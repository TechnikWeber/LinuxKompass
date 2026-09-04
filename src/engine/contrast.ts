import type { RatingKey } from '../data/types';
import type { DistroResult } from './score';

/**
 * Zwei Ergebnisse gegeneinander – die Antwort auf „Warum nicht X?"
 *
 * Fast niemand kommt unvoreingenommen hierher. Meist steht schon ein Name im
 * Raum, weil ein Bekannter ihn genannt hat oder weil er überall empfohlen
 * wird. Eine Empfehlung, die diesen Namen einfach übergeht, wirkt wie ein
 * Orakel. Deshalb lässt sich hier gezielt nachfragen – und die Antwort besteht
 * aus denselben Zahlen, aus denen auch die Empfehlung entstanden ist.
 *
 * Beide Ergebnisse stammen aus demselben Profil, ihre `breakdown`-Einträge
 * sind also dieselben Dimensionen mit denselben Gewichten. Die Differenz je
 * Dimension ist damit unmittelbar vergleichbar.
 */
export interface ContrastLine {
  key: RatingKey;
  /** Wert der befragten Distribution. */
  value: number;
  /** Wert der Empfehlung. */
  referenceValue: number;
  /** Punktdifferenz zur Empfehlung: negativ = schlechter. */
  delta: number;
}

export interface Contrast {
  /** Punktabstand insgesamt: negativ = liegt hinter der Empfehlung. */
  scoreDelta: number;
  /** Harte Anforderungen, an denen die befragte Distribution scheitert. */
  failedRequirementIds: string[];
  /** Wünsche, die nur die Empfehlung erfüllt. */
  missesInstead: string[];
  /** Wünsche, die nur die befragte Distribution erfüllt. */
  meetsExtra: string[];
  /** Dimensionen, in denen sie zurückliegt – stärkste zuerst. */
  worse: ContrastLine[];
  /** Dimensionen, in denen sie vorn liegt. */
  better: ContrastLine[];
  /** Differenz der Zuschläge aus Vorlieben, Schlagworten und Zielgruppen. */
  bonusDelta: number;
}

/** Ab welcher Punktdifferenz eine Dimension überhaupt erwähnenswert ist. */
const NOTEWORTHY = 0.4;

export function contrastDistros(reference: DistroResult, other: DistroResult): Contrast {
  const referenceLines = new Map(reference.breakdown.map((b) => [b.key, b]));

  const lines: ContrastLine[] = [];
  for (const b of other.breakdown) {
    const ref = referenceLines.get(b.key);
    if (!ref) continue;
    lines.push({ key: b.key, value: b.value, referenceValue: ref.value, delta: b.points - ref.points });
  }

  const byMagnitude = [...lines].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  const referenceMet = new Set(reference.metPreferences);
  const otherMet = new Set(other.metPreferences);

  return {
    scoreDelta: other.score - reference.score,
    failedRequirementIds: [...new Set(other.failed.map((f) => f.requirementId))],
    missesInstead: reference.metPreferences.filter((id) => !otherMet.has(id)),
    meetsExtra: other.metPreferences.filter((id) => !referenceMet.has(id)),
    worse: byMagnitude.filter((l) => l.delta <= -NOTEWORTHY).slice(0, 4),
    better: byMagnitude.filter((l) => l.delta >= NOTEWORTHY).slice(0, 3),
    bonusDelta: other.bonusPoints - reference.bonusPoints,
  };
}
