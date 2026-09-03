import type { DistroResult } from '../engine/score';
import { requirements } from '../engine/requirements';
import { ratingLabels, useI18n, releaseModelLabels, installerLabels } from '../i18n';
import { desktopById } from '../data/desktops';
import { CompareToggle, Link, Monogram } from './common';

/** Eine Empfehlung mit Begründung, Punkteherkunft und Warnungen. */
export function ResultCard({ result, rank, featured }: { result: DistroResult; rank: number; featured?: boolean }) {
  // Die hervorgehobene Karte folgt direkt auf die h1 der Seite und muss
  // deshalb eine h2 sein; die Alternativen stehen unter einer eigenen h2.
  const Heading = featured ? 'h2' : 'h3';
  const { t, tl, tls } = useI18n();
  const d = result.distro;
  const top = result.breakdown.filter((b) => b.points > 0).slice(0, 5);
  const maxPoints = Math.max(1, ...top.map((b) => b.points));

  return (
    <article className={`card ${featured ? 'card--raised' : ''} result-card`}>
      <header className="result-card__head">
        <Monogram distro={d} large={featured} />
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 'var(--step--1)', color: 'var(--ink-faint)' }}>
            {featured ? t('resultTopPick') : `#${rank}`}
          </p>
          <Heading className="result-card__title">
            <Link to={{ name: 'distro', id: d.id }}>{d.name}</Link>
          </Heading>
          <p style={{ margin: 0, color: 'var(--ink-muted)' }}>{tl(d.tagline)}</p>
        </div>
        <div className="result-card__score">
          <div className="score">
            {result.score}
            <span className="score__unit">/100</span>
          </div>
        </div>
      </header>

      {featured && <p style={{ margin: 0 }}>{tl(d.description)}</p>}

      <ul className="chiprow">
        <li className="chip">{tl(releaseModelLabels[d.releaseModel])}</li>
        <li className="chip">{d.currentVersion}</li>
        <li className="chip">{tl(installerLabels[d.installer])}</li>
        {result.matchedTags.slice(0, 3).map((tag) => (
          <li key={tag} className="chip chip--accent">
            {desktopById.get(tag)?.name ?? tag.replace(/-/g, ' ')}
          </li>
        ))}
      </ul>

      <div className="reasons">
        <div>
          <h4>{t('resultStrengths')}</h4>
          <ul>
            {result.strengths.length > 0
              ? result.strengths.map((k) => (
                  <li key={k}>
                    {tl(ratingLabels[k])} <span style={{ color: 'var(--ink-faint)' }}>{d.ratings[k]}/10</span>
                  </li>
                ))
              : tls(d.bestFor).slice(0, 3).map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
        <div>
          <h4>{t('resultWeaknesses')}</h4>
          <ul>
            {result.weaknesses.length > 0
              ? result.weaknesses.map((k) => (
                  <li key={k}>
                    {tl(ratingLabels[k])} <span style={{ color: 'var(--ink-faint)' }}>{d.ratings[k]}/10</span>
                  </li>
                ))
              : tls(d.notFor).slice(0, 2).map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
        {result.missedPreferences.length > 0 && (
          <div>
            <h4>{t('resultWeaknesses')}</h4>
            <ul>
              {result.missedPreferences.slice(0, 3).map((id) => (
                <li key={id}>
                  {t('notMet')} {tl(requirements.get(id)?.label)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {featured && top.length > 0 && (
        <details className="explainer">
          <summary>{t('resultBreakdown')}</summary>
          <div className="stack stack-sm" style={{ maxWidth: 'none' }}>
            {top.map((b) => (
              <div key={b.key} className="meter">
                <span className="meter__label">
                  {tl(ratingLabels[b.key])}
                  <span style={{ color: 'var(--ink-faint)' }}> · {b.value}/10</span>
                </span>
                <span className="meter__value">+{b.points.toFixed(1)}</span>
                <div className="meter__track">
                  <div className="meter__fill" style={{ width: `${(b.points / maxPoints) * 100}%` }} />
                </div>
              </div>
            ))}
            {result.bonusPoints !== 0 && (
              <p style={{ fontSize: 'var(--step--1)', color: 'var(--ink-muted)', margin: '0.5rem 0 0' }}>
                {t('resultBonus')}: {result.bonusPoints > 0 ? '+' : ''}
                {result.bonusPoints} {t('points')}
              </p>
            )}
          </div>
        </details>
      )}

      {featured && tls(d.warnings).length > 0 && (
        <div className="callout callout--warning">
          <h3 className="callout__title">{t('detailWarnings')}</h3>
          <ul style={{ margin: 0 }}>
            {tls(d.warnings).map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="no-print">
        <Link to={{ name: 'distro', id: d.id }} className="btn btn--small">
          {t('details')}
        </Link>
        <CompareToggle id={d.id} small />
        <a className="btn btn--small" href={d.downloadUrl} target="_blank" rel="noreferrer noopener">
          {t('detailDownload')} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
