'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  PLAN_PRICES,
  clampPeople,
  calculateTotal,
  getPlanPrice,
  isValidEmail,
  phoneDigits,
  validateReservationData,
  generateReservationId,
  calculateAvailablePcs
} = require('../src/nexus-core.js');

const TODAY = '2026-09-18';

function validReservation(overrides = {}) {
  return {
    name: 'Ana Torres',
    email: 'ana@example.com',
    phone: '300 123 4567',
    plan: 'Night Raid',
    date: '2026-09-20',
    people: 2,
    notes: 'Estaciones contiguas',
    ...overrides
  };
}

test('HU-02: mantiene la cantidad de jugadores entre 1 y 12', () => {
  assert.equal(clampPeople(0), 1);
  assert.equal(clampPeople(7), 7);
  assert.equal(clampPeople(13), 12);
});

test('HU-02: Night Raid para 2 jugadores cuesta 196000 COP', () => {
  assert.equal(calculateTotal(PLAN_PRICES['Night Raid'], 2), 196000);
});

test('HU-02: obtiene el precio configurado de cada plan fijo', () => {
  assert.equal(getPlanPrice('Checkpoint'), 45000);
  assert.equal(getPlanPrice('Night Raid'), 98000);
  assert.equal(getPlanPrice('Full Respawn'), 165000);
  assert.equal(getPlanPrice('Solo Gaming'), null);
});

test('HU-04: acepta una reserva con datos válidos', () => {
  const result = validateReservationData(validReservation(), TODAY);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('HU-04: rechaza un nombre de menos de 3 caracteres', () => {
  const result = validateReservationData(validReservation({ name: 'Al' }), TODAY);
  assert.equal(result.valid, false);
  assert.match(result.errors.name, /al menos 3 caracteres/i);
});

test('HU-04: valida el formato básico del correo', () => {
  assert.equal(isValidEmail('jugador@nexus.co'), true);
  assert.equal(isValidEmail('correo-invalido'), false);
});

test('HU-04: exige al menos 7 dígitos en el teléfono', () => {
  assert.equal(phoneDigits('+57 300 123 4567'), '573001234567');
  const result = validateReservationData(validReservation({ phone: '12345' }), TODAY);
  assert.match(result.errors.phone, /7 dígitos/i);
});

test('HU-04: exige seleccionar un plan', () => {
  const result = validateReservationData(validReservation({ plan: '' }), TODAY);
  assert.match(result.errors.plan, /selecciona un plan/i);
});

test('HU-04: rechaza fechas anteriores al día actual', () => {
  const result = validateReservationData(validReservation({ date: '2026-09-17' }), TODAY);
  assert.match(result.errors.date, /pasado/i);
});

test('HU-04: rechaza cantidades fuera del rango 1 a 12', () => {
  assert.equal(validateReservationData(validReservation({ people: 0 }), TODAY).valid, false);
  assert.equal(validateReservationData(validReservation({ people: 13 }), TODAY).valid, false);
  assert.equal(validateReservationData(validReservation({ people: 12 }), TODAY).valid, true);
});

test('HU-04: genera código NX-AÑO-XXXX', () => {
  const id = generateReservationId([], 2026, () => 0.1234);
  assert.equal(id, 'NX-2026-1234');
  assert.match(id, /^NX-2026-\d{4}$/);
});

test('HU-04: evita reutilizar un código existente cuando puede generar otro', () => {
  const sequence = [0.1234, 0.5678];
  let index = 0;
  const randomFn = () => sequence[index++];
  const id = generateReservationId([{ id: 'NX-2026-1234' }], 2026, randomFn);
  assert.equal(id, 'NX-2026-5678');
});

test('HU-06: la disponibilidad simulada permanece entre 14 y 18 PCs', () => {
  assert.equal(calculateAvailablePcs(() => 0), 18);
  assert.equal(calculateAvailablePcs(() => 0.9999), 14);
});
