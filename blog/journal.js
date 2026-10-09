/* Progressive enhancement for the journal. Article content never depends on JS. */
(() => {
  'use strict';
  const search = document.getElementById('journal-search');
  const language = document.getElementById('journal-language');
  const articles = [...document.querySelectorAll('[data-journal-article]')];
  const normalize = value => value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (search && language && articles.length) {
    const filters = [...document.querySelectorAll('[data-category-filter]')];
    const count = document.querySelector('.journal-results-count');
    const empty = document.querySelector('.journal-empty');
    const more = document.querySelector('.journal-more');
    const reset = document.getElementById('journal-reset');
    const searchable = new Map(articles.map(article => [article, normalize(article.textContent)]));
    let category = 'all';
    let limit = 12;
    const requested = new URLSearchParams(location.search).get('lang');
    if ([...language.options].some(option => option.value === requested)) language.value = requested;
    else language.value = 'fr';
    const filter = () => {
      const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
      const matched = articles.filter(article =>
        (language.value === 'all' || article.dataset.language === language.value) &&
        (category === 'all' || article.dataset.category === category) &&
        terms.every(term => searchable.get(article).includes(term))
      );
      const visible = new Set(matched.slice(0, limit));
      articles.forEach(article => { article.hidden = !visible.has(article); });
      count.textContent = `${matched.length} article${matched.length === 1 ? '' : 's'}${matched.length > limit ? ` · ${limit} affichés` : ''}`;
      empty.hidden = matched.length !== 0;
      more.hidden = matched.length <= limit;
    };
    filters.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.categoryFilter;
      filters.forEach(item => {
        const selected = item === button;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      limit = 12;
      filter();
    }));
    search.form.addEventListener('submit', event => event.preventDefault());
    search.addEventListener('input', () => { limit = 12; filter(); });
    language.addEventListener('change', () => {
      limit = 12;
      const url = new URL(location.href);
      url.searchParams.set('lang', language.value);
      history.replaceState(null, '', url);
      filter();
    });
    more.addEventListener('click', () => {
      const previous = articles.filter(article => !article.hidden);
      limit += 12;
      filter();
      const firstNew = articles.find(article => !article.hidden && !previous.includes(article));
      firstNew?.querySelector('h3 a')?.focus({ preventScroll: true });
    });
    reset.addEventListener('click', () => {
      search.value = '';
      category = 'all';
      filters.forEach(button => {
        const selected = button.dataset.categoryFilter === 'all';
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      limit = 12;
      filter();
      search.focus();
    });
    filter();
  }
  const prose = document.querySelector('.journal-prose');
  const progress = document.querySelector('.journal-progress span');
  if (prose && progress) {
    let ticking = false;
    const update = () => {
      const start = prose.getBoundingClientRect().top + window.scrollY - 120;
      const end = start + prose.scrollHeight - window.innerHeight + 180;
      const ratio = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, end - start)));
      progress.style.transform = `scaleX(${ratio})`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
    const headings = [...prose.querySelectorAll('h2[id]')];
    if ('IntersectionObserver' in window) {
      const links = [...document.querySelectorAll('.journal-toc a')];
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) links.forEach(link => {
            const active = link.hash === `#${entry.target.id}`;
            link.classList.toggle('is-current', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-100px 0px -65% 0px', threshold: 0 });
      headings.forEach(heading => observer.observe(heading));
    }
    const toc = document.querySelector('.journal-toc');
    if (toc && window.matchMedia('(max-width: 760px)').matches) toc.open = false;
  }
})();
