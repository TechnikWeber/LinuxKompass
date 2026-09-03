import { useMemo, useState } from 'react';
import { visibleQuestions } from '../data/questions';
import { scoreAll } from '../engine/score';
import { requirements } from '../engine/requirements';
import { useI18n } from '../i18n';
import { useApp, MAX_COMPARE } from '../state/app';
import { CompareToggle, Link, Monogram } from './common';
import { FlagList } from './FlagList';
import { ResultCard } from './ResultCard';
import { DesktopPick } from './DesktopPick';

const TIE_THRESHOLD = 3;

export function ResultPage() {
  const { t, tl, lang } = useI18n();
  const { mode, answers, navigate, setMode, compare, shareUrl } = useApp();
  const [showAll, setShowAll] = useState(false);
  const [showExcluded, setShowExcluded] = useState(false);
  const [copied, setCopied] = useState(false);

  const outcome = useMemo(() => scoreAll(mode, answers), [mode, answers]);
  const eligible = outcome.results.filter((r) => r.eligible);
  const excluded = outcome.results.filter((r) => !r.eligible);
  const answeredAny = Object.keys(answers).length > 0;

  const top = eligible[0];
  const alternatives = eligible.slice(1, 5);
  const tied = top ? eligible.filter((r) => top.score - r.score <= TIE_THRESHOLD) : [];

  const confidenceText =
    outcome.confidence < 0.45 ? t('resultConfidenceLow') : outcome.confidence < 0.75 ? t('resultConfidenceMedium') : t('resultConfidenceHigh');

  const deeperMode = mode === 'beginner' ? 'advanced' : mode === 'advanced' ? 'expert' : null;
  const deeperLabel = deeperMode === 'advanced' ? t('modeAdvanced') : t('modeExpert');

  // Nicht beantwortete Fragen benennen, statt sie stillschweigend zu übergehen.
  const unanswered = visibleQuestions(mode, answers).filter((q) => (answers[q.id] ?? []).length === 0);

  if (!answeredAny) {
    return (
      <section className="section">
        <div className="container container--narrow stack">
          <h1>{t('resultTitle')}</h1>
          <div className="callout callout--info">
            <p style={{ margin: 0 }}>
              {lang === 'de'
                ? 'Es liegen noch keine Antworten vor. Starte den Fragebogen, dann entsteht hier eine Empfehlung.'
                : 'There are no answers yet. Start the questionnaire and a recommendation will appear here.'}
            </p>
          </div>
          <div>
            <Link to={{ name: 'triage' }} className="btn btn--primary">
              {t('heroStart')}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container stack stack-lg">
        <header className="stack">
          <h1 style={{ fontSize: 'var(--step-3)' }}>{t('resultTitle')}</h1>
          <p className="prose" style={{ color: 'var(--ink-muted)' }}>
            {t('resultLead')}
          </p>

          <div className="card" style={{ maxWidth: '46rem' }}>
            <div className="meter">
              <span className="meter__label">{t('resultConfidence')}</span>
              <span className="meter__value">{Math.round(outcome.confidence * 100)} %</span>
              <div className="meter__track">
                <div className="progress__fill" style={{ width: `${outcome.confidence * 100}%`, height: '100%' }} />
              </div>
            </div>
            <p style={{ marginTop: '0.6rem', marginBottom: 0, fontSize: 'var(--step--1)', color: 'var(--ink-muted)' }}>
              {confidenceText}
              {unanswered.length > 0 && (
                <>
                  {' '}
                  {lang === 'de'
                    ? `${unanswered.length} Frage(n) sind noch offen.`
                    : `${unanswered.length} question(s) are still unanswered.`}
                </>
              )}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="no-print">
            <button type="button" className="btn btn--small" onClick={() => navigate({ name: 'quiz' })}>
              {t('resultRefine')}
            </button>
            {deeperMode && (
              <button
                type="button"
                className="btn btn--small"
                onClick={() => {
                  setMode(deeperMode);
                  navigate({ name: 'quiz' });
                }}
              >
                {t('resultDeepen', { mode: deeperLabel })}
              </button>
            )}
            <button
              type="button"
              className="btn btn--small"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shareUrl());
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2500);
                } catch {
                  // Zwischenablage gesperrt: dann bleibt der Link in der Adresszeile.
                }
              }}
            >
              {copied ? t('resultShareCopied') : t('resultShare')}
            </button>
            <button type="button" className="btn btn--small" onClick={() => window.print()}>
              {t('resultPrint')}
            </button>
            {compare.length > 0 && (
              <Link to={{ name: 'compare' }} className="btn btn--small btn--primary">
                {t('compareOpen')} ({compare.length})
              </Link>
            )}
          </div>
        </header>

        {outcome.relaxed.length > 0 && (
          <div className="callout callout--warning">
            <h2 className="callout__title">{t('resultRelaxed')}</h2>
            <p style={{ color: 'var(--ink-muted)' }}>{t('resultRelaxedLead')}</p>
            <ul style={{ margin: 0 }}>
              {outcome.relaxed.map((id) => (
                <li key={id}>{tl(requirements.get(id)?.label)}</li>
              ))}
            </ul>
          </div>
        )}

        {eligible.length > 0 && eligible.length <= 3 && (
          <div className="callout callout--info">
            <p style={{ margin: 0 }}>
              {t('resultNarrow', { n: eligible.length, total: outcome.results.length })}
            </p>
          </div>
        )}

        {top && <ResultCard result={top} rank={1} featured />}

        {tied.length > 1 && (
          <div className="callout callout--info">
            <p style={{ margin: 0 }}>
              {t('resultTiedWarning')}{' '}
              <strong>{tied.map((r) => r.distro.name).join(' · ')}</strong>
            </p>
          </div>
        )}

        {alternatives.length > 0 && (
          <section className="stack">
            <h2 style={{ fontSize: 'var(--step-2)' }}>{t('resultAlternatives')}</h2>
            <div className="grid grid--2">
              {alternatives.map((r, i) => (
                <ResultCard key={r.distro.id} result={r} rank={i + 2} />
              ))}
            </div>
          </section>
        )}

        <DesktopPick mode={mode} answers={answers} topDistro={top?.distro} />

        {outcome.profile.flags.size > 0 && (
          <section className="stack">
            <h2 style={{ fontSize: 'var(--step-2)' }}>{t('resultFlagsTitle')}</h2>
            <p className="prose" style={{ color: 'var(--ink-muted)' }}>
              {t('resultFlagsLead')}
            </p>
            <FlagList ids={[...outcome.profile.flags]} />
          </section>
        )}

        {top && (
          <section className="stack">
            <h2 style={{ fontSize: 'var(--step-2)' }}>{t('resultNextStepsTitle')}</h2>
            <div className="grid grid--2">
              <div className="card">
                <h3 style={{ fontSize: 'var(--step-1)' }}>{lang === 'de' ? 'Vor der Installation' : 'Before installing'}</h3>
                <ol>
                  <li>
                    {lang === 'de'
                      ? 'Alle wichtigen Daten auf eine externe Festplatte sichern.'
                      : 'Back up everything important to an external drive.'}
                  </li>
                  <li>
                    {lang === 'de'
                      ? 'Abbild herunterladen und mit Ventoy, Rufus oder balenaEtcher auf einen USB-Stick schreiben.'
                      : 'Download the image and write it to a USB stick with Ventoy, Rufus or balenaEtcher.'}
                  </li>
                  <li>
                    {lang === 'de'
                      ? 'Live-System starten und prüfen: WLAN, Ton, Bildschirmauflösung, Drucker, externer Monitor.'
                      : 'Boot the live session and check Wi-Fi, sound, resolution, printer and external monitor.'}
                  </li>
                  <li>
                    {lang === 'de'
                      ? 'Erst installieren, wenn im Live-System alles läuft.'
                      : 'Only install once everything works in the live session.'}
                  </li>
                </ol>
              </div>
              <div className="card">
                <h3 style={{ fontSize: 'var(--step-1)' }}>{t('tryLiveTitle')}</h3>
                <p style={{ color: 'var(--ink-muted)' }}>{t('tryLiveText')}</p>
                <p style={{ marginBottom: '0.35rem' }}>
                  <a className="btn btn--small" href="https://distrosea.com/" target="_blank" rel="noreferrer noopener">
                    {t('tryLiveLink')} <span aria-hidden="true">↗</span>
                  </a>
                </p>
                <p style={{ fontSize: 'var(--step--1)', color: 'var(--ink-faint)', margin: 0 }}>{t('tryLiveDisclaimer')}</p>
              </div>
              <div className="card">
                <h3 style={{ fontSize: 'var(--step-1)' }}>
                  {lang === 'de' ? `Direkt nach der Installation von ${top.distro.name}` : `Right after installing ${top.distro.name}`}
                </h3>
                <ol>
                  {(lang === 'de' ? top.distro.firstSteps.de : top.distro.firstSteps.en).map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

        <section className="stack">
          <h2 style={{ fontSize: 'var(--step-2)' }}>{t('resultAllRanked')}</h2>
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{lang === 'de' ? 'Distribution' : 'Distribution'}</th>
                  <th scope="col">{t('points')}</th>
                  <th scope="col">{t('fieldReleaseModel')}</th>
                  <th scope="col" className="no-print">
                    {t('compareAdd')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(showAll ? eligible : eligible.slice(0, 12)).map((r, i) => (
                  <tr key={r.distro.id}>
                    <td style={{ color: 'var(--ink-faint)', fontVariantNumeric: 'tabular-nums' }}>{i + 1}</td>
                    <th scope="row">
                      <span style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Monogram distro={r.distro} />
                        <Link to={{ name: 'distro', id: r.distro.id }}>{r.distro.name}</Link>
                      </span>
                    </th>
                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{r.score}</td>
                    <td>{tl(r.distro.tagline)}</td>
                    <td className="no-print">
                      <CompareToggle id={r.distro.id} small />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {eligible.length > 12 && (
            <div className="no-print">
              <button type="button" className="btn btn--small" onClick={() => setShowAll((v) => !v)}>
                {showAll ? t('showLess') : `${t('showMore')} (${eligible.length - 12})`}
              </button>
            </div>
          )}
          {compare.length >= MAX_COMPARE && (
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--ink-faint)' }}>{t('compareLimit')}</p>
          )}
        </section>

        {excluded.length > 0 && (
          <section className="stack">
            <h2 style={{ fontSize: 'var(--step-2)' }}>
              {t('resultExcluded')} ({excluded.length})
            </h2>
            <p className="prose" style={{ color: 'var(--ink-muted)' }}>
              {t('resultExcludedLead')}
            </p>
            <button type="button" className="btn btn--small no-print" onClick={() => setShowExcluded((v) => !v)}>
              {showExcluded ? t('showLess') : t('showMore')}
            </button>
            {showExcluded && (
              <div className="card">
                {excluded.map((r) => (
                  <div key={r.distro.id} className="excluded-item">
                    <Link to={{ name: 'distro', id: r.distro.id }} style={{ minWidth: '9rem', fontWeight: 600 }}>
                      {r.distro.name}
                    </Link>
                    <span style={{ color: 'var(--ink-muted)' }}>
                      {t('excludedBecause')}{' '}
                      {r.failed
                        .map((f) => `${t('notMet')} ${tl(requirements.get(f.requirementId)?.label)}`)
                        .join(' · ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </section>
  );
}
