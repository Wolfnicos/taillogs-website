/**
 * PetNudge Homepage — interactions (2026 redesign)
 * Scroll reveal + Lost Mode phone demo toggle.
 */

(function() {
  'use strict';

  // Scroll reveal (respects prefers-reduced-motion)
  const reveals = document.querySelectorAll('.pn-reveal');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function(el) { el.classList.add('is-in'); });
  } else {
    const io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    reveals.forEach(function(el) { io.observe(el); });
  }

  // Lost Mode demo: switch the finder-screen mockup between normal and lost
  const phone = document.getElementById('pn-phone');
  const btnNormal = document.getElementById('pn-mode-normal');
  const btnLost = document.getElementById('pn-mode-lost');

  if (phone && btnNormal && btnLost) {
    function setMode(mode) {
      phone.setAttribute('data-mode', mode);
      btnNormal.setAttribute('aria-pressed', String(mode === 'normal'));
      btnLost.setAttribute('aria-pressed', String(mode === 'lost'));
    }
    btnNormal.addEventListener('click', function() { setMode('normal'); });
    btnLost.addEventListener('click', function() { setMode('lost'); });
  }
})();
