(function() {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const reveals = document.querySelectorAll('.pn-reveal');
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {if (entry.isIntersecting) {entry.target.classList.remove('is-pending');entry.target.classList.add('is-in');observer.unobserve(entry.target);}});
    }, {threshold:.06});
    reveals.forEach(function(el) {if (el.getBoundingClientRect().top > innerHeight) el.classList.add('is-pending');observer.observe(el);});
    reduced.addEventListener('change', function(event) {if(event.matches) reveals.forEach(el=>el.classList.remove('is-pending'));});
  }
  const phone=document.getElementById('pn-phone');
  const normal=document.getElementById('pn-mode-normal');
  const lost=document.getElementById('pn-mode-lost');
  if(phone && normal && lost) {
    function setMode(mode) {phone.dataset.mode=mode;normal.setAttribute('aria-pressed',String(mode==='normal'));lost.setAttribute('aria-pressed',String(mode==='lost'));}
    normal.addEventListener('click',()=>setMode('normal'));lost.addEventListener('click',()=>setMode('lost'));
  }
  const scene=document.querySelector('.pn-scene');
  if (scene && 'IntersectionObserver' in window) {
    let visible=true;
    let scrollFrame;
    function updateDepth() {
      if (!visible || reduced.matches) return;
      cancelAnimationFrame(scrollFrame);
      scrollFrame=requestAnimationFrame(function() {
        const hero=document.querySelector('.pn-hero');
        const progress=Math.max(0,Math.min(1,-hero.getBoundingClientRect().top/hero.offsetHeight));
        scene.style.setProperty('--scene-progress',progress.toFixed(3));
      });
    }
    window.addEventListener('scroll',updateDepth,{passive:true});
    function updateMotion() {scene.querySelectorAll('.pn-device-wrap,.pn-floating-note').forEach(el=>{el.style.animationPlayState=visible && !document.hidden ? 'running' : 'paused';});}
    new IntersectionObserver(function(entries) {visible=entries[0].isIntersecting;updateMotion();updateDepth();}).observe(scene);
    document.addEventListener('visibilitychange',updateMotion);
  }
  const screen=document.getElementById('pn-app-screen');
  document.querySelectorAll('[data-screen]').forEach(function(button) {
    button.addEventListener('click',function() {
      document.querySelectorAll('[data-screen]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
      screen.src='/images/app/screen-'+button.dataset.screen+'.webp';
      screen.alt='PetNudge — '+button.textContent.trim();
      if(!reduced.matches && screen.animate) screen.animate([{opacity:.25},{opacity:1}],{duration:300,easing:'ease-out'});
    });
  });
})();
