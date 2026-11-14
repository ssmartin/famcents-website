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

// Store images in the gallery: tap or click one to see it full size (a <dialog>), with arrows, swiping and the arrow
// keys for the others; Esc, ✕ or a tap outside the image closes it. Without JavaScript the images stay as they are.
(function () {
  if (typeof HTMLDialogElement === 'undefined') return;
  document.querySelectorAll('.gallery').forEach(function (gallery) {
    var imgs = [].slice.call(gallery.querySelectorAll('.store-shot img'));
    if (!imgs.length) return;
    var prevLabel = gallery.querySelector('.gallery-prev').getAttribute('aria-label');
    var nextLabel = gallery.querySelector('.gallery-next').getAttribute('aria-label');
    var closeLabel = gallery.getAttribute('data-close-label') || 'Close';
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.innerHTML =
      '<button type="button" class="lb-btn lb-close">✕</button>' +
      '<button type="button" class="lb-btn lb-prev">‹</button>' +
      '<img alt="">' +
      '<button type="button" class="lb-btn lb-next">›</button>';
    dlg.querySelector('.lb-close').setAttribute('aria-label', closeLabel);
    dlg.querySelector('.lb-prev').setAttribute('aria-label', prevLabel);
    dlg.querySelector('.lb-next').setAttribute('aria-label', nextLabel);
    document.body.appendChild(dlg);
    var big = dlg.querySelector('img');
    var index = 0;
    var opener = null;

    function show(n) {
      index = (n + imgs.length) % imgs.length;
      big.src = imgs[index].getAttribute('src');
      big.alt = imgs[index].alt;
    }
    function open(n, from) {
      opener = from;
      show(n);
      dlg.showModal();
    }
    imgs.forEach(function (img, n) {
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.addEventListener('click', function () { open(n, img); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(n, img);
        }
      });
    });
    dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
    dlg.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
    dlg.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    dlg.addEventListener('close', function () { if (opener) opener.focus(); });
    var startX = null;
    dlg.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
      if (startX == null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    });
  });
})();
