/*
 * Hyc! — landing behaviour.
 * Reads window.HYC_CONFIG (config.js) and wires the store buttons.
 * Kept external (not inline) so the page can ship a strict CSP: script-src 'self'.
 */
(function () {
  // Marker pomocniczy przy weryfikacji w przeglądarce — pozwala stwierdzić,
  // czy strona wykonuje aktualny plik, czy wersję z cache.
  window.__HYC_BUILD = 'nav-manual-2026-07-30';
  var cfg = window.HYC_CONFIG || {};
  var ios = document.getElementById("btn-ios");
  var openBtn = document.getElementById("btn-android-open");

  var modal = document.getElementById("android-modal");
  var closeBtn = document.getElementById("modal-close");
  var group = document.getElementById("btn-group");
  var android = document.getElementById("btn-android");
  var linkText = document.getElementById("modal-link-text");
  var copyBtn = document.getElementById("btn-copy-android");
  var backBtn = document.getElementById("nav-back");
  var nextBtn = document.getElementById("nav-next");

  var steps = Array.prototype.slice.call(modal.querySelectorAll(".modal-step"));
  var stepperBtns = Array.prototype.slice.call(modal.querySelectorAll(".stepper-btn"));
  var LAST = steps.length;
  var current = 1;

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
  wire(group, cfg.googleGroup);
  wire(android, cfg.googlePlay);

  // ---- Kreator instalacji na Androida ----
  // Editable stepper: kroki są klikalne i żaden nie jest zablokowany, więc user
  // skacze swobodnie (UX Patterns: "allows users to revisit completed steps").
  // Krok zmienia wyłącznie user — nic nie przesuwa się samo.

  function goToStep(n) {
    if (n < 1) { n = 1; }
    if (n > LAST) { n = LAST; }
    current = n;

    steps.forEach(function (s) {
      s.classList.toggle("is-hidden", Number(s.dataset.step) !== n);
    });
    // Stan kroku niesiony nie tylko kolorem (numer + ptaszek) — wytyczna
    // dostępności: "do not rely on color alone".
    stepperBtns.forEach(function (b) {
      var i = Number(b.dataset.goto);
      b.classList.toggle("is-current", i === n);
      b.classList.toggle("is-done", i < n);
      if (i === n) { b.setAttribute("aria-current", "step"); }
      else { b.removeAttribute("aria-current"); }
      // Linia po prawej stronie kroku zapala się, gdy ten krok mamy już za sobą.
      if (b.parentElement) { b.parentElement.classList.toggle("is-passed", i < n); }
    });

    backBtn.disabled = n === 1;
    nextBtn.textContent = n === LAST ? "Zamknij" : "Dalej";

    var active = steps[n - 1];
    active.classList.add("is-entering");
    setTimeout(function () { active.classList.remove("is-entering"); }, 400);
  }

  function openModal() {
    // Zawsze od Kroku 1 — kreator nie zgaduje, jak daleko user doszedł
    // poprzednim razem. Ruch po krokach robi wyłącznie on sam.
    goToStep(1);
    if (typeof modal.showModal === "function") { modal.showModal(); }
    else { modal.setAttribute("open", ""); }  // starsze przeglądarki bez <dialog>
    // Bez tego tło przewija się pod otwartym modalem.
    document.body.classList.add("has-modal");
  }

  function closeModal() {
    if (typeof modal.close === "function") { modal.close(); }
    else { modal.removeAttribute("open"); }
    document.body.classList.remove("has-modal");
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  // Zamknięcie kliknięciem w tło musi sprawdzać, gdzie klik się ZACZĄŁ.
  // Samo `click` na <dialog> łapie też przypadek, w którym user zaznacza tekst
  // wewnątrz karty i puszcza przycisk poza nią — przeglądarka raportuje wtedy
  // kliknięcie w tło i modal znikał razem z zaznaczeniem. To samo dotyczy
  // przeciągnięcia paska przewijania.
  var downNaTle = false;
  modal.addEventListener("mousedown", function (e) { downNaTle = e.target === modal; });
  modal.addEventListener("click", function (e) {
    if (e.target === modal && downNaTle) { closeModal(); }
    downNaTle = false;
  });
  // Escape zamyka <dialog> bez naszego udziału — posprzątaj po sobie i wtedy.
  modal.addEventListener("close", function () { document.body.classList.remove("has-modal"); });

  backBtn.addEventListener("click", function () { goToStep(current - 1); });
  nextBtn.addEventListener("click", function () {
    if (current === LAST) { closeModal(); } else { goToStep(current + 1); }
  });
  stepperBtns.forEach(function (b) {
    b.addEventListener("click", function () { goToStep(Number(b.dataset.goto)); });
  });

  // Krok zmienia WYŁĄCZNIE user — przyciskiem „Dalej" albo numerem w stepperze.
  // Klik w „Dołącz do grupy" otwiera kartę i nic poza tym: ani my, ani
  // przeglądarka nie wiemy, czy ktoś faktycznie dołączył (obca domena, brak
  // callbacku), więc przesuwanie kroku za niego byłoby zgadywaniem.

  // Krok 3 pokazuje link do zapisania — Google nie przyśle powiadomienia, gdy
  // dostęp się aktywuje, więc bez tego linku user nie ma jak wrócić.
  if (cfg.googlePlay) {
    linkText.textContent = cfg.googlePlay;
    copyBtn.disabled = false;
    copyBtn.addEventListener("click", function () {
      var reset = function () {
        copyBtn.textContent = "Kopiuj link";
        copyBtn.classList.remove("is-copied");
      };
      var showCopied = function () {
        copyBtn.textContent = "Skopiowano ✓";
        copyBtn.classList.add("is-copied");
        setTimeout(reset, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cfg.googlePlay).then(showCopied, function () {
          window.prompt("Skopiuj link ręcznie:", cfg.googlePlay);
        });
      } else {
        window.prompt("Skopiuj link ręcznie:", cfg.googlePlay);
      }
    });
  } else {
    linkText.textContent = "Link pojawi się, gdy testy wystartują";
    linkText.classList.add("is-empty");
  }

  // Highlight + surface the button matching the visitor's platform.
  var ua = navigator.userAgent || "";
  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var isAndroid = /Android/i.test(ua);
  if (isIOS && !ios.classList.contains("is-disabled")) {
    ios.classList.add("is-primary"); ios.style.order = "-1";
  } else if (isAndroid) {
    openBtn.classList.add("is-primary"); openBtn.style.order = "-1";
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---- Hero: 1 sekunda na pierwszej klatce, zanim nagranie ruszy ----
  // `autoplay` jest ZDJĘTE z <video> w index.html, więc materiał stoi na
  // pierwszej klatce (poster ją niesie) i startuje dopiero stąd.
  // ⚠ Pauza dotyczy WYŁĄCZNIE pierwszego uruchomienia — `loop` zapętla bez
  // przerwy, bo pętla jest wewnątrz elementu i JS jej nie widzi. Gdyby pauza
  // miała wracać w każdym cyklu, trzeba ją wypalić w materiale (ffmpeg tpad)
  // albo zastąpić `loop` ręcznym restartem na zdarzeniu `ended`.
  var heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    // Przy „ogranicz ruch" CSS chowa <video> — nie odtwarzamy go w tle,
    // bo to zużywałoby baterię na rzecz czegoś, czego nikt nie widzi.
    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      setTimeout(function () {
        // Odrzucenie obietnicy jest normalne, gdy karta jest w tle albo
        // przeglądarka blokuje autoodtwarzanie — wtedy zostaje sam poster.
        var p = heroVideo.play();
        if (p && p.catch) { p.catch(function () {}); }
      }, 1000);
    }
  }
})();
