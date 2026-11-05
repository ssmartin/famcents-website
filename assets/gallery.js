// Screenshot gallery: arrow buttons and page dots for the horizontally scrolling .shots row. Swiping and keyboard
// scrolling keep working; without JavaScript the row simply scrolls as before.
(function () {
  document.querySelectorAll('.gallery').forEach(function (gallery) {
    var row = gallery.querySelector('.shots');
    var prev = gallery.querySelector('.gallery-prev');
    var next = gallery.querySelector('.gallery-next');
    var dots = gallery.querySelector('.gallery-dots');
    var items = row.querySelectorAll('.shot-item');
    var pageLabel = gallery.getAttribute('data-page-label') || 'Page {n}';
    gallery.classList.add('ready');

    function step() {
      return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : row.clientWidth;
    }
    /** How far the row can scroll; the last position shows the last screenshot in full. */
    function maxScroll() {
      return Math.max(0, row.scrollWidth - row.clientWidth);
    }
    /**
     * Positions: one per screenshot step, the last one being the end of the row. A remainder of less than half a step
     * (a screenshot already almost fully visible) belongs to the last position instead of getting a dot of its own.
     */
    function pages() {
      return Math.round(maxScroll() / step()) + 1;
    }
    function current() {
      if (row.scrollLeft >= maxScroll() - 8) return pages() - 1;
      return Math.min(pages() - 1, Math.round(row.scrollLeft / step()));
    }
    function go(page) {
      var left = page >= pages() - 1 ? maxScroll() : Math.min(page * step(), maxScroll());
      row.scrollTo({ left: left, behavior: 'smooth' });
    }

    function buildDots() {
      dots.innerHTML = '';
      for (var i = 0; i < pages(); i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'gallery-dot';
        dot.setAttribute('aria-label', pageLabel.replace('{n}', i + 1));
        dot.addEventListener('click', go.bind(null, i));
        dots.appendChild(dot);
      }
      dots.hidden = pages() < 2;
      update();
    }
    function update() {
      var page = current();
      prev.disabled = row.scrollLeft <= 8;
      next.disabled = row.scrollLeft >= maxScroll() - 8;
      dots.querySelectorAll('.gallery-dot').forEach(function (dot, i) {
        dot.setAttribute('aria-current', i === page ? 'true' : 'false');
      });
    }

    prev.addEventListener('click', function () { go(Math.max(0, current() - 1)); });
    next.addEventListener('click', function () { go(Math.min(pages() - 1, current() + 1)); });
    row.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', buildDots);
    buildDots();
  });
})();
