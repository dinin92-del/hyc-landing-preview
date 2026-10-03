/*
 * Hyc! — landing config.
 * TO JEDYNE MIEJSCE DO EDYCJI po zbudowaniu bety.
 * Wklej publiczne linki i (opcjonalnie) endpoint formularza mailowego.
 * Puste ("") => przycisk pokazuje stan „Wkrótce" i jest nieklikalny.
 */
window.HYC_CONFIG = {
  // iOS — publiczny link TestFlight (App Store Connect → TestFlight → Public Link).
  // Instalacja odblokuje się testerom dopiero po zatwierdzeniu recenzji Apple.
  testflight: "https://testflight.apple.com/join/eAMXEMb9",

  // Android idzie przez zamknięty test Play, nie przez testy otwarte — konto
  // deweloperskie jest prywatne i nowe, więc Play wymaga najpierw closed testu
  // zanim odblokuje open testing. Stąd dwa kroki:

  // Krok 1 — grupa Google podpięta w Play Console jako lista testerów.
  // "Anyone can join": dołączenie jest natychmiastowe, nikt nic nie akceptuje.
  googleGroup: "https://groups.google.com/g/hyc-testers",

  // Krok 2 — link opt-in konkretnej ścieżki testów (Play Console → Testing →
  // Closed testing → Testers → "Copy link"). Działa tylko dla członków grupy
  // z Kroku 1 — może być kwestią godzin, zanim Play rozpozna świeże
  // członkostwo (nieudokumentowane przez Google).
  googlePlay: "https://play.google.com/apps/testing/pl.hycdobudy.hyc_do_budy",
};
