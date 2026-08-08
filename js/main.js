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

    var form = document.getElementById('quoteForm');
    if (form) {
      var statusEl = document.getElementById('qfStatus');
      var submitBtn = document.getElementById('qfSubmit');
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var accessKey = form.access_key.value;
        if (!accessKey || accessKey === 'WEB3FORMS_ACCESS_KEY_BURAYA') {
          statusEl.textContent = 'Form henüz aktif değil — Web3Forms access key eklenmedi.';
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
