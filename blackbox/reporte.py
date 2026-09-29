from __future__ import annotations

from datetime import datetime
from html import escape
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CARPETA_EVIDENCIAS = BASE_DIR / "evidencias"
ARCHIVO_REPORTE = BASE_DIR / "reporte.html"
contador_pasos = 0


def crear_reporte() -> None:
    """Crea el archivo HTML inicial del reporte de caja negra."""
    global contador_pasos
    contador_pasos = 0
    CARPETA_EVIDENCIAS.mkdir(exist_ok=True)

    # Limpiar capturas anteriores para no mezclar ejecuciones.
    for captura in CARPETA_EVIDENCIAS.glob("paso_*.png"):
        captura.unlink(missing_ok=True)

    fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reporte Caja Negra - NEXUS</title>
<style>
body {{font-family: Arial, sans-serif; margin: 40px; background:#0b0914; color:#eee;}}
h1 {{color:#b794f4;}}
h2 {{margin-bottom:8px;}}
.paso {{background:#171225; padding:20px; margin-bottom:25px; border-radius:12px; border:1px solid #3b2f5d;}}
.captura {{margin-top:15px; max-width:1000px; width:100%; border:1px solid #5b4a88; border-radius:8px;}}
.fecha {{color:#aaa; font-size:14px;}}
.estado-ok {{color:#5ee6a8; font-weight:bold;}}
.estado-error {{color:#ff7b92; font-weight:bold;}}
.resumen {{background:#211a35; padding:16px; border-radius:10px; margin-bottom:24px;}}
code {{color:#74e6ff;}}
</style>
</head>
<body>
<h1>Reporte de Pruebas de Caja Negra - NEXUS Café Gamer & Stay</h1>
<div class="resumen">
<p><strong>Fecha de ejecución:</strong> {fecha}</p>
<p><strong>Tecnología:</strong> Python + Selenium + navegador Edge/Chrome</p>
<p><strong>Enfoque:</strong> comportamiento visible de la aplicación, sin depender de la implementación interna.</p>
</div>
<hr>
"""
    ARCHIVO_REPORTE.write_text(html, encoding="utf-8")


def registrar_paso(driver, titulo: str, descripcion: str, estado: str = "OK") -> None:
    """Captura pantalla y registra el paso dentro del reporte HTML."""
    global contador_pasos
    contador_pasos += 1

    nombre_imagen = f"paso_{contador_pasos:02d}.png"
    ruta_imagen = CARPETA_EVIDENCIAS / nombre_imagen
    driver.save_screenshot(str(ruta_imagen))

    fecha = datetime.now().strftime("%H:%M:%S")
    clase_estado = "estado-ok" if estado == "OK" else "estado-error"

    bloque_html = f"""
<div class="paso">
<h2>Paso {contador_pasos}: {escape(titulo)}</h2>
<p>{escape(descripcion)}</p>
<p class="{clase_estado}">Estado: {escape(estado)}</p>
<p class="fecha">Hora: {fecha}</p>
<img src="evidencias/{nombre_imagen}" class="captura" alt="{escape(titulo)}">
</div>
"""
    with ARCHIVO_REPORTE.open("a", encoding="utf-8") as archivo:
        archivo.write(bloque_html)


def cerrar_reporte() -> None:
    """Cierra correctamente el documento HTML."""
    html_final = """
</body>
</html>
"""
    with ARCHIVO_REPORTE.open("a", encoding="utf-8") as archivo:
        archivo.write(html_final)
    print(f"Reporte generado: {ARCHIVO_REPORTE.resolve()}")
