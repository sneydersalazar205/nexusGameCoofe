# Casos de prueba de caja negra — NEXUS Café Gamer & Stay

## CP-01 — Manual: registrar una reserva válida

**Contexto:** un cliente desea reservar una experiencia NEXUS.

**Alcance:** abrir NEXUS → ir a Reserva → diligenciar datos válidos → confirmar → verificar código `NX-AÑO-XXXX`.

**Datos:** Ana Torres, `ana.torres@example.com`, 3001234567, Night Raid, fecha futura, 2 personas.

**Resultado esperado:** mensaje de confirmación visible con código de reserva.

## CP-02 — Automatizado: reserva válida

Automatiza CP-01 con Selenium y registra capturas en cada fase. Se aprueba si el mensaje de confirmación contiene un código con patrón `NX-\d{4}-\d{4}`.

## CP-03 — Automatizado: validaciones

Envía el formulario incompleto. Se aprueba si aparecen mensajes visibles para nombre, correo, teléfono, plan y fecha y no se genera una reserva.

## CP-04 — Automatizado: calculadora

Selecciona Night Raid y 2 jugadores. Se aprueba si el total visible contiene `$196.000`.

## CP-05 — Automatizado: precarga del plan

Presiona **Elegir Checkpoint**. Se aprueba si el selector del formulario queda con `Checkpoint`.
