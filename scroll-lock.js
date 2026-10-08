/*
 * Hyc! — body scroll lock, dzielony przez nav.js (panel hamburgera) i main.js
 * (modale instalacji). Samo overflow:hidden na body nie wystarcza na Safari
 * iOS — dokument i tak przewija się (rubber-band) pod spodem. Zamrożenie
 * body na position:fixed w zapamiętanym scrollY jest jedyną niezawodną
 * techniką — tej samej używa każda poważna biblioteka modali.
 * `transform: translateY()`, NIE `top` — `top` na position:fixed wymusza
 * layout w momencie blokady, co na iOS Safari (dynamiczny pasek adresu)
 * dawało zgłoszony przeskok treści pod otwierającym się panelem menu.
 * transform jest kompozytowany, nie dotyka layoutu.
 */
window.HycScrollLock = (function () {
  var savedScrollY = 0;
  var locked = false;
  function lock() {
    if (locked) return;
    locked = true;
    savedScrollY = window.scrollY;
    document.body.classList.add("has-modal");
    document.body.style.transform = "translateY(-" + savedScrollY + "px)";
  }
  function unlock() {
    if (!locked) return;
    locked = false;
    document.body.classList.remove("has-modal");
    document.body.style.transform = "";
    window.scrollTo(0, savedScrollY);
  }
  return { lock: lock, unlock: unlock };
})();
