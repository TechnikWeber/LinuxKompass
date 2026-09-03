import { describe, expect, it } from 'vitest';
import { distros } from '../data/distros';
import { allQuestions, questionsForMode, visibleQuestions, type Answers } from '../data/questions';
import { requirements } from './requirements';
import { buildProfile, scoreAll } from './score';
import { flagById } from '../data/flags';
import { desktopById } from '../data/desktops';

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
    // „Deklarativ“ beschreibt genau eine Distribution. Das ist eine gültige
    // Antwort und darf nicht stillschweigend aufgeweicht werden.
    const outcome = scoreAll('expert', { 'package-philosophy': ['declarative'] });
    const eligible = outcome.results.filter((r) => r.eligible);
    expect(outcome.relaxed).toEqual([]);
    expect(eligible.map((r) => r.distro.id)).toEqual(['nixos']);
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
