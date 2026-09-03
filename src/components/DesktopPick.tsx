import type { Distro } from '../data/types';
import type { Answers, Mode } from '../data/questions';
import { scoreDesktops } from '../engine/desktop';
import { desktopConcernLabels, desktopReasonLabels, useI18n } from '../i18n';
import { CompareToggle, Link } from './common';

/**
 * Empfehlung einer Oberfläche, bewusst getrennt von der Distributionsliste –
 * samt Hinweis, dass die Wahl weniger festlegt, als viele annehmen.
 */
export function DesktopPick({ mode, answers, topDistro }: { mode: Mode; answers: Answers; topDistro?: Distro }) {
  const { t, tl, lang } = useI18n();
  const { results, answered } = scoreDesktops(mode, answers);

  // Ohne jede Angabe zur Oberfläche wäre jede Aussage geraten.
  if (answered === 0) return null;

  const eligible = results.filter((r) => r.eligible);
  const best = eligible[0];
  if (!best) return null;
  const alternatives = eligible.slice(1, 4);

  const reasons = best.reasons.map((code) => tl(desktopReasonLabels[code])).filter(Boolean);
  const joiner = lang === 'de' ? ' und ' : ' and ';
  const reasonText =
    reasons.length === 0
      ? null
      : reasons.length === 1
        ? reasons[0]
        : `${reasons.slice(0, -1).join(', ')}${joiner}${reasons[reasons.length - 1]}`;

  const sentence = reasonText
    ? t('desktopPickSentence', { name: best.desktop.name, reasons: reasonText })
    : t('desktopPickSentencePlain', { name: best.desktop.name });

  let availability: string | null = null;
  if (topDistro) {
    if (topDistro.defaultDesktop === best.desktop.id) {
      availability = t('desktopPickInTop', { distro: topDistro.name, name: best.desktop.name });
    } else if (topDistro.availableDesktops.includes(best.desktop.id)) {
      availability = t('desktopPickAvailable', { distro: topDistro.name, name: best.desktop.name });
    } else if (topDistro.availableDesktops.length > 0) {
      availability = t('desktopPickNotAvailable', { distro: topDistro.name, name: best.desktop.name });
    }
  }

  return (
    <section className="stack">
      <h2 style={{ fontSize: 'var(--step-2)' }}>{t('desktopPickTitle')}</h2>
      <p className="prose" style={{ color: 'var(--ink-muted)' }}>
        {t('desktopPickLead')}
      </p>

      <div className="card card--raised stack">
        <p style={{ fontSize: 'var(--step-1)', fontFamily: 'var(--font-display)', margin: 0 }}>{sentence}</p>
        <p style={{ margin: 0, color: 'var(--ink-muted)' }}>{tl(best.desktop.description)}</p>

        <ul className="chiprow">
          <li className="chip">
            {t('desktopFeelsLike')}: {tl(best.desktop.feelsLike)}
          </li>
          <li className="chip">~{best.desktop.ramFootprintMb} MB</li>
        </ul>

        {best.concerns.length > 0 && (
          <div className="callout callout--warning">
            <h3 className="callout__title">{t('desktopPickCaveat')}</h3>
            <ul style={{ margin: 0 }}>
              {best.concerns.map((code) => (
                <li key={code}>{tl(desktopConcernLabels[code])}</li>
              ))}
            </ul>
          </div>
        )}

        {availability && <p style={{ margin: 0 }}>{availability}</p>}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} className="no-print">
          <CompareToggle id={best.desktop.id} kind="desktop" small />
          <Link to={{ name: 'desktops' }} className="btn btn--small">
            {t('desktopPickAll')}
          </Link>
        </div>
      </div>

      {alternatives.length > 0 && (
        <div>
          <h3 style={{ fontSize: 'var(--step-0)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-faint)' }}>
            {t('desktopPickAlternatives')}
          </h3>
          <div className="grid grid--3">
            {alternatives.map((r) => (
              <div key={r.desktop.id} className="card" style={{ display: 'grid', gap: '0.5rem', alignContent: 'start' }}>
                <strong>{r.desktop.name}</strong>
                <span style={{ fontSize: 'var(--step--1)', color: 'var(--ink-muted)' }}>{tl(r.desktop.tagline)}</span>
                <div className="no-print">
                  <CompareToggle id={r.desktop.id} kind="desktop" small />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
