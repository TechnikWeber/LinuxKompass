import { useMemo, useState } from 'react';
import type { Answers, Mode } from '../data/questions';
import { analyseSensitivity, splitFlips, type FlipGroup } from '../engine/sensitivity';
import { useI18n } from '../i18n';

/** Wie viele Fragen je Block und wie viele Antworten je Frage gezeigt werden. */
const MAX_GROUPS = 4;
const MAX_PER_GROUP = 2;

function FlipBlock({ heading, groups }: { heading: string; groups: FlipGroup[] }) {
  const { t, tl } = useI18n();
  if (groups.length === 0) return null;
  return (
    <div>
      <h4 className="whynot__heading">{heading}</h4>
      {groups.slice(0, MAX_GROUPS).map((group) => (
        <div key={group.question.id} className="flip">
          <p className="flip__question">{tl(group.question.title)}</p>
          <ul className="flip__list">
            {group.flips.slice(0, MAX_PER_GROUP).map((flip) => (
              <li key={flip.optionId}>
                <span className="flip__answer">
                  {tl(group.question.options.find((o) => o.id === flip.optionId)?.label)}
                </span>
                <span aria-hidden="true">→</span>
                <strong>{t('flipThen', { name: flip.winnerName })}</strong>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {groups.length > MAX_GROUPS && (
        <p style={{ margin: '0.5rem 0 0' }}>{t('flipMoreQuestions', { n: groups.length - MAX_GROUPS })}</p>
      )}
    </div>
  );
}

/**
 * „Was würde die Empfehlung kippen?"
 *
 * Zugeklappt, und die Rechnung läuft erst beim Aufklappen: Die Analyse
 * bewertet alle Distributionen einmal je Antwortmöglichkeit neu. Wer sie nicht
 * öffnet, zahlt dafür nichts – weder Rechenzeit noch Aufmerksamkeit.
 */
export function WhatWouldFlip({ mode, answers }: { mode: Mode; answers: Answers }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const analysis = useMemo(() => (open ? analyseSensitivity(mode, answers) : null), [open, mode, answers]);
  const { answered, open: unanswered } = useMemo(
    () => (analysis ? splitFlips(analysis.flips) : { answered: [], open: [] }),
    [analysis],
  );

  return (
    <details className="explainer explainer--wide" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{t('flipTitle')}</summary>
      <div className="stack stack-sm">
        <p style={{ margin: 0 }}>{t('flipLead')}</p>

        {!analysis && <p style={{ margin: 0 }}>{t('flipCalculating')}</p>}

        {analysis && analysis.flips.length === 0 && (
          <p style={{ margin: 0, color: 'var(--ink)' }}>
            <strong>{t('flipNone')}</strong>
          </p>
        )}

        {/* Die Aussage „keine deiner Antworten kippt sie" ist nur dann etwas
            wert, wenn sie ausgesprochen wird – sonst liest man das Fehlen des
            Blocks als Versehen. */}
        {analysis && analysis.flips.length > 0 && answered.length === 0 && (
          <p style={{ margin: 0, color: 'var(--ink)' }}>
            <strong>{t('flipNoneAnswered')}</strong>
          </p>
        )}

        <FlipBlock heading={t('flipAnswered')} groups={answered} />
        <FlipBlock heading={t('flipOpen')} groups={unanswered} />

        {analysis && <p style={{ margin: 0, color: 'var(--ink-faint)' }}>{t('flipTested', { n: analysis.tested })}</p>}
      </div>
    </details>
  );
}
