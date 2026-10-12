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
    const close = () => { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); };
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

   
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (fine && !still) {
    const mk = (id, cls) => {
      const el = document.createElement('div');
      el.id = id; el.setAttribute('aria-hidden', 'true');
      el.innerHTML = cls;
      el.style.opacity = '0';
      document.body.appendChild(el);
      return el;
    };
    const drop = mk('drop', '<span class="bead"></span><span class="spec"></span><span class="spec2"></span>');
    const bead = mk('dropb', '<span class="bead"></span>');

    let mx = innerWidth / 2, my = innerHeight / 2;
    let x = mx, y = my, px = x, py = y, bx = x, by = y;
    let shown = false, running = false, idle = 0, raf = 0;

    const loop = () => {
      if (!running) { raf = 0; return; }
      

      x += (mx - x) * 0.45; y += (my - y) * 0.45;
      bx += (x - bx) * 0.16; by += (y - by) * 0.16;
      const vx = x - px, vy = y - py; px = x; py = y;
      const v = Math.min(Math.hypot(vx, vy), 28);
      const deg = v > 0.6 ? Math.atan2(vy, vx) * 180 / Math.PI + 90 : 0;
      drop.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) rotate(' + deg + 'deg) scale('
        + (1 - v / 70) + ',' + (1 + v / 40) + ')';
      bead.style.transform = 'translate3d(' + bx + 'px,' + by + 'px,0) scale(' + (0.7 + v / 34) + ')';
      bead.style.opacity = shown ? String(Math.min(0.6, v / 13)) : '0';
       
      const settled = v < 0.12 && Math.hypot(mx - x, my - y) < 0.4 && Math.hypot(x - bx, y - by) < 0.4;
      idle = settled ? idle + 1 : 0;
      if (idle > 6) { stop(); return; }
      raf = requestAnimationFrame(loop);
    };
     
    function stop() {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }
    const start = () => { if (!running) { running = true; idle = 0; raf = requestAnimationFrame(loop); } };

    const wake = () => {
       
      document.documentElement.classList.add('drop-on');
      drop.style.opacity = '1';
      start();
    };
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (!shown) {
         
        x = bx = mx; y = by = my; shown = true;
      }
      wake();
    }, { passive: true });
    const sleep = () => {
      drop.style.opacity = '0'; bead.style.opacity = '0';
      document.documentElement.classList.remove('drop-on');
      stop();
    };
    addEventListener('mouseleave', sleep);
    addEventListener('blur', sleep);
    addEventListener('mouseenter', () => { if (shown) wake(); });

     
    addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      const s = document.createElement('div');
      s.className = 'splash';
      s.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
      s.appendChild(document.createElement('b'));
      const n = 8;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.45;
        const d = 18 + Math.random() * 22;
        const r = 2.6 + Math.random() * 3.4;
        const b = document.createElement('i');
        b.style.width = b.style.height = r * 2 + 'px';
        b.style.margin = -r + 'px 0 0 ' + -r + 'px';
        b.style.setProperty('--x', Math.cos(a) * d + 'px');
        b.style.setProperty('--y', Math.sin(a) * d + 'px');
        b.style.animationDelay = Math.random() * 45 + 'ms';
        s.appendChild(b);
      }
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 800);
      start();
      drop.animate(
        [{ transform: drop.style.transform + ' scale(1)' },
         { transform: drop.style.transform + ' scale(1.5,.55)' },
         { transform: drop.style.transform + ' scale(1)' }],
        { duration: 340, easing: 'cubic-bezier(.2,1.5,.4,1)' });
    }, { passive: true });
  }

})();
