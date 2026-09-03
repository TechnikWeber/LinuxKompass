import type { ReactNode } from 'react';
import type { Distro, L10n } from '../data/types';
import { useApp, type Route } from '../state/app';
import { useI18n } from '../i18n';

/** Interner Link, der über den Hash-Router navigiert. */
export function Link({
  to, children, className, withState, ...rest
}: {
  to: Route;
  children: ReactNode;
  className?: string;
  withState?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const { navigate, route } = useApp();
  const isCurrent = route.name === to.name && (to.name !== 'distro' || (route as { id?: string }).id === to.id);
  return (
    <a
      href="#"
      className={className}
      aria-current={isCurrent ? 'page' : undefined}
      onClick={(e) => {
        e.preventDefault();
        navigate(to, withState === undefined ? undefined : { withState });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Monogram({ distro, large }: { distro: Distro; large?: boolean }) {
  return (
    <span
      className={`monogram${large ? ' monogram--lg' : ''}`}
      style={{ ['--brand' as string]: distro.accent }}
      aria-hidden="true"
    >
      {distro.monogram}
    </span>
  );
}

/** Waagerechter Balken für einen Wert von 0–10. */
export function Meter({ label, value, max = 10, muted }: { label: string; value: number; max?: number; muted?: boolean }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="meter">
      <span className="meter__label">{label}</span>
      <span className="meter__value">
        {value}
        <span aria-hidden="true">/{max}</span>
      </span>
      <div className="meter__track" role="img" aria-label={`${label}: ${value} / ${max}`}>
        <div className={`meter__fill${muted ? ' meter__fill--muted' : ''}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt style={{ fontSize: 'var(--step--1)', color: 'var(--ink-faint)' }}>{label}</dt>
      <dd style={{ margin: '0.1rem 0 0' }}>{children}</dd>
    </div>
  );
}

export function YesNo({ value }: { value: boolean }) {
  const { t } = useI18n();
  return (
    <span className={`chip ${value ? 'chip--positive' : ''}`}>
      {value ? '✓' : '–'} {value ? t('yes') : t('no')}
    </span>
  );
}

/** Häkchen, um eine Distribution in die engere Wahl zu legen. */
export function CompareToggle({ id, small }: { id: string; small?: boolean }) {
  const { compare, toggleCompare } = useApp();
  const { t } = useI18n();
  const active = compare.includes(id);
  return (
    <button
      type="button"
      className={`btn${small ? ' btn--small' : ''}${active ? ' btn--primary' : ''}`}
      aria-pressed={active}
      onClick={(e) => {
        e.stopPropagation();
        toggleCompare(id);
      }}
    >
      <span aria-hidden="true">{active ? '☑' : '☐'}</span>
      {active ? t('compareAdded') : t('compareAdd')}
    </button>
  );
}

export function Explainer({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="explainer">
      <summary>{summary}</summary>
      <div>{children}</div>
    </details>
  );
}

export function L10nList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function useText() {
  const { tl, tls } = useI18n();
  return { text: (v: L10n | undefined) => tl(v), list: (v: { de: string[]; en: string[] } | undefined) => tls(v) };
}
