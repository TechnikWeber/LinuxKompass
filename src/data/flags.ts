import type { L10n, L10nList } from './types';

export type FlagSeverity = 'critical' | 'warning' | 'info';

export interface Flag {
  id: string;
  severity: FlagSeverity;
  title: L10n;
  message: L10n;
  /** Was man konkret tun kann. */
  advice: L10nList;
  links?: { label: string; url: string }[];
}

/**
 * Stolperfallen-Katalog: Dinge, die unabhängig von der gewählten Distribution
 * über Erfolg oder Frust eines Umstiegs entscheiden.
 *
 * Der Anspruch hier ist Ehrlichkeit: Wo etwas nicht geht, steht das so da –
 * und daneben, was stattdessen möglich ist.
 */
export const flags: Flag[] = [
  {
    id: 'ms-office',
    severity: 'warning',
    title: { de: 'Microsoft Office läuft nicht als Desktop-Programm', en: 'Microsoft Office does not run as a desktop application' },
    message: {
      de: 'Die installierbare Version von Word, Excel und PowerPoint gibt es für Linux nicht. Für die meisten Menschen ist das kein Hindernis – für alle, die komplexe Excel-Makros oder streng formatierte Vorlagen austauschen müssen, aber schon.',
      en: 'The installable version of Word, Excel and PowerPoint does not exist for Linux. For most people that is not a blocker — for anyone exchanging complex Excel macros or strictly formatted templates, it is.',
    },
    advice: {
      de: [
        'Microsoft 365 im Browser funktioniert vollständig und wird von vielen als Ersatz genutzt.',
        'LibreOffice ist der übliche Weg und liest und schreibt Office-Formate zuverlässig; bei sehr komplexem Layout kann es verrutschen.',
        'OnlyOffice sieht Microsoft Office ähnlicher und ist bei .docx und .xlsx oft formattreuer als LibreOffice.',
        'Excel-Makros in VBA laufen in keiner der Alternativen zuverlässig. Wenn du darauf angewiesen bist: Windows in einer virtuellen Maschine einplanen.',
      ],
      en: [
        'Microsoft 365 in the browser works fully and is what many people use instead.',
        'LibreOffice is the usual route and reads and writes Office formats reliably; very complex layouts can shift.',
        'OnlyOffice looks closer to Microsoft Office and is often more faithful with .docx and .xlsx than LibreOffice.',
        'Excel VBA macros do not run reliably in any alternative. If you depend on them, plan for Windows in a virtual machine.',
      ],
    },
    links: [{ label: 'LibreOffice', url: 'https://de.libreoffice.org' }, { label: 'OnlyOffice', url: 'https://www.onlyoffice.com' }],
  },
  {
    id: 'adobe',
    severity: 'critical',
    title: { de: 'Adobe Creative Cloud läuft unter Linux nicht', en: 'Adobe Creative Cloud does not run on Linux' },
    message: {
      de: 'Photoshop, Premiere, Lightroom, InDesign und After Effects gibt es nicht für Linux und laufen auch über Wine nicht verlässlich. Adobe hat wiederholt erklärt, dass keine Linux-Versionen geplant sind. Wer beruflich damit arbeitet und Dateien mit anderen austauscht, sollte einen Zweitrechner oder Dual-Boot einplanen.',
      en: 'Photoshop, Premiere, Lightroom, InDesign and After Effects do not exist for Linux and do not run dependably through Wine either. Adobe has repeatedly stated that no Linux versions are planned. If you work with them professionally and exchange files with others, plan for a second machine or dual boot.',
    },
    advice: {
      de: [
        'Bildbearbeitung: GIMP (frei) oder Krita (besonders für Malerei und Illustration).',
        'Fotoentwicklung statt Lightroom: Darktable oder RawTherapee – beide sehr leistungsfähig, aber anders bedient.',
        'Videoschnitt statt Premiere: DaVinci Resolve läuft offiziell unter Linux (auch die kostenlose Ausgabe), Kdenlive ist die freie Alternative.',
        'Layout statt InDesign: Scribus – funktional, aber deutlich sperriger.',
        'Wenn Kundendateien im Adobe-Format zurückgehen müssen: Dual-Boot oder ein zweites Gerät ist der ehrlichere Weg als jeder Bastelversuch.',
      ],
      en: [
        'Image editing: GIMP (free) or Krita (especially for painting and illustration).',
        'Raw development instead of Lightroom: Darktable or RawTherapee — both very capable, but operated differently.',
        'Video editing instead of Premiere: DaVinci Resolve runs officially on Linux (including the free edition); Kdenlive is the free alternative.',
        'Layout instead of InDesign: Scribus — functional, but noticeably clunkier.',
        'If client files have to go back in Adobe formats, dual boot or a second device is the honest answer rather than any workaround.',
      ],
    },
    links: [{ label: 'DaVinci Resolve', url: 'https://www.blackmagicdesign.com/products/davinciresolve' }, { label: 'Krita', url: 'https://krita.org' }],
  },
  {
    id: 'cad',
    severity: 'critical',
    title: { de: 'Die meisten CAD-Programme gibt es nicht für Linux', en: 'Most CAD software does not exist for Linux' },
    message: {
      de: 'AutoCAD, Fusion 360, SolidWorks und Inventor laufen nicht nativ unter Linux. Fusion 360 lässt sich mit Bastelaufwand über Wine betreiben, aber ohne Zusicherung und mit Einschränkungen bei der Grafikbeschleunigung.',
      en: 'AutoCAD, Fusion 360, SolidWorks and Inventor do not run natively on Linux. Fusion 360 can be coaxed into running through Wine with effort, but without any guarantee and with limits on graphics acceleration.',
    },
    advice: {
      de: [
        'FreeCAD ist parametrisch und für viele Aufgaben ausreichend, aber im Bedienkonzept eigen.',
        'Für Leiterplatten: KiCad ist ausgereift und wird auch professionell eingesetzt.',
        'Für 3D-Modellierung ohne CAD-Anspruch: Blender.',
        'Onshape läuft komplett im Browser und ist damit distributionsunabhängig.',
        'Bei beruflicher Nutzung mit Kundendateien: Windows in einer virtuellen Maschine mit GPU-Durchreichung oder ein Zweitrechner.',
      ],
      en: [
        'FreeCAD is parametric and sufficient for many tasks, though its interaction model is its own.',
        'For circuit boards: KiCad is mature and used professionally.',
        'For 3D modelling without CAD requirements: Blender.',
        'Onshape runs entirely in the browser and is therefore distribution-agnostic.',
        'For professional use with client files: Windows in a VM with GPU passthrough, or a second machine.',
      ],
    },
    links: [{ label: 'FreeCAD', url: 'https://www.freecad.org' }, { label: 'KiCad', url: 'https://www.kicad.org' }],
  },
  {
    id: 'anticheat',
    severity: 'critical',
    title: { de: 'Spiele mit Kernel-Anti-Cheat laufen nicht', en: 'Games with kernel-level anti-cheat do not run' },
    message: {
      de: 'Valorant und League of Legends nutzen Riot Vanguard, das im Windows-Kernel arbeitet und für das es keinen Linux-Weg gibt – Riot hat das ausdrücklich als Entscheidung bezeichnet, nicht als Fehler. Fortnite läuft ebenfalls nicht, obwohl Easy Anti-Cheat technisch Linux unterstützt: Epic hat den Schalter nicht umgelegt. Easy Anti-Cheat und BattlEye funktionieren nur, wenn die Spieleentwickler die Linux-Unterstützung aktiv einschalten.',
      en: 'Valorant and League of Legends use Riot Vanguard, which operates in the Windows kernel and has no Linux path — Riot has explicitly called this a decision, not a bug. Fortnite does not run either, even though Easy Anti-Cheat technically supports Linux: Epic has not flipped the switch. Easy Anti-Cheat and BattlEye only work when game developers actively enable Linux support.',
    },
    advice: {
      de: [
        'Vor der Entscheidung jedes einzelne Spiel auf ProtonDB und „Are We Anti-Cheat Yet?" nachschlagen – die Lage ändert sich pro Titel, nicht pro Distribution.',
        'Keine Distribution kann das lösen. Bazzite, CachyOS oder Nobara helfen bei allen anderen Spielen, aber nicht hier.',
        'Möglichkeiten: Dual-Boot mit Windows, ein zweiter Rechner, oder Cloud-Gaming (GeForce NOW, Xbox Cloud).',
      ],
      en: [
        'Before deciding, look up each individual game on ProtonDB and "Are We Anti-Cheat Yet?" — the situation varies per title, not per distribution.',
        'No distribution can solve this. Bazzite, CachyOS or Nobara help with every other game, but not this one.',
        'Options: dual boot with Windows, a second machine, or cloud gaming (GeForce NOW, Xbox Cloud).',
      ],
    },
    links: [
      { label: 'ProtonDB', url: 'https://www.protondb.com' },
      { label: 'Are We Anti-Cheat Yet?', url: 'https://areweanticheatyet.com' },
    ],
  },
  {
    id: 'tax-software',
    severity: 'warning',
    title: { de: 'Deutsche Steuer- und Buchhaltungsprogramme sind meist Windows-only', en: 'German tax and accounting software is usually Windows-only' },
    message: {
      de: 'WISO Steuer, Lexware und ähnliche Programme werden fast ausschließlich für Windows angeboten. Für die Steuererklärung gibt es allerdings gute Wege, die ohne Installation auskommen.',
      en: 'WISO Steuer, Lexware and similar products are offered almost exclusively for Windows. For tax returns, though, there are good routes that need no installation.',
    },
    advice: {
      de: [
        'ELSTER läuft vollständig im Browser und ist kostenlos – für viele Fälle genügt das.',
        'Mehrere Anbieter (u. a. WISO) haben Browser-Versionen, die unter Linux funktionieren.',
        'Buchhaltung: Browserbasierte Dienste oder GnuCash als freie Alternative.',
        'Im Zweifel eine Windows-Installation in VirtualBox oder GNOME Boxes für ein bis zwei Programme im Jahr.',
      ],
      en: [
        'ELSTER (the German tax portal) runs entirely in the browser and is free — enough for many situations.',
        'Several vendors offer browser versions that work on Linux.',
        'Accounting: browser-based services, or GnuCash as a free alternative.',
        'If in doubt, keep a Windows install in VirtualBox or GNOME Boxes for one or two programs a year.',
      ],
    },
    links: [{ label: 'ELSTER', url: 'https://www.elster.de' }],
  },
  {
    id: 'banking',
    severity: 'info',
    title: { de: 'Banking und Kartenlesegeräte: meist unproblematisch, aber prüfen', en: 'Banking and card readers: usually fine, but check first' },
    message: {
      de: 'Online-Banking im Browser funktioniert überall. Schwierig wird es bei spezieller Software für HBCI-Kartenleser, Signaturkarten oder dem elektronischen Personalausweis.',
      en: 'Online banking in the browser works everywhere. It gets difficult with special software for card readers, signature cards or electronic ID cards.',
    },
    advice: {
      de: [
        'Die AusweisApp gibt es offiziell für Linux.',
        'Für HBCI und Homebanking: Hibiscus und AqBanking unterstützen viele Kartenleser.',
        'Vor dem Umstieg beim Hersteller des Lesegeräts nach Linux-Treibern fragen.',
      ],
      en: [
        'The German AusweisApp is officially available for Linux.',
        'For HBCI and home banking: Hibiscus and AqBanking support many card readers.',
        'Before switching, ask your card reader’s vendor about Linux drivers.',
      ],
    },
  },
  {
    id: 'industry',
    severity: 'critical',
    title: { de: 'Branchensoftware entscheidet den Umstieg', en: 'Line-of-business software decides the switch' },
    message: {
      de: 'Wenn eine berufliche Fachanwendung nur unter Windows läuft und es keine Browser-Version gibt, ist das der wichtigste Punkt der ganzen Entscheidung – wichtiger als jede Distributionswahl.',
      en: 'If a professional application only runs on Windows and has no browser version, that is the single most important point in this whole decision — more important than any distribution choice.',
    },
    advice: {
      de: [
        'Beim Hersteller nachfragen, ob es eine Web- oder Linux-Version gibt. Immer mehr Anbieter haben eine.',
        'Windows in einer virtuellen Maschine ist der sauberste Kompromiss, wenn nur ein Programm blockiert.',
        'Dual-Boot funktioniert, ist im Alltag aber unbequem, weil man ständig neu startet.',
        'Vorher in einem Live-System testen, statt nach dem Umstieg festzustellen, dass es nicht geht.',
      ],
      en: [
        'Ask the vendor whether a web or Linux version exists. More and more have one.',
        'Windows in a virtual machine is the cleanest compromise when only one program blocks you.',
        'Dual boot works, but is inconvenient day to day because you keep rebooting.',
        'Test in a live session beforehand rather than discovering the problem after switching.',
      ],
    },
  },
  {
    id: 'ms-office-open',
    severity: 'info',
    title: { de: 'Office-Alternative: das solltest du wissen', en: 'Office alternative: what to expect' },
    message: {
      de: 'Da du mit einer Alternative arbeiten würdest, fällt Microsoft Office als Hindernis weg. LibreOffice und OnlyOffice öffnen und speichern .docx, .xlsx und .pptx zuverlässig – für Briefe, Tabellen und Präsentationen im Alltag reicht das vollständig aus.',
      en: 'Since you would work with an alternative, Microsoft Office stops being an obstacle. LibreOffice and OnlyOffice open and save .docx, .xlsx and .pptx reliably — for everyday letters, spreadsheets and presentations that is entirely sufficient.',
    },
    advice: {
      de: [
        'OnlyOffice sieht Microsoft Office ähnlicher und ist bei komplexem Layout meist formattreuer – gute Wahl, wenn du Dateien mit Windows-Nutzern austauschst.',
        'LibreOffice kann mehr und ist verbreiteter, sieht aber anders aus und braucht ein paar Tage Umgewöhnung.',
        'Nicht übertragbar: VBA-Makros. Wenn in deinen Excel-Dateien Makros stecken, laufen sie in keiner Alternative zuverlässig.',
        'Ebenfalls anders: Serienbriefe, Pivot-Tabellen und sehr verschachtelte Formeln funktionieren, aber nicht immer über denselben Weg.',
        'Für gemeinsames Bearbeiten in Echtzeit ist Microsoft 365 im Browser oft der pragmatischste Weg – das läuft unter Linux vollständig.',
      ],
      en: [
        'OnlyOffice looks closer to Microsoft Office and usually keeps complex layouts more faithfully — a good choice if you exchange files with Windows users.',
        'LibreOffice can do more and is more widespread, but looks different and takes a few days to get used to.',
        'Does not carry over: VBA macros. If your Excel files contain macros, they will not run reliably in any alternative.',
        'Also different: mail merge, pivot tables and deeply nested formulas all work, but not always the same way.',
        'For real-time co-authoring, Microsoft 365 in the browser is often the pragmatic route — that runs fully on Linux.',
      ],
    },
    links: [{ label: 'LibreOffice', url: 'https://de.libreoffice.org' }, { label: 'OnlyOffice', url: 'https://www.onlyoffice.com' }],
  },
  {
    id: 'adobe-open',
    severity: 'info',
    title: { de: 'Kreativ-Alternativen: das solltest du wissen', en: 'Creative alternatives: what to expect' },
    message: {
      de: 'Da du mit anderen Programmen arbeiten würdest, ist Adobe kein Ausschlusskriterium mehr. Für jede Adobe-Anwendung gibt es unter Linux eine ernstzunehmende Entsprechung – sie funktionieren gut, aber anders.',
      en: 'Since you would work with other programs, Adobe stops being a deal-breaker. Every Adobe application has a serious counterpart on Linux — they work well, but differently.',
    },
    advice: {
      de: [
        'Photoshop → GIMP für Fotobearbeitung, Krita für Malerei und Illustration. Krita ist bei Pinseln und Zeichentabletts sogar überlegen.',
        'Lightroom → Darktable oder RawTherapee. Beide entwickeln RAW-Dateien hervorragend, arbeiten aber mit anderen Reglern und einem anderen Katalogkonzept.',
        'Premiere → DaVinci Resolve läuft offiziell unter Linux, auch kostenlos, und ist im Profibereich verbreitet. Kdenlive ist die freie, leichter zugängliche Alternative.',
        'Illustrator → Inkscape. InDesign → Scribus, das ist der spürbarste Rückschritt der Reihe.',
        'Nicht übertragbar: PSD-Dateien mit Smart-Objekten und Ebeneneffekten öffnen nur eingeschränkt, und Projektdateien lassen sich nicht mit Adobe-Nutzern austauschen. Wer im Team an denselben Dateien arbeitet, sollte das vorher klären.',
      ],
      en: [
        'Photoshop → GIMP for photo editing, Krita for painting and illustration. Krita is arguably better for brushes and drawing tablets.',
        'Lightroom → Darktable or RawTherapee. Both develop RAW files excellently but use different controls and a different catalogue concept.',
        'Premiere → DaVinci Resolve runs officially on Linux, including the free edition, and is common in professional work. Kdenlive is the free, more approachable alternative.',
        'Illustrator → Inkscape. InDesign → Scribus, the most noticeable step down of the set.',
        'Does not carry over: PSD files with smart objects and layer effects open only partially, and project files cannot be exchanged with Adobe users. If you work on shared files in a team, settle that first.',
      ],
    },
    links: [
      { label: 'Krita', url: 'https://krita.org' },
      { label: 'Darktable', url: 'https://www.darktable.org' },
      { label: 'DaVinci Resolve', url: 'https://www.blackmagicdesign.com/products/davinciresolve' },
    ],
  },
  {
    id: 'cad-open',
    severity: 'info',
    title: { de: 'CAD-Alternativen: das solltest du wissen', en: 'CAD alternatives: what to expect' },
    message: {
      de: 'Da du mit einer anderen Software arbeiten würdest, ist CAD kein Ausschlusskriterium mehr. Für Eigenkonstruktion, 3D-Druck und Elektronik gibt es unter Linux ausgereifte Werkzeuge.',
      en: 'Since you would work with different software, CAD stops being a deal-breaker. For your own designs, 3D printing and electronics, Linux has mature tools.',
    },
    advice: {
      de: [
        'FreeCAD ist parametrisch wie Fusion 360 und für Eigenkonstruktion und 3D-Druck vollständig ausreichend. Die Bedienung ist eigen und braucht Einarbeitung.',
        'KiCad für Leiterplatten ist kein Kompromiss, sondern Industriestandard – auch Firmen setzen es ein.',
        'Onshape läuft komplett im Browser und ist damit unabhängig vom Betriebssystem.',
        'Nicht übertragbar: native Dateien wie .dwg, .sldprt oder .ipt lassen sich nur eingeschränkt austauschen. Für den Austausch mit Kunden oder Fertigern sind STEP und STL der verlässliche Weg.',
        'Große Baugruppen und Simulation sind in FreeCAD deutlich schwächer als in kommerziellen Paketen.',
      ],
      en: [
        'FreeCAD is parametric like Fusion 360 and entirely sufficient for your own designs and 3D printing. Its interaction model is idiosyncratic and takes learning.',
        'KiCad for circuit boards is not a compromise but an industry standard — companies use it too.',
        'Onshape runs entirely in the browser and is therefore independent of the operating system.',
        'Does not carry over: native files such as .dwg, .sldprt or .ipt exchange only partially. For clients and manufacturers, STEP and STL are the dependable route.',
        'Large assemblies and simulation are considerably weaker in FreeCAD than in commercial packages.',
      ],
    },
    links: [{ label: 'FreeCAD', url: 'https://www.freecad.org' }, { label: 'KiCad', url: 'https://www.kicad.org' }],
  },
  {
    id: 'tax-open',
    severity: 'info',
    title: { de: 'Steuererklärung ohne Windows-Programm', en: 'Tax returns without a Windows program' },
    message: {
      de: 'Da du auch anders arbeiten würdest, fällt die Steuersoftware als Hindernis weg. Für die meisten privaten Steuererklärungen braucht es unter Linux gar kein installiertes Programm.',
      en: 'Since you would work another way, tax software stops being an obstacle. Most private tax returns need no installed program on Linux at all.',
    },
    advice: {
      de: [
        'ELSTER läuft vollständig im Browser, ist kostenlos und deckt den Normalfall ab.',
        'Mehrere kommerzielle Anbieter haben Browser-Versionen, die unter Linux funktionieren – meist im Abo statt als Kauf.',
        'Für die Buchhaltung: GnuCash als freie Alternative oder ein browserbasierter Dienst.',
        'Wenn du auf ein bestimmtes Programm angewiesen bleibst, genügt eine Windows-Installation in einer virtuellen Maschine für die paar Stunden im Jahr.',
      ],
      en: [
        'The German tax portal ELSTER runs entirely in the browser, is free and covers the normal case.',
        'Several commercial vendors offer browser versions that work on Linux — usually by subscription rather than purchase.',
        'For bookkeeping: GnuCash as a free alternative, or a browser-based service.',
        'If you still depend on one specific program, a Windows install in a virtual machine is enough for those few hours a year.',
      ],
    },
    links: [{ label: 'ELSTER', url: 'https://www.elster.de' }],
  },
  {
    id: 'nvidia',
    severity: 'info',
    title: { de: 'NVIDIA-Grafik braucht einen zusätzlichen Treiber', en: 'NVIDIA graphics needs an additional driver' },
    message: {
      de: 'Anders als bei Intel und AMD steckt der NVIDIA-Treiber nicht im System, sondern muss ergänzt werden. Bei einigen Distributionen ist er bereits auf der ISO, bei anderen ein Klick im Installer, bei wieder anderen ein Repository und ein paar Befehle.',
      en: 'Unlike Intel and AMD, the NVIDIA driver is not part of the system and has to be added. Some distributions ship it on the ISO, others offer a checkbox in the installer, and others require a repository and a few commands.',
    },
    advice: {
      de: [
        'Am bequemsten sind Distributionen mit vorbereitetem Treiber: Pop!_OS (eigene NVIDIA-ISO), Nobara, Bazzite, TUXEDO OS.',
        'Bei Fedora kommt der Treiber aus RPM Fusion und muss bewusst eingerichtet werden.',
        'Secure Boot und NVIDIA-Treiber vertragen sich nur, wenn die Distribution das Signieren übernimmt – sonst muss Secure Boot aus.',
        'Im Live-System vorher testen, ob Bildschirm, Auflösung und externer Monitor funktionieren.',
      ],
      en: [
        'The most convenient are distributions with the driver prepared: Pop!_OS (dedicated NVIDIA ISO), Nobara, Bazzite, TUXEDO OS.',
        'On Fedora the driver comes from RPM Fusion and must be set up deliberately.',
        'Secure Boot and the NVIDIA driver only coexist if the distribution handles signing — otherwise Secure Boot must be off.',
        'Test in a live session first whether the display, resolution and external monitor work.',
      ],
    },
  },
  {
    id: 'nvidia-legacy',
    severity: 'warning',
    title: { de: 'Ältere NVIDIA-Karten und Wayland vertragen sich schlecht', en: 'Older NVIDIA cards and Wayland do not get along' },
    message: {
      de: 'NVIDIAs quelloffene Kernelmodule setzen die Turing-Generation voraus, also etwa ab GTX 16xx und RTX 20xx. Ältere Karten laufen mit den bisherigen Treibern weiter, unter Wayland aber oft mit Flackern, schwarzen Fenstern oder Problemen beim Aufwachen aus dem Ruhezustand. GNOME 50 hat die X11-Sitzung entfernt, Plasma folgt mit Version 6.8 im Oktober 2026.',
      en: 'NVIDIA’s open kernel modules require the Turing generation, roughly GTX 16xx and RTX 20xx onwards. Older cards keep working with the legacy drivers, but under Wayland often show flickering, black windows or resume problems. GNOME 50 removed the X11 session; Plasma follows with 6.8 in October 2026.',
    },
    advice: {
      de: [
        'Wähle eine Distribution mit X11-Sitzung: Linux Mint, MX Linux, Xubuntu oder eine Xfce-Ausgabe.',
        'Bei KDE Plasma bleibt X11 nur noch bis Version 6.8 verfügbar – das ist eine Übergangslösung, keine dauerhafte.',
        'Auf lange Sicht ist ein Grafikkartenwechsel auf AMD die entspannteste Lösung.',
        'Unbedingt vorher im Live-System testen.',
      ],
      en: [
        'Choose a distribution with an X11 session: Linux Mint, MX Linux, Xubuntu or an Xfce edition.',
        'On KDE Plasma, X11 is only available up to version 6.8 — that is a stopgap, not a permanent answer.',
        'Long term, moving to an AMD card is the least stressful solution.',
        'Definitely test in a live session first.',
      ],
    },
  },
  {
    id: 'apple-silicon',
    severity: 'warning',
    title: { de: 'Apple Silicon: Linux läuft, aber nicht vollständig', en: 'Apple Silicon: Linux runs, but not completely' },
    message: {
      de: 'Auf Macs mit M-Prozessor bringt das Asahi-Linux-Projekt Linux zum Laufen. Je nach Modell und Generation fehlen aber noch Bausteine – bei neueren Chips mehr als bei M1 und M2. Für einen Alltagsrechner ist das nur mit Kompromissen geeignet.',
      en: 'On Macs with M-series chips, the Asahi Linux project makes Linux run. Depending on model and generation, pieces are still missing — more on newer chips than on M1 and M2. As a daily driver this only works with compromises.',
    },
    advice: {
      de: [
        'Aktuellen Stand direkt bei Asahi Linux prüfen; die Unterstützung unterscheidet sich stark je Modell.',
        'Klassische x86-Distributionen laufen auf diesen Geräten nicht.',
        'Für produktive Arbeit ist macOS mit Linux in einer virtuellen Maschine oft der pragmatischere Weg.',
      ],
      en: [
        'Check the current state directly with Asahi Linux; support differs strongly per model.',
        'Classic x86 distributions do not run on these devices.',
        'For productive work, macOS with Linux in a virtual machine is often the more pragmatic path.',
      ],
    },
    links: [{ label: 'Asahi Linux', url: 'https://asahilinux.org' }],
  },
  {
    id: 'backup',
    severity: 'warning',
    title: { de: 'Ohne Sicherung ist jeder Umstieg ein Risiko', en: 'Without a backup, every switch is a gamble' },
    message: {
      de: 'Bei der Installation wird die Festplatte partitioniert. Ein falscher Klick reicht, um alles zu löschen – und das passiert Erfahrenen genauso wie Anfängern.',
      en: 'Installing repartitions the disk. One wrong click is enough to erase everything — and that happens to experienced people just as much as beginners.',
    },
    advice: {
      de: [
        'Vor der Installation alle wichtigen Daten auf eine externe Festplatte kopieren. Nicht auf eine zweite Partition derselben Platte.',
        'Browser-Lesezeichen, E-Mail-Konten und Lizenzschlüssel gesondert notieren.',
        'Nach der Installation eine automatische Sicherung einrichten, bevor man wieder Daten anhäuft.',
        'Distributionen mit Systemschnappschüssen (Mint mit Timeshift, openSUSE mit Snapper, alle Atomic-Systeme) ersetzen keine Datensicherung – sie sichern nur das System, nicht deine Dateien.',
      ],
      en: [
        'Copy everything important to an external drive before installing. Not to a second partition on the same disk.',
        'Note browser bookmarks, email accounts and licence keys separately.',
        'Set up automatic backups after installing, before you accumulate data again.',
        'Distributions with system snapshots (Mint with Timeshift, openSUSE with Snapper, all atomic systems) are not a substitute for backups — they protect the system, not your files.',
      ],
    },
  },
  {
    id: 'accessibility',
    severity: 'warning',
    title: { de: 'Barrierefreiheit: die Wahl des Desktops zählt mehr als die Distribution', en: 'Accessibility: the desktop matters more than the distribution' },
    message: {
      de: 'Der Bildschirmleser Orca ist unter GNOME am besten integriert; dort funktionieren auch Vergrößerung, hohe Kontraste und Tastaturnavigation am zuverlässigsten. KDE Plasma hat aufgeholt, liegt aber noch zurück. Leichte Desktops wie Xfce oder LXQt sind für Bildschirmleser kaum geeignet.',
      en: 'The Orca screen reader is best integrated in GNOME, where magnification, high contrast and keyboard navigation are also most reliable. KDE Plasma has caught up but still trails. Lightweight desktops such as Xfce or LXQt are barely suitable for screen readers.',
    },
    advice: {
      de: [
        'Wähle eine GNOME-basierte Distribution: Ubuntu, Fedora Workstation oder Debian mit GNOME.',
        'Ubuntu hat die längste Erfahrung mit Barrierefreiheit und die meisten Anleitungen.',
        'Vor dem Umstieg unbedingt im Live-System testen, ob Sprachausgabe und Braillezeile funktionieren.',
        'Der Wechsel von X11 zu Wayland hat in diesem Bereich einiges verändert – Erfahrungsberichte sollten aktuell sein.',
      ],
      en: [
        'Pick a GNOME-based distribution: Ubuntu, Fedora Workstation or Debian with GNOME.',
        'Ubuntu has the longest accessibility track record and the most guides.',
        'Definitely test speech output and any braille display in a live session before switching.',
        'The move from X11 to Wayland changed a lot here — make sure any reports you read are current.',
      ],
    },
  },
  {
    id: 'vr',
    severity: 'warning',
    title: { de: 'VR unter Linux ist möglich, aber Bastelarbeit', en: 'VR on Linux is possible, but it is a project' },
    message: {
      de: 'Valve Index und einige SteamVR-Geräte funktionieren. Meta-Quest-Headsets im Link-Betrieb und Windows-Mixed-Reality-Geräte funktionieren nicht oder nur mit erheblichem Aufwand.',
      en: 'The Valve Index and some SteamVR devices work. Meta Quest headsets over Link and Windows Mixed Reality devices do not work, or only with considerable effort.',
    },
    advice: {
      de: [
        'Vor dem Kauf oder Umstieg die konkrete Headset-Unterstützung prüfen.',
        'Eine aktuelle Distribution mit neuem Kernel und Mesa hilft; ältere LTS-Ausgaben sind hier hinderlich.',
        'Monado ist die offene Alternative zu SteamVR und deckt einige Geräte ab.',
      ],
      en: [
        'Check support for your specific headset before buying or switching.',
        'A current distribution with a recent kernel and Mesa helps; older LTS releases get in the way here.',
        'Monado is the open alternative to SteamVR and covers some devices.',
      ],
    },
  },
  {
    id: 'threat-model',
    severity: 'info',
    title: { de: 'Bei einem echten Bedrohungsmodell zählt mehr als die Distribution', en: 'With a real threat model, more than the distribution matters' },
    message: {
      de: 'Qubes OS und Tails sind exzellente Werkzeuge, aber sie ersetzen keine durchdachte Arbeitsweise. Hardware, Firmware, Metadaten und Gewohnheiten sind mindestens genauso wichtig.',
      en: 'Qubes OS and Tails are excellent tools, but they do not replace a thought-through way of working. Hardware, firmware, metadata and habits matter at least as much.',
    },
    advice: {
      de: [
        'Bedrohungsmodell zuerst schriftlich festhalten, dann Werkzeuge wählen.',
        'Tails für einzelne, besonders sensible Vorgänge; Qubes OS als dauerhafter Arbeitsplatz.',
        'Bei journalistischer oder aktivistischer Arbeit: Beratung durch Organisationen wie Reporter ohne Grenzen oder die EFF einholen.',
      ],
      en: [
        'Write down the threat model first, then choose tools.',
        'Tails for individual, particularly sensitive operations; Qubes OS as a permanent workstation.',
        'For journalistic or activist work, get advice from organisations such as Reporters Without Borders or the EFF.',
      ],
    },
  },
  {
    id: 'no-systemd',
    severity: 'info',
    title: { de: 'Ohne systemd fehlen Bausteine, die moderne Desktops erwarten', en: 'Without systemd, building blocks modern desktops expect are missing' },
    message: {
      de: 'Sitzungsverwaltung, Berechtigungsportale, Ruhezustand und einige Flatpak-Funktionen setzen Komponenten voraus, die üblicherweise systemd mitbringt. Ersatzlösungen wie elogind decken vieles ab, aber nicht alles.',
      en: 'Session management, permission portals, suspend and some Flatpak features rely on components systemd usually provides. Substitutes such as elogind cover much of it, but not everything.',
    },
    advice: {
      de: [
        'Vorab prüfen, ob die benötigten Programme ohne systemd laufen.',
        'Leichte Desktops und Fenstermanager vertragen sich besser mit Alternativen als GNOME.',
        'MX Linux erlaubt die Wahl beim Systemstart – ein guter Weg, das auszuprobieren.',
      ],
      en: [
        'Check in advance whether the programs you need run without systemd.',
        'Lightweight desktops and window managers cope better with alternatives than GNOME.',
        'MX Linux lets you choose at boot — a good way to try it out.',
      ],
    },
  },
  {
    id: 'x11-sunset',
    severity: 'warning',
    title: { de: 'X11 hat ein Ablaufdatum', en: 'X11 has an expiry date' },
    message: {
      de: 'GNOME 50 hat die X11-Sitzung im Frühjahr 2026 entfernt. KDE Plasma folgt mit Version 6.8 im Oktober 2026. Xfce, MATE, Cinnamon und die klassischen Fenstermanager laufen weiter auf X11, aber die Entwicklung geht klar in eine Richtung.',
      en: 'GNOME 50 removed the X11 session in spring 2026. KDE Plasma follows with 6.8 in October 2026. Xfce, MATE, Cinnamon and the classic window managers still run on X11, but the direction of travel is clear.',
    },
    advice: {
      de: [
        'Wenn X11 nur wegen eines einzelnen Werkzeugs nötig ist: prüfen, ob es inzwischen eine Wayland-Variante gibt.',
        'Für dauerhaften X11-Betrieb sind Xfce, MATE und Cinnamon die verlässlichsten Wege.',
        'Bei einer LTS-Distribution hat man einige Jahre Zeit, den Wechsel zu planen.',
      ],
      en: [
        'If X11 is only needed for one tool, check whether a Wayland version now exists.',
        'For long-term X11 use, Xfce, MATE and Cinnamon are the most dependable routes.',
        'An LTS distribution buys you a few years to plan the transition.',
      ],
    },
  },
  {
    id: 'free-software',
    severity: 'info',
    title: { de: 'Konsequent freie Software heißt: Hardware auswählen, nicht Software anpassen', en: 'Strictly free software means choosing hardware, not adapting software' },
    message: {
      de: 'Ohne unfreie Firmware funktionieren viele WLAN-Chips, Bluetooth-Module, Grafikkarten und Fingerabdrucksensoren nicht. Das ist kein Fehler der Distribution, sondern eine Folge der Hardware.',
      en: 'Without non-free firmware, many Wi-Fi chips, Bluetooth modules, GPUs and fingerprint sensors do not work. That is not a distribution bug but a consequence of the hardware.',
    },
    advice: {
      de: [
        'Vor dem Umstieg im Live-System testen, was ohne Firmware funktioniert.',
        'Ein USB-WLAN-Stick mit freiem Treiber ist oft die einfachste Lösung.',
        'Die FSF führt eine Liste zertifizierter Hardware.',
      ],
      en: [
        'Test in a live session what works without firmware before switching.',
        'A USB Wi-Fi stick with a free driver is often the simplest fix.',
        'The FSF maintains a list of certified hardware.',
      ],
    },
  },
  {
    id: 'zfs',
    severity: 'info',
    title: { de: 'ZFS ist unter Linux ein Sonderfall', en: 'ZFS is a special case on Linux' },
    message: {
      de: 'Die Lizenz von ZFS verträgt sich nicht mit der des Linux-Kernels, deshalb liefert kaum eine Distribution es fest eingebaut aus. Es funktioniert gut, muss aber als separates Kernelmodul gepflegt werden – und das kann bei Kernel-Updates klemmen.',
      en: 'ZFS’s licence is incompatible with the Linux kernel’s, so almost no distribution ships it built in. It works well but has to be maintained as a separate kernel module — and that can break on kernel updates.',
    },
    advice: {
      de: [
        'Proxmox VE bringt ZFS fertig eingerichtet mit und ist für Speicher- und Virtualisierungsaufgaben der einfachste Weg.',
        'Unter Ubuntu ist ZFS als Modul verfügbar, unter NixOS und Void ebenfalls gut unterstützt.',
        'Wer ZFS nur wegen Schnappschüssen will, ist mit Btrfs meist einfacher bedient.',
      ],
      en: [
        'Proxmox VE ships ZFS ready to go and is the simplest route for storage and virtualisation tasks.',
        'On Ubuntu, ZFS is available as a module; NixOS and Void support it well too.',
        'If you only want ZFS for snapshots, Btrfs is usually simpler.',
      ],
    },
  },
];

export const flagById = new Map(flags.map((f) => [f.id, f]));
