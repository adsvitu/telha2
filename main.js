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

  // ── Bottom Drawer — Captador WhatsApp ─────────────────────

  const WEBHOOK_URL = 'https://evolution-n8n.kpyewn.easypanel.host/webhook/telha40';
  const WA_NUMBER  = '5584987711011';
  const WA_MSG     = encodeURIComponent('Olá! Quero um orçamento de Telha Sanduíche');

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

  // Máscara telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  function maskPhone(value) {
    let v = value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 2)  return v.replace(/^(\d{0,2})/, '($1');
    if (v.length <= 6)  return v.replace(/^(\d{2})(\d{0,4})/, '($1) $2');
    if (v.length <= 10) return v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    // Celular com 9 dígitos
    return v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }

  // Abre o drawer
  function openDrawer() {
    const overlay = document.getElementById('drawerOverlay');
    const drawer  = document.getElementById('leadDrawer');
    if (!overlay || !drawer) return;
    // Reseta estado anterior
    resetDrawer();
    overlay.classList.add('active');
    drawer.classList.add('active');
    document.body.classList.add('drawer-open');
    // Foco no primeiro campo
    setTimeout(() => {
      const nameInput = document.getElementById('drawerName');
      if (nameInput) nameInput.focus();
    }, 420);
  }

  // Fecha o drawer
  function closeDrawer() {
    const overlay = document.getElementById('drawerOverlay');
    const drawer  = document.getElementById('leadDrawer');
    if (!overlay || !drawer) return;
    overlay.classList.remove('active');
    drawer.classList.remove('active');
    document.body.classList.remove('drawer-open');
  }

  // Reseta campos e estados
  function resetDrawer() {
    const nameInput  = document.getElementById('drawerName');
    const phoneInput = document.getElementById('drawerPhone');
    const nameErr    = document.getElementById('drawerNameError');
    const phoneErr   = document.getElementById('drawerPhoneError');
    const form       = document.getElementById('drawerForm');
    const success    = document.getElementById('drawerSuccess');
    const submitBtn  = document.getElementById('drawerSubmit');

    if (nameInput)  { nameInput.value  = ''; nameInput.classList.remove('error'); }
    if (phoneInput) { phoneInput.value = ''; phoneInput.classList.remove('error'); }
    if (nameErr)    nameErr.classList.remove('visible');
    if (phoneErr)   phoneErr.classList.remove('visible');
    if (form)       form.style.display = '';
    if (success)    success.classList.remove('visible');
    if (submitBtn)  { submitBtn.classList.remove('loading'); submitBtn.disabled = false; }
  }

  // Vincula abertura a todos os botões WhatsApp capture
  function bindWhatsAppButtons() {
    document.querySelectorAll('.btn-whatsapp-capture').forEach(btn => {
      // Evita duplicar event listeners
      btn.removeEventListener('click', handleWAClick);
      btn.addEventListener('click', handleWAClick);
    });
  }

  function handleWAClick(e) {
    e.preventDefault();
    openDrawer();
  }

  // Também vincula o botão flutuante
  const floatBtn = document.querySelector('.whatsapp-float');
  if (floatBtn) {
    floatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  }

  // Overlay fecha o drawer ao clicar fora
  const overlayEl = document.getElementById('drawerOverlay');
  if (overlayEl) {
    overlayEl.addEventListener('click', closeDrawer);
  }

  // Botão fechar
  const closeBtn = document.getElementById('drawerClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Máscara no campo telefone
  const phoneField = document.getElementById('drawerPhone');
  if (phoneField) {
    phoneField.addEventListener('input', (e) => {
      const pos = e.target.selectionStart;
      const raw = e.target.value.replace(/\D/g, '');
      e.target.value = maskPhone(raw);
      // Reposiciona cursor
      try {
        const newLen = e.target.value.length;
        const diff = newLen - (pos || 0);
        e.target.setSelectionRange(newLen, newLen);
      } catch(_) {}
    });
  }

  // Submit do formulário
  const drawerForm = document.getElementById('drawerForm');
  if (drawerForm) {
    drawerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput  = document.getElementById('drawerName');
      const phoneInput = document.getElementById('drawerPhone');
      const nameErr    = document.getElementById('drawerNameError');
      const phoneErr   = document.getElementById('drawerPhoneError');
      const submitBtn  = document.getElementById('drawerSubmit');
      const success    = document.getElementById('drawerSuccess');

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
      const payload = {
        nome,
        telefone: phoneInput.value,
        telefone_raw: telefone,
        pagina: window.location.href,
        ...utms,
        timestamp: new Date().toISOString(),
      };

      try {
        // mode: 'no-cors' evita CORS preflight — o n8n recebe mesmo sem resposta legível
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
        console.log('Webhook enviado com sucesso');
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
      drawerForm.style.display = 'none';
      success.classList.add('visible');

      // REDIRECIONAMENTO WHATSAPP DESATIVADO TEMPORARIAMENTE
      // const msgPersonalizada = encodeURIComponent(
      //   `Olá! Meu nome é ${nome} e quero um orçamento de Telha Sanduíche.`
      // );
      // setTimeout(() => {
      //   window.open(`https://wa.me/${WA_NUMBER}?text=${msgPersonalizada}`, '_blank');
      //   closeDrawer();
      // }, 1800);

      // Fecha o drawer após 3 segundos sem redirecionar
      setTimeout(() => {
        closeDrawer();
      }, 3000);
    });
  }

  // Inicializa botões WhatsApp
  bindWhatsAppButtons();
});
