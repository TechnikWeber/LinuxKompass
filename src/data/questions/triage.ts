import type { L10n } from '../types';
import type { Mode } from './types';

export interface TriageOption {
  id: string;
  label: L10n;
  /** 0 = ganz am Anfang, 3 = sehr erfahren. */
  score: number;
}

export interface TriageQuestion {
  id: string;
  title: L10n;
  options: TriageOption[];
}

/**
 * Drei kurze Fragen, die den passenden Modus vorschlagen.
 * Sie fließen NICHT in die Bewertung ein – sie steuern nur, wie viele
 * und wie tiefe Fragen danach kommen. Der Vorschlag ist immer änderbar.
 */
export const triageQuestions: TriageQuestion[] = [
  {
    id: 'experience',
    title: { de: 'Wie viel hattest du bisher mit Linux zu tun?', en: 'How much have you dealt with Linux so far?' },
    options: [
      { id: 'none', label: { de: 'Noch gar nichts', en: 'Nothing at all yet' }, score: 0 },
      { id: 'tried', label: { de: 'Mal ausprobiert oder in einer virtuellen Maschine gesehen', en: 'Tried it once or seen it in a virtual machine' }, score: 1 },
      { id: 'using', label: { de: 'Ich nutze es regelmäßig', en: 'I use it regularly' }, score: 2 },
      { id: 'admin', label: { de: 'Ich richte Linux auch für andere ein', en: 'I set Linux up for other people too' }, score: 3 },
    ],
  },
  {
    id: 'recovery',
    title: { de: 'Der Rechner startet nach einem Update nicht mehr. Was tust du?', en: 'The machine will not boot after an update. What do you do?' },
    options: [
      { id: 'help', label: { de: 'Ich brauche jemanden, der mir hilft', en: 'I need someone to help me' }, score: 0 },
      { id: 'search', label: { de: 'Ich suche im Internet und probiere Anleitungen aus', en: 'I search online and try tutorials' }, score: 1 },
      { id: 'live', label: { de: 'Ich starte ein Live-System und repariere von dort', en: 'I boot a live system and repair from there' }, score: 2 },
      { id: 'journal', label: { de: 'Ich schaue ins Protokoll und rolle den letzten Schnappschuss zurück', en: 'I check the logs and roll back the last snapshot' }, score: 3 },
    ],
  },
  {
    id: 'terminal-habit',
    title: { de: 'Wie oft tippst du Befehle in ein Terminal?', en: 'How often do you type commands into a terminal?' },
    options: [
      { id: 'never', label: { de: 'Nie', en: 'Never' }, score: 0 },
      { id: 'rare', label: { de: 'Selten, und nur mit Anleitung', en: 'Rarely, and only with a tutorial' }, score: 1 },
      { id: 'often', label: { de: 'Regelmäßig', en: 'Regularly' }, score: 2 },
      { id: 'scripts', label: { de: 'Täglich – ich schreibe auch eigene Skripte', en: 'Daily — I write my own scripts too' }, score: 3 },
    ],
  },
];

export const MAX_TRIAGE_SCORE = triageQuestions.length * 3;

/** Wandelt die Triage-Punkte in einen Modusvorschlag. */
export function suggestMode(score: number): Mode {
  if (score <= 3) return 'beginner';
  if (score <= 6) return 'advanced';
  return 'expert';
}
