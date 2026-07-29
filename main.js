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

  // Email signup: show only when an endpoint is configured.
  var signup = document.getElementById("signup");
  var form = document.getElementById("signup-form");
  var status = document.getElementById("signup-status");
  if (cfg.emailAction) {
    form.setAttribute("action", cfg.emailAction);
    signup.hidden = false;

    // Submit via fetch so the visitor stays on the page and sees an inline
    // confirmation. Works with Formspree / Buttondown (Accept: application/json).
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button");
      function say(msg, ok) {
        status.hidden = false;
        status.textContent = msg;
        status.classList.toggle("is-error", !ok);
      }
      btn.disabled = true;
      fetch(cfg.emailAction, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            say("Dzięki — jesteś na liście", true);
          } else {
            say("Coś poszło nie tak — spróbuj ponownie", false);
          }
        })
        .catch(function () {
          say("Brak połączenia — spróbuj ponownie", false);
        })
        .finally(function () { btn.disabled = false; });
    });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
