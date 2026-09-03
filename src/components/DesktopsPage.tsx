import { desktops } from '../data/desktops';
import { distros } from '../data/distros';
import { useI18n } from '../i18n';
import { Link, Meter } from './common';

export function DesktopsPage() {
  const { t, tl, tls } = useI18n();

  return (
    <section className="section">
      <div className="container stack stack-lg">
        <header>
          <h1 style={{ fontSize: 'var(--step-3)' }}>{t('desktopsTitle')}</h1>
          <p className="prose" style={{ color: 'var(--ink-muted)' }}>
            {t('desktopsLead')}
          </p>
        </header>

        <div className="grid grid--2">
          {desktops.map((de) => {
            const defaultIn = distros.filter((d) => d.defaultDesktop === de.id);
            const availableIn = distros.filter((d) => d.availableDesktops.includes(de.id));
            return (
              <article key={de.id} className="card" style={{ display: 'grid', gap: '0.9rem', alignContent: 'start' }}>
                <header style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: '0.7rem',
                      height: '0.7rem',
                      borderRadius: 3,
                      background: `hsl(${de.accent})`,
                      flex: 'none',
                      alignSelf: 'center',
                    }}
                  />
                  <h2 style={{ fontSize: 'var(--step-1)', margin: 0 }}>{de.name}</h2>
                  <span style={{ color: 'var(--ink-faint)', fontSize: 'var(--step--1)', marginLeft: 'auto' }}>
                    ~{de.ramFootprintMb} MB
                  </span>
                </header>

                <p style={{ margin: 0, color: 'var(--ink-muted)', fontStyle: 'italic' }}>{tl(de.tagline)}</p>
                <p style={{ margin: 0 }}>{tl(de.description)}</p>

                <p style={{ margin: 0, fontSize: 'var(--step--1)' }}>
                  <strong>{t('desktopFeelsLike')}:</strong> {tl(de.feelsLike)}
                </p>
                <p style={{ margin: 0, fontSize: 'var(--step--1)' }}>
                  <strong>{t('desktopWayland')}:</strong> {tl(de.waylandStatus)}
                </p>

                <div style={{ display: 'grid', gap: '0.4rem' }}>
                  <Meter label={t('sortBeginner')} value={de.beginnerFriendly} />
                  <Meter label={t('desktopCustomizability')} value={de.customizability} />
                  <Meter label={t('sortLightweight')} value={de.lightweight} />
                  <Meter label={t('desktopTouch')} value={de.touchFriendly} />
                  <Meter label={t('desktopAccessibility')} value={de.accessibility} />
                </div>

                <div className="reasons">
                  <div>
                    <h4>{t('desktopStrengths')}</h4>
                    <ul>
                      {tls(de.strengths).map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>{t('desktopTradeoffs')}</h4>
                    <ul>
                      {tls(de.tradeoffs).map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {defaultIn.length > 0 && (
                  <div>
                    <h4
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--step--1)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        color: 'var(--ink-faint)',
                        marginBottom: '0.4rem',
                      }}
                    >
                      {t('desktopUsedBy')}
                    </h4>
                    <ul className="chiprow">
                      {defaultIn.slice(0, 8).map((d) => (
                        <li key={d.id}>
                          <Link to={{ name: 'distro', id: d.id }} className="chip">
                            {d.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p style={{ margin: 0, fontSize: 'var(--step--1)', color: 'var(--ink-faint)' }}>
                  {t('desktopAvailableIn', { n: availableIn.length })} ·{' '}
                  <a href={de.website} target="_blank" rel="noreferrer noopener">
                    {t('detailWebsite')} ↗
                  </a>
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
