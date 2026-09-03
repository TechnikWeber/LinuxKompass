import { coreQuestions } from './core';
import { advancedQuestions } from './advanced';
import { expertQuestions } from './expert';
import type { Answers, Mode, Question } from './types';

export * from './types';
export * from './triage';

/** Der vollständige Fragenkatalog in Anzeigereihenfolge. */
export const allQuestions: Question[] = [...coreQuestions, ...advancedQuestions, ...expertQuestions];

const SECTION_ORDER = ['usage', 'hardware', 'habits', 'operations', 'software', 'philosophy'] as const;

/** Fragen für einen Modus, thematisch gruppiert statt nach Herkunftsdatei. */
export function questionsForMode(mode: Mode): Question[] {
  return allQuestions
    .filter((q) => q.modes.includes(mode))
    .slice()
    .sort((a, b) => SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section));
}

/** Blendet Fragen aus, deren Bedingung durch die bisherigen Antworten nicht erfüllt ist. */
export function visibleQuestions(mode: Mode, answers: Answers): Question[] {
  return questionsForMode(mode).filter((q) => {
    if (!q.showIf) return true;
    const given = answers[q.showIf.questionId] ?? [];
    return given.some((a) => q.showIf!.anyOf.includes(a));
  });
}

export const questionById = new Map(allQuestions.map((q) => [q.id, q]));
