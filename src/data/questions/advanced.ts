import type { Question } from './types';

/** Zusätzliche Fragen ab dem Fortgeschrittenen-Modus. */
export const advancedQuestions: Question[] = [
  {
    id: 'device-type',
    section: 'hardware',
    modes: ['advanced', 'expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Um was für ein Gerät geht es?', en: 'What kind of device is this?' },
    options: [
      { id: 'laptop', label: { de: 'Notebook', en: 'Laptop' }, hint: { de: 'Akkulaufzeit, Standby und WLAN sind hier entscheidend.', en: 'Battery life, suspend and Wi-Fi matter most here.' }, effect: { ratings: { hardwareSupport: 2 }, boostTags: { notebook: 4 } } },
      { id: 'desktop', label: { de: 'Desktop-PC', en: 'Desktop PC' }, effect: { ratings: { customizability: 1 } } },
      { id: 'handheld', label: { de: 'Handheld oder Wohnzimmer-Gerät', en: 'Handheld or living-room device' }, effect: { boostTags: { handheld: 10, gaming: 6 }, boostDistros: { bazzite: 12, steamos: 10 } } },
      { id: 'sbc', label: { de: 'Einplatinenrechner (Raspberry Pi o. ä.)', en: 'Single-board computer (Raspberry Pi or similar)' }, effect: { require: ['raspberry-pi'], boostDistros: { 'raspberry-pi-os': 12 } } },
      { id: 'vm', label: { de: 'Virtuelle Maschine zum Ausprobieren', en: 'A virtual machine for testing' }, effect: { ratings: { hardwareSupport: -1 }, avoid: ['nvidia-easy'] } },
    ],
  },

  {
    id: 'desktop-preference',
    section: 'habits',
    modes: ['advanced', 'expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Hast du eine bevorzugte Desktop-Umgebung?', en: 'Do you have a preferred desktop environment?' },
    description: { de: 'Die meisten Distributionen bieten mehrere an – der Standard sagt aber viel über die Ausrichtung.', en: 'Most distributions offer several — but the default says a lot about their focus.' },
    options: [
      { id: 'gnome', label: { de: 'GNOME', en: 'GNOME' }, effect: { boostTags: { gnome: 8 } } },
      { id: 'plasma', label: { de: 'KDE Plasma', en: 'KDE Plasma' }, effect: { boostTags: { plasma: 8 } } },
      { id: 'xfce', label: { de: 'Xfce', en: 'Xfce' }, effect: { boostTags: { xfce: 8 } } },
      { id: 'cinnamon', label: { de: 'Cinnamon', en: 'Cinnamon' }, effect: { boostTags: { cinnamon: 8 } } },
      { id: 'tiling', label: { de: 'Kachelnder Fenstermanager (Sway, Hyprland, i3)', en: 'A tiling window manager (Sway, Hyprland, i3)' }, effect: { ratings: { customizability: 3, lightweight: 2, beginnerFriendly: -2 }, boostDistros: { arch: 8, nixos: 6, endeavouros: 6, void: 5 } } },
      { id: 'any', label: { de: 'Keine Vorliebe', en: 'No preference' }, effect: {}, neutral: true },
    ],
  },

  {
    id: 'display-setup',
    section: 'hardware',
    modes: ['advanced', 'expert'],
    type: 'multiple',
    weight: 2,
    title: { de: 'Trifft etwas davon auf deine Bildschirme zu?', en: 'Does any of this apply to your displays?' },
    options: [
      { id: 'hidpi', label: { de: 'Hochauflösender Bildschirm (4K, Retina)', en: 'High-resolution display (4K, Retina)' }, effect: { boostTags: { plasma: 4, gnome: 4, wayland: 3 }, prefer: ['wayland-default'] } },
      { id: 'mixed', label: { de: 'Mehrere Bildschirme mit unterschiedlicher Auflösung', en: 'Several monitors with different resolutions' }, effect: { boostTags: { plasma: 6, wayland: 4 }, prefer: ['wayland-default'] } },
      { id: 'hdr', label: { de: 'HDR-Monitor', en: 'HDR monitor' }, effect: { boostTags: { hdr: 8, plasma: 5 }, prefer: ['wayland-default'] } },
      { id: 'vrr', label: { de: 'Variable Bildwiederholrate (FreeSync, G-Sync)', en: 'Variable refresh rate (FreeSync, G-Sync)' }, effect: { boostTags: { vrr: 6, gaming: 3 } } },
      { id: 'touch', label: { de: 'Touchscreen oder Convertible', en: 'Touchscreen or convertible' }, effect: { boostTags: { gnome: 6 }, prefer: ['wayland-default'] } },
      { id: 'none', label: { de: 'Nichts davon', en: 'None of these' }, effect: {}, neutral: true },
    ],
  },

  {
    id: 'secure-boot',
    section: 'hardware',
    modes: ['advanced', 'expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Muss Secure Boot eingeschaltet bleiben?', en: 'Does Secure Boot have to stay enabled?' },
    description: { de: 'In Firmen ist das oft vorgeschrieben; privat kann man es meist im UEFI abschalten.', en: 'Companies often mandate it; privately you can usually switch it off in the UEFI.' },
    help: {
      de: 'Secure Boot prüft beim Start, ob das Betriebssystem signiert ist. Große Distributionen haben eine von Microsoft signierte Startkomponente und funktionieren problemlos. Kleinere Projekte, eigene Kernel und Distributionen ohne signierten Bootloader erfordern entweder das Abschalten von Secure Boot oder das Eintragen eigener Schlüssel.',
      en: 'Secure Boot checks at start-up whether the operating system is signed. Large distributions carry a Microsoft-signed boot component and work without trouble. Smaller projects, custom kernels and distributions without a signed bootloader require either disabling Secure Boot or enrolling your own keys.',
    },
    options: [
      { id: 'required', label: { de: 'Ja, es muss aktiv bleiben', en: 'Yes, it must stay enabled' }, effect: { require: ['secure-boot'] } },
      { id: 'preferred', label: { de: 'Wäre mir lieber, ist aber kein Muss', en: 'I would prefer it, but it is not mandatory' }, effect: { prefer: ['secure-boot-any'] } },
      { id: 'no', label: { de: 'Nein, ich kann es abschalten', en: 'No, I can turn it off' }, effect: {} },
      { id: 'unknown', label: { de: 'Weiß ich nicht', en: 'I do not know' }, effect: { prefer: ['secure-boot-any'] }, neutral: true },
    ],
  },

  {
    id: 'support-duration',
    section: 'operations',
    modes: ['advanced', 'expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Wie lange soll die Installation halten, ohne dass ein großer Sprung ansteht?', en: 'How long should the installation last before a big jump is due?' },
    options: [
      { id: 'max', label: { de: 'So lange wie möglich – zehn Jahre wären ideal', en: 'As long as possible — ten years would be ideal' }, effect: { ratings: { stability: 3, enterpriseReady: 2, freshness: -2 }, require: ['long-support'], boostTags: { 'zehn-jahre': 8, langzeitsupport: 6 } } },
      { id: 'years', label: { de: 'Drei bis fünf Jahre', en: 'Three to five years' }, effect: { ratings: { stability: 2 }, require: ['long-support'] } },
      { id: 'annual', label: { de: 'Ein bis zwei Jahre sind in Ordnung', en: 'One to two years is fine' }, effect: { ratings: { freshness: 1 } } },
      { id: 'norelease', label: { de: 'Am liebsten gar keine Versionssprünge (rollend)', en: 'Ideally no version jumps at all (rolling)' }, effect: { require: ['rolling'], ratings: { freshness: 2 } } },
    ],
  },

  {
    id: 'package-sources',
    section: 'software',
    modes: ['advanced', 'expert'],
    type: 'multiple',
    weight: 2,
    title: { de: 'Wie möchtest du Software installieren?', en: 'How do you want to install software?' },
    help: {
      de: 'Flatpak ist ein distributionsunabhängiges Paketformat mit Sandbox; Flathub ist der zugehörige Laden. Snap ist Canonicals Gegenstück und startet beim ersten Mal langsamer. AppImage sind Einzeldateien, die man einfach ausführt. Das AUR ist Arch Linux’ Sammlung von Bauanleitungen aus der Community – riesig, aber ungeprüft.',
      en: 'Flatpak is a distribution-agnostic sandboxed package format; Flathub is its store. Snap is Canonical’s counterpart and starts more slowly the first time. AppImages are single files you simply run. The AUR is Arch Linux’s collection of community build recipes — enormous, but unreviewed.',
    },
    options: [
      { id: 'flatpak', label: { de: 'Flatpak/Flathub soll ab Werk bereitstehen', en: 'Flatpak/Flathub should be available out of the box' }, effect: { require: ['flatpak'], boostTags: { flatpak: 4 } } },
      { id: 'no-snap', label: { de: 'Snap-Pakete möchte ich vermeiden', en: 'I want to avoid snap packages' }, effect: { require: ['no-snap'], boostTags: { 'kein-snap': 8 } } },
      { id: 'aur', label: { de: 'Ich will Zugriff auf das AUR', en: 'I want access to the AUR' }, effect: { require: ['aur'], boostTags: { aur: 6 } } },
      { id: 'huge-repo', label: { de: 'Möglichst viel soll aus den offiziellen Quellen kommen', en: 'As much as possible should come from official repositories' }, effect: { ratings: { softwareAvailability: 3 } } },
      { id: 'nopref', label: { de: 'Keine Vorlieben', en: 'No preference' }, effect: {}, neutral: true },
    ],
  },

  {
    id: 'workload-extra',
    section: 'usage',
    modes: ['advanced', 'expert'],
    type: 'multiple',
    weight: 2,
    title: { de: 'Brauchst du eines dieser Werkzeuge regelmäßig?', en: 'Do you regularly need any of these?' },
    options: [
      { id: 'containers', label: { de: 'Container (Docker, Podman)', en: 'Containers (Docker, Podman)' }, effect: { ratings: { freshness: 1, documentation: 1 }, boostAudiences: { developer: 3 } } },
      { id: 'vms', label: { de: 'Virtuelle Maschinen', en: 'Virtual machines' }, effect: { ratings: { stability: 1 }, boostAudiences: { sysadmin: 3 } } },
      { id: 'gpu-compute', label: { de: 'GPU-Rechnen, CUDA oder lokale KI-Modelle', en: 'GPU compute, CUDA or local AI models' }, effect: { require: ['nvidia-any'], ratings: { freshness: 2 }, boostTags: { nvidia: 4 } } },
      { id: 'audio-lowlatency', label: { de: 'Musikproduktion mit niedriger Latenz', en: 'Music production with low latency' }, effect: { ratings: { creativeWork: 3 }, boostDistros: { 'ubuntu-studio': 12 } } },
      { id: 'accessibility', label: { de: 'Bildschirmleser oder andere Hilfstechnologien', en: 'Screen reader or other assistive technology' }, effect: { boostTags: { gnome: 8 }, boostDistros: { ubuntu: 6, 'fedora-workstation': 5, debian: 3 }, flags: ['accessibility'] } },
      { id: 'none', label: { de: 'Nichts davon', en: 'None of these' }, effect: {}, neutral: true },
    ],
  },

  {
    id: 'gaming-detail',
    section: 'usage',
    modes: ['advanced', 'expert'],
    type: 'multiple',
    weight: 2,
    showIf: { questionId: 'purpose', anyOf: ['gaming'] },
    title: { de: 'Was für Spiele sollen laufen?', en: 'What kind of games should run?' },
    options: [
      { id: 'steam-proton', label: { de: 'Steam-Spiele über Proton', en: 'Steam games through Proton' }, effect: { ratings: { gaming: 2 }, boostTags: { gaming: 4 } } },
      { id: 'native', label: { de: 'Native Linux-Spiele', en: 'Native Linux games' }, effect: { ratings: { gaming: 1 } } },
      { id: 'emulation', label: { de: 'Emulatoren für ältere Konsolen', en: 'Emulators for older consoles' }, effect: { ratings: { gaming: 1, freshness: 1 }, boostTags: { gaming: 3 } } },
      { id: 'aaa-latest', label: { de: 'Ganz neue AAA-Titel am Erscheinungstag', en: 'Brand-new AAA titles on release day' }, effect: { ratings: { gaming: 3, freshness: 3 }, prefer: ['gaming-ready', 'rolling'] } },
      { id: 'modding', label: { de: 'Modding, eigene Werkzeuge, Wine-Bastelei', en: 'Modding, custom tools, Wine tinkering' }, effect: { ratings: { customizability: 2, gaming: 2 }, boostTags: { aur: 3 } } },
      { id: 'vr', label: { de: 'VR-Headsets', en: 'VR headsets' }, effect: { ratings: { freshness: 2, gaming: 2 }, flags: ['vr'] } },
    ],
  },

  {
    id: 'privacy-level',
    section: 'philosophy',
    modes: ['advanced', 'expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Wie streng sind deine Anforderungen an Datenschutz?', en: 'How strict are your privacy requirements?' },
    options: [
      { id: 'normal', label: { de: 'Normal – keine Werbung, keine Telemetrie reicht mir', en: 'Normal — no ads and no telemetry is enough' }, effect: { ratings: { privacy: 1 } } },
      { id: 'strict', label: { de: 'Streng – Verschlüsselung, wenig Fremdkomponenten', en: 'Strict — encryption, few third-party components' }, effect: { ratings: { privacy: 3 }, require: ['fde-installer'], boostAudiences: { privacy: 4 } } },
      { id: 'threat-model', label: { de: 'Ich arbeite mit einem echten Bedrohungsmodell', en: 'I work with an actual threat model' }, effect: { ratings: { privacy: 3 }, require: ['privacy-strict'], boostDistros: { qubes: 10, tails: 8 }, flags: ['threat-model'] } },
      { id: 'irrelevant', label: { de: 'Kein besonderer Anspruch', en: 'No particular requirement' }, effect: {}, neutral: true },
    ],
  },

  {
    id: 'vendor-support',
    section: 'operations',
    modes: ['advanced', 'expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Brauchst du einen Ansprechpartner, den man bezahlen kann?', en: 'Do you need a support contact you can pay?' },
    options: [
      { id: 'required', label: { de: 'Ja, ein Supportvertrag ist Voraussetzung', en: 'Yes, a support contract is a requirement' }, effect: { require: ['commercial-support'], ratings: { enterpriseReady: 3 } } },
      { id: 'german-vendor', label: { de: 'Ja, und am liebsten auf Deutsch', en: 'Yes, and ideally in German' }, effect: { require: ['commercial-support'], ratings: { germanSupport: 3, enterpriseReady: 2 }, boostDistros: { 'tuxedo-os': 12, 'proxmox-ve': 6, 'opensuse-leap': 6 } } },
      { id: 'community', label: { de: 'Nein, Community-Hilfe genügt', en: 'No, community help is enough' }, effect: { ratings: { communitySize: 2 } } },
    ],
  },

  {
    id: 'install-effort',
    section: 'operations',
    modes: ['advanced', 'expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Wie viel Zeit darf die Erstinstallation kosten?', en: 'How long may the initial installation take?' },
    options: [
      { id: 'minutes', label: { de: 'Zwanzig Minuten, dann will ich arbeiten', en: 'Twenty minutes, then I want to work' }, effect: { require: ['easy-install'], ratings: { beginnerFriendly: 2 } } },
      { id: 'evening', label: { de: 'Ein Abend zum Einrichten ist in Ordnung', en: 'An evening of setup is fine' }, effect: {} },
      { id: 'weekend', label: { de: 'Ein Wochenende – ich will es richtig aufsetzen', en: 'A weekend — I want to set it up properly' }, effect: { ratings: { customizability: 2, documentation: 1 } } },
      { id: 'unlimited', label: { de: 'Zeit spielt keine Rolle, der Weg ist das Ziel', en: 'Time does not matter, the journey is the point' }, effect: { ratings: { customizability: 3, upstreamPurity: 2, beginnerFriendly: -2 } } },
    ],
  },
];
