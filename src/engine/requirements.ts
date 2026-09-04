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
  /**
   * Bejahender Satzteil hinter einem Subjekt: „Mint **unterstützt Secure Boot
   * vollständig**".
   */
  label: L10n;
  /**
   * Verneinter Satzteil an derselben Stelle. Steht hier als eigener Text und
   * nicht als vorangestelltes „nicht", weil die Verneinung im Deutschen ins
   * Satzinnere gehört: „richtet den NVIDIA-Treiber **nicht** ohne Terminal ein"
   * statt „nicht richtet den NVIDIA-Treiber ohne Terminal ein".
   */
  negated: L10n;
  /** Substantivische Kurzform für Aufzählungen und Etiketten. */
  short: L10n;
  test: (d: Distro) => boolean;
}

type Pair = [de: string, en: string];

function req(id: string, label: Pair, negated: Pair, short: Pair, test: (d: Distro) => boolean): Requirement {
  return {
    id,
    label: { de: label[0], en: label[1] },
    negated: { de: negated[0], en: negated[1] },
    short: { de: short[0], en: short[1] },
    test,
  };
}

export const requirementList: Requirement[] = [
  // --- Hardware & Firmware ---
  req(
    'secure-boot',
    ['unterstützt Secure Boot vollständig', 'fully supports Secure Boot'],
    ['unterstützt Secure Boot nicht vollständig', 'does not fully support Secure Boot'],
    ['Secure Boot vollständig unterstützt', 'Full Secure Boot support'],
    (d) => d.secureBoot === 'full',
  ),
  req(
    'secure-boot-any',
    ['unterstützt Secure Boot zumindest teilweise', 'supports Secure Boot at least partly'],
    ['unterstützt Secure Boot überhaupt nicht', 'does not support Secure Boot at all'],
    ['Secure Boot zumindest teilweise', 'Secure Boot at least partly'],
    (d) => d.secureBoot !== 'none',
  ),
  req(
    'nvidia-easy',
    ['richtet den NVIDIA-Treiber ohne Terminal ein', 'sets up the NVIDIA driver without a terminal'],
    ['richtet den NVIDIA-Treiber nicht ohne Terminal ein', 'does not set up the NVIDIA driver without a terminal'],
    ['NVIDIA-Treiber ohne Terminal', 'NVIDIA driver without a terminal'],
    (d) => ['preinstalled', 'installer-option', 'gui-tool'].includes(d.nvidia),
  ),
  req(
    'nvidia-any',
    ['unterstützt den proprietären NVIDIA-Treiber', 'supports the proprietary NVIDIA driver'],
    ['unterstützt den proprietären NVIDIA-Treiber nicht', 'does not support the proprietary NVIDIA driver'],
    ['Proprietärer NVIDIA-Treiber', 'Proprietary NVIDIA driver'],
    (d) => d.nvidia !== 'unsupported',
  ),
  req(
    'ram-2gb',
    ['läuft mit 2 GB Arbeitsspeicher', 'runs with 2 GB of RAM'],
    ['läuft nicht mit 2 GB Arbeitsspeicher', 'does not run with 2 GB of RAM'],
    ['Läuft mit 2 GB Arbeitsspeicher', 'Runs with 2 GB of RAM'],
    (d) => d.minRamGb <= 2,
  ),
  req(
    'ram-4gb',
    ['läuft mit 4 GB Arbeitsspeicher', 'runs with 4 GB of RAM'],
    ['läuft nicht mit 4 GB Arbeitsspeicher', 'does not run with 4 GB of RAM'],
    ['Läuft mit 4 GB Arbeitsspeicher', 'Runs with 4 GB of RAM'],
    (d) => d.minRamGb <= 4,
  ),
  req(
    'ram-8gb',
    ['läuft mit 8 GB Arbeitsspeicher', 'runs with 8 GB of RAM'],
    ['läuft nicht mit 8 GB Arbeitsspeicher', 'does not run with 8 GB of RAM'],
    ['Läuft mit 8 GB Arbeitsspeicher', 'Runs with 8 GB of RAM'],
    (d) => d.minRamGb <= 8,
  ),
  req(
    'arch-32bit',
    ['bietet noch 32-Bit-Ausgaben', 'still offers 32-bit editions'],
    ['bietet keine 32-Bit-Ausgaben mehr', 'no longer offers 32-bit editions'],
    ['32-Bit-Ausgabe', '32-bit edition'],
    (d) => d.supports32Bit,
  ),
  req(
    'arch-arm',
    ['läuft auf ARM-Prozessoren', 'runs on ARM processors'],
    ['läuft nicht auf ARM-Prozessoren', 'does not run on ARM processors'],
    ['Läuft auf ARM-Prozessoren', 'Runs on ARM processors'],
    (d) => d.architectures.includes('aarch64'),
  ),
  req(
    'raspberry-pi',
    ['läuft auf dem Raspberry Pi', 'runs on the Raspberry Pi'],
    ['läuft nicht auf dem Raspberry Pi', 'does not run on the Raspberry Pi'],
    ['Läuft auf dem Raspberry Pi', 'Runs on the Raspberry Pi'],
    (d) => d.runsOnRaspberryPi,
  ),

  // --- Grundcharakter ---
  req(
    'has-desktop',
    ['ist ein Desktop-System', 'is a desktop system'],
    ['ist kein Desktop-System', 'is not a desktop system'],
    ['Desktop-System', 'Desktop system'],
    (d) => d.availableDesktops.length > 0,
  ),
  req(
    'no-systemd',
    ['verzichtet auf systemd', 'does without systemd'],
    ['setzt systemd voraus', 'requires systemd'],
    ['Ohne systemd', 'Without systemd'],
    (d) => d.init !== 'systemd',
  ),
  req(
    'systemd',
    ['nutzt systemd', 'uses systemd'],
    ['nutzt kein systemd', 'does not use systemd'],
    ['Mit systemd', 'With systemd'],
    (d) => d.init === 'systemd',
  ),
  req(
    'glibc',
    ['nutzt die glibc', 'uses glibc'],
    ['nutzt nicht die glibc', 'does not use glibc'],
    ['glibc als C-Bibliothek', 'glibc as the C library'],
    (d) => d.libc === 'glibc',
  ),
  req(
    'atomic',
    ['ist ein unveränderliches System', 'is an immutable system'],
    ['ist kein unveränderliches System', 'is not an immutable system'],
    ['Unveränderliches System', 'Immutable system'],
    (d) => d.atomic,
  ),
  req(
    'not-atomic',
    ['ist ein klassisch beschreibbares System', 'is a conventional writable system'],
    ['ist kein klassisch beschreibbares System', 'is not a conventional writable system'],
    ['Klassisch beschreibbares System', 'Conventional writable system'],
    (d) => !d.atomic,
  ),
  req(
    'rolling',
    ['ist rollend aktuell', 'is rolling-release'],
    ['ist nicht rollend aktuell', 'is not rolling-release'],
    ['Rollend aktuell', 'Rolling release'],
    (d) => d.releaseModel === 'rolling' || d.releaseModel === 'semi-rolling',
  ),
  req(
    'fixed-release',
    ['hat feste Versionen', 'has fixed versions'],
    ['hat keine festen Versionen', 'does not have fixed versions'],
    ['Feste Versionen', 'Fixed versions'],
    (d) => d.releaseModel === 'lts' || d.releaseModel === 'fixed',
  ),
  req(
    'long-support',
    ['bietet mehrjährigen Support je Version', 'offers multi-year support per version'],
    ['bietet keinen mehrjährigen Support je Version', 'does not offer multi-year support per version'],
    ['Mehrjähriger Support je Version', 'Multi-year support per version'],
    (d) => d.releaseModel === 'lts',
  ),

  // --- Sicherheit & Wiederherstellung ---
  req(
    'snapshots',
    ['legt Systemschnappschüsse zum Zurückrollen an', 'creates system snapshots for rollback'],
    ['legt keine Systemschnappschüsse zum Zurückrollen an', 'does not create system snapshots for rollback'],
    ['Systemschnappschüsse zum Zurückrollen', 'System snapshots for rollback'],
    (d) => d.snapshotRollback || d.atomic,
  ),
  req(
    'fde-installer',
    ['verschlüsselt die Systemplatte direkt im Installer', 'encrypts the system disk right in the installer'],
    ['verschlüsselt die Systemplatte nicht schon im Installer', 'does not encrypt the system disk in the installer'],
    ['Verschlüsselung im Installer', 'Encryption in the installer'],
    (d) => d.fullDiskEncryptionInInstaller,
  ),
  req(
    'privacy-strict',
    ['ist besonders datenschutzfreundlich', 'is particularly privacy-friendly'],
    ['ist nicht besonders datenschutzfreundlich', 'is not particularly privacy-friendly'],
    ['Besonders datenschutzfreundlich', 'Particularly privacy-friendly'],
    (d) => d.ratings.privacy >= 9,
  ),

  // --- Software & Paketwelt ---
  req(
    'flatpak',
    ['unterstützt Flatpak ab Werk', 'supports Flatpak out of the box'],
    ['unterstützt Flatpak nicht ab Werk', 'does not support Flatpak out of the box'],
    ['Flatpak ab Werk', 'Flatpak out of the box'],
    (d) => d.flatpakReady,
  ),
  req(
    'no-snap',
    ['kommt ohne Snap', 'comes without snap'],
    ['setzt auf Snap', 'relies on snap'],
    ['Ohne Snap', 'Without snap'],
    (d) => !d.snapReady,
  ),
  req(
    'aur',
    ['hat Zugriff auf das AUR', 'has access to the AUR'],
    ['hat keinen Zugriff auf das AUR', 'does not have access to the AUR'],
    ['Zugriff auf das AUR', 'Access to the AUR'],
    (d) => d.aur,
  ),
  req(
    'codecs-oob',
    ['bringt Mediencodecs ab Werk mit', 'ships media codecs out of the box'],
    ['bringt keine Mediencodecs ab Werk mit', 'does not ship media codecs out of the box'],
    ['Mediencodecs ab Werk', 'Media codecs out of the box'],
    (d) => d.codecsOutOfBox,
  ),
  req(
    'free-software-only',
    ['enthält ausschließlich freie Software', 'contains exclusively free software'],
    ['enthält nicht ausschließlich freie Software', 'does not contain exclusively free software'],
    ['Ausschließlich freie Software', 'Exclusively free software'],
    (d) => d.tags.includes('freie-software'),
  ),
  req(
    'declarative',
    ['beschreibt das gesamte System deklarativ in einer Konfiguration', 'describes the whole system declaratively in one configuration'],
    ['beschreibt das System nicht deklarativ in einer Konfiguration', 'does not describe the system declaratively in one configuration'],
    ['Deklarative Systemkonfiguration', 'Declarative system configuration'],
    (d) => d.tags.includes('deklarativ'),
  ),
  req(
    'source-based',
    ['übersetzt Pakete aus dem Quellcode mit eigenen Optionen', 'compiles packages from source with your own options'],
    ['übersetzt Pakete nicht aus dem Quellcode mit eigenen Optionen', 'does not compile packages from source with your own options'],
    ['Pakete aus dem Quellcode', 'Packages built from source'],
    (d) => d.tags.includes('quellcode'),
  ),

  // --- Anzeige ---
  req(
    'x11-session',
    ['bietet noch eine X11-Sitzung', 'still offers an X11 session'],
    ['bietet keine X11-Sitzung mehr', 'no longer offers an X11 session'],
    ['X11-Sitzung verfügbar', 'X11 session available'],
    (d) => d.x11SessionAvailable,
  ),
  req(
    'wayland-default',
    ['nutzt Wayland als Standard', 'uses Wayland by default'],
    ['nutzt Wayland nicht als Standard', 'does not use Wayland by default'],
    ['Wayland als Standard', 'Wayland by default'],
    (d) => d.waylandDefault,
  ),

  // --- Aufwand & Begleitung ---
  req(
    'easy-install',
    ['lässt sich ohne Vorkenntnisse installieren', 'can be installed without prior knowledge'],
    ['lässt sich nicht ohne Vorkenntnisse installieren', 'cannot be installed without prior knowledge'],
    ['Installation ohne Vorkenntnisse', 'Installation without prior knowledge'],
    (d) => d.installDifficulty <= 3,
  ),
  req(
    'gui-installer',
    ['hat einen grafischen Installer', 'has a graphical installer'],
    ['hat keinen grafischen Installer', 'does not have a graphical installer'],
    ['Grafischer Installer', 'Graphical installer'],
    (d) => d.installer.startsWith('graphical'),
  ),
  req(
    'low-maintenance',
    ['braucht kaum laufende Pflege', 'needs barely any ongoing maintenance'],
    ['braucht regelmäßige Pflege', 'needs regular ongoing maintenance'],
    ['Kaum laufende Pflege', 'Barely any ongoing maintenance'],
    (d) => d.maintenanceLoad === 'very-low' || d.maintenanceLoad === 'low',
  ),
  req(
    'beginner-safe',
    ['ist für Einsteiger geeignet', 'is suitable for beginners'],
    ['ist für Einsteiger nicht geeignet', 'is not suitable for beginners'],
    ['Für Einsteiger geeignet', 'Suitable for beginners'],
    (d) => d.ratings.beginnerFriendly >= 7,
  ),
  req(
    'german-support',
    ['hat nennenswerte deutschsprachige Hilfe', 'has substantial German-language help'],
    ['hat kaum deutschsprachige Hilfe', 'has hardly any German-language help'],
    ['Deutschsprachige Hilfe', 'German-language help'],
    (d) => d.ratings.germanSupport >= 7,
  ),
  req(
    'commercial-support',
    ['bietet bezahlten Herstellersupport', 'offers paid vendor support'],
    ['bietet keinen bezahlten Herstellersupport', 'does not offer paid vendor support'],
    ['Bezahlter Herstellersupport', 'Paid vendor support'],
    (d) => d.commercialSupport,
  ),
  req(
    'enterprise-ready',
    ['ist für den Unternehmenseinsatz ausgelegt', 'is built for enterprise use'],
    ['ist nicht für den Unternehmenseinsatz ausgelegt', 'is not built for enterprise use'],
    ['Für den Unternehmenseinsatz ausgelegt', 'Built for enterprise use'],
    (d) => d.ratings.enterpriseReady >= 7,
  ),
  req(
    'gaming-ready',
    ['ist ab Werk spieletauglich', 'is ready for gaming out of the box'],
    ['ist ab Werk nicht spieletauglich', 'is not ready for gaming out of the box'],
    ['Ab Werk spieletauglich', 'Ready for gaming out of the box'],
    (d) => d.ratings.gaming >= 8,
  ),
  req(
    'big-community',
    ['hat eine große Community', 'has a large community'],
    ['hat keine große Community', 'does not have a large community'],
    ['Große Community', 'Large community'],
    (d) => d.ratings.communitySize >= 7,
  ),
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
