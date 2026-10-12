(() => {
  'use strict';
  const config = window.G_CONFIG || {};

  function validURL(value, type) {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password) return '';
      if (/XXXX|example\.|localhost|127\.0\.0\.1/i.test(value)) return '';
      if (type === 'line' && !['lin.ee', 'line.me'].includes(url.hostname)) return '';
      return url.href;
    } catch { return ''; }
  }


   
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('menu');
  if (burger && menu) {
    const close = () => { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'メニューを開く'); };
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      menu.hidden = open;
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'メニューを開く' : 'メニューを閉じる');
    });
    menu.addEventListener('click', e => { if (e.target.tagName === 'A') close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

   
  const lineURL = config.SIGNUP_ENABLED === true ? validURL(config.LINE_URL, 'line') : '';
  const notes = [...document.querySelectorAll('#line-status, #line-status-2, #line-status-3')];
   
  const sayNear = (el, text) => {
    const near = el.closest('.sticky, .hero-copy, .signup-grid > div, .signup') || document;
    const own = near.querySelector('.status');
    (own ? [own] : notes).forEach(n => { n.textContent = text; });
  };
  document.querySelectorAll('[data-line-action]').forEach(link => {
    if (lineURL) {
      link.href = lineURL;
      link.removeAttribute('aria-disabled');
      return;
    }
    link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', event => {
      event.preventDefault();
      sayNear(link, '公式LINEは準備中です。もうしばらくお待ちください。');
    });
  });

  

  const consultURL = config.CONSULT_ENABLED === true ? validURL(config.CONSULT_URL) : '';
  document.querySelectorAll('[data-consult-action]').forEach(link => {
    if (consultURL) {
      link.href = consultURL;
      link.removeAttribute('aria-disabled');
      return;
    }
    link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', event => {
      event.preventDefault();
      sayNear(link, '無料個別相談の受付は準備中です。もうしばらくお待ちください。');
    });
  });

   
  const vimeo = String(config.VIMEO_ID || '').trim();
  const frame = document.getElementById('movie-frame');
  const movieNote = document.getElementById('movie-status');
  document.querySelectorAll('[data-movie-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!/^\d+$/.test(vimeo)) {
        if (movieNote) movieNote.textContent = '講座説明動画は準備中です。公開まで少々お待ちください。';
        return;
      }
      if (!frame || !frame.hidden) return;
      const iframe = document.createElement('iframe');
      iframe.src = 'https://player.vimeo.com/video/' + vimeo + '?autoplay=1&dnt=1';
      iframe.title = '講座説明動画';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);
      frame.hidden = false;
      frame.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });


   
  const sticky = document.querySelector('.sticky');
  const heroCta = document.querySelector('.hero-copy .actions');
  const hasInert = 'inert' in HTMLElement.prototype;
  if (sticky && heroCta) {
    sticky.style.transition = 'transform .25s ease, opacity .25s ease';
    const update = () => {
      const passed = heroCta.getBoundingClientRect().bottom < 0;
      sticky.style.transform = passed ? 'none' : 'translateY(110%)';
      sticky.style.opacity = passed ? '1' : '0';
      sticky.style.pointerEvents = passed ? '' : 'none';
      

      if (hasInert) {
        sticky.inert = !passed;
      } else {
        sticky.setAttribute('aria-hidden', passed ? 'false' : 'true');
         
        sticky.style.visibility = passed ? 'visible' : 'hidden';
      }
    };
    update();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
  }

   
  const MOVING = '.rv, .stagger, .ib, .up, .bubble, .pill, .reason';
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '200px 0px 25% 0px', threshold: 0.01 });
     
    const hero = document.querySelector('.hero-photo');
    if (hero) requestAnimationFrame(() => hero.classList.add('in'));
    document.querySelectorAll(MOVING).forEach(el => { if (el !== hero) io.observe(el); });

     
    const shine = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('shine'); shine.unobserve(e.target); }
      });
    }, { threshold: 0.9 });
    document.querySelectorAll('.btn-line').forEach(b => shine.observe(b));
  } else {
    document.querySelectorAll(MOVING).forEach(el => el.classList.add('in'));
  }

   
})();
