import { flagById } from '../data/flags';
import { useI18n } from '../i18n';

const ORDER = { critical: 0, warning: 1, info: 2 } as const;

export function FlagList({ ids }: { ids: string[] }) {
  const { tl, tls } = useI18n();
  const items = ids
    .map((id) => flagById.get(id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
    .sort((a, b) => ORDER[a.severity] - ORDER[b.severity]);

  if (items.length === 0) return null;

  return (
    <div className="stack">
      {items.map((flag) => (
        <div key={flag.id} className={`callout callout--${flag.severity === 'critical' ? 'critical' : flag.severity === 'warning' ? 'warning' : 'info'}`}>
          <h3 className="callout__title">{tl(flag.title)}</h3>
          <p style={{ color: 'var(--ink-muted)' }}>{tl(flag.message)}</p>
          <ul style={{ marginBottom: flag.links ? '0.75rem' : 0 }}>
            {tls(flag.advice).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {flag.links && (
            <ul className="chiprow">
              {flag.links.map((link) => (
                <li key={link.url}>
                  <a className="chip chip--accent" href={link.url} target="_blank" rel="noreferrer noopener">
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
