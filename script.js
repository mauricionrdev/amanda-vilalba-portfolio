/* ═══════════════════════════════════════════════════════════
   AMANDA VILALBA — script.js  v4.0
   ═══════════════════════════════════════════════════════════ */
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ══════════════════════════════════════════════════════════
   1. DARK MODE — ícone sol/lua via CSS, label via JS
   ══════════════════════════════════════════════════════════ */
(function initTheme() {
  const root  = document.documentElement;
  const btn   = $('#themeToggle');
  const label = $('#themeLabel');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    label.textContent = theme === 'dark' ? 'Light' : 'Dark';
    try { localStorage.setItem('av-theme', theme); } catch (_) {}
    updateNav();
  }

  const saved       = (() => { try { return localStorage.getItem('av-theme'); } catch (_) { return null; } })();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  btn.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('av-theme')) applyTheme(e.matches ? 'dark' : 'light');
  });
})();

/* ══════════════════════════════════════════════════════════
   2. NAV SCROLL — adiciona classe .scrolled via JS
   ══════════════════════════════════════════════════════════ */
function updateNav() {
  const nav    = $('#mainNav');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (!isDark) {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  } else {
    nav.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ══════════════════════════════════════════════════════════
   3. HAMBURGER MENU
   ══════════════════════════════════════════════════════════ */
(function initHamburger() {
  const btn  = $('#navHamburger');
  const menu = $('#mobileMenu');
  if (!btn || !menu) return;

  function toggle(force) {
    const open = force !== undefined ? force : !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', () => toggle());
  $$('.mobile-link', menu).forEach(link => link.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
})();

/* ══════════════════════════════════════════════════════════
   4. HERO ENTRY ANIMATION — dispara na primeira carga
   ══════════════════════════════════════════════════════════ */
(function initHeroEntry() {
  // Pequeno delay para garantir que CSS está aplicado
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add('hero-loaded');
    });
  });
})();

/* ══════════════════════════════════════════════════════════
   5. COUNT-UP NA HERO — stats animam na entrada
   ══════════════════════════════════════════════════════════ */
(function initHeroCountUp() {
  function countUp(el, delay) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const dur    = 1200;
    const fps    = 60;
    const step   = target / (dur / (1000 / fps));
    let current  = 0;

    setTimeout(() => {
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) {
          el.textContent = target + suffix;
          clearInterval(timer);
          el.classList.add('popped');
          setTimeout(() => el.classList.remove('popped'), 300);
        }
      }, 1000 / fps);
    }, delay);
  }

  // Dispara após a animação de entrada da hero (≈ 900ms)
  window.addEventListener('load', () => {
    $$('.hero-stat-num[data-target]').forEach((el, i) => {
      countUp(el, 900 + i * 150);
    });
  });
})();

/* ══════════════════════════════════════════════════════════
   6. CURSOR CUSTOMIZADO — desktop ≥ 1025px com hover
   ══════════════════════════════════════════════════════════ */
(function initCursor() {
  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;

  // Dupla verificação: media query hover + largura
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const isWide   = window.innerWidth > 1024;
  if (!hasHover || !isWide) {
    dot.style.display = ring.style.display = 'none';
    return;
  }

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const TARGETS = 'a, button, .pillar, .tech-card, .cert-card, .processo-step';
  $$(TARGETS).forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = ring.style.height = '58px';
      ring.style.background = 'rgba(200,98,42,0.1)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = ring.style.height = '40px';
      ring.style.background = 'transparent';
    });
  });
})();

/* ══════════════════════════════════════════════════════════
   7. SCROLL REVEAL
   ══════════════════════════════════════════════════════════ */
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = $$('.reveal', entry.target.parentElement);
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.065) + 's';
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  $$('.reveal').forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════════════════════
   8. SKILL BARS
   ══════════════════════════════════════════════════════════ */
(function initSkillBars() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target.querySelector('.skill-bar-fill');
      if (fill) setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 180);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  $$('.skill-bar-track').forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════════════════════
   9. COUNT-UP — seção Resultados
   ══════════════════════════════════════════════════════════ */
(function initCountUp() {
  function countUp(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const fps = 60, dur = 1500;
    const step = target / (dur / (1000 / fps));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
        el.style.transform = 'scale(1.1)';
        setTimeout(() => { el.style.transform = ''; }, 220);
      }
    }, 1000 / fps);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  $$('.resultado-num[data-target]').forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════════════════════
   10. CAROUSEL DE DEPOIMENTOS
   ══════════════════════════════════════════════════════════ */
(function initCarousel() {
  const slides = $$('.depo-slide');
  const dots   = $$('.depo-dot');
  const prev   = $('#depoPrev');
  const next   = $('#depoNext');
  if (!slides.length) return;

  let current   = 0;
  let autoTimer = null;

  function goTo(idx, direction) {
    const old = current;
    current = (idx + slides.length) % slides.length;
    if (old === current) return;

    // Saída do slide atual
    slides[old].classList.remove('active');
    slides[old].classList.add(direction === 'next' ? 'exit-left' : 'exit-right');
    dots[old].classList.remove('active');
    dots[old].setAttribute('aria-selected', 'false');

    // Entrada do novo slide
    slides[current].style.transform = direction === 'next' ? 'translateX(40px)' : 'translateX(-40px)';
    slides[current].style.opacity   = '0';

    // Força reflow para a transição funcionar
    void slides[current].offsetWidth;

    slides[current].style.transform = '';
    slides[current].style.opacity   = '';
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');

    // Limpa classe de saída após a transição
    setTimeout(() => {
      slides[old].classList.remove('exit-left', 'exit-right');
    }, 520);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1, 'next'), 6000);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  // Inicia posição
  slides.forEach((s, i) => {
    if (i === 0) { s.classList.add('active'); }
    else { s.style.opacity = '0'; s.style.transform = 'translateX(40px)'; }
  });

  next.addEventListener('click', () => { goTo(current + 1, 'next'); startAuto(); });
  prev.addEventListener('click', () => { goTo(current - 1, 'prev'); startAuto(); });
  dots.forEach((d, i) => {
    d.addEventListener('click', () => { goTo(i, i > current ? 'next' : 'prev'); startAuto(); });
  });

  // Teclado
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { goTo(current + 1, 'next'); startAuto(); }
    if (e.key === 'ArrowLeft')  { goTo(current - 1, 'prev'); startAuto(); }
  });

  // Touch swipe
  let tx = 0;
  const wrap = $('#depoCarousel');
  if (wrap) {
    wrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 48) {
        dx < 0 ? goTo(current + 1, 'next') : goTo(current - 1, 'prev');
        startAuto();
      }
    }, { passive: true });
  }

  // Pausa no hover
  const section = wrap ? wrap.closest('.depo-section') : null;
  if (section) {
    section.addEventListener('mouseenter', stopAuto);
    section.addEventListener('mouseleave', startAuto);
  }

  startAuto();
})();

/* ══════════════════════════════════════════════════════════
   11. BACK TO TOP
   ══════════════════════════════════════════════════════════ */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ══════════════════════════════════════════════════════════
   12. FLOATING CTAs
   ══════════════════════════════════════════════════════════ */
(function initFloatingCtas() {
  const ctas = $('#floatingCtas');
  if (!ctas) return;
  const hero = $('#hero');
  const threshold = hero ? hero.offsetHeight * 0.65 : 480;
  window.addEventListener('scroll', () => {
    ctas.classList.toggle('visible', window.scrollY > threshold);
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════════════
   13. SMOOTH SCROLL
   ══════════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ══════════════════════════════════════════════════════════
   14. PROTEÇÃO DE E-MAIL — monta o href via JS para evitar scrapers
   O endereço nunca aparece em texto puro no HTML
   ══════════════════════════════════════════════════════════ */
(function protectEmail() {
  const link    = document.getElementById('emailLink');
  const display = document.getElementById('emailDisplay');
  if (!link || !display) return;

  // Partes separadas — dificulta coleta automática
  const u = 'contatoamandasvi';
  const d = 'gmail';
  const t = 'com';
  const email = u + '\u0040' + d + '.' + t;

  link.href        = 'mailto:' + email;
  display.textContent = email;
  link.setAttribute('aria-label', 'Enviar e-mail para ' + email);
})();
