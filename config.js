/*
 * Hyc! — landing config.
 * TO JEDYNE MIEJSCE DO EDYCJI po zbudowaniu bety.
 * Wklej publiczne linki i (opcjonalnie) endpoint formularza mailowego.
 * Puste ("") => przycisk pokazuje stan „Wkrótce" i jest nieklikalny.
 */
window.HYC_CONFIG = {
  // iOS — publiczny link TestFlight (App Store Connect → TestFlight → Public Link).
  // Format: https://testflight.apple.com/join/XXXXXXXX
  testflight: "",

  // Android idzie przez ZAMKNIĘTY test Play, nie przez testy otwarte — konto
  // deweloperskie jest prywatne i nowe, więc Play wymaga najpierw closed testu
  // (12 testerów × 14 dni) zanim odblokuje open testing. Stąd DWA kroki:

  // Krok 1 — grupa Google podpięta w Play Console jako lista testerów.
  // "Anyone can join": dołączenie jest natychmiastowe, nikt nic nie akceptuje.
  // Gotowe od razu, nie czeka na appkę w konsoli.
  googleGroup: "https://groups.google.com/g/hyc-testers",

  // Krok 2 — link opt-in konkretnej ścieżki testów (Play Console → Testing →
  // Closed testing → Testers → "Copy link"). Format:
  // https://play.google.com/apps/testing/pl.hycdobudy.hyc_do_budy
  // Puste, dopóki apka nie istnieje w konsoli — patrz docs/runbook-beta-play.md.
  // ⛔ Działa TYLKO dla członków grupy z Kroku 1 (może być kwestią godzin, zanim
  // rozpozna świeże członkostwo — nieudokumentowane przez Google, stąd notatka
  // "sprawdź później" zamiast twierdzenia że zadziała od razu).
  googlePlay: "",
};
