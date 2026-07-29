/*
 * Hyc! — landing behaviour.
 * Reads window.HYC_CONFIG (config.js) and wires the store buttons + email form.
 * Kept external (not inline) so the page can ship a strict CSP: script-src 'self'.
 */
(function () {
  var cfg = window.HYC_CONFIG || {};
  var ios = document.getElementById("btn-ios");
  var android = document.getElementById("btn-android");

  // Wire a store button to its link, or lock it as "Wkrótce" when empty.
  function wire(btn, url) {
    if (url) {
      btn.setAttribute("href", url);
      btn.setAttribute("target", "_blank");
    } else {
      btn.classList.add("is-disabled");
      btn.removeAttribute("href");
      btn.setAttribute("aria-disabled", "true");
      btn.querySelector("strong").textContent = "Wkrótce";
    }
  }
  wire(ios, cfg.testflight);
  wire(android, cfg.googlePlay);

  // Highlight + surface the button matching the visitor's platform.
  var ua = navigator.userAgent || "";
  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var isAndroid = /Android/i.test(ua);
  if (isIOS && !ios.classList.contains("is-disabled")) {
    ios.classList.add("is-primary"); ios.style.order = "-1";
  } else if (isAndroid && !android.classList.contains("is-disabled")) {
    android.classList.add("is-primary"); android.style.order = "-1";
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
