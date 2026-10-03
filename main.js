/*
 * Hyc! — logika landingu.
 * Czyta window.HYC_CONFIG (config.js) i podpina przyciski sklepów.
 * Zewnętrzny plik, nie inline, żeby strona mogła iść ze ścisłym CSP: script-src 'self'.
 */
(function () {
  var cfg = window.HYC_CONFIG || {};
  var ios = document.getElementById("btn-ios");
  var iosOpenBtn = document.getElementById("btn-ios-open");
  var openBtn = document.getElementById("btn-android-open");

  var iosModal = document.getElementById("ios-modal");

  var modal = document.getElementById("android-modal");
  var group = document.getElementById("btn-group");
  var android = document.getElementById("btn-android");
  var backBtn = document.getElementById("nav-back");
  var nextBtn = document.getElementById("nav-next");

  var steps = Array.prototype.slice.call(modal.querySelectorAll(".modal-step"));
  var stepperBtns = Array.prototype.slice.call(modal.querySelectorAll(".stepper-btn"));
  var LAST = steps.length;
  var current = 1;

  // Blokada przewijania tła pod otwartym modalem (dowolnym z dwóch) — patrz
  // scroll-lock.js. Ten sam zamek dzieli panel hamburgera w nav.js.
  var lockScroll = window.HycScrollLock.lock;
  var unlockScroll = window.HycScrollLock.unlock;

  // Podłącz przycisk sklepu do linku, albo zablokuj jako "Wkrótce" gdy pusty.
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
  // Celowo gołe https:// z konsoli Play — próby obejścia przechwycenia przez
  // apkę Sklep Play (intent://, package=, usuwanie target) zawiodły na realnym
  // telefonie. To, czy link otwiera się w apce Play czy w przeglądarce,
  // decyduje ustawienie "Otwieraj domyślnie" apki Play na telefonie, nie strona.

  // ---- Kreator instalacji na Androida ----
  // Editable stepper: kroki są klikalne i żaden nie jest zablokowany, więc user
  // skacze swobodnie. Krok zmienia wyłącznie user — nic nie przesuwa się samo.

  function goToStep(n) {
    if (n < 1) { n = 1; }
    if (n > LAST) { n = LAST; }
    current = n;

    steps.forEach(function (s) {
      s.classList.toggle("is-hidden", Number(s.dataset.step) !== n);
    });
    // Stan kroku niosą też numer i ptaszek, nie sam kolor (a11y).
    stepperBtns.forEach(function (b) {
      var i = Number(b.dataset.goto);
      b.classList.toggle("is-current", i === n);
      b.classList.toggle("is-done", i < n);
      if (i === n) { b.setAttribute("aria-current", "step"); }
      else { b.removeAttribute("aria-current"); }
      if (b.parentElement) { b.parentElement.classList.toggle("is-passed", i < n); }
    });

    backBtn.disabled = n === 1;
    nextBtn.textContent = n === LAST ? "Zamknij" : "Dalej";

    var active = steps[n - 1];
    active.classList.add("is-entering");
    setTimeout(function () { active.classList.remove("is-entering"); }, 400);
  }

  function openModal() {
    // Zawsze od kroku 1 — kreator nie zgaduje, jak daleko user doszedł
    // poprzednim razem.
    goToStep(1);
    if (typeof modal.showModal === "function") { modal.showModal(); }
    else { modal.setAttribute("open", ""); }
    lockScroll();
  }

  function closeModal() {
    if (typeof modal.close === "function") { modal.close(); }
    else { modal.removeAttribute("open"); }
    unlockScroll();
  }

  openBtn.addEventListener("click", openModal);
  // Zamknięcie kliknięciem w tło musi sprawdzać, gdzie klik się ZACZĄŁ —
  // inaczej zaznaczenie tekstu w karcie puszczone poza nią (albo pociągnięcie
  // paska przewijania) przeglądarka raportuje jako klik w tło i modal znikał.
  var pressedOnBackdrop = false;
  modal.addEventListener("mousedown", function (e) { pressedOnBackdrop = e.target === modal; });
  modal.addEventListener("click", function (e) {
    if (e.target === modal && pressedOnBackdrop) { closeModal(); }
    pressedOnBackdrop = false;
  });
  // Escape zamyka <dialog> bez naszego udziału — posprzątaj po sobie i wtedy.
  modal.addEventListener("close", unlockScroll);

  backBtn.addEventListener("click", function () { goToStep(current - 1); });
  nextBtn.addEventListener("click", function () {
    if (current === LAST) { closeModal(); } else { goToStep(current + 1); }
  });
  stepperBtns.forEach(function (b) {
    b.addEventListener("click", function () { goToStep(Number(b.dataset.goto)); });
  });

  // Krok zmienia wyłącznie user. Klik w "Dołącz do grupy" otwiera obcą kartę
  // i nic poza tym — nie wiemy, czy ktoś faktycznie dołączył (brak callbacku),
  // więc przesuwanie kroku za niego byłoby zgadywaniem.

  // ---- Modal instalacji na iOS ----
  // Jedna zewnętrzna akcja (link TestFlight), nie kreator — bez kroków, więc
  // bez steppera i bez Wstecz/Dalej.

  function openIosModal() {
    if (typeof iosModal.showModal === "function") { iosModal.showModal(); }
    else { iosModal.setAttribute("open", ""); }
    lockScroll();
  }
  function closeIosModal() {
    if (typeof iosModal.close === "function") { iosModal.close(); }
    else { iosModal.removeAttribute("open"); }
    unlockScroll();
  }

  // Modal jest zawsze dostępny do obejrzenia (jak modal Androida) — gated jest
  // wyłącznie finalny link wewnątrz, przez wire() (ten sam mechanizm "Wkrótce"),
  // więc odwiedzający widzi wyjaśnienie procesu, ale nie dostanie martwego linku.
  iosOpenBtn.addEventListener("click", openIosModal);

  // Zamknięcie kliknięciem w tło — ta sama ochrona przed zaznaczaniem tekstu
  // co przy modalu Androida.
  var iosPressedOnBackdrop = false;
  iosModal.addEventListener("mousedown", function (e) { iosPressedOnBackdrop = e.target === iosModal; });
  iosModal.addEventListener("click", function (e) {
    if (e.target === iosModal && iosPressedOnBackdrop) { closeIosModal(); }
    iosPressedOnBackdrop = false;
  });
  iosModal.addEventListener("close", unlockScroll);

  // Wyróżnij przycisk pasujący do platformy odwiedzającego.
  var ua = navigator.userAgent || "";
  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var isAndroid = /Android/i.test(ua);
  if (isIOS) {
    iosOpenBtn.classList.add("is-primary"); iosOpenBtn.style.order = "-1";
  } else if (isAndroid) {
    openBtn.classList.add("is-primary"); openBtn.style.order = "-1";
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---- Hero: sekunda na pierwszej klatce, zanim nagranie ruszy ----
  // <video> nie ma autoplay (index.html) — materiał stoi na pierwszej klatce
  // (niesie ją poster) i startuje dopiero stąd. Pauza dotyczy tylko pierwszego
  // uruchomienia; loop zapętla bez przerwy, bo pętla żyje wewnątrz elementu.
  var heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    // Przy "ogranicz ruch" CSS chowa <video> — nie odtwarzamy go w tle,
    // to zużywałoby baterię na coś, czego nikt nie widzi.
    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      // Jedna próba play() nie wystarcza. Odrzucenie ma wiele przyczyn (karta
      // w tle, Low Power Mode na iOS, wymagany gest w in-app WebView), a bez
      // autoplay przeglądarka nie wznowi sama. Dlatego ponawiamy przy każdym
      // wyzwalaczu, dopóki odtwarzanie nie jest potwierdzone, i nie odpinamy
      // nasłuchów po pierwszym starcie — system może zapauzować media długo
      // później (schowanie strony, rozmowa, Low Power). Stanem rozstrzygającym
      // jest heroVideo.paused ("czy stoi teraz"), nie własna flaga.
      var heroTriggers = ["visibilitychange", "touchend", "pointerup", "click"];
      var startHeroVideo = function () {
        // Odrzucenie play() zostawia element zapauzowany, co i tak wyłapie
        // onHeroTrigger; cichy catch tylko tłumi "unhandled rejection".
        var p = heroVideo.play();
        if (p && p.catch) { p.catch(function () {}); }
      };
      // pointerdown NIE nadaje user activation dla dotyku (spec: liczy się mysz;
      // na dotyku aktywację daje pointerup/touchend). click zostaje dla myszy
      // i klawiatury.
      var onHeroTrigger = function () {
        // Dotknięcia sprzed armed (user nie dojechał jeszcze do kadru) ignoruj,
        // ale nasłuch zostaje.
        if (!armed || !heroVideo.paused) { return; }
        startHeroVideo();
      };
      // Nie startujemy po samym setTimeout od załadowania. Safari na iOS
      // odtwarza bez gestu tylko element WIDOCZNY — wideo pod foldem dostaje
      // odrzucone play() i zostaje na pierwszej klatce. Sekundę pauzy liczymy
      // więc od momentu, gdy kadr wjeżdża w ekran. armed pilnuje, żeby awaryjna
      // furtka na gest nie wystartowała nagrania, zanim kadr odstoi swoją sekundę.
      var armed = false;
      var armHeroVideo = function () {
        setTimeout(function () {
          armed = true;
          startHeroVideo();
        }, 1000);
      };
      if (window.IntersectionObserver) {
        var io = new IntersectionObserver(function (entries) {
          for (var i = 0; i < entries.length; i++) {
            if (!entries[i].isIntersecting) { continue; }
            io.disconnect();
            armHeroVideo();
            return;
          }
        // Ćwierć kadru w oknie wystarcza, by Safari uznało element za widoczny.
        }, { threshold: 0.25 });
        io.observe(heroVideo);
      } else {
        armHeroVideo();
      }
      // Awaryjna furtka: Low Power Mode na iOS i polityka mediów in-app
      // browsera blokują każde odtwarzanie bez gestu, więc nawet widoczny kadr
      // zostaje na pierwszej klatce. Każde dotknięcie, kliknięcie i powrót
      // karty na wierzch próbuje ponownie, przez całe życie strony.
      for (var t = 0; t < heroTriggers.length; t++) {
        document.addEventListener(heroTriggers[t], onHeroTrigger, { passive: true });
      }
    }
  }
})();
