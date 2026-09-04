import type { Answers, Mode, Question } from '../data/questions';
import { visibleQuestions } from '../data/questions';
import { scoreAll } from './score';

/**
 * Was passiert, wenn eine einzelne Antwort anders lautet?
 *
 * Die Ergebnisseite behauptet eine Reihenfolge. Diese Datei prüft nach, wie
 * belastbar sie ist: Für jede sichtbare Frage wird der Fragebogen einmal je
 * Antwortmöglichkeit neu gerechnet und geschaut, ob oben etwas anderes steht.
 *
 * Der Nutzen liegt in beiden Ausgängen. Kippt nichts, ist die Empfehlung
 * robust und die Prozentzahl der Verlässlichkeit bekommt eine Aussage, die man
 * nachrechnen kann. Kippt etwas, weiß man, welche Frage die Entscheidung
 * tatsächlich getragen hat – und dass man dort ehrlich geantwortet haben
 * sollte.
 */
export interface Flip {
  question: Question;
  optionId: string;
  /** Wer stattdessen oben stünde. */
  winnerId: string;
  winnerName: string;
  /** Steht diese Antwort gerade nicht ausgewählt da, weil die Frage offen ist? */
  fromUnanswered: boolean;
}

export interface Sensitivity {
  /** Name der aktuellen Empfehlung – Bezugspunkt für alle Kipp-Punkte. */
  currentWinnerId: string;
  /** Fragen, an denen die Empfehlung hängt, in Reihenfolge des Fragebogens. */
  flips: Flip[];
  /** Wie viele Antwortmöglichkeiten insgesamt durchgerechnet wurden. */
  tested: number;
}

/**
 * Ersetzt eine Antwort und rechnet neu.
 *
 * Bewusst ersetzend statt ergänzend, auch bei Mehrfachauswahl: Die Frage
 * lautet „was, wenn du hier etwas anderes gesagt hättest", nicht „was, wenn
 * du zusätzlich noch dies angekreuzt hättest". Letzteres ergäbe bei zwölf
 * Fragen eine Zahl von Kombinationen, die niemand mehr liest.
 */
function winnerWith(mode: Mode, answers: Answers, questionId: string, optionId: string): { id: string; name: string } | null {
  const variant: Answers = { ...answers, [questionId]: [optionId] };
  // Ohne Erklärstücke: Von jedem der dutzenden Durchläufe wird nur der Name
  // ganz oben gebraucht, nicht die Punkteherkunft aller 55 Distributionen.
  const top = scoreAll(mode, variant, { explain: false }).results.find((r) => r.eligible);
  return top ? { id: top.distro.id, name: top.distro.name } : null;
}

/**
 * Prüft jede Antwortmöglichkeit jeder sichtbaren Frage.
 *
 * Das sind je nach Modus 60 bis 200 Durchläufe über alle Distributionen. Auf
 * dem Papier viel, in der Praxis wenige Millisekunden – trotzdem ruft die
 * Oberfläche das erst auf, wenn der Abschnitt aufgeklappt wird.
 */
export function analyseSensitivity(mode: Mode, answers: Answers): Sensitivity {
  const current = scoreAll(mode, answers, { explain: false }).results.find((r) => r.eligible);
  const currentWinnerId = current?.distro.id ?? '';

  const flips: Flip[] = [];
  let tested = 0;

  for (const question of visibleQuestions(mode, answers)) {
    const chosen = answers[question.id] ?? [];
    const answered = chosen.length > 0;

    for (const option of question.options) {
      // Die bereits gegebene Antwort noch einmal zu setzen ändert nichts.
      if (chosen.length === 1 && chosen[0] === option.id) continue;
      tested += 1;
      const winner = winnerWith(mode, answers, question.id, option.id);
      if (!winner || winner.id === currentWinnerId) continue;
      flips.push({
        question,
        optionId: option.id,
        winnerId: winner.id,
        winnerName: winner.name,
        fromUnanswered: !answered,
      });
    }
  }

  return { currentWinnerId, flips, tested };
}

/**
 * Fasst die Kipp-Punkte je Frage zusammen.
 *
 * Eine Frage mit fünf kippenden Antworten ist ein Befund, nicht fünf. Ohne
 * diese Bündelung stünde eine einzige wacklige Frage fünfmal in der Liste und
 * verdeckte die übrigen.
 */
export interface FlipGroup {
  question: Question;
  flips: Flip[];
}

export function groupFlips(flips: Flip[]): FlipGroup[] {
  const groups = new Map<string, FlipGroup>();
  for (const flip of flips) {
    const existing = groups.get(flip.question.id);
    if (existing) existing.flips.push(flip);
    else groups.set(flip.question.id, { question: flip.question, flips: [flip] });
  }
  return [...groups.values()];
}

/**
 * Trennt die beiden Aussagen, die sonst durcheinandergehen.
 *
 * „Deine Antwort hier trägt die Entscheidung" und „diese Frage hast du
 * übersprungen, sie würde sie ändern" sind verschiedene Dinge: Das erste ist
 * eine Warnung, ehrlich geantwortet zu haben, das zweite eine Einladung
 * weiterzumachen. Gemischt in einer Liste liest sich beides wie Rauschen.
 */
export function splitFlips(flips: Flip[]): { answered: FlipGroup[]; open: FlipGroup[] } {
  return {
    answered: groupFlips(flips.filter((f) => !f.fromUnanswered)),
    open: groupFlips(flips.filter((f) => f.fromUnanswered)),
  };
}
