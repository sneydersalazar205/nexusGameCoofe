# Pruebas de caja negra - NEXUS Café Gamer & Stay

Esta carpeta adapta el ejercicio de **prueba funcional manual y automatizada con Selenium** al prototipo NEXUS.

## Qué se prueba

- CP-01 Manual: creación de una reserva válida.
- CP-02 Automatizado: creación y confirmación visible de una reserva válida.
- CP-03 Automatizado: validación de campos obligatorios.
- CP-04 Automatizado: cálculo Night Raid x 2 jugadores = $196.000 COP.
- CP-05 Automatizado: selección de Checkpoint y precarga en el formulario.

## Preparación en Windows / PowerShell

Desde la raíz del proyecto:

```powershell
cd blackbox
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python main.py
```

`main.py` levanta temporalmente un servidor HTTP local para el proyecto y luego abre Edge. Si Edge no está disponible, intenta Chrome.

## Evidencias

Al ejecutar se crean automáticamente:

- `evidencias/paso_01.png`, `paso_02.png`, etc.
- `reporte.html`

El reporte registra cada paso, descripción, estado, hora y captura de pantalla.
