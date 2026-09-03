import { distros, getDistro } from '../data/distros';
import { desktopById } from '../data/desktops';
import {
  archLabels, audienceLabels, familyLabels, governanceLabels, initLabels, installerLabels,
  libcLabels, maintenanceLabels, nvidiaLabels, packageFormatLabels, packageManagerLabels,
  ratingHelp, ratingLabels, releaseModelLabels, secureBootLabels, useI18n,
} from '../i18n';
import type { RatingKey } from '../data/types';
import { CompareToggle, DefaultDesktopLabel, Fact, Link, Meter, Monogram, YesNo } from './common';

const RATING_ORDER: RatingKey[] = [
  'beginnerFriendly', 'stability', 'freshness', 'hardwareSupport', 'lightweight', 'gaming',
  'customizability', 'softwareAvailability', 'upgradeSmoothness', 'documentation', 'communitySize',
  'germanSupport', 'privacy', 'enterpriseReady', 'creativeWork', 'upstreamPurity',
];

export function DistroPage({ id }: { id: string }) {
  const { t, tl, tls, lang } = useI18n();
  const distro = getDistro(id);

  if (!distro) {
    return (
      <section className="section">
        <div className="container container--narrow">
          <h1>404</h1>
          <p>
            <Link to={{ name: 'browse' }}>{t('detailBack')}</Link>
          </p>
        </div>
      </section>
    );
  }

  const base = distro.basedOn ? getDistro(distro.basedOn) : undefined;
  const derivatives = distros.filter((d) => d.basedOn === distro.id);

  return (
    <article className="section">
      <div className="container stack stack-lg">
        <p className="no-print">
          <Link to={{ name: 'browse' }}>← {t('detailBack')}</Link>
        </p>

        <header className="stack">
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Monogram distro={distro} large />
            <div style={{ flex: '1 1 20rem', minWidth: 0 }}>
              <h1 style={{ fontSize: 'var(--step-3)', marginBottom: '0.25rem' }}>{distro.name}</h1>
              <p style={{ fontSize: 'var(--step-1)', color: 'var(--ink-muted)', margin: 0 }}>{tl(distro.tagline)}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="no-print">
              <CompareToggle id={distro.id} />
              <a className="btn btn--primary" href={distro.downloadUrl} target="_blank" rel="noreferrer noopener">
                {t('detailDownload')} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <p className="prose" style={{ fontSize: 'var(--step-1)' }}>
            {tl(distro.description)}
          </p>

          <ul className="chiprow">
            <li className="chip">{tl(familyLabels[distro.family])}</li>
            <li className="chip">{tl(releaseModelLabels[distro.releaseModel])}</li>
            {/* Blau steht in jeder Ansicht für die Desktop-Aussage. */}
            <li className="chip chip--accent">
              <DefaultDesktopLabel distro={distro} />
            </li>
            <li className="chip">{distro.currentVersion}</li>
            {distro.audiences.map((a) => (
              <li key={a} className="chip">
                {tl(audienceLabels[a])}
              </li>
            ))}
          </ul>

          <ul className="chiprow no-print">
            <li>
              <a className="chip" href={distro.website} target="_blank" rel="noreferrer noopener">
                {t('detailWebsite')} ↗
              </a>
            </li>
            {distro.docsUrl && (
              <li>
                <a className="chip" href={distro.docsUrl} target="_blank" rel="noreferrer noopener">
                  {t('detailDocs')} ↗
                </a>
              </li>
            )}
            {distro.germanResourceUrl && (
              <li>
                <a className="chip" href={distro.germanResourceUrl} target="_blank" rel="noreferrer noopener">
                  {t('detailGermanHelp')} ↗
                </a>
              </li>
            )}
          </ul>
        </header>

        <div className="grid grid--2">
          <section className="card">
            <h2 style={{ fontSize: 'var(--step-1)' }}>{t('detailHighlights')}</h2>
            <ul>
              {tls(distro.highlights).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2 style={{ fontSize: 'var(--step-1)' }}>{t('detailFirstSteps')}</h2>
            <ol>
              {tls(distro.firstSteps).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ol>
          </section>
          <section className="card">
            <h2 style={{ fontSize: 'var(--step-1)' }}>{t('detailBestFor')}</h2>
            <ul>
              {tls(distro.bestFor).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2 style={{ fontSize: 'var(--step-1)' }}>{t('detailNotFor')}</h2>
            <ul>
              {tls(distro.notFor).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
        </div>

        {tls(distro.warnings).length > 0 && (
          <section className="callout callout--warning">
            <h2 className="callout__title">{t('detailWarnings')}</h2>
            <ul style={{ margin: 0 }}>
              {tls(distro.warnings).map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="stack">
          <h2 style={{ fontSize: 'var(--step-2)' }}>{t('detailRatings')}</h2>
          <div className="grid grid--2" style={{ gap: '0.75rem 2rem' }}>
            {RATING_ORDER.map((key) => (
              <div key={key} title={tl(ratingHelp[key])}>
                <Meter label={tl(ratingLabels[key])} value={distro.ratings[key]} />
              </div>
            ))}
          </div>
        </section>

        <section className="stack">
          <h2 style={{ fontSize: 'var(--step-2)' }}>{t('detailFacts')}</h2>
          <dl className="grid grid--3 card" style={{ gap: '1rem 1.5rem' }}>
            <Fact label={t('fieldVersion')}>
              {distro.currentVersion} <span style={{ color: 'var(--ink-faint)' }}>({distro.currentVersionDate})</span>
            </Fact>
            <Fact label={t('fieldSupportUntil')}>{tl(distro.supportUntil)}</Fact>
            <Fact label={t('fieldReleaseCadence')}>{tl(distro.releaseCadence)}</Fact>
            <Fact label={t('fieldOrigin')}>{distro.originCountry}</Fact>
            <Fact label={t('fieldFirstRelease')}>{distro.firstRelease}</Fact>
            <Fact label={t('fieldGovernance')}>{tl(governanceLabels[distro.governance])}</Fact>
            <Fact label={t('fieldInit')}>{tl(initLabels[distro.init])}</Fact>
            <Fact label={t('fieldLibc')}>{tl(libcLabels[distro.libc])}</Fact>
            <Fact label={t('fieldPackageManager')}>
              {tl(packageManagerLabels[distro.packageManager])} · {tl(packageFormatLabels[distro.packageFormat])}
            </Fact>
            <Fact label={t('fieldFlatpak')}>
              <YesNo value={distro.flatpakReady} />
            </Fact>
            <Fact label={t('fieldSnap')}>
              <YesNo value={distro.snapReady} />
            </Fact>
            <Fact label={t('fieldAur')}>
              <YesNo value={distro.aur} />
            </Fact>
            <Fact label={t('fieldDefaultDesktop')}>
              {distro.defaultDesktop === 'none' ? (
                t('none')
              ) : (
                <Link to={{ name: 'desktops' }}>
                  {desktopById.get(distro.defaultDesktop)?.name ?? distro.defaultDesktop}
                </Link>
              )}
            </Fact>
            <Fact label={t('fieldDesktops')}>
              {distro.availableDesktops.length === 0
                ? t('none')
                : distro.availableDesktops.map((d) => desktopById.get(d)?.name ?? d).join(', ')}
            </Fact>
            <Fact label={t('fieldInstaller')}>
              {tl(installerLabels[distro.installer])} · {t('fieldInstallDifficulty')} {distro.installDifficulty}/10
            </Fact>
            <Fact label={t('fieldMinRam')}>
              {distro.minRamGb} {t('gb')} ({t('fieldRecommendedRam')}: {distro.recommendedRamGb} {t('gb')})
            </Fact>
            <Fact label={t('fieldMinStorage')}>
              {distro.minStorageGb} {t('gb')}
            </Fact>
            <Fact label={t('fieldArchitectures')}>{distro.architectures.map((a) => tl(archLabels[a])).join(', ')}</Fact>
            <Fact label={t('field32bit')}>
              <YesNo value={distro.supports32Bit} />
            </Fact>
            <Fact label={t('fieldRaspberry')}>
              <YesNo value={distro.runsOnRaspberryPi} />
            </Fact>
            <Fact label={t('fieldSecureBoot')}>{tl(secureBootLabels[distro.secureBoot])}</Fact>
            <Fact label={t('fieldNvidia')}>{tl(nvidiaLabels[distro.nvidia])}</Fact>
            <Fact label={t('fieldCodecs')}>
              <YesNo value={distro.codecsOutOfBox} />
            </Fact>
            <Fact label={t('fieldFde')}>
              <YesNo value={distro.fullDiskEncryptionInInstaller} />
            </Fact>
            <Fact label={t('fieldSnapshots')}>
              <YesNo value={distro.snapshotRollback} />
            </Fact>
            <Fact label={t('fieldAtomic')}>
              <YesNo value={distro.atomic} />
            </Fact>
            <Fact label={t('fieldWayland')}>
              <YesNo value={distro.waylandDefault} />
            </Fact>
            <Fact label={t('fieldX11')}>
              <YesNo value={distro.x11SessionAvailable} />
            </Fact>
            <Fact label={t('fieldMaintenance')}>{tl(maintenanceLabels[distro.maintenanceLoad])}</Fact>
            <Fact label={t('fieldCommercialSupport')}>
              <YesNo value={distro.commercialSupport} />
            </Fact>
          </dl>
        </section>

        <div className="grid grid--2">
          <section className="card">
            <h2 style={{ fontSize: 'var(--step-1)' }}>{t('fieldTelemetry')}</h2>
            <p style={{ margin: 0 }}>{tl(distro.telemetry)}</p>
          </section>
          <section className="card">
            <h2 style={{ fontSize: 'var(--step-1)' }}>{t('detailExtraRepos')}</h2>
            <ul style={{ margin: 0 }}>
              {tls(distro.extraRepos).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        </div>

        {(base || derivatives.length > 0) && (
          <section className="stack">
            <h2 style={{ fontSize: 'var(--step-2)' }}>{lang === 'de' ? 'Verwandtschaft' : 'Relatives'}</h2>
            <div className="grid grid--2">
              {base && (
                <div className="card">
                  <h3 style={{ fontSize: 'var(--step-0)', fontFamily: 'var(--font-body)' }}>{t('detailBasedOn')}</h3>
                  <Link to={{ name: 'distro', id: base.id }}>{base.name}</Link>
                </div>
              )}
              {derivatives.length > 0 && (
                <div className="card">
                  <h3 style={{ fontSize: 'var(--step-0)', fontFamily: 'var(--font-body)' }}>{t('detailDerivatives')}</h3>
                  <ul className="chiprow">
                    {derivatives.map((d) => (
                      <li key={d.id}>
                        <Link to={{ name: 'distro', id: d.id }} className="chip">
                          {d.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="stack">
          <h2 style={{ fontSize: 'var(--step-1)' }}>{t('detailSources')}</h2>
          <ul>
            {distro.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer noopener">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 'var(--step--1)', color: 'var(--ink-faint)' }}>
            {t('detailCheckedAt')} <time dateTime={distro.checkedAt}>{distro.checkedAt}</time>
          </p>
        </section>
      </div>
    </article>
  );
}
