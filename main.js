/*
 * Hyc! — logika landingu.
 * Czyta window.HYC_CONFIG (config.js) i podpina przyciski sklepów.
 * Zewnętrzny plik, nie inline, żeby strona mogła iść ze ścisłym CSP: script-src 'self'.
 */
(function () {
  // ---- Intro hero: gating animacji ----
  // .hero-intro chowa elementy hero (styles.css), a .hero-ready startuje
  // sekwencję dopiero po zdekodowaniu tła, żeby nie wskakiwało w trakcie.
  // Przy „ogranicz ruch" nic nie jest ukrywane. Pierwsza linia pliku celowo
  // przed resztą, żeby stan wyjściowy był ustawiony przed pierwszym malowaniem.
  var heroIntro = document.querySelector(".hero");
  var heroPlayed = !!(window.sessionStorage && (function () { try { return sessionStorage.getItem("hyc_hero_played"); } catch (e) { return null; } }()));
  // F5 / Ctrl+R / location.reload(): always re-show the animation — user expects the
  // full entrance. Only suppress when navigating between pages (logo click from sub-pages).
  // Both Navigation Timing v2 (type string) and deprecated v1 (type number 1 = RELOAD).
  if (heroPlayed) {
    try {
      var _nt = (performance.getEntriesByType("navigation")[0] || {}).type ||
                (performance.navigation.type === 1 ? "reload" : "");
      if (_nt === "reload") { heroPlayed = false; }
    } catch (e) {}
  }
  if (heroIntro &&
      !heroPlayed &&
      !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    // Nagłówek na słowa: „Hyc!" (.accent) jako pierwszy element (--wi 0), reszta
    // po kolei. Separatory (spacje, twarde spacje) zostają zwykłym tekstem, więc
    // łamanie wierszy i niełamliwe spacje działają jak wcześniej.
    var heroH1 = heroIntro.querySelector(".hero-copy > h1");
    if (heroH1) {
      var wi = 0;
      var nodes = Array.prototype.slice.call(heroH1.childNodes);
      nodes.forEach(function (node) {
        if (node.nodeType === 1 && node.classList.contains("accent")) {
          node.classList.add("hw", "hw--lead");
          node.style.setProperty("--wi", wi++);
        } else if (node.nodeType === 3) {
          var parts = node.textContent.split(/([\s\u00a0]+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) { return; }
            if (/^[\s\u00a0]+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var span = document.createElement("span");
            span.className = "hw";
            span.style.setProperty("--wi", wi++);
            span.textContent = part;
            frag.appendChild(span);
          });
          heroH1.replaceChild(frag, node);
        }
      });
      heroH1.classList.add("is-split");
    }
    // Menu dostaje pełną sekwencję (wjeżdża z telefonem) tylko przy czystym
    // wejściu na stronę. Z hashem w URL (np. link „FAQ" z innej podstrony,
    // który ląduje na index.html#faq) user czeka już na konkretną sekcję —
    // menu ma być widoczne od razu, bez wielosekundowego opóźnienia intro.
    // „#top" (logo w topbarze) NIE liczy się jako deep-link — to ten sam
    // widok co czyste wejście (hero ma id="top"), więc nie gasi choreografii.
    var heroNav = document.querySelector(".topbar");
    var skipNavIntro = !!window.location.hash && window.location.hash !== "#top";
    heroIntro.classList.add("hero-intro");
    // topbar has hero-intro statically in HTML; remove it when skip applies
    // (deep-link: menu must be visible immediately, not wait for intro).
    if (heroNav && skipNavIntro) { heroNav.classList.remove("hero-intro"); }
    // Intro "lock": until the intro ends (hero-phone-in: 3750ms delay + 1200ms
    // duration = 4950ms from hero-ready) the first scroll attempt fast-forwards
    // the intro instead of being swallowed (skipIntro below). No lock when:
    // deep-link hash, already scrolled, reduced-motion.
    var introLocked = false;
    var introUnlockTimer = null;
    // Próba scrolla w trakcie intro nie jest połykana: przewijamy intro do
    // końca i oddajemy scroll od razu. Kto tylko patrzy, widzi całą
    // sekwencję; kto chce zjechać, nie stoi do ~7,5 s na stronie, która
    // wygląda na zawieszoną. finish() tylko na animacjach z osi czasu
    // dokumentu (scrollowe zostają), try/catch na nieskończone.
    var skipIntro = function () {
      if (!introLocked) { return; }
      unlockIntroScroll();
      heroGo();
      [heroIntro, heroNav].forEach(function (el) {
        if (!el || !el.getAnimations) { return; }
        el.getAnimations({ subtree: true }).forEach(function (a) {
          if (a.timeline !== document.timeline) { return; }
          try { a.finish(); } catch (e) {}
        });
      });
    };
    var introScrollAttempt = function () { skipIntro(); };
    var introKeyAttempt = function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" ||
          e.key === "PageDown"  || e.key === "PageUp"  ||
          e.key === "End"       || e.key === " ") { skipIntro(); }
    };
    var unlockIntroScroll = function () {
      if (!introLocked) { return; }
      introLocked = false;
      if (introUnlockTimer) { window.clearTimeout(introUnlockTimer); introUnlockTimer = null; }
      window.removeEventListener("wheel", introScrollAttempt);
      window.removeEventListener("touchmove", introScrollAttempt);
      window.removeEventListener("keydown", introKeyAttempt);
    };
    if (!skipNavIntro && window.scrollY <= 10) {
      introLocked = true;
      window.addEventListener("wheel", introScrollAttempt, { passive: true });
      window.addEventListener("touchmove", introScrollAttempt, { passive: true });
      window.addEventListener("keydown", introKeyAttempt);
    }
    var heroImg = heroIntro.querySelector(".hero-img");
    var heroGo = function () {
      try { sessionStorage.setItem("hyc_hero_played", "1"); } catch (e) {}
      heroIntro.classList.add("hero-ready");
      // Bez .hero-intro na menu (patrz wyżej) nie dokładamy .hero-ready —
      // sama ta klasa też odpala `hero-nav-in` (selektor jej nie wymaga
      // .hero-intro), więc menu, które już jest widoczne, zniknęłoby na
      // czas `animation-delay` i wjechało drugi raz.
      if (heroNav && !skipNavIntro) { heroNav.classList.add("hero-ready"); }
      // Unlock after last intro animation (hero-phone-in: 3750ms delay + 1200ms duration)
      if (introLocked) {
        introUnlockTimer = window.setTimeout(unlockIntroScroll, 4950 + 100);
      }
    };
    var heroTimer = window.setTimeout(heroGo, 2500);
    var heroDone = function () {
      window.clearTimeout(heroTimer);
      // Double rAF ensures browser paints hero-intro hidden state at least once
      // before hero-ready triggers animations. Needed for cached images where
      // decode() resolves in ~0.4ms (before first paint).
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(function () { window.requestAnimationFrame(heroGo); });
      } else {
        heroGo();
      }
    };
    if (heroImg && heroImg.decode) { heroImg.decode().then(heroDone, heroDone); }
    else if (heroImg && !heroImg.complete) { heroImg.addEventListener("load", heroDone); heroImg.addEventListener("error", heroDone); }
    else { heroDone(); }
  } else if (heroIntro && heroPlayed) {
    // Return visit in same session — just remove hero-intro; do NOT add hero-ready.
    // hero-ready triggers intro animations (hero-phone-in: 3750ms delay with
    // backwards fill = phone invisible for 3.75s). Scrub animations don't need
    // hero-ready — .hero.is-scrub .hero-phone already has its own scroll rule.
    // Without hero-intro the elements are visible immediately, which is correct.
    heroIntro.classList.remove("hero-intro");
    var returnNav = document.querySelector(".topbar");
    if (returnNav) { returnNav.classList.remove("hero-intro"); }
  }

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
  // scroll-lock.js.
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

  // Na telefonie pokazujemy wyłącznie baton pasujący do jego platformy —
  // drugi i tak prowadzi donikąd dla tego odwiedzającego. Desktop/tablet
  // (żadna z regex nie trafia) zostaje z oboma, bo tam nie wiadomo, na który
  // sklep user faktycznie czeka.
  var ua = navigator.userAgent || "";
  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var isAndroid = /Android/i.test(ua);
  if (isIOS) {
    openBtn.style.display = "none";
    openBtn.parentElement.classList.add("stores--single");
  } else if (isAndroid) {
    iosOpenBtn.style.display = "none";
    iosOpenBtn.parentElement.classList.add("stores--single");
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---- Hero: scena przypięta, wjazd wyzwalany scrollem ----
  // .hero jest krótkim torem, a .hero-stage w środku przykleja się do góry
  // okna (sticky) na czas przytrzymania (--hero-hold w styles.css). Pierwszy
  // ruch w dół (PIN_AT) dokłada .is-pinned i CSS przejściem czasowym
  // (transform/opacity, wątek kompozytora) chowa tekst, piny i tło, a
  // telefon wjeżdża na środek; powrót na samą górę (UNPIN_AT) cofa
  // przejście. Scroll przez cały czas jest zwykłym scrollem przeglądarki:
  // nic go nie przechwytuje i nic nie przewija strony samo.
  // ⛔ Historia 1029, nie wracać: scrub sterowany pozycją scrolla zostawiał
  // scenę „w połowie", dojazd w JS po scrollend dawał „stanął i szarpnął",
  // a CSS scroll snap blokował kółko w dół z przypięcia (mandatory) albo
  // ściągał z powrotem mały ruch (proximity), a na iOS stop
  // (scroll-snap-stop) nie zatrzymywał szybkiego machnięcia (symulator
  // iOS 27, 1029). Zatrzymanie na telefonie robi hamulec (niżej).
  // Tryb scrub (klasa .is-scrub) tylko bez „ogranicz ruch" i na oknach co
  // najmniej 560px wysokości. W przeciwnym razie zostaje statyczny układ ze
  // styles.css (tło z tekstem, telefon pod spodem).
  var hero = document.querySelector(".hero");
  if (hero) {
    var phoneVideo = hero.querySelector(".phone-video");
    var reduceMq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    var scrubbing = false;
    var pinned = false;
    // y względem góry hero z poprzedniego update(); Infinity = jeszcze nie
    // liczony, więc wejście na stronę już przewiniętą nie liczy się jako
    // scroll z góry (bez hamulca i bez dociągania wideo).
    var lastRelY = Infinity;
    var heroTop = 0;
    var framePending = false;
    var videoWanted = false;
    var warmed = false;
    // Progi w px scrolla od góry hero; luka między nimi chroni przed
    // przełączaniem w tę i z powrotem przy drganiu palca na samej górze.
    var PIN_AT = 24;
    var UNPIN_AT = 4;
    // Czas wjazdu telefonu, ten sam co transition .hero-phone w styles.css.
    var PHONE_MS = 850;


    // `--vh` liczony w JS (load + debounced resize), nie jako żywy `100svh`:
    // na iOS Safari pasek adresu zwija się/wraca W TRAKCIE scrolla i realna
    // wysokość okna drga w połowie gestu, co przesuwało cały tor.
    // `max(100svh,620px)` w CSS zostaje jako wartość przed startem JS.
    // Przeliczamy przy zmianie szerokości (obrót, okno) albo wysokości o
    // więcej niż pasek adresu iOS (SYNC_DH), nie przy samym pasku. Ta sama
    // zapamiętana wysokość decyduje o trybie scrub, więc pasek iOS nie
    // przełącza trybu pod palcem. W trybie scrub --vh = wysokość okna (scena
    // nie może być wyższa od ekranu), podłoga 620 tylko dla układu
    // statycznego.
    var SYNC_DH = 150;
    var lastSyncWidth = -1;
    var lastSyncHeight = 0;
    var syncVh = function () {
      lastSyncWidth = window.innerWidth;
      lastSyncHeight = window.innerHeight;
      var vh = lastSyncHeight >= 560 ? lastSyncHeight : 620;
      hero.style.setProperty("--vh", vh + "px");
    };

    // Wideo: przed przypięciem stoi na pierwszej klatce, czyli splashu (ten
    // sam obraz co poster). Rusza w trakcie wjazdu telefonu, gdy ten jest
    // już widoczny w SHOWN_RATIO: nagranie samo zaczyna się od ~1 s splasha,
    // więc start w ruchu jest płynny, a iPhone (ignoruje preload i ładuje
    // dopiero przy play()) zaczyna ładować wcześniej. Start po dojeździe
    // (do 1029) był na iPhonie wyraźnie spóźniony. Powrót na górę pauzuje i
    // cofa do splasha. Odrzucone play() (Low Power Mode na iOS, in-app
    // WebView) ponawiamy przy gestach i kolejnych klatkach scrolla, dopóki
    // wideo ma grać, bo bez autoplay przeglądarka nie wznowi sama.
    // Czy telefon jest w oknie co najmniej w SHOWN_RATIO (IntersectionObserver,
    // liczy też transform sceny). Wideo gra tylko wtedy: gdy user zjedzie
    // dalej i ekran telefonu zacznie znikać, pauza; powrót wznawia od tego
    // samego miejsca (user 1029). Ten sam stan służy układowi statycznemu i
    // przejściu scrub -> statyczny.
    var SHOWN_RATIO = 0.7;
    var phoneShown = false;
    var applyVideo = function () {
      if (!phoneVideo || !phoneVideo.currentSrc) { return; }
      if (videoWanted && !document.hidden) {
        if (phoneVideo.paused) {
          var pr = phoneVideo.play();
          if (pr && pr.catch) { pr.catch(function () {}); }
        }
      } else if (!phoneVideo.paused) {
        phoneVideo.pause();
      }
    };
    var setVideoWanted = function (on) {
      if (on === videoWanted) { return; }
      videoWanted = on;
      applyVideo();
    };
    var rewindToSplash = function () {
      if (phoneVideo && phoneVideo.currentTime > 0) { phoneVideo.currentTime = 0; }
    };
    // Pętla ręcznie, nie atrybutem `loop`: splash (klatka 0) jest tylko na
    // pierwsze wejście, kolejne okrążenia startują od ekranu głównego apki
    // (LOOP_FROM, koniec przejścia splash -> ekran główny w nagraniu), bez
    // skoku do logo. Przy nowym nagraniu sprawdź ten czas.
    var LOOP_FROM = 1.5;
    if (phoneVideo) {
      phoneVideo.addEventListener("ended", function () {
        phoneVideo.currentTime = LOOP_FROM;
        applyVideo();
      });
      // applyVideo() wychodzi, póki przeglądarka nie wybrała źródła; jeśli
      // wideo miało już grać, rusza, gdy źródło i metadane są gotowe.
      ["loadedmetadata", "loadeddata"].forEach(function (ev) {
        phoneVideo.addEventListener(ev, function () { if (videoWanted) { applyVideo(); } });
      });
    }
    // „Ogranicz ruch": wideo nie gra, więc zamiast splasha z samym logo
    // poster pokazuje ekran apki (trasa do schronienia).
    var splashPoster = phoneVideo ? phoneVideo.getAttribute("poster") : "";
    var APP_POSTER = "assets/hero/phone-poster-app.webp?v=2";
    var syncPoster = function () {
      if (!phoneVideo) { return; }
      var want = reduceMq && reduceMq.matches ? APP_POSTER : splashPoster;
      if (phoneVideo.getAttribute("poster") !== want) { phoneVideo.setAttribute("poster", want); }
    };
    // Rozgrzewka: Safari na iPhonie ignoruje preload i zaczyna ładować film
    // dopiero przy play(), więc start po przypięciu spóźniał się (1,6 s w
    // symulatorze, nawet z localhosta). Przy pierwszym dotknięciu, kółku
    // albo klawiszu (user zaraz scrolluje) krótkie play() i pauza na
    // splashu napełnia bufor; pierwsza sekunda nagrania to nieruchomy
    // splash, więc nic nie widać.
    var primed = false;
    var prime = function () {
      if (primed || !phoneVideo || !scrubbing) { return; }
      primed = true;
      if (!warmed) { warmed = true; phoneVideo.preload = "auto"; }
      if (videoWanted || !phoneVideo.paused) { return; }
      var pr = phoneVideo.play();
      if (pr && pr.then) {
        pr.then(function () {
          if (!videoWanted) { phoneVideo.pause(); phoneVideo.currentTime = 0; }
        }, function () {});
      }
    };
    ["touchstart", "wheel", "keydown"].forEach(function (ev) {
      window.addEventListener(ev, prime, { passive: true });
    });

    // Karta w tle: pauza bez zmiany videoWanted, po powrocie wideo rusza
    // samo. Wcześniej visibilitychange wołał play() także przy chowaniu
    // karty, czyli wznawiał wideo, które przeglądarka właśnie zatrzymała.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (phoneVideo && !phoneVideo.paused) { phoneVideo.pause(); }
      } else if (videoWanted) {
        applyVideo();
      }
    });
    ["touchend", "pointerup", "click"].forEach(function (ev) {
      document.addEventListener(ev, function () { if (videoWanted && !document.hidden) { applyVideo(); } }, { passive: true });
    });

    // Hamulec (user 1029: „ma się zatrzymać na telefonie, a nie przez niego
    // przejeżdżać"): od przypięcia scrollem z góry przewijanie stoi przez
    // wjazd telefonu (PHONE_MS) i dalej, dopóki trwa ten sam gest (impulsy
    // kółka co < BRAKE_GAP ms, czyli też bezwładność gładzika), maksymalnie
    // BRAKE_MAX; w tym czasie także w górę (overflow: hidden). Następny, nowy
    // gest jedzie normalnie. Na iOS overflow: hidden na <html> zatrzymuje też
    // rozpęd palca po puszczeniu (iOS 16+; symulator iOS 27: machnięcie,
    // które bez hamulca kończyło na ~350 px, staje w przytrzymaniu).
    // Samo preventDefault nie wystarcza: Chrome pozwala zablokować tylko
    // pierwsze zdarzenie kółka w geście, bezwładność gładzika idzie dalej
    // jako nieblokowalna. Dlatego na czas hamowania html.hero-brake
    // (overflow: hidden) zatrzymuje przewijanie dokumentu, a nasłuch kółka
    // służy do wykrycia końca gestu. preventDefault zostaje dla Safari i
    // dotyku. Nasłuch nie-pasywny tylko na czas hamowania, bo nie-pasywny
    // wheel na window spowalnia scroll całej strony.
    // Kotwica: hamulec trzyma stronę w punkcie brakeY (w połowie
    // przytrzymania) i cofa każde przesunięcie dalej (window.scrollTo).
    // Programowe przewinięcie przerywa rozpęd palca na iOS niezależnie od
    // overflow: hidden, które przeglądarka w aplikacji Facebooka (user 1029)
    // przy mocniejszym machnięciu najwyraźniej ignoruje. Każda taka próba
    // przedłuża hamowanie jak kolejny impuls gestu.
    var BRAKE_GAP = 150;
    var BRAKE_MAX = 2500;
    var brakeY = 0;
    var holdPx = 0;
    var brakeOn = false;
    var brakeStart = 0;
    var lastBrakeWheel = 0;
    var brakeTimer = null;
    var brakeWheel = function (e) {
      if (e.deltaY <= 0) { return; }
      lastBrakeWheel = Date.now();
      if (e.cancelable) { e.preventDefault(); }
    };
    var brakeTouch = function (e) {
      if (Date.now() - brakeStart < PHONE_MS && e.cancelable) { e.preventDefault(); }
    };
    var releaseBrake = function () {
      if (!brakeOn) { return; }
      brakeOn = false;
      document.documentElement.classList.remove("hero-brake");
      if (brakeTimer) { window.clearTimeout(brakeTimer); brakeTimer = null; }
      window.removeEventListener("wheel", brakeWheel, { passive: false });
      window.removeEventListener("touchmove", brakeTouch, { passive: false });
    };
    var checkBrake = function () {
      var now = Date.now();
      var gestureGoing = now - lastBrakeWheel < BRAKE_GAP;
      if (now - brakeStart >= BRAKE_MAX || (now - brakeStart >= PHONE_MS && !gestureGoing)) {
        releaseBrake();
      } else {
        brakeTimer = window.setTimeout(checkBrake, 50);
      }
    };
    var brake = function () {
      releaseBrake();
      brakeOn = true;
      document.documentElement.classList.add("hero-brake");
      brakeStart = Date.now();
      lastBrakeWheel = brakeStart;
      brakeY = Math.min(window.scrollY, heroTop + Math.max(PIN_AT + 1, Math.round(holdPx * 0.5)));
      if (window.scrollY > brakeY) { window.scrollTo(0, brakeY); }
      window.addEventListener("wheel", brakeWheel, { passive: false });
      window.addEventListener("touchmove", brakeTouch, { passive: false });
      brakeTimer = window.setTimeout(checkBrake, PHONE_MS);
    };

    var setPinned = function (on, fromTop) {
      if (on === pinned) { return; }
      pinned = on;
      hero.classList.toggle("is-pinned", on);
      if (on) {
        // Tylko gdy przypięcie wyzwolił scroll z samej góry, nie wejście na
        // stronę już przewiniętą (podstrona, #faq, przywrócenie scrolla,
        // obrót, powrót z modala).
        if (fromTop) {
          brake();
          if (!warmed && phoneVideo) { warmed = true; phoneVideo.preload = "auto"; }
        }
        // Przyciski sklepów gasną (visibility: hidden): fokus z klawiatury nie
        // może na nich zostać, bo spadłby na body i Tab zaczynałby od góry.
        var ae = document.activeElement;
        if (ae && ae.closest && ae.closest(".hero-copy")) {
          var logo = document.querySelector(".topbar-logo");
          if (logo) { logo.focus({ preventScroll: true }); }
        }
      } else {
        releaseBrake();
        setVideoWanted(false);
        rewindToSplash();
      }
    };

    // Czysta arytmetyka na `window.scrollY`, zero odczytu layoutu w gorącej
    // ścieżce; heroTop liczony raz w sync() (load + resize).
    // Otwarty modal (scroll-lock.js: body position fixed) zeruje scrollY;
    // bez tej osłony hero odpinałby się pod modalem i cofał wideo na splash.
    // W update(), bo woła go też IntersectionObserver i sync(), nie tylko
    // scroll. Po zamknięciu scroll-lock.js przywraca pozycję i scroll
    // odświeża stan.
    var modalOpen = function () { return document.body.classList.contains("has-modal"); };
    var update = function () {
      framePending = false;
      if (modalOpen()) { return; }
      var y = window.scrollY - heroTop;
      if (!pinned && y > PIN_AT) { setPinned(true, lastRelY <= PIN_AT); }
      else if (pinned && y < UNPIN_AT) { setPinned(false); }
      lastRelY = y;
      if (pinned) { setVideoWanted(phoneShown); }
      if (videoWanted) { applyVideo(); }
    };
    var onScroll = function () {
      if (!scrubbing || modalOpen()) { return; }
      if (brakeOn && window.scrollY > brakeY + 1) {
        lastBrakeWheel = Date.now();
        window.scrollTo(0, brakeY);
        return;
      }
      // Przypięcie (i hamulec) od razu w zdarzeniu scrolla, nie klatkę
      // później w rAF: przy szybkim machnięciu każda klatka to kilkadziesiąt
      // px, o które strona odjeżdżała za telefon.
      if (!pinned && window.scrollY - heroTop > PIN_AT) { update(); return; }
      if (framePending) { return; }
      framePending = true;
      window.requestAnimationFrame(update);
    };
    // Klawiatura: Spacja/PageDown z samej góry skakały o prawie cały ekran,
    // dalej niż przytrzymanie, więc mijały telefon. Z góry pierwszy taki
    // klawisz tylko przypina scenę (krótki krok w dół, dalej hamulec jak
    // przy kółku); kolejne działają normalnie. Strzałka w dół przesuwa o
    // ~40 px, więc sama przypina bez przeskoku. Pola, przyciski, linki i
    // modale zostają nietknięte.
    window.addEventListener("keydown", function (e) {
      if (!scrubbing || pinned || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) { return; }
      if (e.key !== "PageDown" && !(e.key === " " && !e.shiftKey)) { return; }
      var t = e.target;
      if (t && t.closest && t.closest("input, textarea, select, button, a, [contenteditable], dialog")) { return; }
      if (window.scrollY - heroTop > PIN_AT) { return; }
      e.preventDefault();
      window.scrollTo(0, heroTop + PIN_AT * 2);
    });
    var sync = function () {
      if (window.innerWidth !== lastSyncWidth || Math.abs(window.innerHeight - lastSyncHeight) > SYNC_DH) { syncVh(); }
      syncPoster();
      var want = !(reduceMq && reduceMq.matches) && lastSyncHeight >= 560;
      if (want !== scrubbing) {
        scrubbing = want;
        hero.classList.toggle("is-scrub", want);
        if (!want) {
          setPinned(false);
          setVideoWanted(phoneShown && !(reduceMq && reduceMq.matches));
        }
      }
      if (scrubbing) {
        heroTop = hero.getBoundingClientRect().top + window.scrollY;
        holdPx = hero.offsetHeight - hero.querySelector(".hero-stage").offsetHeight;
        update();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Debounce, nie bezpośrednio `sync` na "resize": Safari na iOS odpala
    // resize za każdym razem, gdy pasek adresu chowa się/wraca przy scrollu,
    // a sync() czyta layout (getBoundingClientRect, offsetHeight).
    var resizeTimer = null;
    var onResize = function () {
      if (resizeTimer) { window.clearTimeout(resizeTimer); }
      resizeTimer = window.setTimeout(function () { resizeTimer = null; sync(); }, 150);
    };
    window.addEventListener("resize", onResize);
    if (reduceMq && reduceMq.addEventListener) { reduceMq.addEventListener("change", sync); }
    sync();

    // Diagnostyka na żywym urządzeniu (np. przeglądarka w aplikacji
    // Facebooka, której nie da się odtworzyć lokalnie): ?herodebug pokazuje
    // stan hero na ekranie. Bez parametru nic się nie ładuje.
    if (/[?&]herodebug\b/.test(window.location.search)) {
      window.HycHeroDebug = function () {
        return { pinned: pinned, brakeOn: brakeOn, brakeY: brakeY, holdPx: holdPx, heroTop: heroTop, scrubbing: scrubbing };
      };
      var dbg = document.createElement("script");
      dbg.src = "hero-debug.js?v=1";
      document.body.appendChild(dbg);
    }

    // Widoczność telefonu: w trybie scrub decyduje update() (przypięcie,
    // dojazd i widoczność), w statycznym wprost.
    if (window.IntersectionObserver && phoneVideo) {
      new IntersectionObserver(function (entries) {
        phoneShown = entries[0].intersectionRatio >= SHOWN_RATIO;
        if (scrubbing) { update(); return; }
        setVideoWanted(phoneShown && !(reduceMq && reduceMq.matches));
      }, { threshold: [0, SHOWN_RATIO, 1] }).observe(phoneVideo);
    }
  }
  // ---- Sekcja ze szlakiem: rysuje się raz, gdy użytkownik jest głębiej ----
  // Domyślnie (bez JS, przy „ogranicz ruch", bez IntersectionObserver) szlak
  // jest od razu cały. Tu go „uzbrajamy" (chowamy) i odpalamy rysowanie
  // dopiero, gdy co najmniej połowa TEKSTU sekcji jest w górnych 74% okna,
  // czyli środek tekstu przejechał już powyżej tej linii (linia 70%: pomiędzy zbyt wczesnym 77% i zbyt późnym 60%). Samo rysowanie to
  // przejście CSS.
  var trail = document.querySelector(".trail");
  var trailText = trail && trail.querySelector(".trail-copy");
  if (trail && trailText && window.IntersectionObserver &&
      !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    trail.classList.add("is-armed");
    // `stroke-dashoffset` nie da się skomponować (malowanie, nie transform/
    // opacity) — 2200ms przejścia odpalone W TRAKCIE aktywnego scrolla
    // konkuruje o główny wątek z samym scrollem na iOS Safari i dawało
    // zgłoszony przeskok dokładnie na wysokości tej sekcji. Rysowanie
    // odkładamy do momentu, gdy scroll faktycznie się zatrzyma (brak
    // zdarzenia scroll przez 150ms — ten sam wzorzec co debounce resize przy
    // hero wyżej), więc malowanie nigdy nie nachodzi na gest.
    var trailScrolling = false;
    var trailScrollTimer = null;
    var trailPendingDraw = false;
    var drawTrail = function () {
      trail.classList.add("is-drawn");
    };
    var onTrailScrollEnd = function () {
      trailScrolling = false;
      if (trailPendingDraw) { trailPendingDraw = false; drawTrail(); }
    };
    window.addEventListener("scroll", function () {
      trailScrolling = true;
      if (trailScrollTimer) { window.clearTimeout(trailScrollTimer); }
      trailScrollTimer = window.setTimeout(onTrailScrollEnd, 150);
    }, { passive: true });
    var trailIo = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting && entries[i].intersectionRatio >= 0.5) {
          trailIo.disconnect();
          if (trailScrolling) { trailPendingDraw = true; } else { drawTrail(); }
          return;
        }
      }
    }, { rootMargin: "0px 0px -26% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });
    trailIo.observe(trailText);
  }

  // ---- Pojawianie elementów przy scrollu (minimalnie, raz) ----
  // Tylko elementy spoza górnej części okna dostają .reveal (ukryte) i .is-in,
  // gdy ich WYZWALACZ dojedzie do linii 80% wysokości okna. Przy „ogranicz
  // ruch" i bez IntersectionObserver nic nie jest ukrywane. Po animacji klasy
  // są zdejmowane. Grupa = jeden wyzwalacz + elementy z własnym opóźnieniem:
  // bullet (na każdej szerokości to dziś jeden kafel, patrz .feature-row w
  // styles.css) odsłania się jako JEDEN element — .reveal na samym wierszu,
  // nie na dzieciach, żeby tło kafla wjeżdżało RAZEM z grafiką i tekstem,
  // a nie stało gotowe, zanim zawartość w nim dojedzie.
  if (window.IntersectionObserver &&
      !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    var groups = [];
    var addGroup = function (trigger, members) { if (trigger) { groups.push({ trigger: trigger, members: members }); } };
    var single = function (el, delay) { addGroup(el, [{ el: el, delay: delay }]); };
    single(document.querySelector(".scouts-cta"), 0);
    // FAQ: JEDEN wyzwalacz (cała sekcja), ale pozycje wylatują po kolei:
    // nagłówek od razu, pytania z odstępem 70ms. Cała kaskada rusza naraz,
    // gdy użytkownik dojedzie do FAQ, a nie osobno przy każdej pozycji.
    var faqMembers = [];
    var faqItems = document.querySelectorAll(".faq-item");
    for (var f = 0; f < faqItems.length; f++) { faqMembers.push({ el: faqItems[f], delay: f * 70 }); }
    addGroup(document.querySelector(".faq"), faqMembers);

    var pending = groups.length;
    var revealGroup = function (g) {
      if (g.done) { return; }
      g.done = true;
      revealIo.unobserve(g.trigger);
      pending--;
      for (var i = 0; i < g.members.length; i++) {
        (function (el) {
          if (!el) { return; }
          el.classList.add("is-in");
          window.setTimeout(function () {
            el.classList.remove("reveal", "is-in");
            el.style.removeProperty("--reveal-delay");
          }, 1400);
        })(g.members[i].el);
      }
    };
    // Próba: odkładanie odsłonięcia do zatrzymania scrolla (ten sam wzorzec
    // co przy szlaku) COFNIĘTA — nie miała potwierdzonej korzyści, a kafle
    // bulletów na mobile zaczęły ładować się/animować zauważalnie wolniej
    // (zgłoszone). Odsłonięcie wraca do natychmiastowego triggera.
    var queueReveal = function (g) { revealGroup(g); };
    var revealIo = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) { continue; }
        for (var j = 0; j < groups.length; j++) {
          if (groups[j].trigger === entries[i].target) { queueReveal(groups[j]); }
        }
      }
    }, { rootMargin: "0px 0px 100px 0px", threshold: 0 });

    var vh = window.innerHeight;
    for (var k = 0; k < groups.length; k++) {
      var g = groups[k];
      // Już w górnej części okna przy starcie (np. skok po kotwicy): bez ukrywania.
      if (g.trigger.getBoundingClientRect().top < vh * 0.8) { g.done = true; pending--; continue; }
      for (var q = 0; q < g.members.length; q++) {
        var mem = g.members[q];
        if (!mem.el) { continue; }
        mem.el.style.setProperty("--reveal-delay", mem.delay + "ms");
        mem.el.classList.add("reveal");
      }
      revealIo.observe(g.trigger);
    }

    // Dół strony: elementy tuż nad stopką nie dojadą do linii 80% (strona się
    // kończy), więc po dojechaniu do końca odsłaniamy wszystko, co zostało.
    var bottomTick = false;
    window.addEventListener("scroll", function () {
      if (bottomTick || pending <= 0) { return; }
      bottomTick = true;
      window.requestAnimationFrame(function () {
        bottomTick = false;
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
          for (var j = 0; j < groups.length; j++) { revealGroup(groups[j]); }
        }
      });
    }, { passive: true });
  }
})();
