import { desktops } from '../data/desktops';
import type { DesktopEnvironment } from '../data/types';
import type { Answers, Mode } from '../data/questions';
import { visibleQuestions } from '../data/questions';

/**
 * Empfehlung einer Desktop-Umgebung.
 *
 * Bewusst getrennt von der Distributionsbewertung: Die Oberfläche entscheidet
 * im Alltag oft mehr als der Unterbau, sie lässt sich aber bei fast jeder
 * Distribution austauschen. Beides in eine Zahl zu pressen würde diesen
 * Zusammenhang verwischen.
 *
 * Die Zuordnung von Antworten zu Eigenschaften steht hier explizit statt im
 * Fragenkatalog, weil nur wenige Fragen überhaupt etwas über die Oberfläche
 * aussagen – und weil sie so an einer Stelle nachlesbar bleibt.
 */

/** Gründe werden als Code geliefert und erst in der Oberfläche übersetzt. */
export type DesktopReason =
  | 'explicit-choice'
  | 'windows-like'
  | 'macos-like'
  | 'calm'
  | 'configurable'
  | 'beginner'
  | 'lightweight'
  | 'touch'
  | 'accessibility'
  | 'hdr-multimonitor'
  | 'x11-needed'
  | 'tiling';

export interface DesktopConcern {
  code: 'x11-ending' | 'no-x11' | 'heavy' | 'steep' | 'weak-accessibility' | 'not-in-distro';
}

export interface DesktopResult {
  desktop: DesktopEnvironment;
  /** 0–100, innerhalb dieser Liste vergleichbar. */
  score: number;
  eligible: boolean;
  reasons: DesktopReason[];
  concerns: DesktopConcern['code'][];
}

type Attr = 'beginnerFriendly' | 'customizability' | 'lightweight' | 'touchFriendly' | 'accessibility';

interface DesktopProfile {
  weights: Partial<Record<Attr, number>>;
  affinity: Map<string, number>;
  reasons: Map<string, DesktopReason[]>;
  /** Eine X11-Sitzung ist zwingend (alte NVIDIA-Karte, ausdrückliche Angabe). */
  requiresX11: boolean;
  /** Einsteigerfreundlichkeit war ausdrücklich Thema. */
  needsBeginnerFriendly: boolean;
  answered: number;
}

function addReason(profile: DesktopProfile, id: string, reason: DesktopReason) {
  const list = profile.reasons.get(id) ?? [];
  if (!list.includes(reason)) list.push(reason);
  profile.reasons.set(id, list);
}

function boost(profile: DesktopProfile, id: string, value: number, reason?: DesktopReason) {
  profile.affinity.set(id, (profile.affinity.get(id) ?? 0) + value);
  if (reason) addReason(profile, id, reason);
}

function weigh(profile: DesktopProfile, attr: Attr, value: number) {
  profile.weights[attr] = (profile.weights[attr] ?? 0) + value;
}

export function buildDesktopProfile(mode: Mode, answers: Answers): DesktopProfile {
  const profile: DesktopProfile = {
    weights: {},
    affinity: new Map(),
    reasons: new Map(),
    requiresX11: false,
    needsBeginnerFriendly: false,
    answered: 0,
  };

  const visible = new Set(visibleQuestions(mode, answers).map((q) => q.id));
  const has = (question: string, option: string) =>
    visible.has(question) && (answers[question] ?? []).includes(option);
  const answeredAny = (question: string) => visible.has(question) && (answers[question] ?? []).length > 0;

  for (const q of ['look', 'desktop-preference', 'ram', 'terminal', 'display-setup', 'gpu', 'purpose']) {
    if (answeredAny(q)) profile.answered += 1;
  }

  // --- Bedienkonzept ---
  if (has('look', 'windows-like')) {
    weigh(profile, 'beginnerFriendly', 2);
    for (const id of ['cinnamon', 'plasma', 'mate', 'xfce', 'lxqt', 'icewm']) boost(profile, id, 10, 'windows-like');
    boost(profile, 'cinnamon', 6);
    boost(profile, 'plasma', 4);
  }
  if (has('look', 'macos-like')) {
    for (const id of ['pantheon', 'gnome', 'budgie']) boost(profile, id, 10, 'macos-like');
    boost(profile, 'pantheon', 8);
  }
  if (has('look', 'clean')) {
    for (const id of ['gnome', 'budgie', 'pantheon', 'cosmic']) boost(profile, id, 9, 'calm');
  }
  if (has('look', 'tweak')) {
    weigh(profile, 'customizability', 3);
    for (const id of ['plasma', 'xfce', 'mate', 'cosmic']) boost(profile, id, 7, 'configurable');
  }

  // --- Ausdrückliche Wahl schlägt alles andere ---
  const preference = answers['desktop-preference'] ?? [];
  for (const id of ['gnome', 'plasma', 'xfce', 'cinnamon']) {
    if (preference.includes(id)) boost(profile, id, 55, 'explicit-choice');
  }
  if (preference.includes('tiling')) {
    weigh(profile, 'customizability', 2);
    for (const id of ['hyprland', 'sway', 'i3', 'herbstluftwm']) boost(profile, id, 45, 'tiling');
  }

  // --- Sparsamkeit ---
  if (has('ram', 'ram-2') || has('hardware-age', 'ancient')) {
    weigh(profile, 'lightweight', 4);
    for (const id of ['lxqt', 'lxde', 'icewm', 'fluxbox', 'jwm', 'xfce', 'openbox']) boost(profile, id, 8, 'lightweight');
  } else if (has('ram', 'ram-4') || has('hardware-age', 'older') || has('purpose', 'revive')) {
    weigh(profile, 'lightweight', 3);
    for (const id of ['xfce', 'mate', 'lxqt', 'cinnamon']) boost(profile, id, 6, 'lightweight');
  }

  // --- Vorwissen ---
  if (has('terminal', 'never')) {
    weigh(profile, 'beginnerFriendly', 4);
    profile.needsBeginnerFriendly = true;
  } else if (has('terminal', 'copy-paste')) weigh(profile, 'beginnerFriendly', 2);
  else if (has('terminal', 'daily')) weigh(profile, 'customizability', 2);

  // --- Bildschirme ---
  if (has('display-setup', 'hdr') || has('display-setup', 'mixed')) {
    boost(profile, 'plasma', 14, 'hdr-multimonitor');
    boost(profile, 'gnome', 6);
  }
  if (has('display-setup', 'hidpi')) {
    boost(profile, 'gnome', 8);
    boost(profile, 'plasma', 8);
  }
  if (has('display-setup', 'touch')) {
    weigh(profile, 'touchFriendly', 4);
    boost(profile, 'gnome', 10, 'touch');
  }

  // --- Barrierefreiheit ---
  if (has('workload-extra', 'accessibility')) {
    weigh(profile, 'accessibility', 5);
    boost(profile, 'gnome', 16, 'accessibility');
  }

  // --- Grafikkarte und Sitzungsart ---
  if (has('gpu', 'nvidia-old') || has('x11-requirement', 'required')) {
    profile.requiresX11 = true;
  }
  if (has('x11-requirement', 'wayland')) {
    for (const id of ['gnome', 'plasma', 'cosmic', 'budgie', 'sway', 'hyprland']) boost(profile, id, 8);
  }

  return profile;
}

function attributeScore(de: DesktopEnvironment, weights: DesktopProfile['weights']): number {
  const entries = Object.entries(weights) as [Attr, number][];
  const total = entries.reduce((sum, [, w]) => sum + Math.abs(w), 0);
  if (total === 0) return 55;
  let achieved = 0;
  for (const [attr, weight] of entries) achieved += Math.abs(weight) * (de[attr] / 10);
  return (achieved / total) * 100;
}

/** Bewertet alle Desktop-Umgebungen gegen die Antworten. */
export function scoreDesktops(mode: Mode, answers: Answers): { results: DesktopResult[]; answered: number } {
  const profile = buildDesktopProfile(mode, answers);

  const results = desktops.map((de): DesktopResult => {
    const base = attributeScore(de, profile.weights);
    const affinity = profile.affinity.get(de.id) ?? 0;
    // Sättigend, damit ein einzelner Treffer nicht alles überfährt.
    const affinityRatio = affinity > 0 ? 1 - Math.exp(-affinity / 26) : 0;
    const raw = base * 0.55 + affinityRatio * 45;

    const eligible = !profile.requiresX11 || de.x11Session !== 'none';

    // Begründungen, die sich erst am einzelnen Desktop entscheiden.
    const derived: DesktopReason[] = [];
    if (profile.requiresX11 && de.x11Session !== 'none') derived.push('x11-needed');
    if (profile.needsBeginnerFriendly && de.beginnerFriendly >= 8) derived.push('beginner');

    const concerns: DesktopResult['concerns'] = [];
    if (de.x11Session === 'ending') concerns.push('x11-ending');
    if (!eligible) concerns.push('no-x11');
    if (de.ramFootprintMb >= 900) concerns.push('heavy');
    if (de.beginnerFriendly <= 3) concerns.push('steep');
    if (de.accessibility <= 3) concerns.push('weak-accessibility');

    return {
      desktop: de,
      score: Math.round(Math.max(0, Math.min(100, raw))),
      eligible,
      reasons: [...(profile.reasons.get(de.id) ?? []), ...derived].slice(0, 3),
      concerns,
    };
  });

  results.sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    return b.score - a.score;
  });

  return { results, answered: profile.answered };
}
