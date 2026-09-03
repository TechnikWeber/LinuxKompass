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
  | { name: 'about' };

// ---------------------------------------------------------------------------
// Zustand
// ---------------------------------------------------------------------------

interface State {
  mode: Mode;
  /** Wurde der Modus bewusst gewählt (Triage abgeschlossen oder manuell)? */
  modeChosen: boolean;
  answers: Answers;
  compare: string[];
}

type Action =
  | { type: 'setMode'; mode: Mode; chosen?: boolean }
  | { type: 'answer'; questionId: string; optionIds: string[] }
  | { type: 'reset' }
  | { type: 'toggleCompare'; id: string }
  | { type: 'clearCompare' }
  | { type: 'load'; state: Partial<State> };

const initialState: State = { mode: 'beginner', modeChosen: false, answers: {}, compare: [] };

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
      return { ...initialState, mode: state.mode, compare: state.compare };
    case 'toggleCompare': {
      const has = state.compare.includes(action.id);
      if (has) return { ...state, compare: state.compare.filter((c) => c !== action.id) };
      if (state.compare.length >= MAX_COMPARE) return state;
      return { ...state, compare: [...state.compare, action.id] };
    }
    case 'clearCompare':
      return { ...state, compare: [] };
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

interface AppContextValue extends State {
  route: Route;
  navigate: (route: Route, options?: { withState?: boolean }) => void;
  setMode: (mode: Mode, chosen?: boolean) => void;
  setAnswer: (questionId: string, optionIds: string[]) => void;
  reset: () => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  /** Teilbarer Link auf das aktuelle Ergebnis. */
  shareUrl: () => string;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const THEME_KEY = 'linuxkompass.theme';

function readTheme(): 'light' | 'dark' | 'system' {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Speicher nicht verfügbar – dann eben Systemeinstellung.
  }
  return 'system';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [route, setRoute] = useState<Route>(() => parseHash().route);
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(readTheme);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Beim ersten Laden Zustand aus der Adresszeile übernehmen.
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
      if (Object.keys(loaded).length > 0) dispatch({ type: 'load', state: loaded });
      setRoute(r);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    try {
      if (theme === 'system') localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ohne Speicher gilt die Wahl nur für diese Sitzung.
    }
  }, [theme]);

  const buildHash = useCallback(
    (target: Route, withState: boolean) => {
      const base = routeToPath(target);
      if (!withState) return base;
      const params = new URLSearchParams();
      params.set('m', state.mode);
      const encoded = encodeAnswers(state.answers);
      if (encoded) params.set('a', encoded);
      if (state.compare.length > 0) params.set('c', state.compare.join('.'));
      return `${base}?${params.toString()}`;
    },
    [state.mode, state.answers, state.compare],
  );

  const navigate = useCallback(
    (target: Route, options?: { withState?: boolean }) => {
      const withState = options?.withState ?? ['result', 'quiz', 'compare'].includes(target.name);
      window.location.hash = buildHash(target, withState);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [buildHash],
  );

  // Adresszeile mitführen, solange man im Fragebogen oder Ergebnis ist.
  useEffect(() => {
    if (!hydrated) return;
    if (route.name !== 'result' && route.name !== 'compare') return;
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
      toggleCompare: (id) => dispatch({ type: 'toggleCompare', id }),
      clearCompare: () => dispatch({ type: 'clearCompare' }),
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
