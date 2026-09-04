import { useMemo, useState } from 'react';
import { distros, popularAlternatives } from '../data/distros';
import { contrastDistros, type ContrastLine } from '../engine/contrast';
import { requirements } from '../engine/requirements';
import type { DistroResult } from '../engine/score';
import { ratingLabels, useI18n } from '../i18n';
import { Link, Monogram } from './common';

/** Ab hier gilt der Abstand nicht mehr als „gleichauf". */
const TIE_RANGE = 2;

function DeltaLines({ lines, heading }: { lines: ContrastLine[]; heading: string }) {
  const { tl } = useI18n();
  if (lines.length === 0) return null;
  return (
    <div>
      <h4 className="whynot__heading">{heading}</h4>
      <ul className="whynot__list">
        {lines.map((line) => (
          <li key={line.key}>
            <span>{tl(ratingLabels[line.key])}</span>
            <span style={{ color: 'var(--ink-faint)', fontVariantNumeric: 'tabular-nums' }}>
              {line.value} statt {line.referenceValue}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * „Warum nicht eine andere?"
 *
 * Die Gegenprobe zur Empfehlung. Vorausgewählt sind die drei am häufigsten
 * genannten Distributionen – ohne die empfohlene, denn sich selbst gegenüber
 * zu stellen sagt nichts. Wer einen anderen Namen im Kopf hat, findet ihn im
 * Auswahlfeld daneben.
 *
 * Alles ist bereits gerechnet: `results` enthält auch die ausgeschlossenen
 * Distributionen samt Punkteherkunft. Hier wird nur verglichen, nicht neu
 * bewertet – deshalb kostet das Aufklappen nichts.
 */
export function WhyNot({ top, results }: { top: DistroResult; results: DistroResult[] }) {
  const { t, tl, lang } = useI18n();
  const [pickedId, setPickedId] = useState<string | null>(null);

  const presets = useMemo(() => popularAlternatives([top.distro.id]), [top.distro.id]);
  const picked = pickedId ? results.find((r) => r.distro.id === pickedId) : undefined;
  const contrast = useMemo(() => (picked ? contrastDistros(top, picked) : null), [top, picked]);

  const sorted = useMemo(
    () => [...distros].filter((d) => d.id !== top.distro.id).sort((a, b) => a.name.localeCompare(b.name, lang)),
    [top.distro.id, lang],
  );

  return (
    <details className="explainer explainer--wide" onToggle={(e) => !e.currentTarget.open && setPickedId(null)}>
      <summary>{t('whyNotTitle')}</summary>
      <div className="stack stack-sm">
        <p style={{ margin: 0 }}>{t('whyNotLead')}</p>

        <div className="whynot__pick">
          <span className="whynot__heading">{t('whyNotPopular')}</span>
          {presets.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`btn btn--small${pickedId === d.id ? ' btn--primary' : ''}`}
              aria-pressed={pickedId === d.id}
              onClick={() => setPickedId(pickedId === d.id ? null : d.id)}
            >
              {d.name}
            </button>
          ))}
          <label className="visually-hidden" htmlFor="whynot-other">
            {t('whyNotOther')}
          </label>
          <select
            id="whynot-other"
            value={presets.some((d) => d.id === pickedId) ? '' : (pickedId ?? '')}
            onChange={(e) => setPickedId(e.target.value || null)}
          >
            <option value="">{t('whyNotOther')} …</option>
            {sorted.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {picked && contrast && (
          <div className="card whynot__result">
            <div className="whynot__head">
              <Monogram distro={picked.distro} />
              <strong>
                <Link to={{ name: 'distro', id: picked.distro.id }}>{picked.distro.name}</Link>{' '}
                <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>
                  {t('whyNotVersus', { name: top.distro.name })}
                </span>
              </strong>
              <span className="whynot__score">
                {picked.score} : {top.score}
              </span>
            </div>

            {!picked.eligible && (
              <div className="callout callout--critical">
                <p style={{ margin: '0 0 0.4rem' }}>{t('whyNotFails')}</p>
                <ul style={{ margin: 0 }}>
                  {contrast.failedRequirementIds.map((id) => (
                    <li key={id}>{tl(requirements.get(id)?.short)}</li>
                  ))}
                </ul>
              </div>
            )}

            <p style={{ margin: 0 }}>
              {!picked.eligible && contrast.scoreDelta > 0
                ? t('whyNotAheadButOut', { n: contrast.scoreDelta })
                : Math.abs(contrast.scoreDelta) <= TIE_RANGE
                  ? t('whyNotTied', { name: top.distro.name })
                  : t('whyNotBehind', { n: Math.abs(contrast.scoreDelta), name: top.distro.name })}
            </p>

            <div className="whynot__columns">
              <DeltaLines lines={contrast.worse} heading={t('whyNotWorse')} />
              <DeltaLines lines={contrast.better} heading={t('whyNotBetter')} />
            </div>

            {contrast.missesInstead.length > 0 && (
              <div>
                <h4 className="whynot__heading">{t('whyNotMisses', { name: top.distro.name })}</h4>
                <ul className="whynot__list">
                  {contrast.missesInstead.slice(0, 4).map((id) => (
                    <li key={id}>{tl(requirements.get(id)?.short)}</li>
                  ))}
                </ul>
              </div>
            )}

            {contrast.meetsExtra.length > 0 && (
              <div>
                <h4 className="whynot__heading">{t('whyNotExtra', { name: top.distro.name })}</h4>
                <ul className="whynot__list">
                  {contrast.meetsExtra.slice(0, 4).map((id) => (
                    <li key={id}>{tl(requirements.get(id)?.short)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </details>
  );
}
