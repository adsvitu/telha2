document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile menu ──────────────────────────────────────────
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      menuBtn.classList.toggle('open');
      const spans = menuBtn.querySelectorAll('span');
      if (menuBtn.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
      } else {
        spans.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
      }
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        menuBtn.classList.remove('open');
        menuBtn.querySelectorAll('span').forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
      });
    });

    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('active');
        menuBtn.classList.remove('open');
        menuBtn.querySelectorAll('span').forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
      }
    });
  }

  // ── Highlight active nav link ─────────────────────────────
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (currentPath === href || (href !== '/' && currentPath.startsWith(href))) {
      link.classList.add('active');
    }
  });

  // ── Animate elements on scroll ───────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.benefit-card, .gallery-item, .category-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // ── Formulário Inline — Captador WhatsApp ─────────────────

  const WEBHOOK_URL = 'https://evolution-n8n.kpyewn.easypanel.host/webhook/telha40';
  const WA_NUMBER   = '5584987711011';

  // Captura UTMs da URL
  function getUTMs() {
    const p = new URLSearchParams(window.location.search);
    return {
      utm_source:   p.get('utm_source')   || '',
      utm_medium:   p.get('utm_medium')   || '',
      utm_campaign: p.get('utm_campaign') || '',
      utm_term:     p.get('utm_term')     || '',
      utm_content:  p.get('utm_content')  || '',
      gclid:        p.get('gclid')        || '',
      fbclid:       p.get('fbclid')       || '',
    };
  }

  // Máscara telefone brasileiro
  function maskPhone(value) {
    let v = value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 2)  return v.replace(/^(\d{0,2})/, '($1');
    if (v.length <= 6)  return v.replace(/^(\d{2})(\d{0,4})/, '($1) $2');
    if (v.length <= 10) return v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    return v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }

  // Máscara no campo telefone
  const phoneField = document.getElementById('formPhone');
  if (phoneField) {
    phoneField.addEventListener('input', (e) => {
      const raw = e.target.value.replace(/\D/g, '');
      e.target.value = maskPhone(raw);
    });
  }

  // Submit do formulário
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('formName');
      const phoneInput = document.getElementById('formPhone');
      const nameErr   = document.getElementById('formNameError');
      const phoneErr  = document.getElementById('formPhoneError');
      const submitBtn = document.getElementById('formSubmit');
      const success   = document.getElementById('formSuccess');

      // Validação
      let valid = true;
      const nome     = nameInput.value.trim();
      const telefone = phoneInput.value.replace(/\D/g, '');

      if (!nome) {
        nameInput.classList.add('error');
        nameErr.classList.add('visible');
        valid = false;
      } else {
        nameInput.classList.remove('error');
        nameErr.classList.remove('visible');
      }

      if (telefone.length < 10) {
        phoneInput.classList.add('error');
        phoneErr.classList.add('visible');
        valid = false;
      } else {
        phoneInput.classList.remove('error');
        phoneErr.classList.remove('visible');
      }

      if (!valid) return;

      // Loading
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      const utms = getUTMs();

      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            nome,
            telefone: phoneInput.value,
            telefone_raw: telefone,
            pagina: window.location.href,
            ...utms,
            timestamp: new Date().toISOString(),
          }).toString(),
        });
      } catch (err) {
        console.warn('Webhook error:', err);
      }

      // GTM event
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'whatsapp_lead_captured',
          event_category: 'CTA',
          lead_nome: nome,
          lead_telefone: telefone,
          ...utms,
        });
      }

      // Mostra sucesso
      leadForm.style.display = 'none';
      success.classList.add('visible');
    });
  }
});
