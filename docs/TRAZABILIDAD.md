# Matriz de trazabilidad — NEXUS

| Historia | Requerimientos relacionados | Implementación principal |
|---|---|---|
| HU-01 | RF-01, RF-02, RNF-01, RNF-02, RNF-03 | Secciones Experiencia, Estaciones, Estadías y navegación responsive |
| HU-02 | RF-03, RF-04, RNF-01, RNF-05 | Sección Calculadora y `updateCalculator()` |
| HU-03 | RF-02, RF-05, RNF-01 | Botones `.plan-select` y precarga del `select#plan` |
| HU-04 | RF-04, RF-06, RF-07, RF-08, RF-09, RF-10, RNF-04, RNF-05, RNF-06 | Formulario `#reservationForm`, validación, código de reserva y `localStorage` |
| HU-05 | RF-11, RF-12, RNF-01, RNF-02, RNF-03 | Carrusel `#carouselTrack` y elementos `<details>` del FAQ |
| HU-06 | RF-13, RNF-01, RNF-05 | Panel hero y generación local `18 - random(0..4)` |

## Reglas de negocio implementadas

- RN-01: la calculadora usa Checkpoint, Night Raid y Full Respawn.
- RN-02: Solo Gaming está disponible en el formulario, pero sin precio fijo en la calculadora.
- RN-03: la reserva acepta de 1 a 12 personas y una fecha igual o posterior al día actual.
- RN-04: el código utiliza `NX-AÑO-XXXX`.
- RN-05: las reservas se guardan localmente en `nexus_reservations`.
- RN-06: la disponibilidad de PCs es una simulación local.
