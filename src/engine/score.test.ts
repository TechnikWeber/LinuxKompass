import { describe, expect, it } from 'vitest';
import { distros } from '../data/distros';
import { allQuestions, baseQuestionCount, questionsForMode, visibleQuestions, type Answers } from '../data/questions';
import { requirements } from './requirements';
import { buildProfile, scoreAll } from './score';
import { flagById } from '../data/flags';
import { desktopById, desktops } from '../data/desktops';
import { scoreDesktops } from './desktop';

/** Hilfsfunktion: nimmt die erste Option einer Frage. */
function pick(questionId: string, optionId: string): Answers {
  return { [questionId]: [optionId] };
}

describe('Datenbestand', () => {
  it('hat eindeutige Distributions-IDs', () => {
    const ids = distros.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('verweist nur auf bekannte Desktops', () => {
    for (const d of distros) {
      for (const de of d.availableDesktops) {
        expect(desktopById.has(de), `${d.id} nennt unbekannten Desktop ${de}`).toBe(true);
      }
      if (d.defaultDesktop !== 'none') {
        expect(desktopById.has(d.defaultDesktop), `${d.id}: ${d.defaultDesktop}`).toBe(true);
      }
    }
  });

  it('nennt den Standarddesktop auch in der Liste der verfügbaren', () => {
    for (const d of distros) {
      if (d.defaultDesktop === 'none') continue;
      expect(d.availableDesktops, d.id).toContain(d.defaultDesktop);
    }
  });

  it('hält alle Bewertungen im Bereich 0–10', () => {
    for (const d of distros) {
      for (const [key, value] of Object.entries(d.ratings)) {
        expect(value, `${d.id}.${key}`).toBeGreaterThanOrEqual(0);
        expect(value, `${d.id}.${key}`).toBeLessThanOrEqual(10);
      }
    }
  });

  it('hat für jeden Text beide Sprachen', () => {
    for (const d of distros) {
      expect(d.tagline.de.length, d.id).toBeGreaterThan(0);
      expect(d.tagline.en.length, d.id).toBeGreaterThan(0);
      expect(d.description.de.length, d.id).toBeGreaterThan(20);
      expect(d.description.en.length, d.id).toBeGreaterThan(20);
      for (const list of [d.highlights, d.bestFor, d.notFor, d.warnings, d.firstSteps, d.extraRepos]) {
        expect(list.de.length, d.id).toBe(list.en.length);
      }
    }
  });

  it('gibt zu jeder Distribution mindestens eine Quelle und ein Prüfdatum an', () => {
    for (const d of distros) {
      expect(d.sources.length, d.id).toBeGreaterThan(0);
      expect(d.checkedAt, d.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('hält kurze Beschriftungen kurz genug für die Kartenansicht', () => {
    // Sehr lange Versionsangaben landen als Chip in schmalen Rasterspalten und
    // haben dort schon einmal das Layout aufgerissen. Der Kontext gehört in die
    // Beschreibung, nicht in die Versionsangabe.
    for (const d of distros) {
      expect(d.currentVersion.length, `${d.id}: "${d.currentVersion}"`).toBeLessThanOrEqual(34);
      expect(d.monogram.length, d.id).toBeLessThanOrEqual(3);
    }
  });

  it('nennt basedOn nur mit existierender ID', () => {
    const ids = new Set(distros.map((d) => d.id));
    for (const d of distros) {
      if (d.basedOn) expect(ids.has(d.basedOn), `${d.id} → ${d.basedOn}`).toBe(true);
    }
  });
});

describe('Fragenkatalog', () => {
  it('hat eindeutige Fragen-IDs', () => {
    const ids = allQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('hat je Frage eindeutige Options-IDs', () => {
    for (const q of allQuestions) {
      const ids = q.options.map((o) => o.id);
      expect(new Set(ids).size, q.id).toBe(ids.length);
    }
  });

  it('verweist nur auf bekannte Anforderungen', () => {
    for (const q of allQuestions) {
      for (const o of q.options) {
        for (const id of [...(o.effect.require ?? []), ...(o.effect.prefer ?? []), ...(o.effect.avoid ?? [])]) {
          expect(requirements.has(id), `${q.id}/${o.id}: ${id}`).toBe(true);
        }
      }
    }
  });

  it('verweist nur auf bekannte Distributionen und Hinweise', () => {
    const ids = new Set(distros.map((d) => d.id));
    for (const q of allQuestions) {
      for (const o of q.options) {
        for (const id of Object.keys(o.effect.boostDistros ?? {})) {
          expect(ids.has(id), `${q.id}/${o.id}: ${id}`).toBe(true);
        }
        for (const id of o.effect.flags ?? []) {
          expect(flagById.has(id), `${q.id}/${o.id}: ${id}`).toBe(true);
        }
      }
    }
  });

  it('nutzt in boostTags nur Schlagworte oder Desktops, die es gibt', () => {
    const known = new Set<string>();
    for (const d of distros) {
      d.tags.forEach((t) => known.add(t));
      d.availableDesktops.forEach((t) => known.add(t));
    }
    for (const q of allQuestions) {
      for (const o of q.options) {
        for (const tag of Object.keys(o.effect.boostTags ?? {})) {
          expect(known.has(tag), `${q.id}/${o.id}: ${tag}`).toBe(true);
        }
      }
    }
  });

  it('verweist in showIf auf existierende Fragen und Optionen', () => {
    for (const q of allQuestions) {
      if (!q.showIf) continue;
      const target = allQuestions.find((x) => x.id === q.showIf!.questionId);
      expect(target, q.id).toBeDefined();
      for (const opt of q.showIf.anyOf) {
        expect(target!.options.some((o) => o.id === opt), `${q.id} → ${opt}`).toBe(true);
      }
    }
  });

  it('stellt in jedem Modus mehr Fragen als im vorherigen', () => {
    expect(questionsForMode('beginner').length).toBeGreaterThan(8);
    expect(questionsForMode('advanced').length).toBeGreaterThan(questionsForMode('beginner').length);
    expect(questionsForMode('expert').length).toBeGreaterThan(questionsForMode('advanced').length);
  });

  it('blendet bedingte Fragen korrekt aus und ein', () => {
    const without = visibleQuestions('advanced', {});
    const withGaming = visibleQuestions('advanced', { purpose: ['gaming'] });
    expect(without.some((q) => q.id === 'gaming-detail')).toBe(false);
    expect(withGaming.some((q) => q.id === 'gaming-detail')).toBe(true);
  });
});

describe('Bewertung', () => {
  it('liefert ohne Antworten alle Distributionen mit neutraler Wertung', () => {
    const { results } = scoreAll('beginner', {});
    expect(results.length).toBe(distros.length);
    expect(results.every((r) => r.eligible)).toBe(true);
  });

  it('schließt Distributionen ohne Terminal-Verzicht aus, wenn niemand ins Terminal will', () => {
    const { results } = scoreAll('beginner', pick('terminal', 'never'));
    const arch = results.find((r) => r.distro.id === 'arch')!;
    expect(arch.eligible).toBe(false);
    expect(arch.failed.length).toBeGreaterThan(0);
  });

  it('empfiehlt bei 2 GB RAM nur sehr sparsame Systeme', () => {
    const { results } = scoreAll('beginner', pick('ram', 'ram-2'));
    const eligible = results.filter((r) => r.eligible);
    expect(eligible.length).toBeGreaterThan(0);
    for (const r of eligible) {
      expect(r.distro.minRamGb, r.distro.id).toBeLessThanOrEqual(2);
    }
  });

  it('setzt bei alter NVIDIA-Karte eine X11-Sitzung voraus', () => {
    const { results } = scoreAll('beginner', pick('gpu', 'nvidia-old'));
    for (const r of results.filter((x) => x.eligible)) {
      expect(r.distro.x11SessionAvailable, r.distro.id).toBe(true);
      expect(r.distro.nvidia, r.distro.id).not.toBe('unsupported');
    }
  });

  it('lockert Anforderungen, statt eine leere Ergebnisliste zu liefern', () => {
    // Widersprüchlich: rollend UND zehn Jahre Support UND ohne systemd UND Secure Boot.
    const answers: Answers = {
      'support-duration': ['max'],
      'release-model': ['rolling'],
      'init-system': ['no-systemd'],
      'secure-boot': ['required'],
      terminal: ['never'],
    };
    const outcome = scoreAll('expert', answers);
    expect(outcome.results.filter((r) => r.eligible).length).toBeGreaterThanOrEqual(1);
    expect(outcome.relaxed.length).toBeGreaterThan(0);
  });

  it('lockert nur im Notfall und lässt ein kleines Ergebnisfeld sonst stehen', () => {
    // „Deklarativ" beschreibt genau zwei Distributionen: NixOS und Guix. Ein
    // Ergebnisfeld dieser Größe ist eine gültige Antwort und darf nicht
    // stillschweigend aufgeweicht werden.
    const outcome = scoreAll('expert', { 'package-philosophy': ['declarative'] });
    const eligible = outcome.results.filter((r) => r.eligible);
    expect(outcome.relaxed).toEqual([]);
    expect(eligible.map((r) => r.distro.id).sort()).toEqual(['guix', 'nixos']);
  });

  it('setzt eine eindeutige Antwort auch gegen eine allgemein starke Distribution durch', () => {
    const outcome = scoreAll('expert', {
      purpose: ['development'],
      'package-philosophy': ['source'],
      terminal: ['daily'],
      'maintenance-budget': ['lots'],
    });
    expect(outcome.results.filter((r) => r.eligible)[0]?.distro.id).toBe('gentoo');
  });

  it('vergibt nie die volle Punktzahl und spreizt das Feld erkennbar', () => {
    const outcome = scoreAll('beginner', {
      purpose: ['everyday'], 'coming-from': ['windows10'], 'hardware-age': ['mid'], ram: ['ram-8'],
      gpu: ['intel'], look: ['windows-like'], 'update-appetite': ['quiet'], 'breakage-tolerance': ['disaster'],
      terminal: ['never'], german: ['essential'], blockers: ['none'], 'safety-net': ['none'],
    });
    const eligible = outcome.results.filter((r) => r.eligible);
    expect(eligible[0].score).toBeLessThan(100);
    // Zwischen Platz 1 und Platz 5 muss ein sichtbarer Abstand liegen,
    // sonst ist die Zahl für eine Entscheidung wertlos.
    expect(eligible[0].score - eligible[Math.min(4, eligible.length - 1)].score).toBeGreaterThanOrEqual(5);
    expect(eligible[0].distro.id).toBe('linux-mint');
  });

  it('gewichtet Einsteigerfreundlichkeit spürbar, wenn danach gefragt wird', () => {
    const answers: Answers = { terminal: ['never'], 'coming-from': ['windows10'], look: ['windows-like'] };
    const { results } = scoreAll('beginner', answers);
    const top = results.filter((r) => r.eligible).slice(0, 5).map((r) => r.distro.id);
    expect(top.some((id) => ['linux-mint', 'zorin', 'kubuntu', 'ubuntu'].includes(id))).toBe(true);
  });

  it('führt Gaming-Antworten zu spieletauglichen Systemen', () => {
    const answers: Answers = { purpose: ['gaming'], 'gaming-detail': ['aaa-latest'], gpu: ['amd'], ram: ['ram-16'] };
    const { results } = scoreAll('advanced', answers);
    const top = results.filter((r) => r.eligible).slice(0, 6).map((r) => r.distro.id);
    expect(top.some((id) => ['bazzite', 'cachyos', 'nobara', 'garuda'].includes(id))).toBe(true);
  });

  it('führt Server-Antworten zu Langzeit-Systemen', () => {
    const answers: Answers = {
      purpose: ['server'],
      'support-duration': ['max'],
      terminal: ['daily'],
      'vendor-support': ['community'],
    };
    const { results } = scoreAll('advanced', answers);
    const top = results.filter((r) => r.eligible).slice(0, 6).map((r) => r.distro.id);
    expect(top.some((id) => ['debian', 'almalinux', 'rocky-linux', 'opensuse-leap', 'ubuntu'].includes(id))).toBe(true);
  });

  it('erzeugt Stolperfallen-Hinweise für Adobe und Anti-Cheat', () => {
    const profile = buildProfile('beginner', { blockers: ['adobe', 'anticheat'] });
    expect(profile.flags.has('adobe')).toBe(true);
    expect(profile.flags.has('anticheat')).toBe(true);
  });

  it('hält alle Punktzahlen im Bereich 0–100', () => {
    const answers: Answers = { purpose: ['gaming', 'development'], gpu: ['nvidia-new'], ram: ['ram-32'] };
    for (const r of scoreAll('expert', answers).results) {
      expect(r.score, r.distro.id).toBeGreaterThanOrEqual(0);
      expect(r.score, r.distro.id).toBeLessThanOrEqual(100);
    }
  });

  it('steigert die Verlässlichkeit mit der Zahl beantworteter Fragen', () => {
    const few = scoreAll('beginner', pick('ram', 'ram-8')).confidence;
    const many = scoreAll('beginner', {
      purpose: ['everyday'], 'coming-from': ['windows10'], 'hardware-age': ['mid'], ram: ['ram-8'],
      gpu: ['intel'], look: ['windows-like'], 'update-appetite': ['quiet'], 'breakage-tolerance': ['disaster'],
      terminal: ['copy-paste'], german: ['essential'], blockers: ['none'], 'safety-net': ['manual'],
    }).confidence;
    expect(many).toBeGreaterThan(few);
  });
});

// ---------------------------------------------------------------------------
// Desktop-Empfehlung
// ---------------------------------------------------------------------------

describe('Desktop-Empfehlung', () => {
  it('schweigt, solange nichts über die Oberfläche gesagt wurde', () => {
    expect(scoreDesktops('beginner', { blockers: ['none'] }).answered).toBe(0);
  });

  it('empfiehlt Windows-Umsteigern eine klassische Oberfläche', () => {
    const { results } = scoreDesktops('beginner', { look: ['windows-like'], terminal: ['never'] });
    expect(['cinnamon', 'plasma', 'mate', 'xfce']).toContain(results[0].desktop.id);
    expect(results[0].reasons).toContain('windows-like');
  });

  it('empfiehlt macOS-Umsteigern Pantheon oder GNOME', () => {
    const { results } = scoreDesktops('beginner', { look: ['macos-like'] });
    expect(['pantheon', 'gnome', 'budgie']).toContain(results[0].desktop.id);
  });

  it('schließt bei alter NVIDIA-Karte Wayland-only-Oberflächen aus', () => {
    const { results } = scoreDesktops('beginner', { gpu: ['nvidia-old'], look: ['clean'] });
    for (const r of results.filter((x) => x.eligible)) {
      expect(r.desktop.x11Session, r.desktop.id).not.toBe('none');
    }
    expect(results.find((r) => r.desktop.id === 'gnome')?.eligible).toBe(false);
  });

  it('setzt die ausdrückliche Wahl durch', () => {
    const { results } = scoreDesktops('advanced', {
      'desktop-preference': ['xfce'],
      look: ['macos-like'],
      'display-setup': ['hdr'],
    });
    expect(results[0].desktop.id).toBe('xfce');
    expect(results[0].reasons).toContain('explicit-choice');
  });

  it('bevorzugt bei Bildschirmleser-Bedarf GNOME', () => {
    const { results } = scoreDesktops('advanced', { 'workload-extra': ['accessibility'] });
    expect(results[0].desktop.id).toBe('gnome');
    expect(results[0].reasons).toContain('accessibility');
  });

  it('bevorzugt auf sehr schwacher Hardware sparsame Oberflächen', () => {
    const { results } = scoreDesktops('beginner', { ram: ['ram-2'], 'hardware-age': ['ancient'] });
    expect(results[0].desktop.ramFootprintMb).toBeLessThanOrEqual(500);
  });

  it('nennt bei Plasma das Auslaufen der X11-Sitzung', () => {
    const { results } = scoreDesktops('advanced', { 'desktop-preference': ['plasma'] });
    expect(results[0].desktop.id).toBe('plasma');
    expect(results[0].concerns).toContain('x11-ending');
  });

  it('hält alle Desktop-Punktzahlen im Bereich 0–100', () => {
    const { results } = scoreDesktops('expert', {
      look: ['tweak'], ram: ['ram-4'], 'display-setup': ['hdr', 'touch'], terminal: ['daily'],
    });
    for (const r of results) {
      expect(r.score, r.desktop.id).toBeGreaterThanOrEqual(0);
      expect(r.score, r.desktop.id).toBeLessThanOrEqual(100);
    }
  });
});

describe('Desktop-Datenbestand', () => {
  it('gibt für jeden Desktop Sitzungsarten an', () => {
    for (const de of desktops) {
      expect(['available', 'ending', 'none'], de.id).toContain(de.x11Session);
      expect(['default', 'optional', 'none'], de.id).toContain(de.waylandSession);
    }
  });

  it('lässt keinen Desktop ohne jede Sitzungsart zurück', () => {
    for (const de of desktops) {
      expect(de.x11Session !== 'none' || de.waylandSession !== 'none', de.id).toBe(true);
    }
  });
});

describe('Desktop-Begründungen', () => {
  it('nennt die X11-Sitzung, wenn die Grafikkarte sie braucht', () => {
    const { results } = scoreDesktops('beginner', { gpu: ['nvidia-old'], look: ['windows-like'] });
    expect(results[0].reasons).toContain('x11-needed');
  });

  it('nennt Einsteigerfreundlichkeit, wenn das Terminal ausgeschlossen wurde', () => {
    const { results } = scoreDesktops('beginner', { terminal: ['never'], look: ['windows-like'] });
    expect(results[0].reasons).toContain('beginner');
  });

  it('vergibt keine Begründung, die in der Oberfläche keinen Text hat', async () => {
    const { desktopReasonLabels } = await import('../i18n/labels');
    const answers = { look: ['tweak'], gpu: ['nvidia-old'], terminal: ['never'], ram: ['ram-2'] };
    for (const r of scoreDesktops('beginner', answers).results) {
      for (const code of r.reasons) {
        expect(desktopReasonLabels[code], `${r.desktop.id}: ${code}`).toBeDefined();
      }
    }
  });
});

describe('Beschriftungen', () => {
  it('zeigt kein internes Schlagwort ohne Anzeigetext', async () => {
    const { tagLabels } = await import('../i18n/labels');
    const { desktopById: byId } = await import('../data/desktops');
    // Alle Schlagworte, die eine Frage überhaupt als Treffer erzeugen kann,
    // brauchen entweder einen Anzeigetext oder sind ein Desktopname.
    const boostable = new Set<string>();
    for (const q of allQuestions) {
      for (const o of q.options) {
        for (const tag of Object.keys(o.effect.boostTags ?? {})) boostable.add(tag);
      }
    }
    const unlabelled = [...boostable].filter((t) => !tagLabels[t] && !byId.has(t));
    // Bewusst ohne Text bleiben nur die, die ein Etikett daneben schon sagt.
    expect(unlabelled.sort()).toEqual(['langzeitsupport', 'rolling', 'semi-rolling']);
  });

  it('rechnet ohne Erklärstücke exakt dasselbe', () => {
    // Die Kipp-Analyse nutzt den Schnellpfad. Käme dabei eine andere
    // Reihenfolge heraus, behauptete sie Umschwünge, die es nicht gibt.
    const cases: Answers[] = [
      {},
      { purpose: ['gaming'], gpu: ['nvidia-new'] },
      { purpose: ['everyday'], terminal: ['never'], 'update-appetite': ['never-touch'], german: ['important'] },
      { purpose: ['server'], 'update-appetite': ['bleeding'], 'breakage-tolerance': ['fun'] },
    ];
    for (const answers of cases) {
      for (const mode of ['beginner', 'advanced', 'expert'] as const) {
        const full = scoreAll(mode, answers);
        const fast = scoreAll(mode, answers, { explain: false });
        const label = `${mode} ${JSON.stringify(answers)}`;
        expect(fast.results.map((r) => r.distro.id), label).toEqual(full.results.map((r) => r.distro.id));
        expect(fast.results.map((r) => r.score), label).toEqual(full.results.map((r) => r.score));
        expect(fast.results.map((r) => r.eligible), label).toEqual(full.results.map((r) => r.eligible));
        expect(fast.relaxed, label).toEqual(full.relaxed);
      }
    }
  });

  it('dreht keine Dimension um, bei der mehr immer besser ist', async () => {
    const { buildProfile, INVERTIBLE_RATINGS } = await import('./score');
    // Ein negatives Gewicht bedeutet dort „weniger wichtig", nicht „je
    // schlechter, desto besser". Sonst stünde am Ende „Stabilität
    // (je weniger, desto besser) 8/10" auf der Ergebniskarte.
    for (const q of allQuestions) {
      for (const o of q.options) {
        for (const mode of ['beginner', 'advanced', 'expert'] as const) {
          if (!q.modes.includes(mode)) continue;
          const weights = buildProfile(mode, { [q.id]: [o.id] }).weights;
          for (const [key, weight] of Object.entries(weights)) {
            if (weight < 0) {
              expect(INVERTIBLE_RATINGS.has(key as never), `${q.id}/${o.id}: ${key}`).toBe(true);
            }
          }
        }
      }
    }
  });

  it('hat zu jeder Anforderung alle drei Textformen in beiden Sprachen', async () => {
    const { requirementList } = await import('./requirements');
    for (const r of requirementList) {
      for (const form of ['label', 'negated', 'short'] as const) {
        for (const lang of ['de', 'en'] as const) {
          expect(r[form][lang].trim().length, `${r.id}.${form}.${lang}`).toBeGreaterThan(0);
        }
      }
      // Die verneinte Form muss wirklich verneinen. Ein versehentlich kopierter
      // Bejahungssatz stünde sonst als Ausschlussgrund auf der Ergebnisseite.
      for (const lang of ['de', 'en'] as const) {
        expect(r.negated[lang], `${r.id}.${lang}`).not.toBe(r.label[lang]);
      }
    }
  });

  it('stellt keine Anforderung dem Nutzer mit vorangestelltem „nicht" hin', async () => {
    const { requirementList } = await import('./requirements');
    // „nicht richtet den Treiber ein" war der Fehler, den diese Prüfung
    // festhält: Die Verneinung gehört im Deutschen ins Satzinnere.
    for (const r of requirementList) {
      expect(r.negated.de.startsWith('nicht '), r.id).toBe(false);
      expect(r.negated.en.startsWith('not '), r.id).toBe(false);
    }
  });

  it('hat für jedes Release-Modell und jeden Installer eine Kurzform', async () => {
    const { releaseModelShort, installerShort } = await import('../i18n/labels');
    for (const d of distros) {
      expect(releaseModelShort[d.releaseModel], d.id).toBeDefined();
      expect(installerShort[d.installer], d.id).toBeDefined();
    }
  });
});

describe('Nachfragen zu Hindernissen', () => {
  it('zeigt die Nachfrage nur, wenn das Programm genannt wurde', () => {
    expect(visibleQuestions('beginner', {}).some((q) => q.id === 'adobe-alternative')).toBe(false);
    expect(
      visibleQuestions('beginner', { blockers: ['adobe'] }).some((q) => q.id === 'adobe-alternative'),
    ).toBe(true);
    // Für Spiele mit Anti-Cheat und Branchensoftware gibt es bewusst keine.
    const withGames = visibleQuestions('beginner', { blockers: ['anticheat', 'industry'] });
    expect(withGames.some((q) => q.id.endsWith('-alternative'))).toBe(false);
  });

  it('hebt die Warnung auf, wenn eine Alternative in Ordnung wäre', () => {
    const strict = buildProfile('beginner', { blockers: ['adobe'] });
    expect(strict.flags.has('adobe')).toBe(true);
    expect(strict.flags.has('adobe-open')).toBe(false);

    const open = buildProfile('beginner', { blockers: ['adobe'], 'adobe-alternative': ['yes'] });
    expect(open.flags.has('adobe')).toBe(false);
    expect(open.flags.has('adobe-open')).toBe(true);
  });

  it('behält die Warnung, wenn genau dieses Programm gebraucht wird', () => {
    const profile = buildProfile('beginner', { blockers: ['ms-office'], 'ms-office-alternative': ['no'] });
    expect(profile.flags.has('ms-office')).toBe(true);
    expect(profile.flags.has('ms-office-open')).toBe(false);
  });

  it('behält bei Adobe die Warnung, wenn nur eigene Projekte übertragbar wären', () => {
    const profile = buildProfile('beginner', { blockers: ['adobe'], 'adobe-alternative': ['partly'] });
    expect(profile.flags.has('adobe')).toBe(true);
  });

  it('kennt zu jedem gesetzten und aufgehobenen Hinweis einen Text', () => {
    const referenced = new Set<string>();
    for (const q of allQuestions) {
      for (const o of q.options) {
        for (const id of [...(o.effect.flags ?? []), ...(o.effect.suppressFlags ?? [])]) referenced.add(id);
      }
    }
    for (const id of referenced) {
      expect(flagById.has(id), id).toBe(true);
    }
  });

  it('gibt die Zahl der immer gestellten Fragen an, nicht die Höchstzahl', () => {
    expect(baseQuestionCount('beginner')).toBe(12);
    expect(baseQuestionCount('beginner')).toBeLessThan(questionsForMode('beginner').length);
    expect(baseQuestionCount('expert')).toBeGreaterThan(baseQuestionCount('advanced'));
  });
});
