/*
 * Hyc! — landing config.
 * TO JEDYNE MIEJSCE DO EDYCJI po zbudowaniu bety.
 * Wklej publiczne linki i (opcjonalnie) endpoint formularza mailowego.
 * Puste ("") => przycisk pokazuje stan „Wkrótce" i jest nieklikalny.
 */
window.HYC_CONFIG = {
  // iOS — publiczny link TestFlight (App Store Connect → TestFlight → Public Link).
  // Build 13 zgłoszony do Beta App Review 0811 (WAITING_FOR_REVIEW) i przypięty
  // do grupy zewnętrznej "Beta" — link działa od razu, instalacja odblokuje się
  // testerom po zatwierdzeniu recenzji (zwykle 24–48h).
  testflight: "https://testflight.apple.com/join/eAMXEMb9",

  // Android idzie przez ZAMKNIĘTY test Play, nie przez testy otwarte — konto
  // deweloperskie jest prywatne i nowe, więc Play wymaga najpierw closed testu
  // (12 testerów × 14 dni) zanim odblokuje open testing. Stąd DWA kroki:

  // Krok 1 — grupa Google podpięta w Play Console jako lista testerów.
  // "Anyone can join": dołączenie jest natychmiastowe, nikt nic nie akceptuje.
  // Gotowe od razu, nie czeka na appkę w konsoli.
  googleGroup: "https://groups.google.com/g/hyc-testers",

  // Krok 2 — link opt-in konkretnej ścieżki testów (Play Console → Testing →
  // Closed testing → Testers → "Copy link"). Build 13 zatwierdzony 0811 (33 min
  // review), link zweryfikowany na żywo (realna strona "Become a tester" dla
  // Hyc!, nie strzał w ciemno).
  // ⛔ Działa TYLKO dla członków grupy z Kroku 1 (może być kwestią godzin, zanim
  // rozpozna świeże członkostwo — nieudokumentowane przez Google, stąd notatka
  // "sprawdź później" zamiast twierdzenia że zadziała od razu).
  googlePlay: "https://play.google.com/apps/testing/pl.hycdobudy.hyc_do_budy",
};
