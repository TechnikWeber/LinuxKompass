import type { Question } from './types';

/** Fragen, die in allen drei Modi gestellt werden. */
export const coreQuestions: Question[] = [
  {
    id: 'purpose',
    section: 'usage',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'multiple',
    weight: 3,
    required: true,
    title: { de: 'Wofür wirst du den Rechner hauptsächlich benutzen?', en: 'What will you mainly use this computer for?' },
    description: { de: 'Mehrfachauswahl – wähle alles, was regelmäßig vorkommt.', en: 'Pick everything that happens regularly.' },
    options: [
      {
        id: 'everyday',
        label: { de: 'Surfen, E-Mail, Office', en: 'Browsing, email, office work' },
        hint: { de: 'Der ganz normale Alltag am Rechner.', en: 'Ordinary everyday computer use.' },
        effect: { ratings: { beginnerFriendly: 2, stability: 2, hardwareSupport: 1 }, boostAudiences: { beginner: 4, switcher: 4 } },
      },
      {
        id: 'gaming',
        label: { de: 'Spielen', en: 'Gaming' },
        hint: { de: 'Steam, Proton, Controller, ggf. hohe Bildraten.', en: 'Steam, Proton, controllers, possibly high frame rates.' },
        effect: { ratings: { gaming: 3, freshness: 2, hardwareSupport: 2 }, boostAudiences: { gamer: 6 }, prefer: ['gaming-ready'] },
      },
      {
        id: 'development',
        label: { de: 'Programmieren und Entwickeln', en: 'Programming and development' },
        effect: { ratings: { freshness: 2, softwareAvailability: 2, documentation: 1 }, boostAudiences: { developer: 5 } },
      },
      {
        id: 'creative',
        label: { de: 'Foto, Video, Musik, Grafik', en: 'Photo, video, music, graphics' },
        effect: { ratings: { creativeWork: 3, hardwareSupport: 2, freshness: 1 }, boostAudiences: { creative: 5 }, prefer: ['codecs-oob'] },
      },
      {
        id: 'server',
        label: { de: 'Server, NAS oder Homelab', en: 'Server, NAS or homelab' },
        hint: { de: 'Ein Rechner, der dauerhaft läuft und Dienste bereitstellt.', en: 'A machine that runs continuously and provides services.' },
        effect: { ratings: { stability: 3, enterpriseReady: 2, lightweight: 1 }, boostAudiences: { sysadmin: 5, enterprise: 2 } },
      },
      {
        id: 'learning',
        label: { de: 'Linux lernen und verstehen', en: 'Learning and understanding Linux' },
        effect: { ratings: { documentation: 3, customizability: 2, upstreamPurity: 2 }, boostAudiences: { tinkerer: 4 } },
      },
      {
        id: 'privacy',
        label: { de: 'Privatsphäre und Datenschutz', en: 'Privacy and data protection' },
        effect: { ratings: { privacy: 3 }, boostAudiences: { privacy: 5 } },
      },
      {
        id: 'revive',
        label: { de: 'Einen alten Rechner wiederbeleben', en: 'Reviving an old computer' },
        effect: { ratings: { lightweight: 3, stability: 1 }, boostAudiences: { oldhardware: 6 } },
      },
      {
        id: 'work',
        label: { de: 'Beruflicher Arbeitsplatz in einer Firma', en: 'A work machine inside a company' },
        effect: { ratings: { enterpriseReady: 3, stability: 2 }, boostAudiences: { enterprise: 5 }, prefer: ['long-support'] },
      },
    ],
  },

  {
    id: 'coming-from',
    section: 'habits',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 2,
    required: true,
    title: { de: 'Woher kommst du?', en: 'Where are you coming from?' },
    description: { de: 'Das bestimmt, welche Oberfläche sich am wenigsten fremd anfühlt.', en: 'This decides which desktop will feel least foreign.' },
    options: [
      {
        id: 'windows10',
        label: { de: 'Windows 10', en: 'Windows 10' },
        hint: {
          de: 'Microsoft hat die kostenlosen Sicherheitsupdates für Privatleute (ESU) bis 12. Oktober 2027 verlängert – danach ist endgültig Schluss.',
          en: 'Microsoft extended the free consumer security updates (ESU) to 12 October 2027 — after that they end for good.',
        },
        effect: { ratings: { beginnerFriendly: 2, hardwareSupport: 1 }, boostTags: { 'windows-optik': 6, umsteiger: 6 }, boostAudiences: { switcher: 5 } },
      },
      { id: 'windows11', label: { de: 'Windows 11', en: 'Windows 11' }, effect: { ratings: { beginnerFriendly: 2 }, boostTags: { 'windows-optik': 4, plasma: 3 }, boostAudiences: { switcher: 4 } } },
      { id: 'macos', label: { de: 'macOS', en: 'macOS' }, effect: { boostTags: { 'macos-feeling': 6, design: 4 }, boostDistros: { elementary: 8, 'fedora-workstation': 3, ubuntu: 2 } } },
      { id: 'linux', label: { de: 'Ich nutze schon Linux', en: 'I already use Linux' }, effect: { ratings: { customizability: 1 } } },
      { id: 'chromeos', label: { de: 'ChromeOS oder Tablet', en: 'ChromeOS or a tablet' }, effect: { ratings: { beginnerFriendly: 2, lightweight: 1 }, prefer: ['low-maintenance'] } },
      { id: 'nothing', label: { de: 'Ich fange bei null an', en: 'I am starting from scratch' }, effect: { ratings: { beginnerFriendly: 2, documentation: 1 } }, neutral: true },
    ],
  },

  // Nur für Windows-Umsteiger: Wer Windows behalten will, läuft in eine Falle,
  // die keine andere Frage abdeckt. Windows 11 verschlüsselt die Systemplatte
  // auf vielen Geräten von selbst, und wer für Linux Secure Boot abschaltet,
  // steht danach vor der Abfrage des BitLocker-Wiederherstellungsschlüssels.
  {
    id: 'keep-windows',
    section: 'habits',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 2,
    showIf: { questionId: 'coming-from', anyOf: ['windows10', 'windows11'] },
    title: { de: 'Soll Windows auf dem Rechner bleiben?', en: 'Should Windows stay on the computer?' },
    description: {
      de: 'Beim Start zwischen Windows und Linux zu wählen ist beliebt – hat aber ein paar Tücken, die sich vorher klären lassen.',
      en: 'Choosing between Windows and Linux at start-up is popular — but it has a few catches worth settling beforehand.',
    },
    help: {
      de: 'Windows 11 verschlüsselt die Systemplatte auf vielen Geräten automatisch mit BitLocker. Muss für Linux Secure Boot abgeschaltet werden, fragt Windows danach nach dem 48-stelligen Wiederherstellungsschlüssel. Distributionen mit voller Secure-Boot-Unterstützung umgehen das, weil im UEFI nichts umgestellt werden muss.',
      en: 'Windows 11 automatically encrypts the system drive with BitLocker on many devices. If Linux requires Secure Boot to be switched off, Windows will then ask for the 48-digit recovery key. Distributions with full Secure Boot support avoid this because nothing has to change in the UEFI.',
    },
    options: [
      {
        id: 'dual-boot',
        label: { de: 'Ja, ich will beim Start zwischen Windows und Linux wählen', en: 'Yes, I want to choose between Windows and Linux at start-up' },
        hint: { de: 'Auch, wenn Linux auf eine eigene Festplatte im selben Rechner kommt.', en: 'Also if Linux goes onto a separate drive in the same machine.' },
        effect: { prefer: ['secure-boot'], flags: ['dual-boot'] },
      },
      {
        id: 'vm',
        label: { de: 'Windows nur noch in einer virtuellen Maschine', en: 'Windows only in a virtual machine' },
        hint: { de: 'Für ein, zwei Programme oft der bequemere Weg als ständiges Neustarten.', en: 'For one or two programs this is often more convenient than constant rebooting.' },
        effect: {},
      },
      {
        id: 'replace',
        label: { de: 'Nein, Linux ersetzt Windows ganz', en: 'No, Linux replaces Windows entirely' },
        effect: {},
      },
    ],
  },

  {
    id: 'hardware-age',
    section: 'hardware',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 3,
    required: true,
    title: { de: 'Wie alt ist der Rechner?', en: 'How old is the computer?' },
    options: [
      { id: 'new', label: { de: 'Neu oder unter 2 Jahre', en: 'New or under 2 years' }, effect: { ratings: { freshness: 2, hardwareSupport: 2 } } },
      { id: 'mid', label: { de: '2 bis 5 Jahre', en: '2 to 5 years' }, effect: { ratings: { hardwareSupport: 1 } } },
      { id: 'older', label: { de: '5 bis 10 Jahre', en: '5 to 10 years' }, effect: { ratings: { lightweight: 2, stability: 1 } } },
      { id: 'ancient', label: { de: 'Älter als 10 Jahre', en: 'Older than 10 years' }, effect: { ratings: { lightweight: 3 }, require: ['ram-4gb'], boostAudiences: { oldhardware: 6 } } },
      { id: 'unknown', label: { de: 'Weiß ich nicht', en: 'I do not know' }, effect: {}, neutral: true },
    ],
  },

  {
    id: 'ram',
    section: 'hardware',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 3,
    required: true,
    title: { de: 'Wie viel Arbeitsspeicher hat der Rechner?', en: 'How much memory does the machine have?' },
    description: { de: 'Der Arbeitsspeicher (RAM) ist die häufigste harte Grenze.', en: 'Memory (RAM) is the most common hard limit.' },
    help: {
      de: 'Unter Windows findest du die Angabe unter Einstellungen → System → Info. Auf einem laufenden Linux zeigt „free -h" die Größe an. Bei 2 GB oder weniger kommen nur sehr sparsame Systeme infrage.',
      en: 'On Windows you find it under Settings → System → About. On a running Linux, "free -h" shows the size. At 2 GB or less only very frugal systems are viable.',
    },
    options: [
      { id: 'ram-2', label: { de: '2 GB oder weniger', en: '2 GB or less' }, effect: { ratings: { lightweight: 3 }, require: ['ram-2gb'], boostAudiences: { oldhardware: 6 } } },
      { id: 'ram-4', label: { de: '4 GB', en: '4 GB' }, effect: { ratings: { lightweight: 2 }, require: ['ram-4gb'] } },
      { id: 'ram-8', label: { de: '8 GB', en: '8 GB' }, effect: { ratings: { lightweight: 1 }, require: ['ram-8gb'] } },
      { id: 'ram-16', label: { de: '16 GB', en: '16 GB' }, effect: {} },
      { id: 'ram-32', label: { de: '32 GB oder mehr', en: '32 GB or more' }, effect: { ratings: { lightweight: -1 } } },
      // Weich statt hart: Nichtwissen ist keine Eigenschaft des Rechners. Die
      // meisten Geräte haben heute 8 GB oder mehr, sparsame Systeme rücken
      // trotzdem nach vorn.
      { id: 'unknown', label: { de: 'Weiß ich nicht', en: 'I do not know' }, effect: { prefer: ['ram-4gb'] }, neutral: true },
    ],
  },

  {
    id: 'gpu',
    section: 'hardware',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 3,
    required: true,
    title: { de: 'Welche Grafikkarte steckt im Rechner?', en: 'What graphics card is in the machine?' },
    description: { de: 'Die Grafikkarte entscheidet mehr über eine gute Erfahrung als fast alles andere.', en: 'Graphics decides more about a good experience than almost anything else.' },
    help: {
      de: 'Intel- und AMD-Grafik funktioniert unter Linux ohne Zusatztreiber, weil die Treiber Teil des Systems sind. NVIDIA braucht einen zusätzlichen, herstellereigenen Treiber. Für Karten vor der GTX-16-Serie gibt es seit Treiber 590 nur noch den Legacy-Zweig 580 mit Sicherheitsupdates bis 2028 – und nicht jede Distribution bietet ihn noch an.',
      en: 'Intel and AMD graphics work on Linux without extra drivers because the drivers are part of the system. NVIDIA needs an additional proprietary driver. Since driver 590, cards older than the GTX 16 series only get the legacy 580 branch, with security updates until 2028 — and not every distribution still offers it.',
    },
    options: [
      // Intel-, AMD- und NVIDIA-Grafik heißt: ein gewöhnlicher PC. Ohne diese
      // Anforderung standen reine ARM-Systeme auch für Windows-Rechner zur Wahl.
      { id: 'intel', label: { de: 'Intel (im Prozessor integriert)', en: 'Intel (integrated in the CPU)' }, effect: { ratings: { hardwareSupport: 1 }, require: ['x86'] } },
      { id: 'amd', label: { de: 'AMD', en: 'AMD' }, hint: { de: 'Unter Linux die unkomplizierteste Wahl.', en: 'The most trouble-free choice on Linux.' }, effect: { ratings: { hardwareSupport: 1, gaming: 1 }, require: ['x86'] } },
      {
        id: 'nvidia-new',
        label: { de: 'NVIDIA, neuer (GTX 16xx, RTX 20xx oder neuer)', en: 'NVIDIA, newer (GTX 16xx, RTX 20xx or newer)' },
        effect: { require: ['x86', 'nvidia-any'], prefer: ['nvidia-easy'], boostTags: { 'nvidia-iso': 6, nvidia: 5 }, flags: ['nvidia'] },
      },
      {
        id: 'nvidia-old',
        label: { de: 'NVIDIA, älter (GTX 10xx oder davor)', en: 'NVIDIA, older (GTX 10xx or earlier)' },
        hint: {
          de: 'Für GTX 900 und 10xx gibt es nur noch einen Legacy-Treiber, den nicht jede Distribution anbietet. GTX 700 und älter laufen nur noch mit dem freien Treiber.',
          en: 'GTX 900 and 10xx cards only get a legacy driver now, and not every distribution offers it. GTX 700 and older only run on the free driver.',
        },
        // Seit Treiber 555 (explizite Synchronisierung) laufen auch diese Karten
        // unter Wayland ordentlich, deshalb ist X11 kein Muss mehr – als
        // Rückfallebene aber weiterhin erwünscht. Hart ist nur, dass die
        // Distribution den Treiberzweig 580 überhaupt noch anbietet.
        effect: { require: ['x86', 'nvidia-legacy-any'], prefer: ['nvidia-legacy-easy', 'x11-session'], flags: ['nvidia-legacy'] },
      },
      {
        id: 'apple',
        label: { de: 'Apple Silicon (M1–M5)', en: 'Apple Silicon (M1–M5)' },
        hint: { de: 'Linux läuft hier nur auf M1 und M2 rund, auf M3 mit Einschränkungen, auf M4 und M5 gar nicht.', en: 'Linux only runs well on M1 and M2, on M3 with limitations, and not at all on M4 and M5.' },
        effect: { require: ['apple-silicon'], flags: ['apple-silicon'] },
      },
      { id: 'unknown', label: { de: 'Weiß ich nicht', en: 'I do not know' }, effect: { prefer: ['nvidia-easy', 'x86'] }, neutral: true },
    ],
  },

  {
    id: 'look',
    section: 'habits',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Wie soll sich die Oberfläche anfühlen?', en: 'How should the desktop feel?' },
    options: [
      { id: 'windows-like', label: { de: 'Wie Windows: Startmenü unten links, Taskleiste', en: 'Like Windows: start menu bottom left, taskbar' }, effect: { boostTags: { 'windows-optik': 8, cinnamon: 6, plasma: 5, klassisch: 4 }, boostDistros: { 'linux-mint': 6, zorin: 6, kubuntu: 5 } } },
      { id: 'macos-like', label: { de: 'Wie macOS: Dock unten, Menüleiste oben', en: 'Like macOS: dock at the bottom, menu bar on top' }, effect: { boostTags: { 'macos-feeling': 8, design: 5 }, boostDistros: { elementary: 8 } } },
      { id: 'clean', label: { de: 'Aufgeräumt und modern, ich passe mich an', en: 'Tidy and modern, I will adapt' }, effect: { boostTags: { gnome: 4, wayland: 2, modern: 4 }, boostDistros: { 'fedora-workstation': 4, ubuntu: 3, 'opensuse-aeon': 3 } } },
      { id: 'tweak', label: { de: 'Ich will alles selbst einstellen', en: 'I want to configure everything myself' }, effect: { ratings: { customizability: 3 }, boostTags: { plasma: 4, anpassbar: 6 } } },
      { id: 'dontcare', label: { de: 'Egal, Hauptsache es funktioniert', en: 'Do not care, as long as it works' }, effect: { ratings: { beginnerFriendly: 1 } }, neutral: true },
    ],
  },

  {
    id: 'update-appetite',
    section: 'habits',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 3,
    required: true,
    title: { de: 'Wie stehst du zu Updates?', en: 'How do you feel about updates?' },
    description: { de: 'Das ist die wichtigste Weiche zwischen den Distributions-Familien.', en: 'This is the single biggest fork between distribution families.' },
    help: {
      de: 'Feste Versionen (Ubuntu LTS, Debian, Mint) ändern über Jahre fast nichts und bringen alle 2–3 Jahre einen großen Sprung. Rollende Systeme (Arch, Tumbleweed) liefern laufend Neues, verlangen aber Aufmerksamkeit. Unveränderliche Systeme (Silverblue, Bazzite, Aeon) aktualisieren sich als Ganzes und lassen sich zurückrollen.',
      en: 'Fixed releases (Ubuntu LTS, Debian, Mint) change little for years and then make one big jump every 2–3 years. Rolling systems (Arch, Tumbleweed) deliver new things continuously but demand attention. Immutable systems (Silverblue, Bazzite, Aeon) update as a whole and can be rolled back.',
    },
    options: [
      {
        id: 'never-touch',
        label: { de: 'So selten wie möglich – Hauptsache es läuft', en: 'As rarely as possible — it just has to keep working' },
        effect: { ratings: { stability: 3, freshness: -2, upgradeSmoothness: 1 }, require: ['long-support'], prefer: ['low-maintenance'] },
      },
      {
        id: 'quiet',
        label: { de: 'Regelmäßig, aber unauffällig im Hintergrund', en: 'Regularly, but quietly in the background' },
        effect: { ratings: { stability: 2, upgradeSmoothness: 2 }, prefer: ['low-maintenance'] },
      },
      {
        id: 'current',
        label: { de: 'Ich hätte gern aktuelle Programmversionen', en: 'I would like current application versions' },
        effect: { ratings: { freshness: 2, upgradeSmoothness: 1 } },
      },
      {
        id: 'bleeding',
        label: { de: 'Immer das Neueste, ich kümmere mich darum', en: 'Always the newest, I will look after it' },
        effect: { ratings: { freshness: 3, stability: -1 }, prefer: ['rolling'] },
      },
    ],
  },

  {
    id: 'breakage-tolerance',
    section: 'operations',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 3,
    required: true,
    title: { de: 'Was passiert, wenn nach einem Update etwas nicht mehr geht?', en: 'What happens if something breaks after an update?' },
    options: [
      {
        id: 'disaster',
        label: { de: 'Das wäre ein echtes Problem – ich brauche den Rechner', en: 'That would be a real problem — I need this machine' },
        effect: { ratings: { stability: 3, upgradeSmoothness: 2, beginnerFriendly: 1 }, prefer: ['snapshots', 'low-maintenance'] },
      },
      {
        id: 'annoying',
        label: { de: 'Ärgerlich, aber ich hätte gern eine Rückfalltaste', en: 'Annoying, but I would like an undo button' },
        effect: { ratings: { upgradeSmoothness: 2 }, require: ['snapshots'], boostTags: { rollback: 5, 'btrfs-snapshots': 5, atomic: 4 } },
      },
      { id: 'fixable', label: { de: 'Ich suche im Netz und repariere es', en: 'I search online and fix it' }, effect: { ratings: { documentation: 2, communitySize: 1 } } },
      { id: 'fun', label: { de: 'Das gehört dazu, ich repariere gern', en: 'That is part of the deal, I enjoy fixing things' }, effect: { ratings: { customizability: 2, documentation: 1, stability: -1 } } },
    ],
  },

  {
    id: 'terminal',
    section: 'operations',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 3,
    required: true,
    title: { de: 'Wie stehst du zur Kommandozeile?', en: 'How do you feel about the command line?' },
    description: { de: 'Das schwarze Fenster mit Textbefehlen. Ehrliche Antwort hilft am meisten.', en: 'The black window with typed commands. An honest answer helps most.' },
    options: [
      { id: 'never', label: { de: 'Gar nicht – ich will alles anklicken können', en: 'Not at all — I want to click everything' }, effect: { ratings: { beginnerFriendly: 3 }, require: ['gui-installer', 'beginner-safe'], prefer: ['easy-install', 'codecs-oob'] } },
      { id: 'copy-paste', label: { de: 'Ich kopiere Befehle aus einer Anleitung hinein', en: 'I paste commands from a tutorial' }, effect: { ratings: { beginnerFriendly: 2, documentation: 1 }, prefer: ['gui-installer'] } },
      { id: 'comfortable', label: { de: 'Ich komme damit zurecht', en: 'I am comfortable with it' }, effect: { ratings: { customizability: 1 } } },
      { id: 'daily', label: { de: 'Täglich – ich schreibe auch Skripte', en: 'Daily — I write scripts too' }, effect: { ratings: { customizability: 2, upstreamPurity: 1, beginnerFriendly: -1 } } },
    ],
  },

  {
    id: 'german',
    section: 'operations',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Wie wichtig ist deutschsprachige Hilfe?', en: 'How important is German-language help?' },
    description: { de: 'Forum, Wiki und Handbuch in der eigenen Sprache machen den Unterschied, wenn man feststeckt.', en: 'A forum, wiki and manual in your own language make the difference when you get stuck.' },
    options: [
      { id: 'essential', label: { de: 'Sehr wichtig – ohne Deutsch komme ich nicht weiter', en: 'Very important — I cannot get by without it' }, effect: { ratings: { germanSupport: 3 }, require: ['german-support'] } },
      { id: 'helpful', label: { de: 'Hilfreich, aber Englisch geht auch', en: 'Helpful, but English works too' }, effect: { ratings: { germanSupport: 2 } } },
      { id: 'irrelevant', label: { de: 'Egal, ich lese ohnehin Englisch', en: 'Does not matter, I read English anyway' }, effect: { ratings: { documentation: 1 } }, neutral: true },
    ],
  },

  {
    id: 'blockers',
    section: 'software',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'multiple',
    weight: 3,
    title: { de: 'Brauchst du eines dieser Programme zwingend?', en: 'Do you absolutely need any of these programs?' },
    description: { de: 'Diese Antwort ändert die Empfehlung kaum – aber sie entscheidet, ob ein Umstieg überhaupt funktioniert.', en: 'This barely changes the recommendation — but it decides whether switching works at all.' },
    help: {
      de: 'Manche Programme laufen unter Linux gar nicht, unabhängig von der Distribution. Das ist eine Entscheidung der jeweiligen Hersteller. Wir zeigen dir gleich, welche Alternativen es gibt und wo eine zweite Windows-Installation oder eine virtuelle Maschine nötig bleibt.',
      en: 'Some programs do not run on Linux at all, regardless of distribution. That is a decision by their vendors. We will show you which alternatives exist and where a second Windows install or a virtual machine remains necessary.',
    },
    options: [
      { id: 'ms-office', label: { de: 'Microsoft Office (Desktop-Version)', en: 'Microsoft Office (desktop version)' }, effect: { flags: ['ms-office'] } },
      { id: 'adobe', label: { de: 'Adobe Photoshop, Premiere, Lightroom …', en: 'Adobe Photoshop, Premiere, Lightroom …' }, effect: { flags: ['adobe'] } },
      { id: 'cad', label: { de: 'CAD-Software (AutoCAD, Fusion 360, SolidWorks)', en: 'CAD software (AutoCAD, Fusion 360, SolidWorks)' }, effect: { flags: ['cad'] } },
      { id: 'tax', label: { de: 'Steuer- oder Buchhaltungssoftware (z. B. WISO, Lexware)', en: 'Tax or accounting software' }, effect: { flags: ['tax-software'] } },
      { id: 'anticheat', label: { de: 'Online-Spiele mit Anti-Cheat (Valorant, Fortnite, LoL …)', en: 'Online games with anti-cheat (Valorant, Fortnite, LoL …)' }, effect: { flags: ['anticheat'] } },
      { id: 'banking', label: { de: 'Spezielle Banking- oder Signaturkarten-Software', en: 'Special banking or signature-card software' }, effect: { flags: ['banking'] } },
      { id: 'industry', label: { de: 'Branchensoftware, die nur unter Windows läuft', en: 'Industry software that only runs on Windows' }, effect: { flags: ['industry'] } },
      { id: 'none', label: { de: 'Nichts davon', en: 'None of these' }, effect: {}, neutral: true },
    ],
  },

  {
    id: 'safety-net',
    section: 'operations',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 2,
    title: { de: 'Wie sicherst du deine Daten heute?', en: 'How do you back up your data today?' },
    description: { de: 'Ehrliche Antwort – davon hängt ab, wie viel Sicherheitsnetz die Distribution mitbringen sollte.', en: 'Answer honestly — it determines how much of a safety net the distribution should provide.' },
    options: [
      { id: 'none', label: { de: 'Gar nicht', en: 'Not at all' }, effect: { ratings: { stability: 2 }, prefer: ['snapshots', 'low-maintenance'], flags: ['backup'] } },
      { id: 'manual', label: { de: 'Ab und zu manuell auf eine externe Platte', en: 'Occasionally, manually to an external drive' }, effect: { ratings: { stability: 1 }, prefer: ['snapshots'] } },
      { id: 'automatic', label: { de: 'Automatisch, regelmäßig', en: 'Automatically and regularly' }, effect: {} },
      { id: 'versioned', label: { de: 'Automatisch, versioniert und getestet', en: 'Automatically, versioned and tested' }, effect: { ratings: { stability: -1 } } },
    ],
  },

  // --- Nachfragen zu den genannten Hindernissen ---------------------------
  // Sie erscheinen nur, wenn das jeweilige Programm angekreuzt wurde. Ohne
  // diese Nachfrage würde ein „ich brauche Adobe" den Umstieg scheinbar
  // ausschließen, obwohl viele mit GIMP und Darktable bestens zurechtkämen.
  // Für Spiele mit Anti-Cheat und für Branchensoftware gibt es bewusst keine
  // Nachfrage: Dort gibt es keine sinnvolle Alternative vorzuschlagen.

  {
    id: 'ms-office-alternative',
    section: 'software',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 2,
    showIf: { questionId: 'blockers', anyOf: ['ms-office'] },
    title: { de: 'Käme statt Microsoft Office auch ein anderes Office-Paket infrage?', en: 'Would a different office suite work instead of Microsoft Office?' },
    description: {
      de: 'LibreOffice und OnlyOffice öffnen und speichern Word-, Excel- und PowerPoint-Dateien. Das ist kein Notbehelf – aber es sieht anders aus und kann bei sehr komplexen Dokumenten verrutschen.',
      en: 'LibreOffice and OnlyOffice open and save Word, Excel and PowerPoint files. That is not a stopgap — but it looks different and can shift very complex layouts.',
    },
    help: {
      de: 'Konkret: Briefe, Tabellen, Präsentationen und der Austausch von .docx und .xlsx funktionieren im Alltag zuverlässig. Nicht übertragbar sind VBA-Makros. Bei streng formatierten Vorlagen, die exakt so bei anderen ankommen müssen, kann es haken – dort ist Microsoft 365 im Browser der sichere Weg, und der läuft unter Linux vollständig.',
      en: 'Concretely: letters, spreadsheets, presentations and exchanging .docx and .xlsx work reliably day to day. VBA macros do not carry over. Strictly formatted templates that must arrive at others exactly as designed can be a problem — there, Microsoft 365 in the browser is the safe route, and it runs fully on Linux.',
    },
    options: [
      {
        id: 'yes',
        label: { de: 'Ja, damit käme ich zurecht', en: 'Yes, I would get along with that' },
        effect: { suppressFlags: ['ms-office'], flags: ['ms-office-open'], ratings: { softwareAvailability: 1 } },
      },
      {
        id: 'browser',
        label: { de: 'Ich würde Microsoft 365 im Browser nutzen', en: 'I would use Microsoft 365 in the browser' },
        hint: { de: 'Läuft unter Linux vollständig, inklusive gemeinsamer Bearbeitung.', en: 'Runs fully on Linux, including co-authoring.' },
        effect: { suppressFlags: ['ms-office'], flags: ['ms-office-open'] },
      },
      {
        id: 'no',
        label: { de: 'Nein, es muss die installierte Version von Microsoft Office sein', en: 'No, it has to be the installed version of Microsoft Office' },
        hint: { de: 'Etwa wegen VBA-Makros oder streng formatierter Vorlagen.', en: 'Because of VBA macros or strictly formatted templates, for instance.' },
        effect: {},
      },
    ],
  },

  {
    id: 'adobe-alternative',
    section: 'software',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 2,
    showIf: { questionId: 'blockers', anyOf: ['adobe'] },
    title: { de: 'Käme statt der Adobe-Programme auch etwas anderes infrage?', en: 'Would something other than the Adobe programs work?' },
    description: {
      de: 'Für jedes Adobe-Programm gibt es unter Linux eine ernstzunehmende Entsprechung: GIMP und Krita statt Photoshop, Darktable statt Lightroom, DaVinci Resolve oder Kdenlive statt Premiere, Inkscape statt Illustrator.',
      en: 'Every Adobe program has a serious counterpart on Linux: GIMP and Krita instead of Photoshop, Darktable instead of Lightroom, DaVinci Resolve or Kdenlive instead of Premiere, Inkscape instead of Illustrator.',
    },
    help: {
      de: 'Sie sind keine abgespeckten Nachbauten – Krita ist beim Zeichnen mit Grafiktablett sogar stärker als Photoshop, und DaVinci Resolve wird professionell eingesetzt. Anders sind sie trotzdem: Die Bedienung muss neu gelernt werden, PSD-Dateien mit Smart-Objekten öffnen nur eingeschränkt, und Projektdateien lassen sich nicht mit Adobe-Nutzern austauschen.',
      en: 'They are not stripped-down imitations — Krita beats Photoshop for drawing with a tablet, and DaVinci Resolve is used professionally. They are still different: the interaction has to be relearned, PSD files with smart objects open only partially, and project files cannot be exchanged with Adobe users.',
    },
    options: [
      {
        id: 'yes',
        label: { de: 'Ja, ich würde mich darauf einlassen', en: 'Yes, I would give that a go' },
        effect: { suppressFlags: ['adobe'], flags: ['adobe-open'], ratings: { creativeWork: 3 } },
      },
      {
        id: 'partly',
        label: { de: 'Für eigene Projekte ja, für Kundendateien nicht', en: 'For my own projects yes, for client files no' },
        hint: { de: 'Dann bleibt für den Austausch ein Windows-Gerät nötig.', en: 'A Windows device stays necessary for exchanging files.' },
        effect: { ratings: { creativeWork: 2 } },
      },
      {
        id: 'no',
        label: { de: 'Nein, es müssen die Adobe-Programme sein', en: 'No, it has to be the Adobe programs' },
        effect: {},
      },
    ],
  },

  {
    id: 'cad-alternative',
    section: 'software',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 2,
    showIf: { questionId: 'blockers', anyOf: ['cad'] },
    title: { de: 'Käme statt deiner CAD-Software auch eine andere infrage?', en: 'Would different CAD software work instead of yours?' },
    description: {
      de: 'FreeCAD arbeitet parametrisch wie Fusion 360, KiCad ist bei Leiterplatten Industriestandard, und Onshape läuft komplett im Browser.',
      en: 'FreeCAD works parametrically like Fusion 360, KiCad is an industry standard for circuit boards, and Onshape runs entirely in the browser.',
    },
    help: {
      de: 'Für Eigenkonstruktion, 3D-Druck und Elektronik reicht das vollständig aus. Grenzen: Große Baugruppen und Simulation sind schwächer als in kommerziellen Paketen, und native Dateien wie .dwg oder .sldprt lassen sich nur eingeschränkt austauschen – für Kunden und Fertiger sind STEP und STL der verlässliche Weg.',
      en: 'For your own designs, 3D printing and electronics that is entirely sufficient. Limits: large assemblies and simulation are weaker than in commercial packages, and native files such as .dwg or .sldprt exchange only partially — for clients and manufacturers, STEP and STL are the dependable route.',
    },
    options: [
      {
        id: 'yes',
        label: { de: 'Ja, ich konstruiere für mich selbst', en: 'Yes, I design for myself' },
        effect: { suppressFlags: ['cad'], flags: ['cad-open'] },
      },
      {
        id: 'browser',
        label: { de: 'Ich würde auf ein Browser-CAD wie Onshape wechseln', en: 'I would move to browser CAD such as Onshape' },
        effect: { suppressFlags: ['cad'], flags: ['cad-open'] },
      },
      {
        id: 'no',
        label: { de: 'Nein, ich brauche genau diese Software', en: 'No, I need exactly this software' },
        hint: { de: 'Etwa wegen Kundendateien, Fertigung oder Zertifizierung.', en: 'Because of client files, manufacturing or certification, for instance.' },
        effect: {},
      },
    ],
  },

  {
    id: 'tax-alternative',
    section: 'software',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 1,
    showIf: { questionId: 'blockers', anyOf: ['tax'] },
    title: { de: 'Käme für die Steuer auch ein anderer Weg infrage?', en: 'Would another route work for your tax return?' },
    description: {
      de: 'ELSTER läuft kostenlos im Browser und deckt den Normalfall ab. Mehrere kommerzielle Anbieter haben inzwischen Browser-Versionen.',
      en: 'The German tax portal ELSTER runs in the browser for free and covers the normal case. Several commercial vendors now offer browser versions.',
    },
    options: [
      {
        id: 'yes',
        label: { de: 'Ja, Browser oder ELSTER wäre in Ordnung', en: 'Yes, the browser or ELSTER would be fine' },
        effect: { suppressFlags: ['tax-software'], flags: ['tax-open'] },
      },
      {
        id: 'vm',
        label: { de: 'Ich würde dafür Windows in einer virtuellen Maschine behalten', en: 'I would keep Windows in a virtual machine for that' },
        hint: { de: 'Für ein paar Stunden im Jahr ein gangbarer Kompromiss.', en: 'A workable compromise for a few hours a year.' },
        effect: { suppressFlags: ['tax-software'], flags: ['tax-open'] },
      },
      {
        id: 'no',
        label: { de: 'Nein, ich brauche genau dieses Programm installiert', en: 'No, I need exactly this program installed' },
        effect: {},
      },
    ],
  },

  {
    id: 'banking-alternative',
    section: 'software',
    modes: ['beginner', 'advanced', 'expert'],
    type: 'single',
    weight: 1,
    showIf: { questionId: 'blockers', anyOf: ['banking'] },
    title: { de: 'Reicht dir Online-Banking im Browser?', en: 'Is online banking in the browser enough for you?' },
    description: {
      de: 'Banking im Browser funktioniert unter Linux überall. Schwierig wird es nur bei spezieller Software für Kartenleser oder Signaturkarten.',
      en: 'Browser banking works everywhere on Linux. It only gets difficult with special software for card readers or signature cards.',
    },
    options: [
      {
        id: 'yes',
        label: { de: 'Ja, ich mache alles im Browser oder per App', en: 'Yes, I do everything in the browser or by app' },
        effect: { suppressFlags: ['banking'] },
      },
      {
        id: 'no',
        label: { de: 'Nein, ich nutze ein Kartenlesegerät oder eine Signaturkarte', en: 'No, I use a card reader or signature card' },
        effect: {},
      },
    ],
  },
];
