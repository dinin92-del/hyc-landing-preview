// Hamburger nawigacji mobilnej — wspólny dla wszystkich stron (index/pobierz/
// o-aplikacji/kontakt), stąd osobny plik zamiast duplikatu w main.js (który
// ładuje się tylko na index.html/pobierz.html).
// Panel jako dropdown pod paskiem: sterowanie klasą .is-open, nie atrybutem
// hidden, bo hidden ucina display natychmiast i transform/opacity nie mają
// się na czym animować. hidden zostaje na starcie w HTML (panel niewidoczny
// i niedostępny dla klawiatury/czytnika, zanim JS w ogóle wystartuje), JS
// zdejmuje go przy pierwszym otwarciu.
(() => {
  const burger = document.querySelector('.topbar-burger');
  const panel = document.querySelector('.topbar-nav-mobile');
  const backdrop = document.querySelector('.nav-backdrop');
  if (!burger || !panel || !backdrop) return;

  // Bez blokady scrolla body (inaczej niż modale instalacji w main.js) —
  // panel to dropdown pod pigułką, nie pełnoekranowy modal, a `position:
  // fixed` na body (scroll-lock.js) kolidowało z dynamicznym paskiem
  // adresu Safari na iOS i dawało przeskok treści w momencie otwarcia.
  // Przyciemnienie (.nav-backdrop, fixed + pointer-events:auto gdy otwarte)
  // wystarcza, żeby user nie wchodził w interakcję z treścią pod spodem.
  const close = () => {
    panel.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    // hidden wraca dopiero po animacji (200ms w CSS) — w trakcie musi być
    // widoczny/focusowalny, inaczej transform/opacity nie mają czego pokazać.
    window.setTimeout(() => { panel.hidden = true; }, 200);
  };
  const open = () => {
    panel.hidden = false;
    // Kolejna klatka — inaczej przeglądarka złączy hidden=false i dodanie
    // .is-open w jedną operację i animacja nie wystartuje od stanu początkowego.
    requestAnimationFrame(() => {
      panel.classList.add('is-open');
      backdrop.classList.add('is-open');
    });
    burger.setAttribute('aria-expanded', 'true');
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
