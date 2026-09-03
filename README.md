**English** · [Deutsch](README.de.md)

# LinuxKompass

A bilingual decision aid for people who want to switch to Linux and do not know
where to start. It asks about your hardware, your habits and your patience — and
then explains every recommendation instead of just printing a number.

**→ [technikweber.github.io/LinuxKompass](https://technikweber.github.io/LinuxKompass/)**

## What it does

- **Three depths.** Three short questions estimate whether you want the
  12-question beginner path, the 23-question advanced path or the 37-question
  expert path. The suggestion is only a suggestion — you can switch modes at any
  point, including mid-questionnaire, without losing your answers.
- **55 researched distributions**, each with ~45 attributes: release model, init
  system, libc, package manager, Secure Boot, NVIDIA handling, Wayland/X11
  status, snapshot support, minimum RAM, architectures, governance, telemetry
  policy, German-language support, maintenance load and more. Every entry cites
  its sources and carries a check date.
- **Traceable scoring.** For each result you can open the score breakdown and
  see which rating dimension contributed how many points. Distributions that
  were ruled out are listed separately, each with the specific requirement it
  failed.
- **Honest hard requirements.** If you say you never want to use a terminal,
  Arch is excluded — not merely down-ranked. Requirements are only relaxed when
  nothing at all would remain, and the result tells you exactly which one was
  dropped.
- **A desktop recommendation, separately.** The desktop often matters more day
  to day than the distribution beneath it, and on almost any distribution you
  can swap it — so it gets its own short verdict ("Cinnamon fits your answers
  because it comes closest to the way Windows works"), with its caveats and
  whether the recommended distribution actually ships it.
- **Side-by-side comparison.** Tick any distributions *and* desktops to compare
  up to six of each. They are compared in two separate tables rather than one:
  they have different attributes, and shortlisting "Mint or Fedora" and
  "Cinnamon or Plasma" at the same time is a perfectly normal thing to do. A
  filter hides rows where the entries agree.
- **What will not work.** Adobe Creative Cloud, kernel-level anti-cheat, CAD,
  German tax software, old NVIDIA cards on Wayland, accessibility, free-software
  purity: an 18-entry catalogue of things that decide a switch regardless of
  distribution — each with the alternatives that actually exist.
- **Shareable results.** Answers are encoded in the URL, so a result link
  reproduces the exact recommendation.
- **Try before installing.** Links to [DistroSea](https://distrosea.com/), where
  80+ distributions and their desktops run live in the browser.
- German and English throughout, light and dark themes, keyboard accessible,
  prints cleanly to PDF, no tracking, no cookies, no external requests.

## How the recommendation is produced

Every answer acts in three ways:

1. It **weights rating dimensions** — 16 of them, from `stability` to
   `germanSupport` to `upstreamPurity`.
2. It can set a **hard requirement**, expressed as one of 39 named predicates
   over a distribution (`secure-boot`, `ram-2gb`, `no-systemd`, `x11-session`, …).
3. It can **favour specific distributions** when an answer points at one
   unambiguously — "the system should follow from a configuration file" is a
   description of NixOS, not a preference.

The base score is a weighted average across the rating dimensions, normalised to
0–100 and then spread and soft-capped so that results do not all cluster in the
high nineties and 100 stays reserved for a theoretical perfect fit. Preference
and distribution bonuses are added on top with saturation, so a single strong
match cannot run away with the total while a genuinely defining answer still
wins.

See [`src/engine/score.ts`](src/engine/score.ts) for the implementation and
[`src/engine/score.test.ts`](src/engine/score.test.ts) for the behaviour that is
pinned by tests.

## Data

All distribution data lives in [`src/data/distros/`](src/data/distros/), grouped
by family, and is fully typed against
[`src/data/types.ts`](src/data/types.ts). Every entry carries `checkedAt` and a
`sources` list. The data was verified in September 2026 against official release
announcements, release notes and project pages.

Version numbers and support windows go stale quickly. If you find something that
is no longer correct, an issue or a pull request is the fastest way to fix it.

## Development

```bash
npm install
npm run dev        # local dev server
npm run test:run   # 29 data-integrity and scoring tests
npm run typecheck
npm run build      # production build into dist/
```

Deployment happens automatically: every push to `main` runs type checking, tests
and the build in GitHub Actions and publishes the result to GitHub Pages.

## Contributing

Corrections to version numbers, ratings or wording are explicitly welcome, as are
new distributions and translations. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Prior art

[distrochooser.de](https://distrochooser.de) and
[The Morpheus' LinuxChooser](https://github.com/TheMorpheus407/LinuxChooser)
showed that this kind of tool is needed and how to structure it sensibly.
LinuxKompass is an independent implementation with its own data set, its own
scoring logic and its own design.

## License

Code under the [MIT License](LICENSE). The distribution data in `src/data/` is
released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) —
reuse it, but say where it came from.
