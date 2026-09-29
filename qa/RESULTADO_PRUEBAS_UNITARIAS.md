# Resultado de pruebas unitarias — NEXUS Café Gamer & Stay

Fecha de ejecución: 2026-09-18
Motor: Node.js v22.16.0
Framework: `node:test`
Comando: `node --test --test-reporter=spec tests/*.test.js`

## Resumen

- Pruebas ejecutadas: **13**
- Aprobadas: **13**
- Fallidas: **0**
- Omitidas: **0**
- Resultado general: **APROBADO**

## Cobertura funcional académica

| Prueba | HU / requisito relacionado | Resultado |
|---|---|---|
| Límite 1–12 jugadores | HU-02 / RF-04 | OK |
| Night Raid x 2 = 196000 | HU-02 / RF-03 | OK |
| Precios de planes fijos | HU-01/HU-02 / RF-02, RF-03 | OK |
| Reserva válida | HU-04 / RF-06, RF-07 | OK |
| Nombre mínimo 3 caracteres | HU-04 / RF-07 | OK |
| Correo válido | HU-04 / RF-07 | OK |
| Teléfono mínimo 7 dígitos | HU-04 / RF-07 | OK |
| Plan obligatorio | HU-04 / RF-07 | OK |
| Fecha no pasada | HU-04 / RF-07 | OK |
| Personas fuera de rango | HU-04 / RF-04, RF-07 | OK |
| Código NX-AÑO-XXXX | HU-04 / RF-08 | OK |
| Evitar código repetido | HU-04 / RF-08 | OK |
| Disponibilidad 14–18 PCs | HU-06 / RF-13 | OK |

## Salida real

```text
✔ HU-02: mantiene la cantidad de jugadores entre 1 y 12 (1.097392ms)
✔ HU-02: Night Raid para 2 jugadores cuesta 196000 COP (0.158145ms)
✔ HU-02: obtiene el precio configurado de cada plan fijo (0.103774ms)
✔ HU-04: acepta una reserva con datos válidos (0.87486ms)
✔ HU-04: rechaza un nombre de menos de 3 caracteres (1.035249ms)
✔ HU-04: valida el formato básico del correo (0.111726ms)
✔ HU-04: exige al menos 7 dígitos en el teléfono (0.222601ms)
✔ HU-04: exige seleccionar un plan (0.288048ms)
✔ HU-04: rechaza fechas anteriores al día actual (0.307888ms)
✔ HU-04: rechaza cantidades fuera del rango 1 a 12 (0.330101ms)
✔ HU-04: genera código NX-AÑO-XXXX (0.312495ms)
✔ HU-04: evita reutilizar un código existente cuando puede generar otro (0.115442ms)
✔ HU-06: la disponibilidad simulada permanece entre 14 y 18 PCs (0.098717ms)
ℹ tests 13
ℹ suites 0
ℹ pass 13
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 61.08868
```

## Conclusión

Las reglas de negocio extraídas a `src/nexus-core.js` se ejecutaron correctamente de forma aislada. La interfaz continúa consumiendo estas mismas funciones, reduciendo duplicación y facilitando la trazabilidad entre historias de usuario, requerimientos y pruebas.
