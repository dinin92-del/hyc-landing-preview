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
  if (heroIntro &&
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
    if (heroNav && !skipNavIntro) { heroNav.classList.add("hero-intro"); }
    // Block scroll during intro so user watches animations play.
    // Use preventDefault on events (not HycScrollLock/position:fixed) to
    // avoid layout side-effects that would break `sync()` calculations.
    // Unlock after hero-phone-in finishes: delay 3750ms + duration 1200ms = 4950ms
    // from hero-ready. No lock when: deep-link hash, already scrolled, reduced-motion.
    var introLocked = false;
    var introUnlockTimer = null;
    var preventScrollEvt = function (e) { e.preventDefault(); };
    var preventScrollKey = function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" ||
          e.key === "PageDown"  || e.key === "PageUp"  ||
          e.key === "End"       || e.key === " ") { e.preventDefault(); }
    };
    var unlockIntroScroll = function () {
      if (!introLocked) { return; }
      introLocked = false;
      if (introUnlockTimer) { window.clearTimeout(introUnlockTimer); introUnlockTimer = null; }
      window.removeEventListener("wheel", preventScrollEvt);
      window.removeEventListener("touchmove", preventScrollEvt);
      window.removeEventListener("keydown", preventScrollKey);
    };
    if (!skipNavIntro && window.scrollY <= 10) {
      introLocked = true;
      window.addEventListener("wheel", preventScrollEvt, { passive: false });
      window.addEventListener("touchmove", preventScrollEvt, { passive: false });
      window.addEventListener("keydown", preventScrollKey);
    }
    var heroImg = heroIntro.querySelector(".hero-img");
    var heroGo = function () {
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
    var heroDone = function () { window.clearTimeout(heroTimer); heroGo(); };
    if (heroImg && heroImg.decode) { heroImg.decode().then(heroDone, heroDone); }
    else if (heroImg && !heroImg.complete) { heroImg.addEventListener("load", heroDone); heroImg.addEventListener("error", heroDone); }
    else { heroDone(); }
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

  // ---- Hero: scena przypięta, animacja sterowana scrollem ----
  // .hero jest wysokim torem, a .hero-stage w środku przykleja się do góry
  // okna (sticky). Tu liczymy tylko postęp 0..1 przejazdu przez tor i
  // wpisujemy go w --p; cała animacja (tekst i piny odjeżdżają, tło blednie,
  // telefon wjeżdża i rośnie) jest w CSS i rusza wyłącznie transform/opacity.
  // Scroll zostaje natywny: nic nie przechwytujemy, nic nie odpala się samo.
  // Tryb scrub (klasa .is-scrub) tylko gdy ma sens: bez „ogranicz ruch" i na
  // oknach co najmniej 560px wysokości. W przeciwnym razie zostaje statyczny
  // układ ze styles.css (tło z tekstem, telefon pod spodem).
  var hero = document.querySelector(".hero");
  if (hero) {
    var stage = hero.querySelector(".hero-stage");
    var phoneVideo = hero.querySelector(".phone-video");
    var reduceMq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    var scrubbing = false;
    var track = 0;
    var heroTop = 0;
    var heroHeight = 0;
    var framePending = false;
    var videoWanted = false;
    // Safari 26+/inne nowe WebKity: `animation-timeline: view()` prowadzi
    // --hero-bg/--hero-pins/--hero-copy/--hero-phone (styles.css) BEZ JS,
    // skomponowane przez silnik, nie główny wątek — JS już nie pisze --p,
    // więc nie wywołuje ani jednego recalc stylu na klatkę scrolla. To samo
    // sprawdzenie musi być w CSS (@supports) pod tym samym warunkiem.
    var nativeScrollTimeline = !!(window.CSS && CSS.supports && (function () {
      try { return CSS.supports("animation-timeline: view()"); } catch (e) { return false; }
    })());

    // `--vh` liczony RAZ w JS (load + debounced resize), nie jako żywy
    // `100svh` liczony przez przeglądarkę w locie: na iOS Safari pasek
    // adresu zwija się/wraca W TRAKCIE scrolla, a `svh` bywa wtedy mniej
    // stabilny niż powinien być ze specyfikacji — realna wysokość okna
    // potrafi drgnąć w połowie gestu, co przesuwa cały tor sceny i wygląda
    // na przeskok scrolla dokładnie tam, gdzie akurat jest tor (np. przy
    // szlaku, jeśli strona jest już przesunięta o tyle, ile urósł/skurczył
    // się wcześniej hero). `max(100svh,620px)` w CSS zostaje jako wartość
    // PRZED pierwszym uruchomieniem JS, ale od tego momentu JS nadpisuje ją
    // inline wartością zmierzoną raz, nie co klatkę.
    // Szerokość okna przy ostatnim syncVh — iOS toolbar chowa/pokazuje się
    // zmieniając WYŁĄCZNIE wysokość (width zostaje ten sam), więc width-guard
    // blokuje fałszywy layout shift `--vh` podczas scrolla. Rzeczywisty resize
    // (obrót, zmiana okna na desktop) zawsze zmienia szerokość i przechodzi.
    var lastSyncWidth = -1;
    var syncVh = function () {
      lastSyncWidth = window.innerWidth;
      hero.style.setProperty("--vh", Math.max(window.innerHeight, 620) + "px");
    };

    // Wideo startuje dopiero, gdy telefon jest cały widoczny (przy scrollu:
    // postęp >= 0,98), i pauzuje, gdy znika z ekranu. Pusty <video> (jeszcze
    // bez <source>) po prostu zostaje na posterze. Odrzucone play() (Low Power
    // Mode na iOS, in-app WebView) ponawiamy przy gestach, dopóki wideo ma
    // grać, bo bez autoplay przeglądarka nie wznowi sama.
    var applyVideo = function () {
      if (!phoneVideo || !phoneVideo.currentSrc) { return; }
      if (videoWanted) {
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
    ["visibilitychange", "touchend", "pointerup", "click"].forEach(function (ev) {
      document.addEventListener(ev, function () { if (videoWanted) { applyVideo(); } }, { passive: true });
    });

    // Czysta arytmetyka na `window.scrollY`, ZERO odczytu layoutu w gorącej
    // ścieżce (żadnego getBoundingClientRect/offsetHeight tutaj). Safari na
    // iOS scrolluje na wątku kompozytora, a JS dostaje aktualizacje na
    // głównym wątku — odczyt layoutu w tym miejscu bywał spóźniony względem
    // realnej pozycji scrolla (dokumentowany efekt), co dawało stuttering
    // właśnie przy wjeździe telefonu. heroTop/heroHeight liczone są raz, przy
    // sync() (load + debounced resize), nie co klatkę.
    var update = function () {
      framePending = false;
      var p = track > 0 ? Math.min(1, Math.max(0, (window.scrollY - heroTop) / track)) : 0;
      if (!nativeScrollTimeline) { hero.style.setProperty("--p", p.toFixed(4)); }
      setVideoWanted(p >= 0.98 && heroTop + heroHeight - window.scrollY > 0);
    };
    var onScroll = function () {
      if (!scrubbing || framePending) { return; }
      framePending = true;
      window.requestAnimationFrame(update);
    };
    var sync = function () {
      // Tylko przy prawdziwej zmianie szerokości (obrót/desktop resize) —
      // toolbar iOS zmienia wyłącznie height, width zostaje stały.
      if (window.innerWidth !== lastSyncWidth) { syncVh(); }
      var want = !(reduceMq && reduceMq.matches) && window.innerHeight >= 560;
      if (want !== scrubbing) {
        scrubbing = want;
        hero.classList.toggle("is-scrub", want);
        if (!want) { hero.style.removeProperty("--p"); }
      }
      if (scrubbing) {
        heroTop = hero.getBoundingClientRect().top + window.scrollY;
        heroHeight = hero.offsetHeight;
        track = heroHeight - stage.offsetHeight;
        update();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Safari: `animation-timeline` potrafi zostać na STAREJ próbce postępu,
    // gdy scroll osiada tuż po skoku pozycji (zmierzone: po zjechaniu i
    // powrocie na samą górę opacity bg/pinów/tekstu/telefonu zostawała
    // zamrożona na wartości sprzed powrotu — reprodukowane nawet lokalnie
    // przez programatyczny scrollTo, więc to próbkowanie silnika, nie zgadywanie).
    // Zdjęcie i ponowne dołożenie klasy niosącej `animation-name` wymusza
    // świeżą próbkę na AKTUALNEJ pozycji scrolla — bez skoku, bo policzony
    // postęp jest identyczny, tylko odczytany od nowa. Tylko po OSIADANIU
    // (debounce), nigdy w trakcie gestu — to nie jest kolejny zapis co klatkę.
    // `scrubbing` zostaje `true` przez CAŁY czas życia strony (viewport
    // ≥560px) — bez dodatkowego warunku ten listener wymuszałby reflow po
    // KAŻDYM zatrzymaniu scrolla GDZIEKOLWIEK na stronie, nie tylko przy
    // hero. Resync ma sens WYŁĄCZNIE, gdy user wciąż jest w torze hero
    // (scrollY nie minął jeszcze jego dolnej krawędzi).
    // ⚠ Zdejmowanie i dokładanie klasy `is-scrub` (poprzednia wersja tej
    // poprawki) NAPRAWIAŁO zawieszoną przezroczystość, ale samo w sobie
    // dawało WIDOCZNY błysk złej wartości: nowa instancja animacji na jedną
    // klatkę pokazuje wartość bazową (opacity 1) ZANIM silnik zdąży
    // przeliczyć ją względem aktualnego scrolla — zmierzone wprost (getComputedStyle
    // tuż po przełożeniu klasy: 1, dopiero kolejna klatka: poprawna wartość).
    // To dawało dokładnie zgłoszone „zacinanie/przeskakiwanie" przy zanikaniu
    // treści hero, bo resync odpala się po KAŻDYM 150ms postoju scrolla,
    // czyli przy typowym urywanym scrollowaniu wielokrotnie w trakcie
    // zanikania. Sam wymuszony reflow (`offsetWidth`), BEZ ruszania klas,
    // naprawia tę samą zawieszoną próbkę i NIE powoduje błysku złej wartości
    // (zmierzone: wartość zostaje stabilna na każdej klatce po reflow) —
    // animacja zostaje cały czas podpięta, zmienia się tylko to, KIEDY
    // silnik przelicza jej postęp względem scrolla.
    // ⚠ Reflow sam w sobie NIE jest darmowy — blokuje główny wątek na chwilę
    // niezależnie od tego, czy wartość się zmienia. Odpalany w CAŁYM
    // zakresie toru (w tym w strefie skalowania telefonu) dawał zgłoszony
    // stutter przy powiększaniu makiety. Oryginalny bug (zawieszona
    // przezroczystość) występował WYŁĄCZNIE przy powrocie na samą górę —
    // graniczny przypadek, nie cały zakres. Trigger zawężony do okolic
    // granic toru (góra/dół), gdzie ten bug faktycznie się pojawiał; w
    // środkowej strefie (zanikanie tekstu, skalowanie telefonu) listener
    // nic nie robi.
    if (nativeScrollTimeline) {
      var scrubResyncTimer = null;
      var resyncEdgeMargin = 60;
      // Przy szybkim scrollu POWROTNYM user mija strefę ±60px bez zatrzymania,
      // więc debouncowany resync nie strzela. Natychmiastowy resync przy
      // WEJŚCIU do hero (scrollY spada z > heroTop+heroHeight do ≤ heroTop+heroHeight)
      // łapie ten przypadek jednym `offsetWidth` bez debounce.
      var prevOutsideHero = false;
      window.addEventListener("scroll", function () {
        if (!scrubbing) { return; }
        var y = window.scrollY;
        var outsideHero = y > heroTop + heroHeight;
        if (prevOutsideHero && !outsideHero) {
          // Właśnie weszliśmy do hero z zewnątrz (scroll w górę zza dolnej krawędzi)
          void hero.offsetWidth;
        }
        prevOutsideHero = outsideHero;
        var nearStart = y < heroTop + resyncEdgeMargin;
        var nearEnd = track > 0 && y > heroTop + track - resyncEdgeMargin && y <= heroTop + heroHeight;
        if (!nearStart && !nearEnd) { return; }
        if (scrubResyncTimer) { window.clearTimeout(scrubResyncTimer); }
        scrubResyncTimer = window.setTimeout(function () {
          void hero.offsetWidth;
        }, 150);
      }, { passive: true });
    }
    // Debounce, nie bezpośrednio `sync` na "resize": Safari na iOS odpala
    // resize za KAŻDYM razem, gdy pasek adresu chowa się/wraca przy scrollu
    // (znany efekt dynamicznego toolbaru) — bez debounce `sync()` robił wtedy
    // wymuszony, synchroniczny odczyt layoutu (offsetHeight ×2 +
    // getBoundingClientRect) w środku gestu scrolla, co blokowało główny wątek
    // i dawało dokładnie zgłoszone „przeskoki" i zacinający się wyjazd telefonu
    // (resize łapał moment akurat w trakcie animacji wjazdu). Realny resize
    // (obrót, zmiana okna) i tak nie musi przeliczać się co klatkę.
    var resizeTimer = null;
    var onResize = function () {
      if (resizeTimer) { window.clearTimeout(resizeTimer); }
      resizeTimer = window.setTimeout(function () { resizeTimer = null; sync(); }, 150);
    };
    window.addEventListener("resize", onResize);
    if (reduceMq && reduceMq.addEventListener) { reduceMq.addEventListener("change", sync); }
    sync();

    // Statyczny układ: nagranie gra, gdy telefon jest w oknie.
    if (window.IntersectionObserver && phoneVideo) {
      new IntersectionObserver(function (entries) {
        if (scrubbing) { return; }
        setVideoWanted(entries[0].isIntersecting && !(reduceMq && reduceMq.matches));
      }, { threshold: 0.6 }).observe(phoneVideo);
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
    var rows = document.querySelectorAll(".feature-row");
    for (var r = 0; r < rows.length; r++) {
      addGroup(rows[r], [{ el: rows[r], delay: 0 }]);
    }
    var single = function (el, delay) { addGroup(el, [{ el: el, delay: delay }]); };
    single(document.querySelector(".scouts-cta"), 0);
    // FAQ: JEDEN wyzwalacz (cała sekcja), ale pozycje wylatują po kolei:
    // nagłówek od razu, pytania z odstępem 70ms. Cała kaskada rusza naraz,
    // gdy użytkownik dojedzie do FAQ, a nie osobno przy każdej pozycji.
    var faqMembers = [{ el: document.querySelector(".faq-intro"), delay: 0 }];
    var faqItems = document.querySelectorAll(".faq-item");
    for (var f = 0; f < faqItems.length; f++) { faqMembers.push({ el: faqItems[f], delay: 80 + f * 70 }); }
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
    }, { rootMargin: "0px 0px -20% 0px", threshold: 0 });

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
