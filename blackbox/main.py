from __future__ import annotations

import re
import threading
import time
from datetime import date, timedelta
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait

from reporte import crear_reporte, registrar_paso, cerrar_reporte

PROJECT_ROOT = Path(__file__).resolve().parents[1]


class SilentHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):  # noqa: A003
        pass


def iniciar_servidor_local():
    """Sirve el proyecto NEXUS por HTTP para que el navegador lo pruebe como aplicación web."""
    handler = partial(SilentHandler, directory=str(PROJECT_ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, f"http://127.0.0.1:{server.server_address[1]}/"


def crear_driver():
    """Intenta Edge primero (como la guía); si no está disponible, intenta Chrome."""
    try:
        driver = webdriver.Edge()
        navegador = "Edge"
    except WebDriverException:
        driver = webdriver.Chrome()
        navegador = "Chrome"
    driver.maximize_window()
    return driver, navegador


def esperar(driver, segundos: int = 10):
    return WebDriverWait(driver, segundos)


def ir_a(driver, element):
    driver.execute_script("arguments[0].scrollIntoView({block:'center'});", element)
    time.sleep(0.4)


def cp02_reserva_valida(driver, base_url: str) -> None:
    """CP-02 Automatizado: registrar una reserva válida desde la interfaz."""
    driver.get(base_url)
    esperar(driver).until(EC.visibility_of_element_located((By.ID, "inicio")))
    registrar_paso(driver, "CP-02 - Abrir NEXUS", "La página principal de NEXUS cargó correctamente.")

    formulario = esperar(driver).until(EC.presence_of_element_located((By.ID, "reservationForm")))
    ir_a(driver, formulario)

    driver.find_element(By.ID, "name").send_keys("Ana Torres")
    driver.find_element(By.ID, "email").send_keys("ana.torres@example.com")
    driver.find_element(By.ID, "phone").send_keys("3001234567")
    Select(driver.find_element(By.ID, "plan")).select_by_visible_text("Night Raid — 12 horas")

    fecha = (date.today() + timedelta(days=1)).isoformat()
    fecha_input = driver.find_element(By.ID, "date")
    driver.execute_script(
        "arguments[0].value=arguments[1]; arguments[0].dispatchEvent(new Event('input',{bubbles:true})); arguments[0].dispatchEvent(new Event('change',{bubbles:true}));",
        fecha_input,
        fecha,
    )

    personas = driver.find_element(By.ID, "people")
    personas.clear()
    personas.send_keys("2")
    driver.find_element(By.ID, "notes").send_keys("Prueba funcional automatizada de caja negra.")
    registrar_paso(driver, "CP-02 - Ingresar datos", "Se diligenciaron los datos válidos de la reserva.")

    driver.find_element(By.CSS_SELECTOR, "#reservationForm button[type='submit']").click()
    feedback = esperar(driver).until(EC.visibility_of_element_located((By.ID, "formFeedback")))
    texto = feedback.text
    if not re.search(r"NX-\d{4}-\d{4}", texto):
        raise AssertionError(f"No se encontró un código de reserva válido en: {texto!r}")

    registrar_paso(
        driver,
        "CP-02 - Confirmar reserva",
        f"La aplicación mostró confirmación y un código con formato NX-AÑO-XXXX. Mensaje: {texto}",
    )


def cp03_validaciones(driver, base_url: str) -> None:
    """CP-03 Automatizado: verificar rechazo de datos obligatorios inválidos."""
    driver.get(f"{base_url}#reservar")
    formulario = esperar(driver).until(EC.presence_of_element_located((By.ID, "reservationForm")))
    ir_a(driver, formulario)

    driver.find_element(By.CSS_SELECTOR, "#reservationForm button[type='submit']").click()
    esperar(driver).until(lambda d: d.find_element(By.ID, "nameError").text.strip() != "")

    errores = {
        "nombre": driver.find_element(By.ID, "nameError").text,
        "correo": driver.find_element(By.ID, "emailError").text,
        "teléfono": driver.find_element(By.ID, "phoneError").text,
        "plan": driver.find_element(By.ID, "planError").text,
        "fecha": driver.find_element(By.ID, "dateError").text,
    }
    if not all(errores.values()):
        raise AssertionError(f"No se mostraron todos los errores esperados: {errores}")

    registrar_paso(
        driver,
        "CP-03 - Validar campos obligatorios",
        "La aplicación rechazó el formulario incompleto y mostró mensajes de validación en los campos obligatorios.",
    )


def cp04_calculadora(driver, base_url: str) -> None:
    """CP-04 Automatizado: validar cálculo Night Raid x 2 = 196.000 COP."""
    driver.get(f"{base_url}#calculadora")
    total = esperar(driver).until(EC.visibility_of_element_located((By.ID, "calcTotal")))
    ir_a(driver, total)

    Select(driver.find_element(By.ID, "calcPlan")).select_by_visible_text("Night Raid — $98.000")
    personas = driver.find_element(By.ID, "calcPeople")
    personas.clear()
    personas.send_keys("2")
    personas.click()
    time.sleep(0.4)

    total_texto = driver.find_element(By.ID, "calcTotal").text.replace("\xa0", " ")
    if "196.000" not in total_texto:
        raise AssertionError(f"Total inesperado: {total_texto}")

    registrar_paso(
        driver,
        "CP-04 - Calcular plan",
        f"Night Raid para 2 jugadores mostró el total esperado de $196.000 COP. Valor visible: {total_texto}",
    )


def cp05_precarga_plan(driver, base_url: str) -> None:
    """CP-05 Automatizado: seleccionar Checkpoint desde la tarjeta y validar precarga."""
    driver.get(f"{base_url}#estadias")
    boton = esperar(driver).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(normalize-space(.), 'Elegir Checkpoint')]") )
    )
    ir_a(driver, boton)
    boton.click()

    plan = esperar(driver).until(EC.presence_of_element_located((By.ID, "plan")))
    esperar(driver).until(lambda d: Select(d.find_element(By.ID, "plan")).first_selected_option.get_attribute("value") == "Checkpoint")
    if Select(plan).first_selected_option.get_attribute("value") != "Checkpoint":
        raise AssertionError("El plan Checkpoint no quedó precargado en el formulario.")

    registrar_paso(
        driver,
        "CP-05 - Precargar plan",
        "Al seleccionar Checkpoint desde su tarjeta, el formulario de reserva quedó precargado con ese plan.",
    )


def main() -> None:
    crear_reporte()
    server = None
    driver = None
    try:
        server, base_url = iniciar_servidor_local()
        driver, navegador = crear_driver()
        print(f"Navegador seleccionado: {navegador}")
        print(f"NEXUS servido temporalmente en: {base_url}")

        cp02_reserva_valida(driver, base_url)
        cp03_validaciones(driver, base_url)
        cp04_calculadora(driver, base_url)
        cp05_precarga_plan(driver, base_url)

        print("Pruebas de caja negra finalizadas correctamente.")
    except Exception as exc:
        print(f"ERROR durante la automatización: {exc}")
        if driver is not None:
            try:
                registrar_paso(driver, "Error de ejecución", str(exc), estado="ERROR")
            except Exception:
                pass
        raise
    finally:
        cerrar_reporte()
        if driver is not None:
            driver.quit()
        if server is not None:
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    main()
