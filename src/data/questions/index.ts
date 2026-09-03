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

/**
 * Zahl der Fragen, die in einem Modus immer gestellt werden.
 *
 * Bedingte Nachfragen bleiben außen vor: Sie erscheinen nur, wenn eine
 * frühere Antwort sie auslöst. „12 Fragen" zu versprechen und dann 17 zu
 * stellen wäre irreführend, „ab 12" ist die ehrliche Angabe.
 */
export function baseQuestionCount(mode: Mode): number {
  return questionsForMode(mode).filter((q) => !q.showIf).length;
}

export const questionById = new Map(allQuestions.map((q) => [q.id, q]));
