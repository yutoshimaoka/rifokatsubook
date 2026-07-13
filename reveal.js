const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const itemSelectors = [
  'main section > *',
  '.find-block > *',
  '.carousel-track > *',
  '.case-grid > *',
  '.news-grid > *',
  '.blog-grid > *',
  '.related-articles-grid > *',
  '.article-toc',
].join(',');

const items = Array.from(document.querySelectorAll(itemSelectors)).filter((item) => {
  return !item.closest('[hidden]') &&
    !item.closest('.hero') &&
    !item.matches('.find-panel .topic-card, script, style');
});

items.forEach((item, index) => {
  item.classList.add('reveal-item');
  item.style.setProperty('--reveal-delay', `${(index % 5) * 70}ms`);
});

if (reduceMotion || !('IntersectionObserver' in window)) {
  items.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -5% 0px',
  });

  items.forEach((item) => observer.observe(item));
}
