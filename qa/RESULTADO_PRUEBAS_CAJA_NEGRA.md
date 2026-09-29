# Preparación de pruebas de caja negra - NEXUS

Se incorporó una suite funcional externa en `blackbox/` siguiendo el flujo de la guía académica: abrir la aplicación, localizar elementos, interactuar con ellos, comprobar resultados visibles y registrar evidencias.

## Casos incluidos

| Caso | Tipo | Objetivo | HU / RF |
|---|---|---|---|
| CP-01 | Manual | Crear una reserva válida desde la interfaz | HU-04 / RF-06 a RF-10 |
| CP-02 | Automatizado | Crear reserva válida y comprobar código NX-AÑO-XXXX visible | HU-04 / RF-06 a RF-10 |
| CP-03 | Automatizado | Rechazar formulario incompleto y mostrar validaciones | HU-04 / RF-07 |
| CP-04 | Automatizado | Verificar Night Raid x 2 = $196.000 COP | HU-02 / RF-03, RF-04 |
| CP-05 | Automatizado | Precargar Checkpoint desde la tarjeta al formulario | HU-03 / RF-05 |

## Validación realizada al generar el entregable

- Los scripts Python fueron compilados con `py_compile`: **OK**.
- Se verificó que los selectores/IDs usados por la automatización existen en `index.html`: **OK**.
- Las 13 pruebas unitarias existentes continúan pasando: **13/13**.

## Ejecución Selenium

La ejecución completa con navegador debe realizarse en un equipo con Selenium instalado y Edge o Chrome disponible. Al ejecutar `python main.py`, el sistema generará `reporte.html` y las capturas en `blackbox/evidencias/`.
