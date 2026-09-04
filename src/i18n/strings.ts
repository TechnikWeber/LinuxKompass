import type { L10n } from '../data/types';

/**
 * Alle Oberflächentexte. Die Struktur ist absichtlich flach gehalten:
 * ein Schlüssel, zwei Sprachen, keine Verschachtelung, keine Platzhalter-
 * Sprache. Wo Zahlen eingesetzt werden, steht {n} bzw. {a}/{b} im Text.
 */
export const ui = {
  // --- Rahmen ---
  appName: { de: 'LinuxKompass', en: 'LinuxKompass' },
  tagline: { de: 'Welches Linux passt zu dir?', en: 'Which Linux fits you?' },
  skipToContent: { de: 'Zum Inhalt springen', en: 'Skip to content' },
  langSwitch: { de: 'Sprache', en: 'Language' },
  themeToDark: { de: 'Auf dunkles Design umschalten', en: 'Switch to the dark theme' },
  themeToLight: { de: 'Auf helles Design umschalten', en: 'Switch to the light theme' },
  navStart: { de: 'Start', en: 'Home' },
  navQuiz: { de: 'Fragebogen', en: 'Questionnaire' },
  navBrowse: { de: 'Alle Distributionen', en: 'All distributions' },
  navCompare: { de: 'Vergleich', en: 'Comparison' },
  navDesktops: { de: 'Desktops', en: 'Desktops' },
  navAbout: { de: 'Über das Projekt', en: 'About' },
  footerBlurb: {
    de: 'Entscheidungshilfe für den Umstieg auf Linux. Quelloffen, ohne Werbung, ohne Nutzerverfolgung.',
    en: 'A decision aid for moving to Linux. Open source, no ads, no tracking.',
  },

  // --- Startseite ---
  heroKicker: { de: 'Entscheidungshilfe, keine Rangliste', en: 'A decision aid, not a leaderboard' },
  heroTitle: { de: 'Welches Linux passt zu dir?', en: 'Which Linux fits you?' },
  heroLead: {
    de: 'Es gibt keine beste Distribution. Es gibt nur die, die zu deiner Hardware, deiner Arbeitsweise und deiner Geduld passt. Dieser Wegweiser fragt nach – und erklärt jede Empfehlung, statt nur eine Zahl zu zeigen.',
    en: 'There is no best distribution. There is only the one that fits your hardware, the way you work and your patience. This guide asks — and explains every recommendation instead of just showing a number.',
  },
  heroStart: { de: 'Fragebogen starten', en: 'Start the questionnaire' },
  heroBrowse: { de: 'Erst mal stöbern', en: 'Browse first' },
  heroStatDistros: { de: 'geprüfte Distributionen', en: 'researched distributions' },
  heroStatQuestions: { de: 'Fragen in drei Tiefen', en: 'questions across three depths' },
  followUpNote: {
    de: 'Nennst du ein Programm, das dich bisher hält, fragen wir gezielt nach, ob eine Alternative für dich infrage käme – und was dabei anders wäre.',
    en: 'If you name a program that is holding you back, we ask specifically whether an alternative would work for you — and what would be different about it.',
  },
  heroStatAttributes: { de: 'Merkmale je Distribution', en: 'attributes per distribution' },
  heroCheckedNote: { de: 'Datenstand', en: 'Data as of' },

  featureModesTitle: { de: 'Drei Tiefen statt einer Größe für alle', en: 'Three depths instead of one size fits all' },
  featureModesText: {
    de: 'Drei kurze Fragen schätzen ein, wie tief der Fragebogen gehen sollte. Der Vorschlag ist nur ein Vorschlag – du kannst jederzeit umschalten.',
    en: 'Three short questions estimate how deep the questionnaire should go. The suggestion is only a suggestion — you can switch at any time.',
  },
  featureExplainTitle: { de: 'Jede Empfehlung ist nachvollziehbar', en: 'Every recommendation is traceable' },
  featureExplainText: {
    de: 'Zu jedem Ergebnis siehst du, welche Antwort welchen Anteil an der Punktzahl hatte – und welche Distributionen an welcher Anforderung gescheitert sind.',
    en: 'For every result you can see which answer contributed what share of the score — and which distributions failed on which requirement.',
  },
  featureCompareTitle: { de: 'Engere Wahl vergleichen', en: 'Compare your shortlist' },
  featureCompareText: {
    de: 'Häkchen setzen und beliebig viele Distributionen nebeneinander legen. Unterschiede werden hervorgehoben, Gemeinsamkeiten lassen sich ausblenden.',
    en: 'Tick the boxes and place any number of distributions side by side. Differences are highlighted and shared values can be hidden.',
  },
  featureHonestTitle: { de: 'Auch das, was nicht geht', en: 'Including what will not work' },
  featureHonestText: {
    de: 'Adobe, Anti-Cheat-Spiele, CAD, Branchensoftware: Wo Linux an Grenzen stößt, steht das hier – mit den Alternativen, die es tatsächlich gibt.',
    en: 'Adobe, anti-cheat games, CAD, line-of-business software: where Linux hits limits, it says so here — along with the alternatives that actually exist.',
  },

  // --- Triage ---
  triageTitle: { de: 'Zuerst: Wie tief soll es gehen?', en: 'First: how deep should this go?' },
  triageLead: {
    de: 'Drei Fragen, damit wir dir nicht die falschen 40 Fragen stellen. Antworte ehrlich – es gibt hier nichts zu gewinnen.',
    en: 'Three questions so we do not ask you the wrong forty. Answer honestly — there is nothing to win here.',
  },
  triageSkip: { de: 'Überspringen und Modus selbst wählen', en: 'Skip and choose the mode myself' },
  triageResultTitle: { de: 'Unser Vorschlag', en: 'Our suggestion' },
  triageChangeHint: {
    de: 'Du kannst das jederzeit ändern – auch mitten im Fragebogen.',
    en: 'You can change this at any time, even in the middle of the questionnaire.',
  },
  modeContinue: { de: 'Mit diesem Modus starten', en: 'Start with this mode' },

  // --- Modi ---
  modeBeginner: { de: 'Einsteiger', en: 'Beginner' },
  modeBeginnerDesc: {
    de: 'Zwölf Fragen in Alltagssprache, ohne Fachbegriffe. Reicht für eine gute Empfehlung völlig aus.',
    en: 'Twelve questions in plain language, no jargon. Entirely sufficient for a good recommendation.',
  },
  modeAdvanced: { de: 'Fortgeschritten', en: 'Advanced' },
  modeAdvancedDesc: {
    de: 'Zusätzlich Fragen zu Desktop, Bildschirmen, Secure Boot, Paketformaten und Supportdauer.',
    en: 'Adds questions about desktop, displays, Secure Boot, package formats and support duration.',
  },
  modeExpert: { de: 'Profi', en: 'Expert' },
  modeExpertDesc: {
    de: 'Alles: Release-Modell, Init-System, Dateisystem, Härtung, Trägerschaft, Architekturen, Kernelkontrolle.',
    en: 'Everything: release model, init system, filesystem, hardening, governance, architectures, kernel control.',
  },
  modeQuestionCount: { de: 'ab {n} Fragen', en: 'from {n} questions' },

  // --- Fragebogen ---
  questionOf: { de: 'Frage {a} von {b}', en: 'Question {a} of {b}' },
  quizBack: { de: 'Zurück', en: 'Back' },
  quizNext: { de: 'Weiter', en: 'Next' },
  quizSkip: { de: 'Überspringen', en: 'Skip' },
  quizFinish: { de: 'Ergebnis ansehen', en: 'See the result' },
  quizMultiHint: { de: 'Mehrfachauswahl möglich', en: 'Multiple answers allowed' },
  quizRequired: { de: 'Diese Frage sollte beantwortet werden', en: 'This question should be answered' },
  quizWhyTitle: { de: 'Warum wir das fragen', en: 'Why we ask this' },
  quizModeSwitch: { de: 'Modus wechseln', en: 'Switch mode' },
  quizLivePreview: { de: 'Zwischenstand', en: 'Current standing' },
  quizLivePreviewHint: {
    de: 'Ändert sich mit jeder Antwort. Noch nicht endgültig.',
    en: 'Changes with every answer. Not final yet.',
  },
  quizRestart: { de: 'Von vorn beginnen', en: 'Start over' },

  // --- Ergebnis ---
  resultTitle: { de: 'Deine Empfehlung', en: 'Your recommendation' },
  resultLead: {
    de: 'Sortiert nach Passgenauigkeit zu deinen Antworten. Die Punktzahl ist ein Vergleichswert innerhalb dieser Liste, keine Schulnote.',
    en: 'Sorted by fit to your answers. The score compares within this list; it is not a grade.',
  },
  resultTopPick: { de: 'Beste Übereinstimmung', en: 'Best match' },
  resultAlternatives: { de: 'Ebenfalls passend', en: 'Also a good fit' },
  resultAllRanked: { de: 'Vollständige Rangliste', en: 'Full ranking' },
  resultExcluded: { de: 'Ausgeschlossen durch deine Anforderungen', en: 'Excluded by your requirements' },
  resultExcludedLead: {
    de: 'Diese Distributionen erfüllen mindestens eine deiner harten Anforderungen nicht. Der Grund steht jeweils dabei.',
    en: 'These distributions fail at least one of your hard requirements. The reason is given in each case.',
  },
  resultConfidence: { de: 'Verlässlichkeit der Empfehlung', en: 'Confidence in this recommendation' },
  resultConfidenceLow: {
    de: 'Noch wenig belastbar – beantworte mehr Fragen oder wechsle in einen tieferen Modus.',
    en: 'Not very solid yet — answer more questions or switch to a deeper mode.',
  },
  resultConfidenceMedium: {
    de: 'Ordentlich. Die vorderen Plätze liegen nah beieinander – sieh dir den Vergleich an.',
    en: 'Reasonably solid. The top places are close together — take a look at the comparison.',
  },
  resultConfidenceHigh: {
    de: 'Belastbar. Die Empfehlung hebt sich deutlich vom Rest ab.',
    en: 'Solid. The recommendation stands clearly apart from the rest.',
  },
  resultTiedWarning: {
    de: 'Diese Distributionen liegen praktisch gleichauf. Hier entscheidet Geschmack, nicht Technik – vergleiche sie direkt.',
    en: 'These distributions are practically tied. Taste decides here, not technology — compare them directly.',
  },
  resultNarrow: {
    de: 'Deine Anforderungen sind sehr spezifisch: nur {n} von {total} Distributionen erfüllen sie alle. Das ist eine gültige Antwort – wenn du mehr Auswahl möchtest, lockere eine Anforderung im Fragebogen.',
    en: 'Your requirements are very specific: only {n} of {total} distributions meet all of them. That is a valid answer — if you want more choice, relax one requirement in the questionnaire.',
  },
  resultRelaxed: { de: 'Gelockerte Anforderungen', en: 'Relaxed requirements' },
  resultRelaxedLead: {
    de: 'Deine Anforderungen zusammen erfüllt keine Distribution. Wir haben deshalb die folgenden Punkte außen vor gelassen, damit überhaupt eine Empfehlung entsteht:',
    en: 'No distribution meets all your requirements at once. We therefore set the following aside so that a recommendation is possible at all:',
  },
  resultWhyTitle: { de: 'Warum diese Empfehlung', en: 'Why this recommendation' },
  resultBreakdown: { de: 'Punkteherkunft', en: 'Where the points come from' },
  resultMatchedTag: { de: 'Passt zu deinen Angaben', en: 'Matches your answers' },
  resultStrengths: { de: 'Spricht dafür', en: 'In favour' },
  resultWeaknesses: { de: 'Spricht dagegen', en: 'Against' },
  resultOpenWishes: { de: 'Bleibt offen', en: 'Left unmet' },
  resultNothingFor: { de: 'Nichts, was besonders dafür spricht.', en: 'Nothing that particularly speaks for it.' },
  resultNothingAgainst: { de: 'Nichts, was dagegen spricht.', en: 'Nothing that speaks against it.' },
  ratingLowWanted: { de: 'je weniger, desto besser', en: 'less is better' },
  resultBonus: { de: 'Zuschlag aus deinen Vorlieben', en: 'Bonus from your preferences' },
  resultFlagsTitle: { de: 'Bevor du umsteigst', en: 'Before you switch' },
  resultFlagsLead: {
    de: 'Diese Punkte hängen nicht von der Distribution ab, sondern entscheiden, ob ein Umstieg für dich funktioniert.',
    en: 'These points do not depend on the distribution — they decide whether switching works for you at all.',
  },
  resultNextStepsTitle: { de: 'Wie es weitergeht', en: 'What to do next' },
  resultShare: { de: 'Ergebnis-Link kopieren', en: 'Copy result link' },
  resultShareCopied: { de: 'Link kopiert', en: 'Link copied' },
  resultPrint: { de: 'Drucken oder als PDF sichern', en: 'Print or save as PDF' },
  resultRefine: { de: 'Antworten anpassen', en: 'Adjust answers' },
  resultDeepen: { de: 'Tiefer nachfragen ({mode})', en: 'Ask deeper questions ({mode})' },

  // --- Desktop-Empfehlung ---
  desktopPickTitle: { de: 'Und welche Oberfläche?', en: 'And which desktop?' },
  desktopPickLead: {
    de: 'Die Oberfläche entscheidet im Alltag oft mehr als die Distribution darunter – und sie lässt sich bei fast jeder Distribution austauschen. Du bist also nicht festgelegt.',
    en: 'Day to day the desktop often matters more than the distribution beneath it — and on almost any distribution you can swap it. So you are not locked in.',
  },
  desktopPickSentence: { de: 'Zu deinen Antworten passt {name}, weil {reasons}.', en: '{name} fits your answers because {reasons}.' },
  desktopPickSentencePlain: { de: 'Zu deinen Antworten passt {name} am besten.', en: '{name} fits your answers best.' },
  desktopPickAlternatives: { de: 'Ebenfalls passend', en: 'Also a good fit' },
  desktopPickInTop: { de: '{distro} bietet {name} als Standard an.', en: '{distro} ships {name} as its default.' },
  desktopPickAvailable: { de: '{distro} bietet {name} zur Auswahl an.', en: '{distro} offers {name} as an option.' },
  desktopPickNotAvailable: {
    de: '{distro} liefert {name} nicht mit. Entweder du nimmst dort den Standard-Desktop, oder du wählst eine Distribution aus der Liste, die {name} anbietet.',
    en: '{distro} does not ship {name}. Either use its default desktop, or pick a distribution from the list that offers {name}.',
  },
  desktopPickAll: { de: 'Alle Desktops ansehen', en: 'See all desktops' },
  desktopPickCaveat: { de: 'Gut zu wissen', en: 'Worth knowing' },
  tryLiveTitle: { de: 'Vorher ausprobieren, ohne etwas zu installieren', en: 'Try before installing anything' },
  tryLiveText: {
    de: 'Auf DistroSea lassen sich über 80 Distributionen und deren Oberflächen direkt im Browser starten. Das ersetzt keinen Test auf der eigenen Hardware – dafür braucht es einen USB-Stick –, aber für den ersten Eindruck von Bedienkonzept und Optik reicht es völlig.',
    en: 'DistroSea runs over 80 distributions and their desktops straight in your browser. It does not replace a test on your own hardware — that needs a USB stick — but for a first impression of look and feel it is more than enough.',
  },
  tryLiveLink: { de: 'DistroSea öffnen', en: 'Open DistroSea' },
  tryLiveDisclaimer: {
    de: 'Externes Angebot, nicht von uns betrieben.',
    en: 'External service, not operated by us.',
  },

  // --- Vergleich ---
  compareTitle: { de: 'Vergleich', en: 'Comparison' },
  compareDistros: { de: 'Distributionen', en: 'Distributions' },
  compareDesktops: { de: 'Desktop-Umgebungen', en: 'Desktop environments' },
  compareBothHint: {
    de: 'Distributionen und Oberflächen werden getrennt verglichen – sie haben unterschiedliche Merkmale und schließen sich nicht aus.',
    en: 'Distributions and desktops are compared separately — they have different attributes and do not exclude one another.',
  },
  compareEmpty: {
    de: 'Noch nichts ausgewählt. Setze auf einer Distribution ein Häkchen, um sie hier zu vergleichen.',
    en: 'Nothing selected yet. Tick a distribution to compare it here.',
  },
  compareAdd: { de: 'Zum Vergleich', en: 'Compare' },
  compareAdded: { de: 'Im Vergleich', en: 'In comparison' },
  compareClear: { de: 'Auswahl leeren', en: 'Clear selection' },
  compareOnlyDiffs: { de: 'Nur Unterschiede zeigen', en: 'Show differences only' },
  compareCount: { de: '{n} ausgewählt', en: '{n} selected' },
  compareOpen: { de: 'Vergleich öffnen', en: 'Open comparison' },
  compareRemove: { de: 'Entfernen', en: 'Remove' },
  compareLimit: {
    de: 'Mehr als sechs Distributionen lassen sich schlecht nebeneinander lesen.',
    en: 'More than six distributions become hard to read side by side.',
  },

  // --- Übersicht / Filter ---
  browseTitle: { de: 'Alle Distributionen', en: 'All distributions' },
  browseLead: {
    de: 'Alle {n} Einträge mit Quellenangabe und Prüfdatum. Filter und Suche helfen beim Eingrenzen.',
    en: 'All {n} entries with sources and a check date. Filters and search help narrow things down.',
  },
  search: { de: 'Suchen', en: 'Search' },
  searchPlaceholder: { de: 'Name, Schlagwort, Desktop …', en: 'Name, tag, desktop …' },
  filters: { de: 'Filter', en: 'Filters' },
  filtersReset: { de: 'Filter zurücksetzen', en: 'Reset filters' },
  filterFamily: { de: 'Familie', en: 'Family' },
  filterReleaseModel: { de: 'Release-Modell', en: 'Release model' },
  filterDesktop: { de: 'Desktop', en: 'Desktop' },
  filterAudience: { de: 'Zielgruppe', en: 'Audience' },
  filterDifficulty: { de: 'Einstiegshürde', en: 'Barrier to entry' },
  filterAll: { de: 'Alle', en: 'All' },
  sortBy: { de: 'Sortierung', en: 'Sort by' },
  sortName: { de: 'Name', en: 'Name' },
  sortBeginner: { de: 'Einsteigerfreundlichkeit', en: 'Beginner friendliness' },
  sortFreshness: { de: 'Aktualität', en: 'Freshness' },
  sortLightweight: { de: 'Sparsamkeit', en: 'Frugality' },
  resultsCount: { de: '{n} Treffer', en: '{n} matches' },
  noResults: { de: 'Nichts gefunden. Setze die Filter zurück.', en: 'Nothing found. Reset the filters.' },

  // --- Detailansicht ---
  detailBack: { de: 'Zurück zur Übersicht', en: 'Back to the overview' },
  detailWebsite: { de: 'Website', en: 'Website' },
  detailDownload: { de: 'Herunterladen', en: 'Download' },
  detailDocs: { de: 'Dokumentation', en: 'Documentation' },
  detailGermanHelp: { de: 'Deutschsprachige Hilfe', en: 'German-language help' },
  detailHighlights: { de: 'Das macht sie besonders', en: 'What sets it apart' },
  detailBestFor: { de: 'Gut geeignet für', en: 'A good fit for' },
  detailNotFor: { de: 'Weniger geeignet für', en: 'Less suitable for' },
  detailWarnings: { de: 'Worauf du achten musst', en: 'What to watch out for' },
  detailFirstSteps: { de: 'Erste Schritte nach der Installation', en: 'First steps after installation' },
  detailFacts: { de: 'Technische Daten', en: 'Technical data' },
  detailRatings: { de: 'Bewertungsprofil', en: 'Rating profile' },
  detailSources: { de: 'Quellen', en: 'Sources' },
  detailCheckedAt: { de: 'Zuletzt geprüft am', en: 'Last checked' },
  detailExtraRepos: { de: 'Zusätzliche Paketquellen', en: 'Additional package sources' },
  detailBasedOn: { de: 'Basiert auf', en: 'Based on' },
  detailDerivatives: { de: 'Baut darauf auf', en: 'Built on top of it' },

  // --- Feldbezeichnungen ---
  fieldVersion: { de: 'Aktuelle Version', en: 'Current version' },
  fieldSupportUntil: { de: 'Gepflegt bis', en: 'Maintained until' },
  fieldReleaseModel: { de: 'Release-Modell', en: 'Release model' },
  fieldReleaseCadence: { de: 'Erscheinungsrhythmus', en: 'Release cadence' },
  fieldFamily: { de: 'Familie', en: 'Family' },
  fieldOrigin: { de: 'Herkunft', en: 'Origin' },
  fieldFirstRelease: { de: 'Seit', en: 'Since' },
  fieldGovernance: { de: 'Trägerschaft', en: 'Stewardship' },
  fieldInit: { de: 'Init-System', en: 'Init system' },
  fieldLibc: { de: 'C-Bibliothek', en: 'C library' },
  fieldPackageManager: { de: 'Paketverwaltung', en: 'Package manager' },
  fieldPackageFormat: { de: 'Paketformat', en: 'Package format' },
  fieldFlatpak: { de: 'Flatpak ab Werk', en: 'Flatpak out of the box' },
  fieldSnap: { de: 'Snap', en: 'Snap' },
  fieldAur: { de: 'AUR-Zugriff', en: 'AUR access' },
  fieldDefaultDesktop: { de: 'Standard-Desktop', en: 'Default desktop' },
  desktopFreeChoice: { de: 'Desktop frei wählbar', en: 'Desktop is your choice' },
  desktopNone: { de: 'Ohne Desktop', en: 'No desktop' },
  fieldDesktops: { de: 'Verfügbare Desktops', en: 'Available desktops' },
  fieldInstaller: { de: 'Installation', en: 'Installation' },
  fieldInstallDifficulty: { de: 'Installationsaufwand', en: 'Installation effort' },
  fieldMinRam: { de: 'Mindest-RAM', en: 'Minimum RAM' },
  fieldRecommendedRam: { de: 'Empfohlener RAM', en: 'Recommended RAM' },
  fieldMinStorage: { de: 'Mindestspeicher', en: 'Minimum storage' },
  fieldArchitectures: { de: 'Architekturen', en: 'Architectures' },
  field32bit: { de: '32-Bit-Ausgabe', en: '32-bit edition' },
  fieldRaspberry: { de: 'Raspberry Pi', en: 'Raspberry Pi' },
  fieldSecureBoot: { de: 'Secure Boot', en: 'Secure Boot' },
  fieldNvidia: { de: 'NVIDIA-Treiber', en: 'NVIDIA driver' },
  fieldCodecs: { de: 'Mediencodecs ab Werk', en: 'Media codecs out of the box' },
  fieldFde: { de: 'Verschlüsselung im Installer', en: 'Encryption in the installer' },
  fieldSnapshots: { de: 'Systemschnappschüsse', en: 'System snapshots' },
  fieldAtomic: { de: 'Unveränderliches System', en: 'Immutable system' },
  fieldWayland: { de: 'Wayland als Standard', en: 'Wayland by default' },
  fieldX11: { de: 'X11-Sitzung verfügbar', en: 'X11 session available' },
  fieldMaintenance: { de: 'Pflegeaufwand', en: 'Maintenance effort' },
  fieldTelemetry: { de: 'Telemetrie', en: 'Telemetry' },
  fieldCommercialSupport: { de: 'Bezahlter Support', en: 'Paid support' },
  fieldAudiences: { de: 'Zielgruppen', en: 'Audiences' },

  yes: { de: 'ja', en: 'yes' },
  no: { de: 'nein', en: 'no' },
  none: { de: 'keiner', en: 'none' },
  gb: { de: 'GB', en: 'GB' },

  // --- Desktops ---
  desktopsTitle: { de: 'Desktop-Umgebungen', en: 'Desktop environments' },
  desktopsLead: {
    de: 'Für den Alltag entscheidet die Oberfläche oft mehr als die Distribution darunter. Fast jede Distribution bietet mehrere an – hier stehen sie im Vergleich.',
    en: 'Day to day, the desktop often matters more than the distribution beneath it. Almost every distribution offers several — here they are side by side.',
  },
  desktopFeelsLike: { de: 'Fühlt sich an wie', en: 'Feels like' },
  desktopMemory: { de: 'Speicher im Leerlauf', en: 'Idle memory use' },
  desktopWayland: { de: 'Wayland-Stand', en: 'Wayland status' },
  desktopStrengths: { de: 'Stärken', en: 'Strengths' },
  desktopTradeoffs: { de: 'Preis dafür', en: 'Trade-offs' },
  desktopAccessibility: { de: 'Barrierefreiheit', en: 'Accessibility' },
  desktopTouch: { de: 'Touch-Bedienung', en: 'Touch support' },
  desktopCustomizability: { de: 'Anpassbarkeit', en: 'Configurability' },
  desktopUsedBy: { de: 'Standard bei', en: 'Default in' },
  desktopAvailableIn: { de: 'Wählbar bei {n} Distributionen', en: 'Selectable in {n} distributions' },

  // --- Über ---
  aboutTitle: { de: 'Über LinuxKompass', en: 'About LinuxKompass' },
  aboutMethodTitle: { de: 'Wie die Empfehlung zustande kommt', en: 'How the recommendation is produced' },
  aboutDataTitle: { de: 'Woher die Daten kommen', en: 'Where the data comes from' },
  aboutLimitsTitle: { de: 'Was dieser Wegweiser nicht kann', en: 'What this guide cannot do' },
  aboutContributeTitle: { de: 'Mitmachen und korrigieren', en: 'Contribute and correct' },

  // --- Sonstiges ---
  showMore: { de: 'Mehr anzeigen', en: 'Show more' },
  showLess: { de: 'Weniger anzeigen', en: 'Show less' },
  details: { de: 'Details', en: 'Details' },
  close: { de: 'Schließen', en: 'Close' },
  points: { de: 'Punkte', en: 'points' },
  outOf10: { de: 'von 10', en: 'out of 10' },
  excludedBecause: { de: 'Ausgeschlossen – diese Distribution', en: 'Excluded — this distribution' },
  ofWhich: { de: 'davon', en: 'of which' },
} as const satisfies Record<string, L10n>;

export type UiKey = keyof typeof ui;
