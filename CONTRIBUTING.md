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
