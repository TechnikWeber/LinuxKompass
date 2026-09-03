/**
 * LinuxKompass – zentrale Typen / central type definitions.
 *
 * Alle nutzersichtbaren Texte sind zweisprachig (de/en) direkt am Datensatz
 * hinterlegt, damit Daten und Übersetzung nicht auseinanderlaufen können.
 */

/** Zweisprachiger Text. Both languages are mandatory – no silent fallbacks. */
export interface L10n {
  de: string;
  en: string;
}

export type Lang = keyof L10n;

/** Zweisprachige Liste. */
export interface L10nList {
  de: string[];
  en: string[];
}

// ---------------------------------------------------------------------------
// Enumerationen
// ---------------------------------------------------------------------------

export type ReleaseModel =
  | 'lts' // langer Support, feste Version (Ubuntu LTS, Debian stable, RHEL-Klone)
  | 'fixed' // feste Version, kürzerer Zyklus (Fedora, Mint-Punktrelease-Kette)
  | 'semi-rolling' // rollend mit Staging/Verzögerung (Manjaro, Slowroll)
  | 'rolling' // rollend (Arch, Tumbleweed, Void, Gentoo)
  | 'atomic'; // bildbasiert/unveränderlich (Silverblue, Bazzite, Aeon, NixOS-artig)

export type InitSystem = 'systemd' | 'openrc' | 'runit' | 'sysvinit' | 's6' | 'dinit' | 'bsd-style' | 'other';

export type PackageManager =
  | 'apt' | 'dnf' | 'rpm-ostree' | 'zypper' | 'transactional-update' | 'pacman'
  | 'xbps' | 'apk' | 'portage' | 'nix' | 'eopkg' | 'slackpkg' | 'pkgtool' | 'ostree';

export type PackageFormat = 'deb' | 'rpm' | 'pkg.tar.zst' | 'xbps' | 'apk' | 'ebuild' | 'nix' | 'eopkg' | 'txz';

export type Libc = 'glibc' | 'musl';

/** Wie kommt der proprietäre NVIDIA-Treiber auf das System? */
export type NvidiaHandling =
  | 'preinstalled' // ISO enthält den Treiber bereits
  | 'installer-option' // im Installer ankreuzbar
  | 'gui-tool' // grafisches Werkzeug nach der Installation
  | 'repo-manual' // Paket aus dem Repo, Terminal nötig
  | 'third-party-repo' // Fremdquelle einrichten (RPM Fusion o. ä.)
  | 'unsupported'; // nur Nouveau/NVK

export type SecureBoot = 'full' | 'partial' | 'none';

/** Grafische Installation, geführt, oder Handarbeit im Terminal? */
export type InstallerKind =
  | 'graphical-guided' // Calamares, Ubiquity/Subiquity-Desktop, Anaconda …
  | 'graphical-expert' // grafisch, aber mit vielen Pflichtentscheidungen
  | 'tui-guided' // textbasiert, aber geführt (archinstall, debian-installer)
  | 'manual'; // Dokumentation abarbeiten (Arch, Gentoo, LFS-artig)

export type Audience =
  | 'switcher' // Umsteiger von Windows/macOS
  | 'beginner'
  | 'intermediate'
  | 'power-user'
  | 'developer'
  | 'sysadmin'
  | 'gamer'
  | 'creative'
  | 'privacy'
  | 'oldhardware'
  | 'enterprise'
  | 'education'
  | 'tinkerer';

/** Projektträgerschaft – wichtig für Langlebigkeit und Interessenkonflikte. */
export type Governance =
  | 'community' // ehrenamtlich, keine Firma dahinter
  | 'foundation' // Stiftung/Verein
  | 'company-community' // Firma finanziert, Community entscheidet mit
  | 'company' // Firma steuert das Produkt
  | 'single-maintainer'; // steht und fällt mit wenigen Personen

/** Wie viel laufende Pflege erwartet die Distribution vom Menschen davor? */
export type MaintenanceLoad = 'very-low' | 'low' | 'medium' | 'high' | 'very-high';

export type Arch = 'x86_64' | 'x86_64-v3' | 'i686' | 'aarch64' | 'armhf' | 'riscv64' | 'ppc64le' | 's390x';

// ---------------------------------------------------------------------------
// Bewertungsdimensionen
// ---------------------------------------------------------------------------

/**
 * Alle Bewertungen 0–10. Sie sind bewusst *relativ* zueinander gemeint
 * ("im Vergleich zu anderen Desktop-Distributionen") und nicht absolut.
 */
export interface Ratings {
  /** Wie gut kommt jemand ohne Vorwissen zurecht? */
  beginnerFriendly: number;
  /** Wie selten bricht etwas nach Updates? */
  stability: number;
  /** Wie neu ist die ausgelieferte Software? */
  freshness: number;
  /** Wie weit lässt sich das System umbauen, ohne gegen es zu arbeiten? */
  customizability: number;
  /** Sparsamkeit auf schwacher Hardware. */
  lightweight: number;
  /** Spieletauglichkeit ab Werk (Treiber, Proton, Kernel, Werkzeuge). */
  gaming: number;
  /** Hardware-Erkennung inkl. WLAN, Drucker, Fingerabdruck, Grafik. */
  hardwareSupport: number;
  /** Größe und Aktivität der Community insgesamt. */
  communitySize: number;
  /** Deutschsprachige Hilfe: Forum, Wiki, Handbuch. */
  germanSupport: number;
  /** Qualität der offiziellen Dokumentation. */
  documentation: number;
  /** Eignung für Firmen: Support, Zertifizierungen, Lebenszyklus. */
  enterpriseReady: number;
  /** Datenschutz-Grundhaltung: Telemetrie, Voreinstellungen, Härtung. */
  privacy: number;
  /** Softwareangebot ohne Fremdquellen. */
  softwareAvailability: number;
  /** Wie reibungslos verläuft der Sprung auf die nächste Hauptversion? */
  upgradeSmoothness: number;
  /** Eignung für kreative Arbeit (Audio-Latenz, Farbmanagement, Codecs). */
  creativeWork: number;
  /** Nähe zum Upstream – wie wenig Eigenbau steckt drin? */
  upstreamPurity: number;
}

export type RatingKey = keyof Ratings;

// ---------------------------------------------------------------------------
// Distribution
// ---------------------------------------------------------------------------

export interface DistroSource {
  label: string;
  url: string;
}

export interface Distro {
  id: string;
  name: string;
  /** Kurzform für die Monogramm-Kachel, 1–3 Zeichen. */
  monogram: string;
  /** Markenfarbe als HSL-Tripel-String, z. B. "142 62% 38%". */
  accent: string;

  tagline: L10n;
  description: L10n;

  website: string;
  downloadUrl: string;
  docsUrl?: string;
  /** Deutschsprachige Anlaufstelle, falls vorhanden. */
  germanResourceUrl?: string;

  /** Herkunft/Basis. `null` = eigenständig entwickelt. */
  basedOn: string | null;
  family: 'debian' | 'ubuntu' | 'fedora' | 'rhel' | 'suse' | 'arch' | 'independent' | 'gentoo' | 'slackware' | 'nix';
  originCountry: string;
  firstRelease: number;
  governance: Governance;

  currentVersion: string;
  /** ISO-Datum der aktuellen Version. */
  currentVersionDate: string;
  /** Menschlicher Text: bis wann gepflegt? */
  supportUntil: L10n;
  releaseModel: ReleaseModel;
  releaseCadence: L10n;

  init: InitSystem;
  libc: Libc;
  packageManager: PackageManager;
  packageFormat: PackageFormat;
  /** Zusätzliche Paketquellen ab Werk. */
  flatpakReady: boolean;
  snapReady: boolean;
  appimageFriendly: boolean;
  aur: boolean;
  /** Halbamtliche Fremdquellen wie RPM Fusion, Packman, Chaotic-AUR. */
  extraRepos: L10nList;

  defaultDesktop: string;
  availableDesktops: string[];
  installer: InstallerKind;
  /** 1 (Stick anstecken, weiterklicken) bis 10 (Handbuch abarbeiten). */
  installDifficulty: number;

  minRamGb: number;
  recommendedRamGb: number;
  minStorageGb: number;
  architectures: Arch[];
  supports32Bit: boolean;
  runsOnRaspberryPi: boolean;

  secureBoot: SecureBoot;
  nvidia: NvidiaHandling;
  /** Mediencodecs (H.264/265, MP3 …) ohne Nacharbeit? */
  codecsOutOfBox: boolean;
  /** Verschlüsselung der Systemplatte im Installer anklickbar? */
  fullDiskEncryptionInInstaller: boolean;
  /** Automatische Systemschnappschüsse zum Zurückrollen. */
  snapshotRollback: boolean;
  /** Läuft das System unveränderlich/bildbasiert? */
  atomic: boolean;
  /** Wayland-Sitzung als Standard? */
  waylandDefault: boolean;
  /** X11-Sitzung überhaupt noch wählbar? */
  x11SessionAvailable: boolean;

  maintenanceLoad: MaintenanceLoad;
  /** Sendet das System ab Werk Nutzungsdaten? */
  telemetry: L10n;
  /** Bezahlbarer Herstellersupport verfügbar? */
  commercialSupport: boolean;

  audiences: Audience[];
  tags: string[];
  ratings: Ratings;

  highlights: L10nList;
  bestFor: L10nList;
  notFor: L10nList;
  warnings: L10nList;
  /** Erste Schritte direkt nach der Installation. */
  firstSteps: L10nList;

  /** ISO-Datum der letzten inhaltlichen Prüfung. */
  checkedAt: string;
  sources: DistroSource[];
}

// ---------------------------------------------------------------------------
// Desktopumgebungen
// ---------------------------------------------------------------------------

export interface DesktopEnvironment {
  id: string;
  name: string;
  accent: string;
  tagline: L10n;
  description: L10n;
  /** Woran erinnert die Bedienung am ehesten? */
  feelsLike: L10n;
  ramFootprintMb: number;
  customizability: number;
  beginnerFriendly: number;
  lightweight: number;
  touchFriendly: number;
  waylandStatus: L10n;
  /** Barrierefreiheit: Bildschirmleser, Kontrast, Skalierung. */
  accessibility: number;
  strengths: L10nList;
  tradeoffs: L10nList;
  website: string;
}
