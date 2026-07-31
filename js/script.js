/* ============================================
   FONTANERO CEUTI - JavaScript principal
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- Menu movil ---
  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      var spans = menuToggle.querySelectorAll('span');
      if (nav.classList.contains('is-open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }

  // Cerrar menu al hacer click en un enlace
  document.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      var spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // --- Header scroll ---
  var header = document.querySelector('.header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.12)';
    } else {
      header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    }
  });

  // --- Scroll animations ---
  var fadeElements = document.querySelectorAll('.fade-in');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });

  // --- Formulario de contacto ---
  var form = document.getElementById('contactForm');
  var formFields = form ? form.querySelector('.form__fields') : null;
  var formSuccess = form ? form.querySelector('.form__success') : null;

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;

      // Validar campos requeridos
      var requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(function (field) {
        var error = field.parentElement.querySelector('.form__error');
        if (!field.value.trim()) {
          field.classList.add('is-invalid');
          if (error) error.style.display = 'block';
          valid = false;
        } else {
          field.classList.remove('is-invalid');
          if (error) error.style.display = 'none';
        }
      });

      // Validar telefono (formato espanol)
      var phoneField = form.querySelector('[name="telefono"]');
      if (phoneField && phoneField.value.trim()) {
        var phoneClean = phoneField.value.replace(/\s/g, '');
        var phoneRegex = /^(\+34)?[6-9]\d{8}$/;
        if (!phoneRegex.test(phoneClean)) {
          phoneField.classList.add('is-invalid');
          var phoneError = phoneField.parentElement.querySelector('.form__error');
          if (phoneError) {
            phoneError.textContent = 'Introduce un telefono valido';
            phoneError.style.display = 'block';
          }
          valid = false;
        }
      }

      if (!valid) return;

      // Simular envio (reemplazar con Formspree, EmailJS, o tu backend)
      var submitBtn = form.querySelector('.form__submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      // Preparar datos para WhatsApp como alternativa
      var nombre = form.querySelector('[name="nombre"]').value;
      var telefono = form.querySelector('[name="telefono"]').value;
      var servicio = form.querySelector('[name="servicio"]').value;
      var mensaje = form.querySelector('[name="mensaje"]').value;

      var whatsappMsg = 'Hola, soy ' + nombre + '.';
      if (servicio) whatsappMsg += ' Necesito: ' + servicio + '.';
      if (mensaje) whatsappMsg += ' ' + mensaje;
      whatsappMsg += ' Mi telefono: ' + telefono;

      // Mostrar exito tras breve pausa
      setTimeout(function () {
        if (formFields) formFields.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('is-visible');
          // Guardar el mensaje de WhatsApp en el boton
          var waBtn = formSuccess.querySelector('.form__success-wa');
          if (waBtn) {
            waBtn.href = 'https://wa.me/34655072638?text=' + encodeURIComponent(whatsappMsg);
          }
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Solicitar Presupuesto';
      }, 800);
    });

    // Limpiar errores al escribir
    form.querySelectorAll('.form__input, .form__select, .form__textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.classList.remove('is-invalid');
        var error = this.parentElement.querySelector('.form__error');
        if (error) error.style.display = 'none';
      });
    });
  }

  // --- Cookie banner ---
  var cookieBanner = document.querySelector('.cookie-banner');
  var cookieAccept = document.getElementById('cookieAccept');
  var cookieReject = document.getElementById('cookieReject');

  if (cookieBanner && !localStorage.getItem('cookies_accepted')) {
    cookieBanner.classList.add('is-visible');
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      localStorage.setItem('cookies_accepted', 'true');
      cookieBanner.classList.remove('is-visible');
    });
  }

  if (cookieReject) {
    cookieReject.addEventListener('click', function () {
      localStorage.setItem('cookies_accepted', 'false');
      cookieBanner.classList.remove('is-visible');
    });
  }

  // --- Contador animado en stats ---
  var statNumbers = document.querySelectorAll('.stat__number');
  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function (el) {
    statsObserver.observe(el);
  });

  function animateNumber(el) {
    var target = el.getAttribute('data-target');
    var suffix = el.getAttribute('data-suffix') || '';
    var num = parseInt(target, 10);
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * num);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

});
