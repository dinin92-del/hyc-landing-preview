/*
 * Hyc! - diagnostyka hero (ładowana tylko z ?herodebug, patrz main.js).
 * Nakładka ze stanem scrolla, hamulca i wideo do zrzutu ekranu z urządzenia.
 */
(function () {
  var v = document.querySelector(".phone-video");
  var o = document.createElement("pre");
  o.style.cssText = "position:fixed;left:4px;top:96px;z-index:99999;background:rgba(255,255,255,.94);color:#000;font:11px/1.35 monospace;padding:4px 6px;margin:0;pointer-events:none;max-width:96vw;white-space:pre-wrap";
  document.body.appendChild(o);
  var maxY = 0, overshoots = 0, lastY = 0, lockOffAt = 0, firstMoveAt = 0, movedInLock = 0;
  window.addEventListener("scroll", function () {
    var now = Math.round(performance.now());
    if (!firstMoveAt && window.scrollY > 0) { firstMoveAt = now; }
    if (document.documentElement.classList.contains("intro-lock") && window.scrollY > 0) { movedInLock++; }
    var st = window.HycHeroDebug ? window.HycHeroDebug() : {};
    if (st.brakeOn && window.scrollY > st.brakeY + 1) { overshoots++; }
    lastY = window.scrollY;
  }, { passive: true });
  setInterval(function () {
    var st = window.HycHeroDebug ? window.HycHeroDebug() : {};
    maxY = Math.max(maxY, window.scrollY);
    var lock = document.documentElement.classList.contains("intro-lock");
    if (!lock && !lockOffAt) { lockOffAt = Math.round(performance.now()); }
    o.textContent = "y" + Math.round(window.scrollY) + " max" + Math.round(maxY) + " ih" + window.innerHeight +
      "\npin:" + st.pinned + " brake:" + st.brakeOn + " brakeY" + st.brakeY + " hold" + st.holdPx + " overshoot" + overshoots +
      "\novf:" + getComputedStyle(document.documentElement).overflowY + " video paused:" + (v && v.paused) + " t" + (v ? v.currentTime.toFixed(1) : "-") +
      "\nlock:" + lock + " lockOff@" + lockOffAt + " firstMove@" + firstMoveAt + " movedInLock" + movedInLock + " now" + Math.round(performance.now()) +
      "\n" + navigator.userAgent.slice(-70);
  }, 100);
})();
