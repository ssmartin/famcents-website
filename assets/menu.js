// The language menu in the header (a <details> element, so it works without this script too): closes when you tap
// outside it or press Escape.
document.addEventListener('click', (e) => {
  document.querySelectorAll('details.lang-menu[open]').forEach((menu) => {
    if (!menu.contains(e.target)) menu.removeAttribute('open');
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('details.lang-menu[open]').forEach((menu) => {
    menu.removeAttribute('open');
    menu.querySelector('summary').focus();
  });
});
