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

  // Normaliza número: remove código do país 55 se presente, retorna 10-11 dígitos
  function normalizePhone(value) {
    let digits = value.replace(/\D/g, '');
    
    // 1. Caso óbvio: colou ou preencheu 12-13 dígitos (Ex: 5584988...)
    if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
      return digits.slice(2);
    }

    // 2. Desambiguação preditiva (para digitação manual):
    // Se começa com 55 e o 3º dígito não é um início válido de número no RS (2,3,4,5 ou 9)
    // então o 55 é obrigatoriamente o código do país (DDI).
    if (digits.length >= 3 && digits.startsWith('55')) {
      const thirdDigit = digits.charAt(2);
      const validRSPrefixes = ['2', '3', '4', '5', '9'];
      if (!validRSPrefixes.includes(thirdDigit)) {
        return digits.slice(2); // Remove o 55 DDI imediatamente
      }
    }

    return digits; // 10 ou 11 dígitos
  }

  // Mapeamento de DDDs para Estados
  const DDD_MAP = {
    11:"SP", 12:"SP", 13:"SP", 14:"SP", 15:"SP", 16:"SP", 17:"SP", 18:"SP", 19:"SP",
    21:"RJ", 22:"RJ", 24:"RJ", 27:"ES", 28:"ES",
    31:"MG", 32:"MG", 33:"MG", 34:"MG", 35:"MG", 37:"MG", 38:"MG",
    41:"PR", 42:"PR", 43:"PR", 44:"PR", 45:"PR", 46:"PR",
    47:"SC", 48:"SC", 49:"SC",
    51:"RS", 53:"RS", 54:"RS", 55:"RS",
    61:"DF", 62:"GO", 64:"GO", 63:"TO", 65:"MT", 66:"MT", 67:"MS", 68:"AC", 69:"RO",
    71:"BA", 73:"BA", 74:"BA", 75:"BA", 77:"BA", 79:"SE",
    81:"PE", 87:"PE", 82:"AL", 83:"PB", 84:"RN", 85:"CE", 88:"CE", 86:"PI", 89:"PI",
    91:"PA", 93:"PA", 94:"PA", 92:"AM", 97:"AM", 95:"RR", 96:"AP", 98:"MA", 99:"MA"
  };

  // Máscara + hint de normalização no campo telefone
  const phoneField = document.getElementById('formPhone');
  const phoneHint  = document.getElementById('formPhoneHint');

  if (phoneField) {
    phoneField.addEventListener('input', (e) => {
      // Pega todos os dígitos digitados até agora (sem limite de 11)
      const currentDigits = e.target.value.replace(/\D/g, '');
      
      // Normaliza: se for 12-13 dígitos começando com 55, limpa o 55
      const normalized = normalizePhone(currentDigits);

      // Agora sim aplica a máscara no número normalizado (limite de 11 dígitos)
      e.target.value = maskPhone(normalized);

      // Hint de localização e normalização
      if (phoneHint) {
        if (normalized.length >= 2) {
          const ddd = parseInt(normalized.substring(0, 2));
          const estado = DDD_MAP[ddd];
          
          // Detectamos DDI 55 se o que foi digitado originalmente tinha 12-13 dígitos
          const hadDdiPrefix = (currentDigits.length === 12 || currentDigits.length === 13) && currentDigits.startsWith('55');

          // Evita mostrar RS (DDD 55) prematuramente
          let skipState = (ddd === 55 && normalized.length < 10);

          if (estado && !skipState) {
            let hintMsg = `📱 Identificado: ${maskPhone(normalized)} (${estado})`;
            if (hadDdiPrefix) hintMsg = `🌍 Prefixo 55 removido | ${hintMsg}`;
            
            phoneHint.textContent = hintMsg;
            phoneHint.classList.add('visible');
          } else if (hadDdiPrefix) {
            phoneHint.textContent = `🌍 Prefixo 55 removido | ${maskPhone(normalized)}`;
            phoneHint.classList.add('visible');
          } else {
            phoneHint.classList.remove('visible');
          }
        } else {
          phoneHint.classList.remove('visible');
        }
      }
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
      const telefone = normalizePhone(phoneInput.value); // número limpo, sem país

      if (!nome) {
        nameInput.classList.add('error');
        nameErr.classList.add('visible');
        valid = false;
      } else {
        nameInput.classList.remove('error');
        nameErr.classList.remove('visible');
      }

      if (telefone.length < 10 || telefone.length > 11) {
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
            telefone: maskPhone(telefone),   // formatado: (84) 98771-1011
            telefone_raw: telefone,           // limpo: 84987711011
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

      // Monta mensagem personalizada
      const msgPersonalizada = encodeURIComponent(
        `Olá! Meu nome é ${nome} e quero um orçamento de Telha Sanduíche.`
      );

      // Clica no link oculto wa.me para o GTM detectar e disparar conversão Google Ads
      // O trigger "Clique - Apenas links | {{Click URL}} contém wa.me" é acionado aqui
      const waLink = document.getElementById('waGtmLink');
      if (waLink) {
        waLink.href = `https://wa.me/${WA_NUMBER}?text=${msgPersonalizada}`;
        waLink.click();
      }
    });
  }
});
