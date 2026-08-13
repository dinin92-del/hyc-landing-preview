/*
 * Hyc! — landing behaviour.
 * Reads window.HYC_CONFIG (config.js) and wires the store buttons.
 * Kept external (not inline) so the page can ship a strict CSP: script-src 'self'.
 */
(function () {
  // Marker pomocniczy przy weryfikacji w przeglądarce — pozwala stwierdzić,
  // czy strona wykonuje aktualny plik, czy wersję z cache.
  window.__HYC_BUILD = 'ios-modal-always-open-2026-08-11';
  var cfg = window.HYC_CONFIG || {};
  var ios = document.getElementById("btn-ios");
  var iosOpenBtn = document.getElementById("btn-ios-open");
  var openBtn = document.getElementById("btn-android-open");

  var iosModal = document.getElementById("ios-modal");
  var iosCloseBtn = document.getElementById("ios-modal-close");

  var modal = document.getElementById("android-modal");
  var closeBtn = document.getElementById("modal-close");
  var group = document.getElementById("btn-group");
  var android = document.getElementById("btn-android");
  var backBtn = document.getElementById("nav-back");
  var nextBtn = document.getElementById("nav-next");

  var steps = Array.prototype.slice.call(modal.querySelectorAll(".modal-step"));
  var stepperBtns = Array.prototype.slice.call(modal.querySelectorAll(".stepper-btn"));
  var LAST = steps.length;
  var current = 1;

  // Blokada przewijania tła pod otwartym modalem (dowolnym z dwóch).
  // ⛔ Samo `has-modal` (overflow: hidden na <body>, patrz styles.css) NIE
  // WYSTARCZA na Safari iOS — dokument i tak przewija się pod spodem
  // (wieloletni limit WebKita, zgłoszenie z telefonu 0811). Zamrożenie na
  // `position: fixed` w zapamiętanym miejscu przewinięcia to jedyna
  // niezawodna technika — tej samej używa każda poważna biblioteka modali.
  // ⚠ Strażnik `scrollLocked`: oba modale (Android/iOS) dzielą jeden zamek
  // na <body>, więc podwójny lock nadpisałby zapamiętane miejsce zerem.
  var savedScrollY = 0;
  var scrollLocked = false;
  function lockScroll() {
    if (scrollLocked) return;
    scrollLocked = true;
    savedScrollY = window.scrollY;
    document.body.classList.add("has-modal");
    document.body.style.top = "-" + savedScrollY + "px";
  }
  function unlockScroll() {
    if (!scrollLocked) return;
    scrollLocked = false;
    document.body.classList.remove("has-modal");
    document.body.style.top = "";
    window.scrollTo(0, savedScrollY);
  }

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
  // ⛔ CELOWO gołe https:// z konsoli Play, bez żadnej sztuczki (intent://,
  // package=com.android.chrome, usuwanie target) — dwie próby obejścia
  // przechwycenia przez apkę Sklep Play ZAWIODŁY na realnym telefonie
  // (0811: najpierw „nie znaleziono elementu", potem pusta karta po poprawce
  // targetu). Ten link jest zweryfikowany ręcznie w przeglądarce jako
  // poprawny (prawdziwa strona „Become a tester" dla Hyc!) — jeśli na
  // Androidzie otwiera się w apce Play zamiast w przeglądarce, to decyduje o
  // tym ustawienie „Otwieraj domyślnie" apki Sklep Play NA TYM TELEFONIE
  // (Ustawienia → Aplikacje → Sklep Play → Otwieraj domyślnie), nie coś, co
  // strona może wymusić niezawodnie z poziomu klienta.

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
    lockScroll();
  }

  function closeModal() {
    if (typeof modal.close === "function") { modal.close(); }
    else { modal.removeAttribute("open"); }
    unlockScroll();
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
  modal.addEventListener("close", unlockScroll);

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

  // ---- Modal instalacji na iOS ----
  // Jedna zewnętrzna akcja (link TestFlight), nie kreator — bez kroków do
  // przełączania, więc bez steppera i bez Wstecz/Dalej z modala Androida.

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

  // Modal jest ZAWSZE dostępny do obejrzenia — tak jak modal Androida
  // (`btn-android-open` nie gatuje się na `cfg.googlePlay`). Gated jest
  // wyłącznie finalny link WEWNĄTRZ, przez `wire()` (ten sam mechanizm co
  // "Wkrótce" na krokach Androida bez gotowego linku) — więc realny odwiedzający
  // widzi wyjaśnienie procesu, ale nie dostanie martwego linku.
  iosOpenBtn.addEventListener("click", openIosModal);
  iosCloseBtn.addEventListener("click", closeIosModal);

  // Zamknięcie kliknięciem w tło — ta sama ochrona przed zaznaczaniem tekstu
  // co modal Androida (patrz komentarz niżej przy `downNaTle`).
  var iosDownNaTle = false;
  iosModal.addEventListener("mousedown", function (e) { iosDownNaTle = e.target === iosModal; });
  iosModal.addEventListener("click", function (e) {
    if (e.target === iosModal && iosDownNaTle) { closeIosModal(); }
    iosDownNaTle = false;
  });
  iosModal.addEventListener("close", unlockScroll);

  // Highlight + surface the button matching the visitor's platform.
  var ua = navigator.userAgent || "";
  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var isAndroid = /Android/i.test(ua);
  if (isIOS) {
    iosOpenBtn.classList.add("is-primary"); iosOpenBtn.style.order = "-1";
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
      // ⚠ JEDNA PRÓBA NIE WYSTARCZY. Gdy strona ładuje się w karcie w TLE
      // (Ctrl+klik, „otwórz w nowej karcie"), przeglądarka odrzuca `play()`
      // i przy samym `catch` wideo zostawało zamrożone na posterze NA ZAWSZE —
      // także po przełączeniu się użytkownika na tę kartę. Zmierzone na
      // produkcji: `visibilityState: hidden` -> `play()` odrzucone, mimo że
      // ręczne wywołanie przechodzi bez problemu.
      // Atrybut `autoplay` radził sobie z tym sam (przeglądarka wznawia po
      // pokazaniu karty), więc zdejmując go musimy to odtworzyć ręcznie.
      // ⛔ 0812: NIE ZGADUJEMY, KTÓRA polityka odrzuciła `play()`. Odrzucenie
      // ma na mobile co najmniej trzy różne przyczyny (wymagany gest w WebView
      // Facebooka, Low Power Mode na iOS, oszczędzanie danych), a poprzednia
      // wersja obsługiwała wyłącznie „karta w tle" i po jednym nieudanym
      // podejściu nie miała już czym ponowić. Reguła jest teraz odwrotna:
      // każdy wyzwalacz ponawia, dopóki odtwarzanie NIE JEST potwierdzone.
      // ⛔ Nasłuchów NIE ODPINAMY po pierwszym udanym starcie. Wznowienie jest
      // potrzebne nie tylko przed pierwszym odtworzeniem: WebView pauzuje media
      // przy schowaniu strony, iOS przy rozmowie i przy wejściu w Low Power —
      // a `autoplay`, który wznawiałby to sam, jest z <video> zdjęty (patrz
      // index.html). Odpięcie po starcie zostawiało wtedy poster na zawsze,
      // czyli ten sam objaw co przed poprawką 0812, tylko później.
      // Stanem rozstrzygającym jest `heroVideo.paused`, nie własna flaga:
      // flaga mówi „kiedyś ruszyło", a pytanie brzmi „czy stoi TERAZ".
      var heroTriggers = ["visibilitychange", "touchend", "pointerup", "click"];
      var startHeroVideo = function () {
        // Obietnica z `play()` jest tu bez znaczenia — jej odrzucenie zostawia
        // element zapauzowany, a to i tak sprawdza `onHeroTrigger` przy każdym
        // kolejnym wyzwalaczu. Cichy `catch` tylko tłumi „unhandled rejection".
        var p = heroVideo.play();
        if (p && p.catch) { p.catch(function () {}); }
      };
      // ⛔ `pointerdown` NIE NADAJE user activation dla `pointerType: "touch"`
      // (HTML spec: liczy się tylko dla myszy; na dotyku aktywację daje
      // `pointerup`/`touchend`). Poprzednia wersja wołała więc `play()` bez
      // gestu dokładnie tam, gdzie gest był potrzebny — w in-app browserze
      // Facebooka na Androidzie (Chromium WebView egzekwuje to dosłownie).
      // `click` zostaje dla myszy i dla klawiatury.
      var onHeroTrigger = function () {
        // Dotknięcia sprzed `armed` (user jeszcze nie dojechał do kadru) mają
        // być zignorowane — ale nasłuch ZOSTAJE, bo nic nie zużyły.
        if (!armed || !heroVideo.paused) { return; }
        startHeroVideo();
      };
      // ⚠ NIE odpalamy po samym `setTimeout` od załadowania strony. Safari na
      // iOS odtwarza materiał bez gestu tylko wtedy, gdy element jest WIDOCZNY
      // — wideo pod foldem dostaje odrzucone `play()` (albo natychmiastową
      // pauzę) i zostaje zamrożone na pierwszej klatce. Zgłoszone z telefonu
      // 0808, po powiększeniu kadru: hero-art zaczyna się teraz ~1050px od
      // góry (przy 375px ekranu), czyli DOBRZE pod foldem — wcześniej łapał
      // się jeszcze przy dolnej krawędzi ekranu i problem się nie ujawniał.
      // Sekunda pauzy na pierwszej klatce (user 0806) zostaje — liczymy ją
      // od momentu, w którym kadr wjeżdża w ekran, a nie od `DOMContentLoaded`.
      // `armed` pilnuje, żeby awaryjna furtka na gest (niżej) nie wystartowała
      // nagrania ZANIM kadr wjedzie w ekran i odstoi swoją sekundę — inaczej
      // dotknięcie strony na samej górze zjadałoby pauzę na pierwszej klatce
      // i user dojeżdżałby do telefonu w połowie animacji.
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
        // Ćwierć kadru w oknie wystarcza, żeby Safari uznało element za
        // widoczny, a user zdążył go zobaczyć przed startem.
        }, { threshold: 0.25 });
        io.observe(heroVideo);
      } else {
        armHeroVideo();
      }
      // Ostatnia furtka: tryb niskiego zużycia energii na iOS i polityka mediów
      // in-app browsera blokują KAŻDE odtwarzanie bez gestu, więc nawet widoczny
      // kadr zostaje na pierwszej klatce. Każde dotknięcie, kliknięcie i powrót
      // karty na wierzch próbuje ponownie — i robi to przez całe życie strony,
      // bo zapauzować może też sam system długo po pierwszym starcie.
      for (var t = 0; t < heroTriggers.length; t++) {
        document.addEventListener(heroTriggers[t], onHeroTrigger, { passive: true });
      }
    }
  }
})();
