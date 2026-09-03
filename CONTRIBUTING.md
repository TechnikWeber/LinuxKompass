**English** · [Deutsch](#mitmachen)

# Contributing to LinuxKompass

Corrections are the most valuable contribution here. Version numbers and support
windows go stale within months, and a wrong number is worse than a missing one.

## Fixing a distribution entry

Distribution data lives in `src/data/distros/`, grouped by family. Each entry is
plain, fully typed data — no code to touch.

1. Find the entry and change what is wrong.
2. Update `checkedAt` to today's date (`YYYY-MM-DD`).
3. Add or update a `sources` entry pointing at the official announcement,
   release notes or project page you verified it against. Blog posts and news
   aggregators are fine as a secondary source, never as the only one.
4. Run `npm run test:run`. The test suite checks referential integrity, that all
   ratings stay within 0–10, and that both languages are present everywhere.

Please keep both `de` and `en` filled in. An entry with only one language will
fail the tests.

## Adding a distribution

Add it to the file matching its family (or `independent.ts`), then it appears
automatically in the questionnaire, the overview and the comparison. Two rules:

- **Ratings are relative to other desktop distributions**, not absolute. "8 out
  of 10 for stability" means "more stable than most", not "80 % bug-free".
- **Write the warnings honestly.** The `warnings` and `notFor` fields are what
  make this tool useful. An entry where everything sounds great is not finished.

## Changing questions or scoring

- Questions: `src/data/questions/` — `core.ts` (all modes), `advanced.ts`,
  `expert.ts`. They are pure data; effects reference named requirements from
  `src/engine/requirements.ts`.
- Scoring: `src/engine/score.ts`. Changes here need a test in
  `score.test.ts` that pins the behaviour you intended.

## Before opening a pull request

```bash
npm run typecheck && npm run lint && npm run test:run && npm run build
```

---

# Mitmachen

Korrekturen sind hier der wertvollste Beitrag. Versionsnummern und
Supportzeiträume veralten innerhalb von Monaten, und eine falsche Angabe ist
schlimmer als eine fehlende.

## Einen Distributionseintrag korrigieren

Die Daten liegen in `src/data/distros/`, nach Familien gruppiert. Jeder Eintrag
ist reine, typisierte Datenstruktur – am Code muss nichts angefasst werden.

1. Eintrag suchen und korrigieren.
2. `checkedAt` auf das heutige Datum setzen (`JJJJ-MM-TT`).
3. Unter `sources` die offizielle Ankündigung, die Release Notes oder die
   Projektseite ergänzen, gegen die du geprüft hast. Blogbeiträge und
   Nachrichtenseiten sind als Zweitquelle in Ordnung, nie als einzige.
4. `npm run test:run` ausführen. Die Tests prüfen Verweise, den Wertebereich
   aller Bewertungen und die Vollständigkeit beider Sprachen.

Bitte immer `de` **und** `en` füllen – ein einsprachiger Eintrag fällt durch die
Tests.

## Eine Distribution ergänzen

In die Datei der passenden Familie eintragen (oder `independent.ts`), dann
erscheint sie automatisch im Fragebogen, in der Übersicht und im Vergleich. Zwei
Regeln:

- **Bewertungen sind relativ** zu anderen Desktop-Distributionen, nicht absolut.
  „8 von 10 bei Stabilität" heißt „stabiler als die meisten", nicht „zu 80 %
  fehlerfrei".
- **Warnungen ehrlich schreiben.** Die Felder `warnings` und `notFor` machen
  dieses Werkzeug erst nützlich. Ein Eintrag, bei dem alles großartig klingt, ist
  nicht fertig.

## Fragen oder Bewertung ändern

- Fragen: `src/data/questions/` – `core.ts` (alle Modi), `advanced.ts`,
  `expert.ts`. Reine Daten; die Wirkungen verweisen auf benannte Anforderungen
  aus `src/engine/requirements.ts`.
- Bewertung: `src/engine/score.ts`. Änderungen brauchen einen Test in
  `score.test.ts`, der das gewünschte Verhalten festhält.

## Vor einem Pull Request

```bash
npm run typecheck && npm run lint && npm run test:run && npm run build
```
