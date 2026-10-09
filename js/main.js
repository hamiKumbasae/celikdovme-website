(function () {
    var toggle = document.getElementById('menuToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var nav = document.querySelector('.primary-nav');
        var open = nav.style.display === 'flex';
        nav.style.display = open ? 'none' : 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = 'var(--paper)';
        nav.style.borderBottom = '1px solid var(--line)';
        nav.style.padding = '1rem clamp(1.25rem, 4vw, 3rem)';
        toggle.setAttribute('aria-expanded', String(!open));
      });
    }

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealEls = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { io.observe(el); });
    }


    // Contact details are maintained in js/config.js for both languages.
    var config = window.CELIKDOVME_CONFIG || {};
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) { if (config.phone) a.href = 'tel:' + config.phone; });
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) { if (config.email) { a.href = 'mailto:' + config.email; var label = a.querySelector('.cc-value'); if (label) label.textContent = config.email; } });
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) { if (config.whatsapp) a.href = 'https://wa.me/' + config.whatsapp; });
    document.querySelectorAll('.contact-card').forEach(function (a) {
      var label = a.querySelector('.cc-label'); var value = a.querySelector('.cc-value');
      if (!label || !value) return;
      var language = document.documentElement.lang === 'en' ? 'phoneDisplayEN' : 'phoneDisplayTR';
      if (/WhatsApp/i.test(label.textContent) && config[language]) value.textContent = config[language];
      else if (/Telefon|Phone/i.test(label.textContent) && config[language]) value.textContent = config[language];
    });
    var map = document.querySelector('.map-frame iframe');
    if (map && config.mapQuery) map.src = 'https://www.google.com/maps?q=' + encodeURIComponent(config.mapQuery) + '&output=embed';

    var form = document.getElementById('quoteForm');
    if (form) {
      var statusEl = document.getElementById('qfStatus');
      var submitBtn = document.getElementById('qfSubmit');
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var accessKey = config.web3formsAccessKey || '';
        form.access_key.value = accessKey;
        if (!accessKey) {
          statusEl.textContent = document.documentElement.lang === 'en' ? 'The quote form is not configured yet. Please contact us by email or phone.' : 'Teklif formu henüz yapılandırılmadı. Lütfen e-posta veya telefonla ulaşın.';
          statusEl.className = 'form-status err';
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Gönderiliyor...';
        statusEl.textContent = '';
        statusEl.className = 'form-status';

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.assign(
            { subject: 'Kumbasar Çelik Dövme — Yeni Teklif Talebi' },
            Object.fromEntries(new FormData(form))
          ))
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data.success) {
              statusEl.textContent = 'Talebiniz alındı, en kısa sürede dönüş yapacağız.';
              statusEl.className = 'form-status ok';
              form.reset();
            } else {
              statusEl.textContent = 'Gönderilemedi, lütfen tekrar deneyin veya telefonla ulaşın.';
              statusEl.className = 'form-status err';
            }
          })
          .catch(function () {
            statusEl.textContent = 'Bağlantı hatası, lütfen tekrar deneyin veya telefonla ulaşın.';
            statusEl.className = 'form-status err';
          })
          .finally(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Teklif İste';
          });
      });
    }
  })();
