import type { Distro, L10n } from '../data/types';

/**
 * Benannte Prädikate über eine Distribution.
 *
 * Die Fragen im Fragenkatalog verweisen nur über ihre ID auf diese Prädikate.
 * Dadurch bleiben die Fragen reine Daten, und jede harte Anforderung lässt
 * sich einzeln testen und dem Nutzer als Begründung anzeigen.
 */
export interface Requirement {
  id: string;
  /** Wird als Ausschlussgrund angezeigt: „… unterstützt kein Secure Boot". */
  label: L10n;
  test: (d: Distro) => boolean;
}

function req(id: string, de: string, en: string, test: (d: Distro) => boolean): Requirement {
  return { id, label: { de, en }, test };
}

export const requirementList: Requirement[] = [
  // --- Hardware & Firmware ---
  req('secure-boot', 'unterstützt Secure Boot vollständig', 'fully supports Secure Boot', (d) => d.secureBoot === 'full'),
  req('secure-boot-any', 'unterstützt Secure Boot zumindest teilweise', 'supports Secure Boot at least partly', (d) => d.secureBoot !== 'none'),
  req('nvidia-easy', 'richtet den NVIDIA-Treiber ohne Terminal ein', 'sets up the NVIDIA driver without a terminal', (d) => ['preinstalled', 'installer-option', 'gui-tool'].includes(d.nvidia)),
  req('nvidia-any', 'unterstützt proprietäre NVIDIA-Treiber', 'supports the proprietary NVIDIA driver', (d) => d.nvidia !== 'unsupported'),
  req('ram-2gb', 'läuft mit 2 GB Arbeitsspeicher', 'runs with 2 GB of RAM', (d) => d.minRamGb <= 2),
  req('ram-4gb', 'läuft mit 4 GB Arbeitsspeicher', 'runs with 4 GB of RAM', (d) => d.minRamGb <= 4),
  req('ram-8gb', 'läuft mit 8 GB Arbeitsspeicher', 'runs with 8 GB of RAM', (d) => d.minRamGb <= 8),
  req('arch-32bit', 'bietet noch 32-Bit-Ausgaben', 'still offers 32-bit editions', (d) => d.supports32Bit),
  req('arch-arm', 'läuft auf ARM-Prozessoren', 'runs on ARM processors', (d) => d.architectures.includes('aarch64')),
  req('raspberry-pi', 'läuft auf dem Raspberry Pi', 'runs on the Raspberry Pi', (d) => d.runsOnRaspberryPi),

  // --- Grundcharakter ---
  req('has-desktop', 'ist ein Desktop-System', 'is a desktop system', (d) => d.availableDesktops.length > 0),
  req('no-systemd', 'verzichtet auf systemd', 'does without systemd', (d) => d.init !== 'systemd'),
  req('systemd', 'nutzt systemd', 'uses systemd', (d) => d.init === 'systemd'),
  req('glibc', 'nutzt die glibc', 'uses glibc', (d) => d.libc === 'glibc'),
  req('atomic', 'ist ein unveränderliches System', 'is an immutable system', (d) => d.atomic),
  req('not-atomic', 'ist ein klassisch beschreibbares System', 'is a conventional writable system', (d) => !d.atomic),
  req('rolling', 'ist rollend aktuell', 'is rolling-release', (d) => d.releaseModel === 'rolling' || d.releaseModel === 'semi-rolling'),
  req('fixed-release', 'hat feste Versionen', 'has fixed versions', (d) => d.releaseModel === 'lts' || d.releaseModel === 'fixed'),
  req('long-support', 'bietet mehrjährigen Support je Version', 'offers multi-year support per version', (d) => d.releaseModel === 'lts'),

  // --- Sicherheit & Wiederherstellung ---
  req('snapshots', 'legt Systemschnappschüsse zum Zurückrollen an', 'creates system snapshots for rollback', (d) => d.snapshotRollback || d.atomic),
  req('fde-installer', 'verschlüsselt die Systemplatte direkt im Installer', 'encrypts the system disk right in the installer', (d) => d.fullDiskEncryptionInInstaller),
  req('privacy-strict', 'ist besonders datenschutzfreundlich', 'is particularly privacy-friendly', (d) => d.ratings.privacy >= 9),

  // --- Software & Paketwelt ---
  req('flatpak', 'unterstützt Flatpak ab Werk', 'supports Flatpak out of the box', (d) => d.flatpakReady),
  req('no-snap', 'kommt ohne Snap', 'comes without snap', (d) => !d.snapReady),
  req('aur', 'hat Zugriff auf das AUR', 'has access to the AUR', (d) => d.aur),
  req('codecs-oob', 'bringt Mediencodecs ab Werk mit', 'ships media codecs out of the box', (d) => d.codecsOutOfBox),
  req('free-software-only', 'enthält ausschließlich freie Software', 'contains exclusively free software', (d) => d.tags.includes('freie-software')),
  req('declarative', 'beschreibt das gesamte System deklarativ in einer Konfiguration', 'describes the whole system declaratively in one configuration', (d) => d.tags.includes('deklarativ')),
  req('source-based', 'übersetzt Pakete aus dem Quellcode mit eigenen Optionen', 'compiles packages from source with your own options', (d) => d.tags.includes('quellcode')),

  // --- Anzeige ---
  req('x11-session', 'bietet noch eine X11-Sitzung', 'still offers an X11 session', (d) => d.x11SessionAvailable),
  req('wayland-default', 'nutzt Wayland als Standard', 'uses Wayland by default', (d) => d.waylandDefault),

  // --- Aufwand & Begleitung ---
  req('easy-install', 'lässt sich ohne Vorkenntnisse installieren', 'can be installed without prior knowledge', (d) => d.installDifficulty <= 3),
  req('gui-installer', 'hat einen grafischen Installer', 'has a graphical installer', (d) => d.installer.startsWith('graphical')),
  req('low-maintenance', 'braucht kaum laufende Pflege', 'needs barely any ongoing maintenance', (d) => d.maintenanceLoad === 'very-low' || d.maintenanceLoad === 'low'),
  req('beginner-safe', 'ist für Einsteiger geeignet', 'is suitable for beginners', (d) => d.ratings.beginnerFriendly >= 7),
  req('german-support', 'hat nennenswerte deutschsprachige Hilfe', 'has substantial German-language help', (d) => d.ratings.germanSupport >= 7),
  req('commercial-support', 'bietet bezahlbaren Herstellersupport', 'offers paid vendor support', (d) => d.commercialSupport),
  req('enterprise-ready', 'ist für den Unternehmenseinsatz ausgelegt', 'is built for enterprise use', (d) => d.ratings.enterpriseReady >= 7),
  req('gaming-ready', 'ist ab Werk spieletauglich', 'is ready for gaming out of the box', (d) => d.ratings.gaming >= 8),
  req('big-community', 'hat eine große Community', 'has a large community', (d) => d.ratings.communitySize >= 7),
];

export const requirements = new Map(requirementList.map((r) => [r.id, r]));

export function testRequirement(id: string, d: Distro): boolean {
  const r = requirements.get(id);
  if (!r) {
    // Eine unbekannte ID darf nie stillschweigend alles durchlassen.
    throw new Error(`Unbekannte Anforderung: ${id}`);
  }
  return r.test(d);
}
