import type { Audience, Distro, RatingKey } from '../data/types';
import { distros as allDistros } from '../data/distros';
import { type Answers, type Mode, visibleQuestions } from '../data/questions';
import { requirements } from './requirements';

/** Woher eine harte Anforderung stammt – für die Erklärung im Ergebnis. */
export interface RequirementSource {
  requirementId: string;
  questionId: string;
  optionId: string;
}

export interface Profile {
  /** Gewichte je Bewertungsdimension. Positiv = erwünscht, negativ = störend. */
  weights: Partial<Record<RatingKey, number>>;
  /** Harte Anforderungen mit Herkunft. */
  required: RequirementSource[];
  /** Weiche Anforderungen: Erfüllung gibt Punkte. */
  preferred: Map<string, number>;
  /** Unerwünschte Eigenschaften: Erfüllung kostet Punkte. */
  avoided: Map<string, number>;
  distroBoost: Map<string, number>;
  tagBoost: Map<string, number>;
  audienceBoost: Map<Audience, number>;
  /** Ausgelöste Stolperfallen-Hinweise. */
  flags: Set<string>;
  /** Wie viele Fragen wurden mit „weiß ich nicht" oder gar nicht beantwortet? */
  unansweredCount: number;
  answeredCount: number;
}

export interface RatingContribution {
  key: RatingKey;
  weight: number;
  value: number;
  /** Anteil an der Gesamtpunktzahl in Prozentpunkten. */
  points: number;
}

export interface DistroResult {
  distro: Distro;
  /** 0–100. Auch für ausgeschlossene Distributionen berechnet. */
  score: number;
  eligible: boolean;
  /** Nicht erfüllte harte Anforderungen. */
  failed: RequirementSource[];
  /** Erfüllte weiche Wünsche. */
  metPreferences: string[];
  missedPreferences: string[];
  /** Ausschlaggebende Stärken (Dimensionen mit hohem Gewicht und hohem Wert). */
  strengths: RatingKey[];
  /** Wunde Punkte (hohes Gewicht, niedriger Wert). */
  weaknesses: RatingKey[];
  matchedTags: string[];
  breakdown: RatingContribution[];
  /** Punkte aus direkten Zuschlägen (Distro, Schlagwort, Zielgruppe). */
  bonusPoints: number;
}

export interface ScoreOutcome {
  results: DistroResult[];
  /** Anforderungen, die gelockert werden mussten, weil sonst zu wenig übrig bliebe. */
  relaxed: string[];
  profile: Profile;
  /** 0–1: wie belastbar ist die Empfehlung? */
  confidence: number;
}

const EMPTY_PROFILE_MESSAGE = 'Es wurden noch keine Fragen beantwortet.';

/** Baut aus den Antworten das Nutzerprofil. */
export function buildProfile(mode: Mode, answers: Answers): Profile {
  const profile: Profile = {
    weights: {},
    required: [],
    preferred: new Map(),
    avoided: new Map(),
    distroBoost: new Map(),
    tagBoost: new Map(),
    audienceBoost: new Map(),
    flags: new Set(),
    unansweredCount: 0,
    answeredCount: 0,
  };

  const visible = visibleQuestions(mode, answers);

  for (const question of visible) {
    const chosen = answers[question.id] ?? [];
    if (chosen.length === 0) {
      profile.unansweredCount += 1;
      continue;
    }

    let allNeutral = true;
    for (const optionId of chosen) {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) continue;
      if (!option.neutral) allNeutral = false;

      const { effect } = option;
      const qw = question.weight;

      if (effect.ratings) {
        for (const [key, value] of Object.entries(effect.ratings) as [RatingKey, number][]) {
          profile.weights[key] = (profile.weights[key] ?? 0) + value * qw;
        }
      }
      for (const id of effect.require ?? []) {
        profile.required.push({ requirementId: id, questionId: question.id, optionId });
      }
      for (const id of effect.prefer ?? []) {
        profile.preferred.set(id, (profile.preferred.get(id) ?? 0) + qw);
      }
      for (const id of effect.avoid ?? []) {
        profile.avoided.set(id, (profile.avoided.get(id) ?? 0) + qw);
      }
      for (const [id, value] of Object.entries(effect.boostDistros ?? {})) {
        profile.distroBoost.set(id, (profile.distroBoost.get(id) ?? 0) + value);
      }
      for (const [tag, value] of Object.entries(effect.boostTags ?? {})) {
        profile.tagBoost.set(tag, (profile.tagBoost.get(tag) ?? 0) + value);
      }
      for (const [aud, value] of Object.entries(effect.boostAudiences ?? {}) as [Audience, number][]) {
        profile.audienceBoost.set(aud, (profile.audienceBoost.get(aud) ?? 0) + value);
      }
      for (const flag of effect.flags ?? []) {
        profile.flags.add(flag);
      }
    }

    if (allNeutral) profile.unansweredCount += 1;
    else profile.answeredCount += 1;
  }

  return profile;
}

/**
 * Grundpunktzahl aus den Bewertungsdimensionen.
 *
 * Positive Gewichte bewerten hohe Werte gut, negative Gewichte bewerten
 * niedrige Werte gut. Normiert auf 0–100, damit die Zahl unabhängig von der
 * Anzahl beantworteter Fragen vergleichbar bleibt.
 */
function ratingScore(distro: Distro, weights: Profile['weights']): { score: number; breakdown: RatingContribution[] } {
  const entries = Object.entries(weights) as [RatingKey, number][];
  const totalWeight = entries.reduce((sum, [, w]) => sum + Math.abs(w), 0);
  if (totalWeight === 0) return { score: 50, breakdown: [] };

  let achieved = 0;
  const breakdown: RatingContribution[] = [];

  for (const [key, weight] of entries) {
    if (weight === 0) continue;
    const value = distro.ratings[key];
    const normalised = weight > 0 ? value / 10 : (10 - value) / 10;
    const gained = Math.abs(weight) * normalised;
    achieved += gained;
    breakdown.push({ key, weight, value, points: (gained / totalWeight) * 100 });
  }

  breakdown.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
  return { score: (achieved / totalWeight) * 100, breakdown };
}

/*
 * Skalierung der Endpunktzahl.
 *
 * Der gewichtete Mittelwert über die Bewertungsdimensionen liegt in der Praxis
 * zwischen 45 (passt kaum) und 100 (passt in jeder gewichteten Dimension
 * perfekt). Ohne Spreizung landen dann alle brauchbaren Treffer zwischen 88 und
 * 97, und die Zahl sagt nichts mehr aus. Deshalb wird der genutzte Bereich auf
 * 0–100 gedehnt und die Spitze anschließend weich gedeckelt: kein Ergebnis
 * erreicht 100, und ab etwa 75 kosten weitere Punkte spürbar mehr.
 */
const EXPAND_FLOOR = 45;
const SOFT_CAP_START = 75;
const SOFT_CAP_RANGE = 22;
const SOFT_CAP_TAU = 22;
const EXTRA_RANGE = 20;

function expand(base: number): number {
  return Math.max(0, ((base - EXPAND_FLOOR) / (100 - EXPAND_FLOOR)) * 100);
}

function softCap(value: number): number {
  if (value <= SOFT_CAP_START) return value;
  return SOFT_CAP_START + SOFT_CAP_RANGE * (1 - Math.exp(-(value - SOFT_CAP_START) / SOFT_CAP_TAU));
}

function requirementHolds(id: string, distro: Distro): boolean {
  const requirement = requirements.get(id);
  if (!requirement) return true;
  return requirement.test(distro);
}

/** Bewertet eine einzelne Distribution gegen das Profil. */
function evaluate(distro: Distro, profile: Profile, activeRequirements: RequirementSource[]): DistroResult {
  const { score: base, breakdown } = ratingScore(distro, profile.weights);

  const failed = activeRequirements.filter((r) => !requirementHolds(r.requirementId, distro));

  const metPreferences: string[] = [];
  const missedPreferences: string[] = [];
  let prefWeight = 0;
  let prefAchieved = 0;
  for (const [id, weight] of profile.preferred) {
    prefWeight += weight;
    if (requirementHolds(id, distro)) {
      metPreferences.push(id);
      prefAchieved += weight;
    } else {
      missedPreferences.push(id);
      prefAchieved -= weight;
    }
  }
  for (const [id, weight] of profile.avoided) {
    prefWeight += weight;
    if (requirementHolds(id, distro)) prefAchieved -= weight;
    else prefAchieved += weight;
  }
  // -1 (alles verfehlt) bis +1 (alles erfüllt); ohne Wünsche neutral.
  const prefRatio = prefWeight > 0 ? Math.max(-1, Math.min(1, prefAchieved / prefWeight)) : 0;

  let boost = profile.distroBoost.get(distro.id) ?? 0;
  const matchedTags: string[] = [];
  for (const [tag, value] of profile.tagBoost) {
    if (distro.tags.includes(tag) || distro.defaultDesktop === tag || distro.availableDesktops.includes(tag)) {
      boost += value;
      matchedTags.push(tag);
    }
  }
  for (const [aud, value] of profile.audienceBoost) {
    if (distro.audiences.includes(aud)) boost += value;
  }
  // Sättigend: die ersten Treffer zählen viel, weitere immer weniger.
  const boostRatio = boost >= 0 ? 1 - Math.exp(-boost / 22) : Math.max(-1, boost / 15);

  // Zuschläge wirken additiv, damit eine sehr eindeutige Antwort eine sonst
  // allgemein starke Distribution auch überholen kann. Nach oben wird die
  // Summe weich gedeckelt: 100 bleibt der theoretischen Bestleistung
  // vorbehalten, und ein Feld aus lauter 95ern entsteht gar nicht erst.
  const extra = 0.45 * prefRatio + 0.55 * boostRatio;
  const score = softCap(expand(base) + EXTRA_RANGE * extra);

  const significant = breakdown.filter((b) => Math.abs(b.weight) >= 3);
  const strengths = significant.filter((b) => (b.weight > 0 ? b.value >= 8 : b.value <= 3)).slice(0, 4).map((b) => b.key);
  const weaknesses = significant.filter((b) => (b.weight > 0 ? b.value <= 4 : b.value >= 8)).slice(0, 3).map((b) => b.key);

  return {
    distro,
    score: Math.round(Math.max(0, Math.min(100, score))),
    eligible: failed.length === 0,
    failed,
    metPreferences,
    missedPreferences,
    strengths,
    weaknesses,
    matchedTags,
    breakdown,
    bonusPoints: Math.round(score - softCap(expand(base))),
  };
}

/**
 * Bewertet alle Distributionen.
 *
 * Wenn die harten Anforderungen zusammen weniger als `minimumResults`
 * Kandidaten übrig lassen, wird schrittweise diejenige Anforderung gelockert,
 * die die meisten Distributionen ausschließt. Das Ergebnis benennt, welche
 * Anforderungen dafür fallen mussten – geraten wird nichts.
 */
export function scoreAll(
  mode: Mode,
  answers: Answers,
  options: { pool?: Distro[]; minimumResults?: number } = {},
): ScoreOutcome {
  const pool = options.pool ?? allDistros;
  // Nur lockern, wenn sonst gar nichts übrig bliebe. Ein kleines Ergebnisfeld
  // ist eine ehrliche Antwort ("das kann wirklich nur diese eine"), eine
  // stillschweigend fallengelassene Anforderung wäre es nicht.
  const minimumResults = options.minimumResults ?? 1;
  const profile = buildProfile(mode, answers);

  let active = [...profile.required];
  const relaxed: string[] = [];

  const countEligible = (reqs: RequirementSource[]) =>
    pool.filter((d) => reqs.every((r) => requirementHolds(r.requirementId, d))).length;

  while (active.length > 0 && countEligible(active) < minimumResults) {
    // Welche Anforderung kostet die meisten Kandidaten?
    const ids = [...new Set(active.map((r) => r.requirementId))];
    let worst = ids[0];
    let worstRemaining = -1;
    for (const id of ids) {
      const without = active.filter((r) => r.requirementId !== id);
      const remaining = countEligible(without);
      if (remaining > worstRemaining) {
        worstRemaining = remaining;
        worst = id;
      }
    }
    active = active.filter((r) => r.requirementId !== worst);
    relaxed.push(worst);
  }

  const results = pool
    .map((d) => evaluate(d, profile, active))
    .sort((a, b) => {
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      return b.score - a.score;
    });

  const eligible = results.filter((r) => r.eligible);
  const top = eligible[0]?.score ?? 0;
  const second = eligible[1]?.score ?? 0;
  const gap = Math.min(1, (top - second) / 10);
  // Wurzel, damit ein tiefer Modus mit vielen Fragen nicht automatisch
  // schlechter dasteht als ein kurzer Fragebogen mit denselben Aussagen.
  const rawCoverage = profile.answeredCount / Math.max(1, profile.answeredCount + profile.unansweredCount);
  const coverage = Math.sqrt(rawCoverage);
  const confidence = Math.max(0, Math.min(1, 0.3 * gap + 0.7 * coverage));

  return { results, relaxed, profile, confidence };
}

export { EMPTY_PROFILE_MESSAGE };
