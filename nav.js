// Hamburger nawigacji mobilnej — wspólny dla wszystkich stron (index/pobierz/
// o-aplikacji/kontakt), stąd osobny plik zamiast duplikatu w main.js (który
// ładuje się tylko na index.html/pobierz.html).
// Panel jako bottom sheet: sterowanie klasą .is-open, nie atrybutem hidden,
// bo hidden ucina display natychmiast i transform nie ma się na czym animować.
// hidden zostaje na starcie w HTML (panel poza ekranem i niedostępny dla
// klawiatury/czytnika, zanim JS w ogóle wystartuje), JS zdejmuje go przy
// pierwszym otwarciu.
(() => {
  const burger = document.querySelector('.topbar-burger');
  const panel = document.querySelector('.topbar-nav-mobile');
  const backdrop = document.querySelector('.nav-backdrop');
  if (!burger || !panel || !backdrop) return;

  // Ta sama blokada co modale instalacji w main.js — patrz scroll-lock.js.
  const lockScroll = window.HycScrollLock.lock;
  const unlockScroll = window.HycScrollLock.unlock;

  const close = () => {
    panel.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    unlockScroll();
    // hidden wraca dopiero po animacji (280ms w CSS) — w trakcie musi być
    // widoczny/focusowalny, inaczej transform nie ma czego pokazać.
    window.setTimeout(() => { panel.hidden = true; }, 280);
  };
  const open = () => {
    panel.hidden = false;
    // Kolejna klatka — inaczej przeglądarka złączy hidden=false i dodanie
    // .is-open w jedną operację i transform nie wystartuje od translateY(100%).
    requestAnimationFrame(() => {
      panel.classList.add('is-open');
      backdrop.classList.add('is-open');
    });
    burger.setAttribute('aria-expanded', 'true');
    lockScroll();
  };

  burger.addEventListener('click', () => {
    if (panel.hidden || !panel.classList.contains('is-open')) open(); else close();
  });
  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
  });
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
  });
})();
