import type { Question } from './types';

/** Nur im Experten-/Profimodus. Hier darf Fachsprache stehen. */
export const expertQuestions: Question[] = [
  {
    id: 'release-model',
    section: 'philosophy',
    modes: ['expert'],
    type: 'single',
    weight: 3,
    title: { de: 'Welches Release-Modell soll es sein?', en: 'Which release model do you want?' },
    options: [
      { id: 'lts', label: { de: 'Feste Version mit langem Support (LTS)', en: 'Fixed release with long-term support (LTS)' }, effect: { require: ['long-support'], ratings: { stability: 3, freshness: -2 } } },
      { id: 'short-fixed', label: { de: 'Feste Version mit kurzem Zyklus (Fedora-Stil)', en: 'Fixed release with a short cycle (Fedora style)' }, effect: { require: ['fixed-release'], ratings: { freshness: 2, upgradeSmoothness: 2 }, boostDistros: { 'fedora-workstation': 6, 'fedora-kde': 5, nixos: 3 } } },
      { id: 'semi-rolling', label: { de: 'Halbrollend mit Verzögerung und Testphase', en: 'Semi-rolling with staging and testing' }, effect: { ratings: { stability: 1, freshness: 2 }, boostTags: { 'semi-rolling': 8 }, boostDistros: { 'opensuse-slowroll': 8, manjaro: 5 } } },
      { id: 'rolling', label: { de: 'Voll rollend', en: 'Fully rolling' }, effect: { require: ['rolling'], ratings: { freshness: 3 }, boostTags: { rolling: 6 } } },
      { id: 'image-based', label: { de: 'Bildbasiert und unveränderlich (OSTree, transactional-update)', en: 'Image-based and immutable (OSTree, transactional-update)' }, effect: { require: ['atomic'], ratings: { upgradeSmoothness: 3, stability: 2 }, boostTags: { atomic: 8 } } },
    ],
  },

  {
    id: 'init-system',
    section: 'philosophy',
    modes: ['expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Hast du eine Anforderung an das Init-System?', en: 'Do you have a requirement regarding the init system?' },
    help: {
      de: 'systemd ist heute der De-facto-Standard und Voraussetzung für viele Desktop-Bausteine (logind, Portale, Suspend-Logik). Alternativen wie OpenRC, runit, s6 oder dinit sind schlanker und leichter nachvollziehbar, erfordern aber Ersatzlösungen wie elogind und schließen manche Software aus.',
      en: 'systemd is today’s de-facto standard and a prerequisite for many desktop building blocks (logind, portals, suspend logic). Alternatives such as OpenRC, runit, s6 or dinit are leaner and easier to follow but require substitutes like elogind and rule out some software.',
    },
    options: [
      { id: 'systemd', label: { de: 'systemd – ich will maximale Kompatibilität', en: 'systemd — I want maximum compatibility' }, effect: { require: ['systemd'] } },
      { id: 'no-systemd', label: { de: 'Ausdrücklich ohne systemd', en: 'Explicitly without systemd' }, effect: { require: ['no-systemd'], boostTags: { 'ohne-systemd': 10 }, flags: ['no-systemd'] } },
      { id: 'choice', label: { de: 'Ich hätte gern die Wahl zwischen mehreren', en: 'I would like a choice between several' }, effect: { boostDistros: { antix: 8, artix: 8, devuan: 6, gentoo: 5, 'mx-linux': 5 } } },
      { id: 'nopref', label: { de: 'Keine Anforderung', en: 'No requirement' }, effect: {}, neutral: true },
    ],
  },

  {
    id: 'filesystem',
    section: 'operations',
    modes: ['expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Welches Dateisystem willst du für das Wurzelverzeichnis?', en: 'Which filesystem do you want for the root volume?' },
    options: [
      { id: 'btrfs-snapshots', label: { de: 'Btrfs mit automatischen Schnappschüssen', en: 'Btrfs with automatic snapshots' }, effect: { require: ['snapshots'], ratings: { upgradeSmoothness: 2 }, boostTags: { 'btrfs-snapshots': 8 } } },
      { id: 'zfs', label: { de: 'ZFS', en: 'ZFS' }, effect: { boostDistros: { 'proxmox-ve': 10, nixos: 5, ubuntu: 3, void: 3 }, flags: ['zfs'] } },
      { id: 'ext4', label: { de: 'ext4 – schlicht und unauffällig', en: 'ext4 — plain and unremarkable' }, effect: { ratings: { stability: 1 } } },
      { id: 'nopref', label: { de: 'Keine Vorliebe', en: 'No preference' }, effect: {}, neutral: true },
    ],
  },

  {
    id: 'hardening',
    section: 'philosophy',
    modes: ['expert'],
    type: 'multiple',
    weight: 2,
    title: { de: 'Welche Härtungsmerkmale brauchst du?', en: 'Which hardening features do you need?' },
    options: [
      { id: 'mac', label: { de: 'Verbindliche Zugriffskontrolle (SELinux oder AppArmor) ab Werk aktiv', en: 'Mandatory access control (SELinux or AppArmor) enabled by default' }, effect: { boostTags: { selinux: 8 }, boostDistros: { 'fedora-workstation': 6, 'fedora-kde': 6, almalinux: 6, 'rocky-linux': 6, ubuntu: 4, 'opensuse-leap': 4 } } },
      { id: 'fde-tpm', label: { de: 'Festplattenverschlüsselung mit TPM-Bindung', en: 'Full-disk encryption bound to the TPM' }, effect: { require: ['fde-installer'], boostDistros: { 'opensuse-aeon': 8, 'fedora-silverblue': 4 } } },
      { id: 'reproducible', label: { de: 'Nachvollziehbare, reproduzierbare Systemzustände', en: 'Traceable, reproducible system states' }, effect: { boostDistros: { nixos: 12, 'fedora-silverblue': 6, 'fedora-kinoite': 6, bluefin: 5, aurora: 5 } } },
      { id: 'isolation', label: { de: 'Strikte Trennung von Anwendungen (Sandbox oder VM)', en: 'Strict separation of applications (sandbox or VM)' }, effect: { boostDistros: { qubes: 12, 'fedora-silverblue': 5, 'opensuse-aeon': 4 } } },
      { id: 'none', label: { de: 'Nichts davon', en: 'None of these' }, effect: {}, neutral: true },
    ],
  },

  {
    id: 'governance',
    section: 'philosophy',
    modes: ['expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Wer soll hinter der Distribution stehen?', en: 'Who should be behind the distribution?' },
    description: { de: 'Trägerschaft bestimmt Langlebigkeit, Interessenkonflikte und wie Entscheidungen fallen.', en: 'Stewardship determines longevity, conflicts of interest and how decisions are made.' },
    options: [
      { id: 'community', label: { de: 'Community oder Stiftung, keine Firma', en: 'A community or foundation, no company' }, effect: { boostDistros: { debian: 10, arch: 8, gentoo: 6, 'linux-mint': 6, almalinux: 5, 'rocky-linux': 5, nixos: 5, void: 5 } } },
      { id: 'company-backed', label: { de: 'Firma im Rücken – das gibt Planbarkeit', en: 'A company behind it — that gives predictability' }, effect: { ratings: { enterpriseReady: 2 }, boostDistros: { ubuntu: 6, 'fedora-workstation': 5, 'opensuse-leap': 5, 'pop-os': 4, 'tuxedo-os': 4 } } },
      { id: 'avoid-single', label: { de: 'Kein Projekt, das an einer einzelnen Person hängt', en: 'Nothing that depends on a single person' }, effect: { boostDistros: { debian: 6, ubuntu: 5, 'fedora-workstation': 5, 'opensuse-tumbleweed': 4 } } },
      { id: 'nopref', label: { de: 'Egal', en: 'Does not matter' }, effect: {}, neutral: true },
    ],
  },

  {
    id: 'upstream-purity',
    section: 'philosophy',
    modes: ['expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Wie viel Eigenbau der Distribution ist dir recht?', en: 'How much distribution-specific engineering is acceptable?' },
    help: {
      de: 'Manche Distributionen liefern Software fast unverändert aus (Arch, Fedora, Slackware). Andere patchen viel, um ein rundes Produkt zu bauen (Ubuntu, Manjaro, Garuda, Nobara). Viel Eigenbau heißt: bequemer im Alltag, aber schwerer zu debuggen und mehr Abweichung von Anleitungen und Fehlerberichten aus dem Netz.',
      en: 'Some distributions ship software almost untouched (Arch, Fedora, Slackware). Others patch heavily to build a rounded product (Ubuntu, Manjaro, Garuda, Nobara). Heavy patching means: more comfortable day to day, but harder to debug and further from tutorials and upstream bug reports.',
    },
    options: [
      { id: 'pure', label: { de: 'Möglichst nah am Upstream', en: 'As close to upstream as possible' }, effect: { ratings: { upstreamPurity: 3 } } },
      { id: 'balanced', label: { de: 'Ausgewogen', en: 'Balanced' }, effect: { ratings: { upstreamPurity: 1 } } },
      { id: 'integrated', label: { de: 'Lieber ein fertig abgestimmtes Produkt', en: 'I prefer a fully integrated product' }, effect: { ratings: { upstreamPurity: -2, beginnerFriendly: 2 } } },
    ],
  },

  {
    id: 'architectures',
    section: 'hardware',
    modes: ['expert'],
    type: 'multiple',
    weight: 2,
    title: { de: 'Brauchst du bestimmte Prozessorarchitekturen?', en: 'Do you need particular CPU architectures?' },
    options: [
      { id: 'x86-64', label: { de: 'Nur x86-64', en: 'x86-64 only' }, effect: {}, neutral: true },
      { id: 'arm64', label: { de: 'ARM64 (aarch64)', en: 'ARM64 (aarch64)' }, effect: { require: ['arch-arm'] } },
      { id: 'i686', label: { de: '32-Bit x86 (i686)', en: '32-bit x86 (i686)' }, effect: { require: ['arch-32bit'], boostTags: { '32-bit': 8 } } },
      { id: 'exotic', label: { de: 'RISC-V, POWER oder s390x', en: 'RISC-V, POWER or s390x' }, effect: { boostDistros: { debian: 10, 'opensuse-tumbleweed': 6, gentoo: 6, alpine: 5, almalinux: 4 } } },
    ],
  },

  {
    id: 'package-philosophy',
    section: 'software',
    modes: ['expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Wie soll Software auf das System kommen?', en: 'How should software reach the system?' },
    options: [
      { id: 'binary-classic', label: { de: 'Klassische Binärpakete aus der Distribution', en: 'Classic binary packages from the distribution' }, effect: { ratings: { softwareAvailability: 2 }, require: ['not-atomic'] } },
      { id: 'containers-first', label: { de: 'Grundsystem schlank, alles andere in Containern und Flatpaks', en: 'A lean base system, everything else in containers and Flatpaks' }, effect: { require: ['flatpak'], boostTags: { atomic: 6, distrobox: 4 }, boostDistros: { 'fedora-silverblue': 8, bluefin: 8, aurora: 8, 'opensuse-aeon': 6 } } },
      { id: 'declarative', label: { de: 'Deklarativ: das System ergibt sich aus einer Konfigurationsdatei', en: 'Declaratively: the system follows from a configuration file' }, effect: { require: ['declarative'], boostDistros: { nixos: 20 }, ratings: { upgradeSmoothness: 2 } } },
      { id: 'source', label: { de: 'Aus dem Quellcode, mit eigenen Übersetzungsoptionen', en: 'From source, with my own compile options' }, effect: { require: ['source-based'], boostDistros: { gentoo: 20 }, ratings: { customizability: 3 } } },
    ],
  },

  {
    id: 'x11-requirement',
    section: 'hardware',
    modes: ['expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Brauchst du zwingend eine X11-Sitzung?', en: 'Do you strictly need an X11 session?' },
    description: { de: 'GNOME 50 hat X11 entfernt, Plasma folgt mit 6.8 im Oktober 2026.', en: 'GNOME 50 removed X11; Plasma follows with 6.8 in October 2026.' },
    help: {
      de: 'Gründe für X11 sind heute vor allem: alte NVIDIA-Treiber, bestimmte Fernwartungs- und Präsentationswerkzeuge, einzelne Bildschirmleser-Setups, globale Tastenkürzel für manche Aufnahmesoftware und ältere proprietäre Fachanwendungen.',
      en: 'Reasons for X11 today are mainly: old NVIDIA drivers, certain remote-support and presentation tools, some screen-reader setups, global hotkeys for some recording software, and older proprietary line-of-business applications.',
    },
    options: [
      { id: 'required', label: { de: 'Ja, X11 muss verfügbar sein', en: 'Yes, X11 must be available' }, effect: { require: ['x11-session'], flags: ['x11-sunset'] } },
      { id: 'wayland', label: { de: 'Nein, Wayland ist mir sogar lieber', en: 'No, I would rather have Wayland' }, effect: { require: ['wayland-default'] } },
      { id: 'nopref', label: { de: 'Keine Anforderung', en: 'No requirement' }, effect: {}, neutral: true },
    ],
  },

  {
    id: 'maintenance-budget',
    section: 'operations',
    modes: ['expert'],
    type: 'single',
    weight: 3,
    title: { de: 'Wie viel Zeit willst du dauerhaft pro Monat in das System stecken?', en: 'How much time per month do you want to spend on the system long-term?' },
    description: { de: 'Nicht: wie viel kannst du – sondern: wie viel willst du auf Dauer.', en: 'Not how much you could — how much you actually want to, month after month.' },
    options: [
      { id: 'zero', label: { de: 'Praktisch nichts', en: 'Practically nothing' }, effect: { require: ['low-maintenance'], ratings: { stability: 3, upgradeSmoothness: 2 } } },
      { id: 'little', label: { de: 'Eine halbe Stunde', en: 'Half an hour' }, effect: { prefer: ['low-maintenance'], ratings: { stability: 1 } } },
      { id: 'some', label: { de: 'Ein paar Stunden', en: 'A few hours' }, effect: { ratings: { customizability: 1 } } },
      { id: 'lots', label: { de: 'So viel wie nötig, das ist mein Hobby', en: 'As much as it takes, this is my hobby' }, effect: { ratings: { customizability: 3, freshness: 2, beginnerFriendly: -2 } } },
    ],
  },

  {
    id: 'licence-purity',
    section: 'philosophy',
    modes: ['expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Wie hältst du es mit unfreier Software und Firmware?', en: 'Where do you stand on non-free software and firmware?' },
    options: [
      { id: 'strict-free', label: { de: 'Ausschließlich freie Software, auch keine Firmware-Blobs', en: 'Exclusively free software, no firmware blobs either' }, effect: { require: ['free-software-only'], flags: ['free-software'] } },
      { id: 'prefer-free', label: { de: 'Freie Software bevorzugt, Firmware für Hardware ist in Ordnung', en: 'Free software preferred, hardware firmware is fine' }, effect: { ratings: { upstreamPurity: 1, privacy: 1 }, boostDistros: { debian: 5, 'fedora-workstation': 3 } } },
      { id: 'pragmatic', label: { de: 'Pragmatisch – Hauptsache die Hardware läuft', en: 'Pragmatic — what matters is that the hardware works' }, effect: { ratings: { hardwareSupport: 2 }, prefer: ['codecs-oob'] } },
    ],
  },

  {
    id: 'enterprise-needs',
    section: 'operations',
    modes: ['expert'],
    type: 'multiple',
    weight: 2,
    title: { de: 'Gibt es organisatorische Anforderungen?', en: 'Are there organisational requirements?' },
    options: [
      { id: 'certified', label: { de: 'Zertifizierte Plattform für Fremdsoftware (SAP, Oracle, RHEL-zertifiziert)', en: 'A certified platform for third-party software (SAP, Oracle, RHEL-certified)' }, effect: { require: ['enterprise-ready'], boostDistros: { almalinux: 8, 'rocky-linux': 8, 'centos-stream': 5, 'opensuse-leap': 6, ubuntu: 5 } } },
      { id: 'fleet', label: { de: 'Viele identische Rechner zentral verwalten', en: 'Managing many identical machines centrally' }, effect: { boostDistros: { 'fedora-silverblue': 6, bluefin: 6, nixos: 6, ubuntu: 5, almalinux: 4 } } },
      { id: 'eu-hosting', label: { de: 'Anbieter mit Sitz in der EU bevorzugt', en: 'A vendor based in the EU is preferred' }, effect: { boostDistros: { 'opensuse-leap': 8, 'opensuse-tumbleweed': 8, 'tuxedo-os': 8, 'proxmox-ve': 8, elementary: -2 } } },
      { id: 'none', label: { de: 'Nein', en: 'No' }, effect: {}, neutral: true },
    ],
  },

  {
    id: 'kernel-control',
    section: 'operations',
    modes: ['expert'],
    type: 'single',
    weight: 1,
    title: { de: 'Wie viel Kontrolle brauchst du über den Kernel?', en: 'How much control do you need over the kernel?' },
    options: [
      { id: 'stock', label: { de: 'Der Standardkernel der Distribution reicht', en: 'The distribution’s stock kernel is fine' }, effect: {}, neutral: true },
      { id: 'choice', label: { de: 'Ich will zwischen mehreren Kerneln wählen können', en: 'I want to choose between several kernels' }, effect: { boostDistros: { manjaro: 8, cachyos: 6, arch: 5, nixos: 4, 'opensuse-tumbleweed': 3 } } },
      { id: 'custom', label: { de: 'Ich baue eigene Kernel', en: 'I build my own kernels' }, effect: { boostDistros: { gentoo: 10, arch: 6, nixos: 6, void: 5, slackware: 5 }, ratings: { customizability: 2 } } },
      { id: 'realtime', label: { de: 'Ich brauche Echtzeit- oder Latenzoptimierung', en: 'I need real-time or latency tuning' }, effect: { boostDistros: { 'ubuntu-studio': 10, cachyos: 6, 'mx-linux': 3 }, ratings: { creativeWork: 2 } } },
    ],
  },

  {
    id: 'documentation-style',
    section: 'operations',
    modes: ['expert'],
    type: 'single',
    weight: 1,
    title: { de: 'Wovon hängt deine Fehlersuche ab?', en: 'What does your troubleshooting depend on?' },
    options: [
      { id: 'wiki', label: { de: 'Einem exzellenten Wiki', en: 'An excellent wiki' }, effect: { ratings: { documentation: 3 }, boostDistros: { arch: 8, gentoo: 6, debian: 4 } } },
      { id: 'forum', label: { de: 'Einem aktiven Forum mit Menschen', en: 'An active forum with actual people' }, effect: { ratings: { communitySize: 3, germanSupport: 1 } } },
      { id: 'vendor-docs', label: { de: 'Offizieller Herstellerdokumentation', en: 'Official vendor documentation' }, effect: { ratings: { documentation: 2, enterpriseReady: 2 } } },
      { id: 'source', label: { de: 'Dem Quellcode – ich lese notfalls selbst nach', en: 'The source code — I will read it myself if needed' }, effect: { ratings: { upstreamPurity: 2, customizability: 1 } } },
    ],
  },
];
