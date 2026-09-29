# NEXUS Café Gamer & Stay — Proyecto académico 2026

Aplicación web frontend desarrollada con **HTML, CSS y JavaScript**, alineada con la documentación ampliada de requisitos e historias de usuario. Esta versión incluye **pruebas unitarias automatizadas** para las reglas de negocio principales.

## Publicar en GitHub Pages

Repositorio: https://github.com/sneydersalazar205/nexusGameCoofe

En **Settings → Pages**, selecciona **Deploy from a branch**, rama **main** y carpeta **/(root)**. Guarda con **Save**.

La dirección prevista, una vez activado y completado el despliegue, es:
https://sneydersalazar205.github.io/nexusGameCoofe/

Esta página es una demostración académica. Las reservas se conservan solo en el navegador; las pruebas Python se ejecutan en el computador, no en GitHub Pages.

## Ejecutar la aplicación

1. Descomprime la carpeta.
2. Abre `index.html` en un navegador moderno.
3. Opcionalmente usa **Live Server** de VS Code.

La aplicación no necesita backend ni base de datos.

## Ejecutar las pruebas unitarias

Requisito: **Node.js 18 o superior**.

En la terminal de VS Code, ubicado en la raíz del proyecto:

```powershell
node --version
npm test
```

Para ver el resultado en formato más descriptivo:

```powershell
npm run test:verbose
```

Para validar sintaxis y luego ejecutar todas las pruebas:

```powershell
npm run check
```

No es necesario instalar Jest, Mocha u otra dependencia: las pruebas utilizan `node:test`, el framework de pruebas incluido en Node.js.

## Historias de usuario implementadas

| HU | Funcionalidad |
|---|---|
| HU-01 | Consultar servicios, estaciones y planes NEXUS |
| HU-02 | Calcular el costo estimado de una experiencia |
| HU-03 | Seleccionar un plan y trasladarlo al formulario de reserva |
| HU-04 | Registrar y confirmar una reserva de demostración |
| HU-05 | Explorar la galería y resolver preguntas frecuentes |
| HU-06 | Visualizar disponibilidad operativa demostrativa |

## Reglas cubiertas por pruebas unitarias

- Rango permitido de 1 a 12 jugadores.
- Fórmula `precio del plan × número de jugadores`.
- Precios de Checkpoint, Night Raid y Full Respawn.
- Nombre mínimo de 3 caracteres.
- Formato básico de correo.
- Teléfono de al menos 7 dígitos.
- Selección obligatoria de plan.
- Fecha igual o posterior al día actual.
- Código de reserva `NX-AÑO-XXXX`.
- Prevención básica de colisión de códigos.
- Disponibilidad simulada entre 14 y 18 PCs.

## Estructura

```text
NEXUS_Cafe_Gamer_Stay_2026/
├── index.html
├── style.css
├── script.js
├── package.json
├── .gitignore
├── README.md
├── src/
│   └── nexus-core.js
├── tests/
│   └── nexus-core.test.js
├── docs/
│   ├── NEXUS_Actividad_Ejercicio_Base_Ampliado.docx
│   ├── Paso_a_Paso_Pruebas_Unitarias_NEXUS.docx
│   └── TRAZABILIDAD.md
└── qa/
    ├── CASOS_DE_PRUEBA.md
    ├── RESULTADO_PRUEBAS_UNITARIAS.md
    └── RESULTADO_VALIDACION.md
```

## Alcance de la demo

- No procesa pagos.
- No utiliza backend.
- No utiliza base de datos central.
- `localStorage` conserva reservas únicamente en el navegador actual.
- La disponibilidad es simulada.
- Las imágenes de la galería requieren conexión a Internet.

## Pruebas de caja negra con Selenium

La carpeta `blackbox/` contiene la adaptación del ejercicio académico de prueba funcional manual y automatizada. Incluye casos sobre reserva válida, validaciones del formulario, calculadora y selección de plan, además de un generador de evidencias (`reporte.py`).

En Windows/PowerShell:

```powershell
cd blackbox
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python main.py
```

Al terminar se generan `blackbox/reporte.html` y capturas dentro de `blackbox/evidencias/`.
