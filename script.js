/**
 * NEXUS Café Gamer & Stay
 * Versión académica alineada con la documentación ampliada.
 *
 * HU-01 / RF-01, RF-02: consulta de oferta y navegación.
 * HU-02 / RF-03, RF-04: calculadora de planes (1 a 12 jugadores).
 * HU-03 / RF-05: selección de plan y precarga del formulario.
 * HU-04 / RF-06..RF-10: validación, código NX-AÑO-XXXX y localStorage.
 * HU-05 / RF-11, RF-12: carrusel y FAQ.
 * HU-06 / RF-13: disponibilidad demostrativa.
 */

document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const {
    clampPeople,
    calculateTotal,
    getLocalISODate,
    validateReservationData,
    generateReservationId,
    calculateAvailablePcs
  } = window.NexusCore;

  const currency = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  });

  // =========================================================
  // HU-01 · NAVEGACIÓN RESPONSIVE
  // =========================================================
  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    $$('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        menuToggle.textContent = '☰';
      });
    });
  }

  // =========================================================
  // HU-05 · GALERÍA: ANTERIOR, SIGUIENTE, INDICADORES Y AUTO
  // =========================================================
  const track = $('#carouselTrack');

  if (track) {
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    const indicators = $$('.indicator');
    const carousel = track.closest('.carousel-container');
    let currentIndex = 0;
    let autoplayId = null;

    const updateCarousel = (index) => {
      if (!indicators.length) return;
      currentIndex = (index + indicators.length) % indicators.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      indicators.forEach((indicator, i) => {
        const active = i === currentIndex;
        indicator.classList.toggle('active', active);
        indicator.setAttribute('aria-current', active ? 'true' : 'false');
      });
    };

    const stopAutoplay = () => {
      if (autoplayId) clearInterval(autoplayId);
      autoplayId = null;
    };

    const startAutoplay = () => {
      stopAutoplay();
      autoplayId = setInterval(() => updateCarousel(currentIndex + 1), 5000);
    };

    prevBtn?.addEventListener('click', () => {
      updateCarousel(currentIndex - 1);
      startAutoplay();
    });

    nextBtn?.addEventListener('click', () => {
      updateCarousel(currentIndex + 1);
      startAutoplay();
    });

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        updateCarousel(index);
        startAutoplay();
      });
    });

    carousel?.addEventListener('mouseenter', stopAutoplay);
    carousel?.addEventListener('mouseleave', startAutoplay);
    carousel?.addEventListener('focusin', stopAutoplay);
    carousel?.addEventListener('focusout', startAutoplay);
    carousel?.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') updateCarousel(currentIndex - 1);
      if (event.key === 'ArrowRight') updateCarousel(currentIndex + 1);
    });

    updateCarousel(0);
    startAutoplay();
  }

  // =========================================================
  // HU-02 · CALCULADORA DE PLANES
  // =========================================================
  const calcPlan = $('#calcPlan');
  const calcPeople = $('#calcPeople');
  const calcTotal = $('#calcTotal');

  const updateCalculator = () => {
    if (!calcPlan || !calcPeople || !calcTotal) return;
    const planValue = Number(calcPlan.value) || 0;
    const people = clampPeople(calcPeople.value);
    calcPeople.value = String(people);
    calcTotal.textContent = currency.format(calculateTotal(planValue, people));
  };

  calcPlan?.addEventListener('change', updateCalculator);
  calcPeople?.addEventListener('input', updateCalculator);
  calcPeople?.addEventListener('blur', updateCalculator);
  updateCalculator();

  // =========================================================
  // HU-03 · SELECCIÓN DE PLAN -> FORMULARIO DE RESERVA
  // =========================================================
  const reservationPlan = $('#plan');
  const reservationPeople = $('#people');
  const reservationSection = $('#reservar');

  $$('.plan-select').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.pricing-card');
      const selectedPlan = card?.dataset.plan || '';

      if (reservationPlan && selectedPlan) {
        reservationPlan.value = selectedPlan;
      }

      if (reservationPeople && calcPeople) {
        reservationPeople.value = String(clampPeople(calcPeople.value));
      }

      reservationSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => reservationPlan?.focus(), 450);
      showToast(selectedPlan ? `${selectedPlan} fue precargado en la reserva.` : 'Plan seleccionado.');
    });
  });

  // =========================================================
  // HU-04 · FORMULARIO + VALIDACIÓN + LOCALSTORAGE
  // =========================================================
  const reservationForm = $('#reservationForm');
  const formFeedback = $('#formFeedback');
  const dateInput = $('#date');

  if (dateInput) dateInput.min = getLocalISODate();

  const setError = (id, message) => {
    const error = document.getElementById(id);
    if (error) error.textContent = message;
  };

  const clearErrors = () => $$('.field-error').forEach(error => { error.textContent = ''; });

  const readReservations = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem('nexus_reservations') || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const saveReservations = (reservations) => {
    try {
      localStorage.setItem('nexus_reservations', JSON.stringify(reservations));
      return true;
    } catch {
      return false;
    }
  };

  const validateReservation = (reservationData) => {
    const result = validateReservationData(reservationData, getLocalISODate());
    const errorMap = {
      name: 'nameError',
      email: 'emailError',
      phone: 'phoneError',
      plan: 'planError',
      date: 'dateError',
      people: 'peopleError'
    };

    Object.entries(result.errors).forEach(([field, message]) => {
      setError(errorMap[field], message);
    });

    return result.valid;
  };

  if (reservationForm) {
    reservationForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearErrors();
      if (formFeedback) formFeedback.hidden = true;

      const reservationData = {
        name: $('#name')?.value.trim() || '',
        email: $('#email')?.value.trim() || '',
        phone: $('#phone')?.value.trim() || '',
        plan: $('#plan')?.value || '',
        date: $('#date')?.value || '',
        people: Number($('#people')?.value || 0),
        notes: $('#notes')?.value.trim() || ''
      };

      if (!validateReservation(reservationData)) {
        showToast('Revisa los campos marcados antes de continuar.');
        return;
      }

      const reservations = readReservations();
      const reservationId = generateReservationId(reservations);
      const reservation = {
        id: reservationId,
        createdAt: new Date().toISOString(),
        ...reservationData
      };

      reservations.push(reservation);

      if (!saveReservations(reservations)) {
        if (formFeedback) {
          formFeedback.innerHTML = '⚠️ Los datos son válidos, pero el navegador no permitió guardar la reserva en localStorage.';
          formFeedback.hidden = false;
        }
        showToast('No fue posible guardar la reserva en este navegador.');
        return;
      }

      if (formFeedback) {
        formFeedback.innerHTML = `✅ Reserva demo creada. Tu código es <strong>${reservationId}</strong>. Se guardó únicamente en este navegador.`;
        formFeedback.hidden = false;
      }

      showToast(`Reserva ${reservationId} creada correctamente.`);
      reservationForm.reset();
      if (dateInput) dateInput.min = getLocalISODate();
    });

    reservationForm.addEventListener('reset', () => {
      setTimeout(() => {
        clearErrors();
        if (formFeedback) formFeedback.hidden = true;
      }, 0);
    });
  }

  // =========================================================
  // HU-06 · DISPONIBILIDAD DEMOSTRATIVA
  // Base documental: 18 PCs - variación aleatoria de 0 a 4.
  // =========================================================
  const freePcCount = $('#freePcCount');
  if (freePcCount) {
    freePcCount.textContent = String(calculateAvailablePcs());
  }

  // =========================================================
  // RNF-01 / RNF-03 · REVEAL PROGRESIVO Y ACCESIBILIDAD
  // =========================================================
  const revealElements = $$('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('visible'));
  }

  // =========================================================
  // UTILIDADES
  // =========================================================
  const currentYear = $('#currentYear');
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 3200);
  }
});
