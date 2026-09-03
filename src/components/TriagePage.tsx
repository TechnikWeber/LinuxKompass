import { useState } from 'react';
import { MAX_TRIAGE_SCORE, questionsForMode, suggestMode, triageQuestions, type Mode } from '../data/questions';
import { useI18n } from '../i18n';
import { useApp } from '../state/app';

const MODE_ORDER: Mode[] = ['beginner', 'advanced', 'expert'];

export function TriagePage() {
  const { t, tl } = useI18n();
  const { navigate, setMode, mode } = useApp();
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [chosen, setChosen] = useState<Mode | null>(null);

  const answeredAll = triageQuestions.every((q) => q.id in picks);
  const score = Object.values(picks).reduce((a, b) => a + b, 0);
  const suggested = answeredAll ? suggestMode(score) : null;
  const active = chosen ?? suggested ?? mode;

  const modeInfo: Record<Mode, { title: string; desc: string }> = {
    beginner: { title: t('modeBeginner'), desc: t('modeBeginnerDesc') },
    advanced: { title: t('modeAdvanced'), desc: t('modeAdvancedDesc') },
    expert: { title: t('modeExpert'), desc: t('modeExpertDesc') },
  };

  return (
    <section className="section">
      <div className="container container--narrow stack stack-lg">
        <div>
          <h1 style={{ fontSize: 'var(--step-3)' }}>{t('triageTitle')}</h1>
          <p className="prose" style={{ color: 'var(--ink-muted)' }}>
            {t('triageLead')}
          </p>
        </div>

        {triageQuestions.map((q, index) => (
          <fieldset key={q.id} style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ padding: 0, marginBottom: '0.75rem' }}>
              <span style={{ fontSize: 'var(--step--1)', color: 'var(--ink-faint)' }}>{index + 1}.</span>{' '}
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--step-1)' }}>{tl(q.title)}</strong>
            </legend>
            <div className="stack stack-sm">
              {q.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="answer"
                  aria-pressed={picks[q.id] === o.score}
                  onClick={() => {
                    setPicks((p) => ({ ...p, [q.id]: o.score }));
                    setChosen(null);
                  }}
                >
                  <span className="answer__box answer__box--radio" aria-hidden="true">
                    {picks[q.id] === o.score ? '●' : ''}
                  </span>
                  <span className="answer__label">{tl(o.label)}</span>
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        {answeredAll && (
          <div className="card card--raised stack">
            <div>
              <h2 style={{ fontSize: 'var(--step-1)' }}>{t('triageResultTitle')}</h2>
              <div className="progress" style={{ maxWidth: 260 }}>
                <div className="progress__fill" style={{ width: `${(score / MAX_TRIAGE_SCORE) * 100}%` }} />
              </div>
            </div>
            <div className="grid grid--3">
              {MODE_ORDER.map((m) => (
                <button
                  key={m}
                  type="button"
                  className="answer"
                  aria-pressed={active === m}
                  onClick={() => setChosen(m)}
                  style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <span className="answer__label">
                    {modeInfo[m].title}
                    {suggested === m && (
                      <span className="chip chip--accent" style={{ marginLeft: '0.5rem' }}>
                        {t('triageResultTitle')}
                      </span>
                    )}
                  </span>
                  <span className="answer__hint">{t('modeQuestionCount', { n: questionsForMode(m).length })}</span>
                  <span className="answer__hint">{modeInfo[m].desc}</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--ink-muted)', margin: 0 }}>{t('triageChangeHint')}</p>
            <div>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  setMode(active, true);
                  navigate({ name: 'quiz' });
                }}
              >
                {t('modeContinue')} <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}

        {!answeredAll && (
          <div>
            <button
              type="button"
              className="btn btn--quiet"
              onClick={() => {
                setMode(mode, true);
                navigate({ name: 'quiz' });
              }}
            >
              {t('triageSkip')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
