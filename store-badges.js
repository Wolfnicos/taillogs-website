// The App Store badge follows the page language (Apple's localized artwork in /images/badges/), and the web-app
// badge takes the same width as the App Store badge next to it.
(function () {
  var ALTS = {
    fr: 'Télécharger dans l’App Store', en: 'Download on the App Store', ro: 'Descarcă din App Store',
    es: 'Descárgalo en el App Store', de: 'Laden im App Store', it: 'Scarica dall’App Store',
    pt: 'Baixar na App Store', ja: 'App Storeからダウンロード', zh: '在 App Store 下载'
  };
  function lang() {
    var l = (document.documentElement.lang || 'fr').slice(0, 2).toLowerCase();
    return ALTS[l] ? l : 'en';
  }
  function sync() {
    document.querySelectorAll('.pn-store-badges').forEach(function (group) {
      var img = group.querySelector('.pn-store-badge__apple');
      var web = group.querySelector('.pn-store-badge--web');
      if (!img || !web) return;
      var width = img.getBoundingClientRect().width;
      if (width > 0) web.style.width = Math.round(width) + 'px';
    });
  }
  function apply() {
    var l = lang();
    document.querySelectorAll('.pn-store-badge__apple').forEach(function (img) {
      var src = '/images/badges/app-store-' + l + '.svg';
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
      img.alt = ALTS[l];
    });
    sync();
  }
  document.addEventListener('load', function (event) {
    var t = event.target;
    if (t && t.classList && t.classList.contains('pn-store-badge__apple')) sync();
  }, true);
  new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  window.addEventListener('resize', sync);
  apply();
})();
