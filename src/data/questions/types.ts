import type { Audience, L10n, RatingKey } from '../types';

export type Mode = 'beginner' | 'advanced' | 'expert';

export const MODES: Mode[] = ['beginner', 'advanced', 'expert'];

export type QuestionSection =
  | 'usage'
  | 'hardware'
  | 'habits'
  | 'software'
  | 'philosophy'
  | 'operations';

/**
 * Was eine gewählte Antwort mit der Bewertung macht.
 *
 * Bewusst deklarativ gehalten: Der Fragenkatalog bleibt reine Daten und
 * lässt sich ohne Codeänderung erweitern oder korrigieren.
 */
export interface AnswerEffect {
  /**
   * Gewichte auf Bewertungsdimensionen. Positiv = wichtig, negativ = stört.
   * Sinnvoller Bereich: -3 bis +3.
   */
  ratings?: Partial<Record<RatingKey, number>>;
  /** Harte Anforderung: Wer sie nicht erfüllt, fliegt aus der Empfehlung. */
  require?: string[];
  /** Weiche Anforderung: Nichterfüllung kostet Punkte, schließt aber nicht aus. */
  prefer?: string[];
  /** Wer das erfüllt, wird abgewertet (z. B. „ich will kein Snap"). */
  avoid?: string[];
  /** Direkter Zuschlag auf einzelne Distributionen (0–20 Punkte). */
  boostDistros?: Record<string, number>;
  /** Zuschlag für alle Distributionen mit diesem Schlagwort. */
  boostTags?: Record<string, number>;
  /** Zuschlag für Distributionen mit dieser Zielgruppe. */
  boostAudiences?: Partial<Record<Audience, number>>;
  /** Verweist auf einen Hinweistext im Stolperfallen-Katalog. */
  flags?: string[];
}

export interface AnswerOption {
  id: string;
  label: L10n;
  /** Kurze Erläuterung unter der Antwort – erklärt Fachbegriffe im Klartext. */
  hint?: L10n;
  effect: AnswerEffect;
  /** Markiert „weiß ich nicht" – wirkt neutral und wird gesondert gezählt. */
  neutral?: boolean;
}

export interface Question {
  id: string;
  section: QuestionSection;
  /** In welchen Modi wird die Frage gestellt? */
  modes: Mode[];
  title: L10n;
  /** Zusatzinformation, immer sichtbar. */
  description?: L10n;
  /** Ausklappbarer Hintergrundtext für Menschen, die tiefer wissen wollen. */
  help?: L10n;
  type: 'single' | 'multiple';
  options: AnswerOption[];
  /** Gesamtgewicht der Frage (1 = nebensächlich, 3 = entscheidend). */
  weight: number;
  /** Frage nur zeigen, wenn eine frühere Antwort passt. */
  showIf?: { questionId: string; anyOf: string[] };
  /** Darf übersprungen werden? Standard: ja. */
  required?: boolean;
}

/** Antworten des Nutzers: Fragen-ID → gewählte Options-IDs. */
export type Answers = Record<string, string[]>;
