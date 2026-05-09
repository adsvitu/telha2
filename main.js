document.addEventListener('DOMContentLoaded', () => {

  // ── Hero Slideshow ────────────────────────────────────────
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots   = document.querySelectorAll('.hero-dot');

  if (heroSlides.length > 1) {
    let heroIndex = 0;
    let heroTimer = null;

    function heroGoTo(i) {
      heroSlides[heroIndex].classList.remove('active');
      heroDots[heroIndex].classList.remove('active');
      heroIndex = (i + heroSlides.length) % heroSlides.length;
      heroSlides[heroIndex].classList.add('active');
      heroDots[heroIndex].classList.add('active');
    }

    function heroNext() { heroGoTo(heroIndex + 1); }

    function heroStart() { heroTimer = setInterval(heroNext, 6000); }
    function heroStop()  { clearInterval(heroTimer); }

    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => { heroGoTo(i); heroStop(); heroStart(); });
    });

    const heroEl = document.getElementById('hero-slideshow');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', heroStop);
      heroEl.addEventListener('mouseleave', heroStart);
    }

    heroStart();
  }

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

  document.querySelectorAll('.benefit-card, .gallery-item, .category-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // ── FAQ Accordion ─────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.parentElement;
      const isActive = faqItem.classList.contains('active');
      
      // Close all other active items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Toggle current
      if (!isActive) {
        faqItem.classList.add('active');
        const answer = faqItem.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // ── Testimonials Slideshow ────────────────────────────────
  const track = document.getElementById('testimonials-track');
  const dotsContainer = document.getElementById('testimonials-dots');

  if (track && dotsContainer) {
    const slides = track.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoPlayTimer = null;

    function getSlidesPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, totalSlides - getSlidesPerView());
    }

    function getTotalPages() {
      return getMaxIndex() + 1;
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const pages = getTotalPages();
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonials-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlide() {
      const perView = getSlidesPerView();
      const offset = -(currentIndex * (100 / perView));
      track.style.transform = 'translateX(' + offset + '%)';
      
      dotsContainer.querySelectorAll('.testimonials-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
      updateSlide();
    }

    function next() {
      goTo(currentIndex >= getMaxIndex() ? 0 : currentIndex + 1);
    }

    function prev() {
      goTo(currentIndex <= 0 ? getMaxIndex() : currentIndex - 1);
    }

    // Arrow buttons
    const prevBtn = document.querySelector('.testimonials-arrow.prev');
    const nextBtn = document.querySelector('.testimonials-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });

    // Auto-play
    function startAutoPlay() {
      autoPlayTimer = setInterval(next, 5000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    // Pause on hover
    const viewport = document.querySelector('.testimonials-viewport');
    if (viewport) {
      viewport.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
      viewport.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch swipe
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next(); else prev();
        resetAutoPlay();
      }
    }, { passive: true });

    // Recalc on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
        buildDots();
        updateSlide();
      }, 200);
    });

    buildDots();
    updateSlide();
    startAutoPlay();
  }

});
