import {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode,
} from 'react';
import type { Answers, Mode } from '../data/questions';

export type Route =
  | { name: 'home' }
  | { name: 'triage' }
  | { name: 'quiz' }
  | { name: 'result' }
  | { name: 'browse' }
  | { name: 'distro'; id: string }
  | { name: 'compare' }
  | { name: 'desktops' }
  | { name: 'about' };

// ---------------------------------------------------------------------------
// Zustand
// ---------------------------------------------------------------------------

/** Was in der engeren Wahl liegen kann. */
export type CompareKind = 'distro' | 'desktop';

/** Farbschema. Es gibt nur die beiden bewussten Wahlmöglichkeiten. */
export type Theme = 'light' | 'dark';

interface State {
  mode: Mode;
  /** Wurde der Modus bewusst gewählt (Triage abgeschlossen oder manuell)? */
  modeChosen: boolean;
  answers: Answers;
  /*
   * Distributionen und Desktops werden getrennt gehalten statt in einer Liste.
   * Sie haben völlig unterschiedliche Merkmale, ließen sich also nie in einer
   * Tabelle nebeneinanderstellen – und sie schließen sich nicht aus: „Mint
   * oder Fedora" und „Cinnamon oder Plasma" ist eine normale Fragestellung.
   */
  compare: string[];
  compareDesktops: string[];
}

type Action =
  | { type: 'setMode'; mode: Mode; chosen?: boolean }
  | { type: 'answer'; questionId: string; optionIds: string[] }
  | { type: 'reset' }
  | { type: 'toggleCompare'; id: string; kind: CompareKind }
  | { type: 'clearCompare'; kind?: CompareKind }
  | { type: 'load'; state: Partial<State> };

const initialState: State = { mode: 'beginner', modeChosen: false, answers: {}, compare: [], compareDesktops: [] };

export const MAX_COMPARE = 6;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setMode':
      return { ...state, mode: action.mode, modeChosen: action.chosen ?? true };
    case 'answer': {
      const answers = { ...state.answers };
      if (action.optionIds.length === 0) delete answers[action.questionId];
      else answers[action.questionId] = action.optionIds;
      return { ...state, answers };
    }
    case 'reset':
      return { ...initialState, mode: state.mode, compare: state.compare, compareDesktops: state.compareDesktops };
    case 'toggleCompare': {
      const key = action.kind === 'desktop' ? 'compareDesktops' : 'compare';
      const list = state[key];
      if (list.includes(action.id)) return { ...state, [key]: list.filter((c) => c !== action.id) };
      if (list.length >= MAX_COMPARE) return state;
      return { ...state, [key]: [...list, action.id] };
    }
    case 'clearCompare':
      if (action.kind === 'distro') return { ...state, compare: [] };
      if (action.kind === 'desktop') return { ...state, compareDesktops: [] };
      return { ...state, compare: [], compareDesktops: [] };
    case 'load':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Kodierung für teilbare Links
// ---------------------------------------------------------------------------

/** Antworten kompakt kodieren: `frage:a.b~frage2:c` */
export function encodeAnswers(answers: Answers): string {
  return Object.entries(answers)
    .filter(([, v]) => v.length > 0)
    .map(([q, v]) => `${q}:${v.join('.')}`)
    .join('~');
}

export function decodeAnswers(raw: string): Answers {
  const answers: Answers = {};
  for (const part of raw.split('~')) {
    const idx = part.indexOf(':');
    if (idx <= 0) continue;
    const question = part.slice(0, idx);
    const options = part.slice(idx + 1).split('.').filter(Boolean);
    if (options.length > 0) answers[question] = options;
  }
  return answers;
}

function parseHash(): { route: Route; params: URLSearchParams } {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [path, query = ''] = hash.split('?');
  const params = new URLSearchParams(query);
  const segments = path.split('/').filter(Boolean);

  let route: Route = { name: 'home' };
  switch (segments[0]) {
    case 'triage': route = { name: 'triage' }; break;
    case 'quiz': route = { name: 'quiz' }; break;
    case 'result': route = { name: 'result' }; break;
    case 'browse': route = { name: 'browse' }; break;
    case 'compare': route = { name: 'compare' }; break;
    case 'desktops': route = { name: 'desktops' }; break;
    case 'about': route = { name: 'about' }; break;
    case 'distro': if (segments[1]) route = { name: 'distro', id: segments[1] }; break;
    default: route = { name: 'home' };
  }
  return { route, params };
}

export function routeToPath(route: Route): string {
  switch (route.name) {
    case 'home': return '#/';
    case 'distro': return `#/distro/${route.id}`;
    default: return `#/${route.name}`;
  }
}

// ---------------------------------------------------------------------------
// Kontext
// ---------------------------------------------------------------------------

/**
 * Zustand, der beim Navigieren von der Adresszeile abweichen darf.
 *
 * Wer den Modus wechselt oder den Fragebogen neu startet und im selben
 * Klick weiternavigiert, sieht den frischen Wert noch nicht im `state`:
 * der Reducer läuft erst nach dem Ereignis. Ohne diese Mitgabe schriebe
 * die Adresszeile den alten Stand fest und holte ihn gleich zurück.
 */
export interface NavigateOverrides {
  mode?: Mode;
  answers?: Answers;
}

interface AppContextValue extends State {
  route: Route;
  navigate: (route: Route, options?: { withState?: boolean } & NavigateOverrides) => void;
  setMode: (mode: Mode, chosen?: boolean) => void;
  setAnswer: (questionId: string, optionIds: string[]) => void;
  reset: () => void;
  toggleCompare: (id: string, kind?: CompareKind) => void;
  clearCompare: (kind?: CompareKind) => void;
  /** Teilbarer Link auf das aktuelle Ergebnis. */
  shareUrl: () => string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

/** Seiten, deren Zustand in der Adresszeile mitgeführt wird. */
const SYNCED_ROUTES: Route['name'][] = ['quiz', 'result', 'compare'];

const THEME_KEY = 'linuxkompass.theme';

/*
 * Vorgabe ist das helle Design, nicht die Systemeinstellung.
 *
 * Viele Telefone schalten abends automatisch auf Dunkel um. Die Seite wechselte
 * dann mitten im Fragebogen das Aussehen, ohne dass jemand etwas gewählt hätte.
 * Das Dunkle bleibt gleichwertig – aber als Entscheidung, nicht als Uhrzeit.
 */
function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Speicher nicht verfügbar – dann gilt die Vorgabe.
  }
  return 'light';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [route, setRoute] = useState<Route>(() => parseHash().route);
  const [theme, setThemeState] = useState<Theme>(readTheme);
  const [hydrated, setHydrated] = useState(false);
  // Spiegel des Zustands für den hashchange-Listener, der nur einmal
  // registriert wird und trotzdem den aktuellen Stand sehen muss.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Beim ersten Laden Zustand aus der Adresszeile übernehmen. Die Adresszeile
  // ist hier das externe System, mit dem synchronisiert wird.
  useEffect(() => {
    const { route: r, params } = parseHash();
    const loaded: Partial<State> = {};
    const a = params.get('a');
    if (a) loaded.answers = decodeAnswers(a);
    const m = params.get('m');
    if (m === 'beginner' || m === 'advanced' || m === 'expert') {
      loaded.mode = m;
      loaded.modeChosen = true;
    }
    const c = params.get('c');
    if (c) loaded.compare = c.split('.').filter(Boolean).slice(0, MAX_COMPARE);
    const cd = params.get('cd');
    if (cd) loaded.compareDesktops = cd.split('.').filter(Boolean).slice(0, MAX_COMPARE);
    if (Object.keys(loaded).length > 0) dispatch({ type: 'load', state: loaded });
    setRoute(r);
    setHydrated(true);
  }, []);

  // Bei jedem Wechsel der Adresszeile auch den mitgegebenen Zustand übernehmen.
  // Sonst würde ein von außen eingefügter Ergebnis-Link in einem bereits
  // geöffneten Tab stillschweigend mit dem alten Zustand überschrieben.
  useEffect(() => {
    const onHash = () => {
      const { route: r, params } = parseHash();
      const incoming = params.get('a');
      const incomingMode = params.get('m');
      const incomingCompare = params.get('c');
      const loaded: Partial<State> = {};

      if (incoming !== null && incoming !== encodeAnswers(stateRef.current.answers)) {
        loaded.answers = decodeAnswers(incoming);
      }
      if (
        (incomingMode === 'beginner' || incomingMode === 'advanced' || incomingMode === 'expert') &&
        incomingMode !== stateRef.current.mode
      ) {
        loaded.mode = incomingMode;
        loaded.modeChosen = true;
      }
      if (incomingCompare !== null && incomingCompare !== stateRef.current.compare.join('.')) {
        loaded.compare = incomingCompare.split('.').filter(Boolean).slice(0, MAX_COMPARE);
      }
      const incomingDesktops = params.get('cd');
      if (incomingDesktops !== null && incomingDesktops !== stateRef.current.compareDesktops.join('.')) {
        loaded.compareDesktops = incomingDesktops.split('.').filter(Boolean).slice(0, MAX_COMPARE);
      }
      if (Object.keys(loaded).length > 0) dispatch({ type: 'load', state: loaded });
      setRoute(r);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ohne Speicher gilt die Wahl nur für diese Sitzung.
    }
  }, [theme]);

  const buildHash = useCallback(
    (target: Route, withState: boolean, overrides?: NavigateOverrides) => {
      const base = routeToPath(target);
      if (!withState) return base;
      const params = new URLSearchParams();
      params.set('m', overrides?.mode ?? state.mode);
      const encoded = encodeAnswers(overrides?.answers ?? state.answers);
      if (encoded) params.set('a', encoded);
      if (state.compare.length > 0) params.set('c', state.compare.join('.'));
      if (state.compareDesktops.length > 0) params.set('cd', state.compareDesktops.join('.'));
      return `${base}?${params.toString()}`;
    },
    [state.mode, state.answers, state.compare, state.compareDesktops],
  );

  const navigate = useCallback(
    (target: Route, options?: { withState?: boolean } & NavigateOverrides) => {
      const withState = options?.withState ?? ['result', 'quiz', 'compare'].includes(target.name);
      window.location.hash = buildHash(target, withState, options);
      // Siehe QuizPage: `auto` folgt dem CSS und damit `smooth`.
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [buildHash],
  );

  /*
   * Adresszeile mitführen, solange man im Fragebogen, Ergebnis oder Vergleich ist.
   *
   * Der Fragebogen gehört dazu, weil sonst nach „Von vorn beginnen" die alten
   * Antworten noch in der Adresszeile stünden: ein Klick auf Zurück im Browser
   * holte sie wortlos zurück. Nebenbei übersteht so auch ein Neuladen der Seite
   * den aktuellen Stand.
   */
  useEffect(() => {
    if (!hydrated) return;
    if (!SYNCED_ROUTES.includes(route.name)) return;
    const next = buildHash(route, true);
    if (`#${window.location.hash.replace(/^#/, '')}` !== next) {
      window.history.replaceState(null, '', next);
    }
  }, [hydrated, route, buildHash]);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      route,
      navigate,
      setMode: (mode, chosen) => dispatch({ type: 'setMode', mode, chosen }),
      setAnswer: (questionId, optionIds) => dispatch({ type: 'answer', questionId, optionIds }),
      reset: () => dispatch({ type: 'reset' }),
      toggleCompare: (id, kind = 'distro') => dispatch({ type: 'toggleCompare', id, kind }),
      clearCompare: (kind) => dispatch({ type: 'clearCompare', kind }),
      shareUrl: () => `${window.location.origin}${window.location.pathname}${buildHash({ name: 'result' }, true)}`,
      theme,
      setTheme: setThemeState,
    }),
    [state, route, navigate, buildHash, theme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp muss innerhalb von <AppProvider> verwendet werden.');
  return ctx;
}
