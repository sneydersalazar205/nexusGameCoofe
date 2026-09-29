# Casos de prueba manuales — NEXUS

## CP-01 — Oferta NEXUS
**Objetivo:** verificar HU-01.  
**Pasos:** abrir `index.html`, revisar Experiencia, Estaciones y Estadías.  
**Resultado esperado:** aparecen NEXUS Core, NEXUS Elite, Private Squad, Checkpoint, Night Raid y Full Respawn.

## CP-02 — Cálculo Night Raid
**Objetivo:** verificar HU-02.  
**Datos:** Night Raid, 2 jugadores.  
**Resultado esperado:** `$196.000` COP.

## CP-03 — Límite de jugadores
**Objetivo:** verificar RF-04.  
**Pasos:** ingresar 0 y luego 13 en la calculadora.  
**Resultado esperado:** el valor se normaliza dentro del rango 1–12.

## CP-04 — Precarga del plan
**Objetivo:** verificar HU-03.  
**Pasos:** pulsar “Elegir Checkpoint”.  
**Resultado esperado:** la página baja a Reserva y el plan Checkpoint queda seleccionado.

## CP-05 — Reserva inválida
**Objetivo:** verificar RF-07.  
**Datos:** nombre corto, correo inválido, teléfono menor de 7 dígitos o fecha pasada.  
**Resultado esperado:** no se crea la reserva y se muestran errores junto a los campos.

## CP-06 — Reserva válida
**Objetivo:** verificar HU-04.  
**Datos:** todos los campos obligatorios válidos, 1–12 personas y fecha actual o futura.  
**Resultado esperado:** aparece un código `NX-AÑO-XXXX`, se muestra confirmación y se agrega un objeto a `localStorage.nexus_reservations`.

## CP-07 — Carrusel
**Objetivo:** verificar RF-11.  
**Pasos:** usar Anterior, Siguiente e indicadores; esperar aproximadamente 5 segundos.  
**Resultado esperado:** la imagen cambia correctamente y también avanza automáticamente.

## CP-08 — FAQ
**Objetivo:** verificar RF-12.  
**Pasos:** abrir y cerrar cada pregunta.  
**Resultado esperado:** las respuestas se despliegan sin abandonar la página.

## CP-09 — Disponibilidad simulada
**Objetivo:** verificar HU-06.  
**Pasos:** recargar la página varias veces.  
**Resultado esperado:** PCs disponibles toma un valor entre 14 y 18; se conservan 6 consolas, 4 habitaciones y el dato 24/7 para viernes y sábado.

## CP-10 — Responsive
**Objetivo:** verificar RNF-02.  
**Pasos:** reducir la ventana a tamaño móvil.  
**Resultado esperado:** aparece el menú móvil y el contenido se mantiene legible sin desbordamientos horizontales importantes.
