[English](README.md) · **Deutsch**

# LinuxKompass

Eine zweisprachige Entscheidungshilfe für Menschen, die auf Linux umsteigen
möchten und nicht wissen, wo sie anfangen sollen. Sie fragt nach Hardware,
Arbeitsweise und Geduld – und erklärt anschließend jede Empfehlung, statt nur
eine Zahl auszugeben.

**→ [technikweber.github.io/LinuxKompass](https://technikweber.github.io/LinuxKompass/)**

## Was es kann

- **Drei Tiefen.** Drei kurze Fragen schätzen ein, ob der Einsteigerpfad (12
  Fragen), der Fortgeschrittenenpfad (22) oder der Profipfad (36) passt. Der
  Vorschlag ist nur ein Vorschlag – du kannst den Modus jederzeit wechseln, auch
  mitten im Fragebogen, ohne Antworten zu verlieren.
- **Nachfragen, wo es zählt.** Wer Adobe, Microsoft Office oder CAD-Software als
  Hindernis nennt, bekommt eine gezielte Nachfrage: Käme eine Alternative für
  dich überhaupt infrage? Ein Ja hebt das Hindernis auf und ersetzt die Warnung
  durch eine konkrete Aufstellung, was GIMP, Darktable, LibreOffice oder FreeCAD
  gut können – und was nicht übertragbar ist (VBA-Makros, PSD-Smart-Objekte,
  native CAD-Dateien). Keine Nachfrage bei Spielen mit Anti-Cheat und bei
  Branchensoftware: Dort gibt es keine ehrliche Alternative vorzuschlagen.
- **55 recherchierte Distributionen** mit je rund 45 Merkmalen: Release-Modell,
  Init-System, C-Bibliothek, Paketverwaltung, Secure Boot, NVIDIA-Handhabung,
  Wayland/X11-Stand, Systemschnappschüsse, Mindest-RAM, Architekturen,
  Trägerschaft, Telemetrie, deutschsprachige Hilfe, Pflegeaufwand und mehr. Zu
  jedem Eintrag stehen Quellen und ein Prüfdatum.
- **Nachvollziehbare Bewertung.** Zu jedem Ergebnis lässt sich die
  Punkteherkunft aufklappen: welche Bewertungsdimension wie viele Punkte
  beigesteuert hat. Ausgeschlossene Distributionen stehen gesondert, jeweils mit
  der konkreten Anforderung, an der sie gescheitert sind.
- **Ehrliche harte Anforderungen.** Wer angibt, nie ein Terminal benutzen zu
  wollen, bekommt Arch ausgeschlossen – nicht bloß abgewertet. Gelockert wird
  nur, wenn sonst gar nichts übrig bliebe, und dann wird genau benannt, welche
  Anforderung dafür fallen musste.
- **Eigene Desktop-Empfehlung.** Die Oberfläche entscheidet im Alltag oft mehr
  als die Distribution darunter, und sie lässt sich bei fast jeder Distribution
  austauschen – deshalb bekommt sie ein eigenes kurzes Urteil („Zu deinen
  Antworten passt Cinnamon, weil er dem Bedienkonzept von Windows am nächsten
  kommt"), samt Einschränkungen und der Angabe, ob die empfohlene Distribution
  ihn überhaupt mitliefert.
- **Direkter Vergleich.** Distributionen **und** Desktops anhaken und je bis zu
  sechs nebeneinander legen. Verglichen wird in zwei getrennten Tabellen statt
  in einer: Sie haben unterschiedliche Merkmale, und „Mint oder Fedora" und
  „Cinnamon oder Plasma" gleichzeitig zu überlegen ist völlig normal. Ein Filter
  blendet Zeilen aus, in denen die Einträge übereinstimmen.
- **Auch das, was nicht geht.** Adobe Creative Cloud, Spiele mit
  Kernel-Anti-Cheat, CAD, deutsche Steuersoftware, alte NVIDIA-Karten unter
  Wayland, Barrierefreiheit, konsequent freie Software: ein Katalog aus 18
  Punkten, die unabhängig von der Distribution über einen Umstieg entscheiden –
  jeweils mit den Alternativen, die es tatsächlich gibt.
- **Teilbare Ergebnisse.** Die Antworten stehen in der Adresszeile, ein
  Ergebnis-Link stellt dieselbe Empfehlung wieder her.
- **Vorher ausprobieren.** Verweis auf [DistroSea](https://distrosea.com/), wo
  über 80 Distributionen und ihre Oberflächen live im Browser laufen.
- Durchgehend deutsch und englisch, helles und dunkles Farbschema, mit der
  Tastatur bedienbar, sauber als PDF druckbar, ohne Nutzerverfolgung, ohne
  Cookies, ohne externe Anfragen.

## Wie die Empfehlung zustande kommt

Jede Antwort wirkt auf drei Arten:

1. Sie **gewichtet Bewertungsdimensionen** – 16 Stück, von `stability` über
   `germanSupport` bis `upstreamPurity`.
2. Sie kann eine **harte Anforderung** setzen, ausgedrückt als eines von 39
   benannten Prädikaten über eine Distribution (`secure-boot`, `ram-2gb`,
   `no-systemd`, `x11-session`, …).
3. Sie kann **einzelne Distributionen gezielt bevorzugen**, wenn eine Antwort
   eindeutig auf sie zeigt – „das System soll sich aus einer Konfigurationsdatei
   ergeben" ist eine Beschreibung von NixOS, keine Vorliebe.

Die Grundpunktzahl ist ein gewichteter Mittelwert über die
Bewertungsdimensionen, normiert auf 0–100, anschließend gespreizt und nach oben
weich gedeckelt. So klebt das Ergebnisfeld nicht bei 95 bis 97, und 100 bleibt
der theoretischen Bestleistung vorbehalten. Zuschläge aus Vorlieben und
Distributions-Treffern kommen sättigend obendrauf: ein einzelner Treffer kann
die Wertung nicht überfahren, eine wirklich definierende Antwort setzt sich
trotzdem durch.

Die Umsetzung steht in [`src/engine/score.ts`](src/engine/score.ts), das
abgesicherte Verhalten in
[`src/engine/score.test.ts`](src/engine/score.test.ts).

## Daten

Alle Distributionsdaten liegen in [`src/data/distros/`](src/data/distros/), nach
Familien gruppiert und vollständig typisiert gegen
[`src/data/types.ts`](src/data/types.ts). Jeder Eintrag trägt `checkedAt` und
eine `sources`-Liste. Die Daten wurden im September 2026 anhand offizieller
Ankündigungen, Release Notes und Projektseiten geprüft.

Versionsnummern und Supportzeiträume veralten schnell. Wenn dir etwas auffällt,
das nicht mehr stimmt, ist ein Issue oder ein Pull Request der schnellste Weg.

## Entwicklung

```bash
npm install
npm run dev        # lokaler Entwicklungsserver
npm run test:run   # 29 Tests für Datenbestand und Bewertung
npm run typecheck
npm run build      # Produktivbau nach dist/
```

Die Veröffentlichung läuft automatisch: Jeder Push auf `main` prüft Typen,
führt die Tests aus, baut das Projekt in GitHub Actions und stellt das Ergebnis
auf GitHub Pages bereit.

## Mitmachen

Korrekturen an Versionsnummern, Bewertungen oder Texten sind ausdrücklich
erwünscht, ebenso neue Distributionen und Übersetzungen. Siehe
[CONTRIBUTING.md](CONTRIBUTING.md).

## Vorbilder

[distrochooser.de](https://distrochooser.de) und
[der LinuxChooser von The Morpheus](https://github.com/TheMorpheus407/LinuxChooser)
haben gezeigt, dass so ein Werkzeug gebraucht wird und wie man es sinnvoll
aufzieht. LinuxKompass ist eine eigenständige Umsetzung mit eigenem
Datenbestand, eigener Bewertungslogik und eigener Gestaltung.

## Lizenz

Der Code steht unter der [MIT-Lizenz](LICENSE). Die Distributionsdaten in
`src/data/` stehen unter
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) – nachnutzen gern,
aber mit Herkunftsangabe.
