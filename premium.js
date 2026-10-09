/* Shared navigation, accessible progressive motion and page state. */
(function () {
  'use strict';
  function init() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main';
    if (main && !document.querySelector('a[href="#' + main.id + '"]')) {
      const skip = document.createElement('a');
      skip.href = '#' + main.id;
      skip.className = 'premium-skip';
      skip.textContent = document.documentElement.lang === 'fr' ? 'Aller au contenu' : 'Skip to content';
      document.body.prepend(skip);
    }
    document.querySelectorAll('.header__nav a').forEach(function (link) {
      const url = new URL(link.href, location.href);
      if (!url.hash && url.pathname.replace(/index\.html$/, '') === location.pathname.replace(/index\.html$/, '')) link.setAttribute('aria-current', 'page');
    });
    let button = document.getElementById('menu-btn');
    let menu = document.getElementById('mobile-menu');
    if (!menu && document.querySelector('.header__nav')) {
      if (!button) {
        button = document.createElement('button');
        button.id = 'menu-btn';button.className = 'header__menu-btn';button.type = 'button';
        button.setAttribute('aria-label', 'Menu');button.setAttribute('aria-expanded', 'false');
        button.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 8h16M4 16h16"/></svg>';
        (document.querySelector('.header__actions') || document.querySelector('.header__inner')).append(button);
      }
      menu = document.createElement('div');menu.id = 'mobile-menu';menu.className = 'mobile-menu';menu.inert = true;menu.setAttribute('aria-hidden', 'true');
      const close = document.createElement('button');close.id = 'menu-close';close.type = 'button';close.className = 'mobile-menu__close';close.setAttribute('aria-label', 'Close menu');close.textContent = '×';
      const nav = document.createElement('nav');nav.className = 'mobile-menu__nav';
      document.querySelectorAll('.header__nav a').forEach(function (link) {const copy = link.cloneNode(true);copy.className = 'mobile-menu__link';nav.append(copy);});
      menu.append(close, nav);document.body.append(menu);
      menu.dataset.premiumManaged = 'true';
    }
    if (button && menu) {
      button.setAttribute('aria-controls', menu.id);
      const close = document.getElementById('menu-close');
      function closeMenu() {menu.classList.remove('is-open');menu.inert = true;menu.setAttribute('aria-hidden', 'true');button.setAttribute('aria-expanded', 'false');document.body.style.overflow = '';button.focus({preventScroll:true});}
      if (!window.translations || menu.dataset.premiumManaged) {
        button.addEventListener('click', function () {menu.classList.add('is-open');menu.inert = false;menu.setAttribute('aria-hidden', 'false');button.setAttribute('aria-expanded', 'true');document.body.style.overflow = 'hidden';});
        if (close) close.addEventListener('click', closeMenu);
        menu.querySelectorAll('a').forEach(function (link) {link.addEventListener('click', closeMenu);});
      }
      button.addEventListener('click', function () {requestAnimationFrame(function () {if (close && menu.classList.contains('is-open')) close.focus();});});
      document.addEventListener('keydown', function (event) {
        if (!menu.classList.contains('is-open')) return;
        if (event.key === 'Escape') closeMenu();
        if (event.key === 'Tab') {
          const items = Array.from(menu.querySelectorAll('button,a[href]')).filter(el => el.offsetParent !== null);
          const first = items[0], last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
          else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
        }
      });
      matchMedia('(min-width:1100px)').addEventListener('change', function (event) {if(event.matches && menu.classList.contains('is-open')) closeMenu();});
    }
    if (!reduced.matches && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {if (entry.isIntersecting) {entry.target.classList.remove('is-pending');entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});
      }, {threshold:.06});
      document.querySelectorAll('[data-reveal]').forEach(function (element) {element.classList.add('premium-reveal');if(element.getBoundingClientRect().top > innerHeight) element.classList.add('is-pending');observer.observe(element);});
      reduced.addEventListener('change', function (event) {if(event.matches) document.querySelectorAll('.is-pending').forEach(el=>el.classList.remove('is-pending'));});
    }
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
      document.querySelectorAll('[data-tilt]').forEach(function (element) {
        let frame;
        element.addEventListener('pointermove', function (event) {
          if (reduced.matches) return;
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(function () {const rect=element.getBoundingClientRect();element.style.setProperty('--tilt-x', ((.5-(event.clientY-rect.top)/rect.height)*5)+'deg');element.style.setProperty('--tilt-y', (((event.clientX-rect.left)/rect.width-.5)*7)+'deg');});
        });
        element.addEventListener('pointerleave', function () {cancelAnimationFrame(frame);element.style.setProperty('--tilt-x','0deg');element.style.setProperty('--tilt-y','0deg');});
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
