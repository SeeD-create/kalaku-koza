(() => {
  'use strict';
  const config = window.F_CONFIG || {};
  function validURL(value, type) {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password || /XXXX|example\.|localhost|127\.0\.0\.1/i.test(value)) return '';
      if (type === 'line' && !['lin.ee', 'line.me'].includes(url.hostname)) return '';
      return url.href;
    } catch { return ''; }
  }
  function connect(selector, value, statusId, readyText, type) {
    const url = validURL(value, type);
    const status = document.getElementById(statusId);
    document.querySelectorAll(selector).forEach(link => {
      if (url) {
        link.href = url;
        link.removeAttribute('aria-disabled');
      } else {
        link.addEventListener('click', event => {
          event.preventDefault();
          status.hidden = false;
          status.classList.remove('attention');
          void status.offsetWidth;
          status.classList.add('attention');
          status.setAttribute('tabindex', '-1');
          status.focus({ preventScroll: true });
        });
      }
    });
    if (url) { status.hidden = false; status.textContent = readyText; }
    return Boolean(url);
  }
  connect('[data-line-action]', config.LINE_URL, 'line-status', '講座用の公式LINEへ進みます。', 'line');

  
  const vid = String(config.VIMEO_ID || '').replace(/\D/g, '');
  const frame = document.getElementById('movie-frame');
  const movieStatus = document.getElementById('movie-status');
  function showMovieStatus() {
    movieStatus.hidden = false;
    movieStatus.classList.remove('attention');
    void movieStatus.offsetWidth;
    movieStatus.classList.add('attention');
    movieStatus.setAttribute('tabindex', '-1');
    movieStatus.focus({ preventScroll: true });
  }
  document.querySelectorAll('[data-movie-action]').forEach(link => {
    if (!vid) link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', event => {
      event.preventDefault();
      if (!vid) {
        document.getElementById('registration').scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(showMovieStatus, 420);
        return;
      }
      if (!frame.dataset.loaded) {
        const player = document.createElement('iframe');
        player.src = 'https://player.vimeo.com/video/' + vid + '?autoplay=1&title=0&byline=0&portrait=0';
        player.title = '講座説明動画';
        player.allow = 'autoplay; fullscreen; picture-in-picture';
        player.setAttribute('allowfullscreen', '');
        frame.appendChild(player);
        frame.dataset.loaded = '1';
      }
      frame.hidden = false;
      frame.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  const sticky = document.querySelector('.sticky');
  const hero = document.querySelector('.hero');
  const register = document.getElementById('registration');
  const closing = document.querySelector('.closing');
  let queued = false;
  function updateSticky() {
    const registrationRect = register.getBoundingClientRect();
    const registrationVisible = registrationRect.top < innerHeight && registrationRect.bottom > 0;
    sticky.hidden = hero.getBoundingClientRect().bottom > 0 || registrationVisible || closing.getBoundingClientRect().top < innerHeight || innerWidth >= 900;
    queued = false;
  }
  function scheduleUpdate() { if (!queued) { queued = true; requestAnimationFrame(updateSticky); } }
  addEventListener('scroll', scheduleUpdate, { passive: true });
  addEventListener('resize', scheduleUpdate);
  updateSticky();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const animations = new Set();
    function animate(el, frames, options) {
      if (reducedMotion.matches) return;
      const animation = el.animate(frames, options);
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
    }
    document.querySelectorAll('.hero-copy .eyebrow, .hero h1, .hero-lead, .hero-action').forEach((el, index) => {
      animate(el, [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 850, delay: index * 140, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    });
    animate(document.querySelector('.hero-image img'), [{ transform: 'scale(1.07)' }, { transform: 'scale(1)' }], { duration: 1900, easing: 'cubic-bezier(.2,.6,.2,1)' });
    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);
    let motionFrame = false;
    function progressFrame() {
      progress.style.transform = `scaleX(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
      motionFrame = false;
    }
    function progressRequest() { if (!motionFrame) { motionFrame = true; requestAnimationFrame(progressFrame); } }
    addEventListener('scroll', progressRequest, { passive: true });
    addEventListener('resize', progressRequest);
    progressFrame();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.matches('figure')) {
          animate(el.querySelector('img'), [{ clipPath: 'inset(0 0 14% 0)', opacity: 0.65 }, { clipPath: 'inset(0 0 0% 0)', opacity: 1 }], { duration: 1100, easing: 'cubic-bezier(.16,1,.3,1)' });
        } else {
          animate(el, [{ opacity: 0.3, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 850, easing: 'cubic-bezier(.16,1,.3,1)' });
          if (el.matches('.program-banner, .editorial-strip, .curriculum-list, .movie-topics')) {
            [...el.children].forEach((child, index) => animate(child, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 700, delay: index * 110, easing: 'ease-out', fill: 'backwards' }));
          }
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.section-heading, .intro-grid, .editorial-strip, .program-banner, .method-copy, .registration-action, .curriculum-list, .formats, .outline-grid, .consultation-grid>div, .closing>.wrap, .movie-topics, main figure:not(.hero-image)').forEach(el => observer.observe(el));
    reducedMotion.addEventListener('change', event => {
      if (!event.matches) return;
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      progress.remove();
      removeEventListener('scroll', progressRequest);
      removeEventListener('resize', progressRequest);
    });
  }
})();
