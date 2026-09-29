/**
 * NEXUS Core
 * Reglas de negocio puras y reutilizables del prototipo académico.
 * Se mantiene independiente del DOM para facilitar pruebas unitarias.
 */
(function attachNexusCore(globalScope) {
  'use strict';

  const PLAN_PRICES = Object.freeze({
    Checkpoint: 45000,
    'Night Raid': 98000,
    'Full Respawn': 165000
  });

  function clampPeople(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return 1;
    return Math.max(1, Math.min(12, Math.trunc(numericValue)));
  }

  function calculateTotal(planValue, people) {
    const price = Number(planValue);
    if (!Number.isFinite(price) || price < 0) {
      throw new TypeError('El precio del plan debe ser un número válido mayor o igual a cero.');
    }
    return price * clampPeople(people);
  }

  function getPlanPrice(planName) {
    return PLAN_PRICES[planName] ?? null;
  }

  function getLocalISODate(date = new Date()) {
    const copy = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return copy.toISOString().split('T')[0];
  }

  function isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(String(email || '').trim());
  }

  function phoneDigits(phone) {
    return String(phone || '').replace(/\D/g, '');
  }

  function validateReservationData(data, todayISO = getLocalISODate()) {
    const normalized = {
      name: String(data?.name || '').trim(),
      email: String(data?.email || '').trim(),
      phone: String(data?.phone || '').trim(),
      plan: String(data?.plan || '').trim(),
      date: String(data?.date || '').trim(),
      people: Number(data?.people),
      notes: String(data?.notes || '').trim()
    };

    const errors = {};

    if (normalized.name.length < 3) {
      errors.name = 'Escribe un nombre válido de al menos 3 caracteres.';
    }

    if (!isValidEmail(normalized.email)) {
      errors.email = 'Escribe un correo válido.';
    }

    if (phoneDigits(normalized.phone).length < 7) {
      errors.phone = 'Escribe un número de contacto con al menos 7 dígitos.';
    }

    if (!normalized.plan) {
      errors.plan = 'Selecciona un plan.';
    }

    if (!normalized.date) {
      errors.date = 'Selecciona una fecha.';
    } else if (normalized.date < todayISO) {
      errors.date = 'La fecha no puede estar en el pasado.';
    }

    if (!Number.isInteger(normalized.people) || normalized.people < 1 || normalized.people > 12) {
      errors.people = 'Selecciona entre 1 y 12 personas.';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
      data: normalized
    };
  }

  function generateReservationId(
    reservations = [],
    year = new Date().getFullYear(),
    randomFn = Math.random
  ) {
    const existingIds = new Set(
      Array.isArray(reservations) ? reservations.map(item => item?.id).filter(Boolean) : []
    );

    for (let attempt = 0; attempt < 50; attempt += 1) {
      const suffix = Math.floor(randomFn() * 10000).toString().padStart(4, '0');
      const id = `NX-${year}-${suffix}`;
      if (!existingIds.has(id)) return id;
    }

    return `NX-${year}-${Date.now().toString().slice(-4)}`;
  }

  function calculateAvailablePcs(randomFn = Math.random) {
    const base = 18;
    const variation = Math.floor(randomFn() * 5);
    return base - variation;
  }

  const api = Object.freeze({
    PLAN_PRICES,
    clampPeople,
    calculateTotal,
    getPlanPrice,
    getLocalISODate,
    isValidEmail,
    phoneDigits,
    validateReservationData,
    generateReservationId,
    calculateAvailablePcs
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  globalScope.NexusCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
