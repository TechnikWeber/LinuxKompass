import type {
  Arch, Audience, Governance, InitSystem, InstallerKind, L10n, Libc, MaintenanceLoad,
  NvidiaHandling, PackageFormat, PackageManager, RatingKey, ReleaseModel, SecureBoot,
} from '../data/types';

type Labels<T extends string> = Record<T, L10n>;

/** Kurzbezeichnung jeder Bewertungsdimension. */
export const ratingLabels: Labels<RatingKey> = {
  beginnerFriendly: { de: 'Einsteigerfreundlichkeit', en: 'Beginner friendliness' },
  stability: { de: 'Stabilität', en: 'Stability' },
  freshness: { de: 'Aktualität der Software', en: 'Software freshness' },
  customizability: { de: 'Anpassbarkeit', en: 'Configurability' },
  lightweight: { de: 'Sparsamkeit', en: 'Frugality' },
  gaming: { de: 'Spieletauglichkeit', en: 'Gaming readiness' },
  hardwareSupport: { de: 'Hardware-Unterstützung', en: 'Hardware support' },
  communitySize: { de: 'Größe der Community', en: 'Community size' },
  germanSupport: { de: 'Deutschsprachige Hilfe', en: 'German-language help' },
  documentation: { de: 'Dokumentation', en: 'Documentation' },
  enterpriseReady: { de: 'Unternehmenstauglichkeit', en: 'Enterprise readiness' },
  privacy: { de: 'Datenschutz', en: 'Privacy' },
  softwareAvailability: { de: 'Softwareangebot', en: 'Software availability' },
  upgradeSmoothness: { de: 'Reibungslose Versionswechsel', en: 'Smooth upgrades' },
  creativeWork: { de: 'Kreativarbeit', en: 'Creative work' },
  upstreamPurity: { de: 'Nähe zum Upstream', en: 'Upstream purity' },
};

/** Erklärung, was die Dimension konkret misst. */
export const ratingHelp: Labels<RatingKey> = {
  beginnerFriendly: { de: 'Wie gut kommt jemand ohne Vorwissen zurecht?', en: 'How well does someone without prior knowledge cope?' },
  stability: { de: 'Wie selten geht nach Updates etwas kaputt?', en: 'How rarely does something break after updates?' },
  freshness: { de: 'Wie neu ist die ausgelieferte Software?', en: 'How new is the software as shipped?' },
  customizability: { de: 'Wie weit lässt sich das System umbauen, ohne gegen es zu arbeiten?', en: 'How far can the system be rebuilt without fighting it?' },
  lightweight: { de: 'Wie gut läuft es auf schwacher Hardware?', en: 'How well does it run on weak hardware?' },
  gaming: { de: 'Treiber, Proton, Kernel und Werkzeuge ab Werk.', en: 'Drivers, Proton, kernel and tooling out of the box.' },
  hardwareSupport: { de: 'WLAN, Drucker, Grafik, Fingerabdruck – läuft es ohne Nacharbeit?', en: 'Wi-Fi, printers, graphics, fingerprint — does it work without extra effort?' },
  communitySize: { de: 'Wie viele Menschen können bei einem Problem helfen?', en: 'How many people can help when something goes wrong?' },
  germanSupport: { de: 'Forum, Wiki und Handbuch auf Deutsch.', en: 'Forum, wiki and manual in German.' },
  documentation: { de: 'Qualität der offiziellen Dokumentation.', en: 'Quality of the official documentation.' },
  enterpriseReady: { de: 'Support, Zertifizierungen, planbarer Lebenszyklus.', en: 'Support, certifications, a predictable lifecycle.' },
  privacy: { de: 'Telemetrie, Voreinstellungen, Härtung.', en: 'Telemetry, defaults, hardening.' },
  softwareAvailability: { de: 'Wie viel gibt es ohne Fremdquellen?', en: 'How much is available without third-party sources?' },
  upgradeSmoothness: { de: 'Wie reibungslos verläuft der Sprung auf die nächste Hauptversion?', en: 'How smoothly does the jump to the next major version go?' },
  creativeWork: { de: 'Audio-Latenz, Farbmanagement, Codecs, Grafiktabletts.', en: 'Audio latency, colour management, codecs, graphics tablets.' },
  upstreamPurity: { de: 'Wie wenig Eigenbau steckt zwischen dir und der Originalsoftware?', en: 'How little distribution-specific engineering sits between you and upstream?' },
};

export const releaseModelLabels: Labels<ReleaseModel> = {
  lts: { de: 'Feste Version mit langem Support', en: 'Fixed release, long-term support' },
  fixed: { de: 'Feste Version, kurzer Zyklus', en: 'Fixed release, short cycle' },
  'semi-rolling': { de: 'Halbrollend', en: 'Semi-rolling' },
  rolling: { de: 'Rollend', en: 'Rolling' },
  atomic: { de: 'Bildbasiert und unveränderlich', en: 'Image-based and immutable' },
};

export const initLabels: Labels<InitSystem> = {
  systemd: { de: 'systemd', en: 'systemd' },
  openrc: { de: 'OpenRC', en: 'OpenRC' },
  runit: { de: 'runit', en: 'runit' },
  sysvinit: { de: 'sysVinit', en: 'sysVinit' },
  s6: { de: 's6', en: 's6' },
  dinit: { de: 'dinit', en: 'dinit' },
  'bsd-style': { de: 'BSD-artige Init-Skripte', en: 'BSD-style init scripts' },
  other: { de: 'anderes', en: 'other' },
};

export const packageManagerLabels: Labels<PackageManager> = {
  apt: { de: 'apt', en: 'apt' },
  dnf: { de: 'dnf', en: 'dnf' },
  'rpm-ostree': { de: 'rpm-ostree', en: 'rpm-ostree' },
  zypper: { de: 'zypper', en: 'zypper' },
  'transactional-update': { de: 'transactional-update', en: 'transactional-update' },
  pacman: { de: 'pacman', en: 'pacman' },
  xbps: { de: 'xbps', en: 'xbps' },
  apk: { de: 'apk', en: 'apk' },
  portage: { de: 'Portage', en: 'Portage' },
  nix: { de: 'Nix', en: 'Nix' },
  eopkg: { de: 'eopkg', en: 'eopkg' },
  slackpkg: { de: 'slackpkg', en: 'slackpkg' },
  pkgtool: { de: 'pkgtool', en: 'pkgtool' },
  ostree: { de: 'OSTree', en: 'OSTree' },
};

export const packageFormatLabels: Labels<PackageFormat> = {
  deb: { de: '.deb', en: '.deb' },
  rpm: { de: '.rpm', en: '.rpm' },
  'pkg.tar.zst': { de: '.pkg.tar.zst', en: '.pkg.tar.zst' },
  xbps: { de: '.xbps', en: '.xbps' },
  apk: { de: '.apk', en: '.apk' },
  ebuild: { de: 'ebuild (Quellcode)', en: 'ebuild (source)' },
  nix: { de: 'Nix-Ableitung', en: 'Nix derivation' },
  eopkg: { de: '.eopkg', en: '.eopkg' },
  txz: { de: '.txz', en: '.txz' },
};

export const nvidiaLabels: Labels<NvidiaHandling> = {
  preinstalled: { de: 'auf der ISO vorinstalliert', en: 'preinstalled on the ISO' },
  'installer-option': { de: 'im Installer ankreuzbar', en: 'a checkbox in the installer' },
  'gui-tool': { de: 'über ein grafisches Werkzeug', en: 'via a graphical tool' },
  'repo-manual': { de: 'Paket aus dem Repository, Terminal nötig', en: 'a repository package, terminal required' },
  'third-party-repo': { de: 'Fremdquelle einrichten (z. B. RPM Fusion)', en: 'requires a third-party repo (e.g. RPM Fusion)' },
  unsupported: { de: 'nicht unterstützt', en: 'not supported' },
};

export const secureBootLabels: Labels<SecureBoot> = {
  full: { de: 'vollständig', en: 'full' },
  partial: { de: 'teilweise', en: 'partial' },
  none: { de: 'nicht unterstützt', en: 'not supported' },
};

export const installerLabels: Labels<InstallerKind> = {
  'graphical-guided': { de: 'grafisch, geführt', en: 'graphical, guided' },
  'graphical-expert': { de: 'grafisch, mit vielen Entscheidungen', en: 'graphical, many decisions' },
  'tui-guided': { de: 'textbasiert, geführt', en: 'text-based, guided' },
  manual: { de: 'Handarbeit nach Handbuch', en: 'manual, following the handbook' },
};

export const audienceLabels: Labels<Audience> = {
  switcher: { de: 'Umsteiger von Windows/macOS', en: 'Windows/macOS switchers' },
  beginner: { de: 'Einsteiger', en: 'Beginners' },
  intermediate: { de: 'Fortgeschrittene', en: 'Intermediate users' },
  'power-user': { de: 'Erfahrene Nutzer', en: 'Power users' },
  developer: { de: 'Entwicklung', en: 'Developers' },
  sysadmin: { de: 'Systemadministration', en: 'System administrators' },
  gamer: { de: 'Spielerinnen und Spieler', en: 'Gamers' },
  creative: { de: 'Kreativarbeit', en: 'Creative professionals' },
  privacy: { de: 'Datenschutz', en: 'Privacy-focused users' },
  oldhardware: { de: 'Alte Hardware', en: 'Old hardware' },
  enterprise: { de: 'Unternehmen', en: 'Enterprises' },
  education: { de: 'Bildung', en: 'Education' },
  tinkerer: { de: 'Bastler', en: 'Tinkerers' },
};

export const governanceLabels: Labels<Governance> = {
  community: { de: 'Community, keine Firma', en: 'Community, no company' },
  foundation: { de: 'Stiftung oder Verein', en: 'Foundation or association' },
  'company-community': { de: 'Firma und Community gemeinsam', en: 'Company and community together' },
  company: { de: 'Firma', en: 'Company' },
  'single-maintainer': { de: 'Wenige Einzelpersonen', en: 'A few individuals' },
};

export const maintenanceLabels: Labels<MaintenanceLoad> = {
  'very-low': { de: 'sehr gering', en: 'very low' },
  low: { de: 'gering', en: 'low' },
  medium: { de: 'mittel', en: 'medium' },
  high: { de: 'hoch', en: 'high' },
  'very-high': { de: 'sehr hoch', en: 'very high' },
};

export const libcLabels: Labels<Libc> = {
  glibc: { de: 'glibc', en: 'glibc' },
  musl: { de: 'musl', en: 'musl' },
};

export const archLabels: Labels<Arch> = {
  x86_64: { de: 'x86-64', en: 'x86-64' },
  'x86_64-v3': { de: 'x86-64-v3 (optimiert)', en: 'x86-64-v3 (optimised)' },
  i686: { de: '32-Bit x86', en: '32-bit x86' },
  aarch64: { de: 'ARM64', en: 'ARM64' },
  armhf: { de: 'ARM 32-Bit', en: 'ARM 32-bit' },
  riscv64: { de: 'RISC-V', en: 'RISC-V' },
  ppc64le: { de: 'POWER', en: 'POWER' },
  s390x: { de: 'IBM Z', en: 'IBM Z' },
};

export const familyLabels: Record<string, L10n> = {
  debian: { de: 'Debian', en: 'Debian' },
  ubuntu: { de: 'Ubuntu', en: 'Ubuntu' },
  fedora: { de: 'Fedora', en: 'Fedora' },
  rhel: { de: 'Red Hat Enterprise', en: 'Red Hat Enterprise' },
  suse: { de: 'SUSE', en: 'SUSE' },
  arch: { de: 'Arch', en: 'Arch' },
  gentoo: { de: 'Gentoo', en: 'Gentoo' },
  slackware: { de: 'Slackware', en: 'Slackware' },
  nix: { de: 'Nix', en: 'Nix' },
  independent: { de: 'Eigenständig', en: 'Independent' },
};

export const sectionLabels: Record<string, L10n> = {
  usage: { de: 'Nutzung', en: 'Usage' },
  hardware: { de: 'Hardware', en: 'Hardware' },
  habits: { de: 'Gewohnheiten', en: 'Habits' },
  operations: { de: 'Betrieb', en: 'Operations' },
  software: { de: 'Software', en: 'Software' },
  philosophy: { de: 'Grundhaltung', en: 'Philosophy' },
};

// ---------------------------------------------------------------------------
// Desktop-Empfehlung
// ---------------------------------------------------------------------------

/** Begründungen, eingesetzt in „… passt X, weil {Grund} und {Grund}." */
export const desktopReasonLabels: Record<string, L10n> = {
  'explicit-choice': { de: 'du ihn ausdrücklich gewählt hast', en: 'you picked it explicitly' },
  'windows-like': { de: 'er dem Bedienkonzept von Windows am nächsten kommt', en: 'it comes closest to the way Windows works' },
  'macos-like': { de: 'er sich ähnlich wie macOS bedienen lässt', en: 'it is operated much like macOS' },
  calm: { de: 'er aufgeräumt und ablenkungsarm ist', en: 'it is tidy and distraction-free' },
  configurable: { de: 'sich daran fast alles einstellen lässt', en: 'almost everything about it can be configured' },
  beginner: { de: 'er ohne Vorwissen sofort bedienbar ist', en: 'it is usable straight away without prior knowledge' },
  lightweight: { de: 'er mit dem Arbeitsspeicher deines Rechners gut zurechtkommt', en: 'it copes well with your machine’s memory' },
  touch: { de: 'er sich per Touch und Gesten gut bedienen lässt', en: 'it works well with touch and gestures' },
  accessibility: { de: 'er die beste Unterstützung für Bildschirmleser mitbringt', en: 'it has the best screen-reader support' },
  'hdr-multimonitor': { de: 'er HDR und gemischte Bildschirmauflösungen am besten beherrscht', en: 'it handles HDR and mixed display resolutions best' },
  'x11-needed': { de: 'er weiterhin eine X11-Sitzung anbietet', en: 'it still offers an X11 session' },
  tiling: { de: 'er Fenster automatisch anordnet', en: 'it arranges windows automatically' },
};

/** Einschränkungen, die zur Empfehlung dazugehören. */
export const desktopConcernLabels: Record<string, L10n> = {
  'x11-ending': {
    de: 'Die X11-Sitzung entfällt mit Plasma 6.8 im Oktober 2026.',
    en: 'The X11 session disappears with Plasma 6.8 in October 2026.',
  },
  'no-x11': {
    de: 'Bietet keine X11-Sitzung mehr – deine Grafikkarte braucht aber eine.',
    en: 'No longer offers an X11 session — but your graphics card needs one.',
  },
  heavy: {
    de: 'Braucht vergleichsweise viel Arbeitsspeicher.',
    en: 'Uses comparatively much memory.',
  },
  steep: {
    de: 'Muss erst eingerichtet und gelernt werden.',
    en: 'Has to be set up and learned first.',
  },
  'weak-accessibility': {
    de: 'Schwache Unterstützung für Bildschirmleser und Vergrößerung.',
    en: 'Weak support for screen readers and magnification.',
  },
};
