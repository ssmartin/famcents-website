// Price offers on the home pages (Christmas 1–31 December 2026, New Year 1–10 January 2027 – the same days as in the
// app, src/lib/pro.ts in the app repository): each .offer note carries its first and last day and shows only on those
// days, by the visitor's date. Hidden by default, so nothing shows without JavaScript or outside the offer.
(function () {
  var d = new Date();
  var today = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  document.querySelectorAll('.offer[data-from][data-until]').forEach(function (el) {
    if (el.dataset.from <= today && today <= el.dataset.until) el.hidden = false;
  });
})();
