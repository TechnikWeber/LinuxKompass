import { useMemo, useState } from 'react';
import { visibleQuestions, type Mode } from '../data/questions';
import { scoreAll } from '../engine/score';
import { sectionLabels, useI18n } from '../i18n';
import { useApp } from '../state/app';
import { Monogram } from './common';

const MODES: Mode[] = ['beginner', 'advanced', 'expert'];

export function QuizPage() {
  const { t, tl } = useI18n();
  const { mode, setMode, answers, setAnswer, navigate, reset } = useApp();
  const [index, setIndex] = useState(0);

  const questions = useMemo(() => visibleQuestions(mode, answers), [mode, answers]);
  const total = questions.length;
  // Beim Moduswechsel kann die aktuelle Frage wegfallen: dann auf die letzte
  // vorhandene zurückfallen, ohne dafür einen zusätzlichen Renderdurchlauf zu brauchen.
  const safeIndex = Math.max(0, Math.min(index, total - 1));
  const current = questions[safeIndex];

  const preview = useMemo(() => {
    const { results } = scoreAll(mode, answers);
    return results.filter((r) => r.eligible).slice(0, 3);
  }, [mode, answers]);

  if (!current) return null;

  const selected = answers[current.id] ?? [];
  const isMulti = current.type === 'multiple';
  const answeredCount = questions.filter((q) => (answers[q.id] ?? []).length > 0).length;

  function choose(optionId: string) {
    if (!current) return;
    if (isMulti) {
      const option = current.options.find((o) => o.id === optionId);
      // „Nichts davon“ schließt die übrigen Auswahlen aus und umgekehrt.
      if (option?.neutral) {
        setAnswer(current.id, selected.includes(optionId) ? [] : [optionId]);
        return;
      }
      const withoutNeutral = selected.filter((id) => !current.options.find((o) => o.id === id)?.neutral);
      const next = withoutNeutral.includes(optionId)
        ? withoutNeutral.filter((id) => id !== optionId)
        : [...withoutNeutral, optionId];
      setAnswer(current.id, next);
    } else {
      setAnswer(current.id, selected.includes(optionId) ? [] : [optionId]);
      if (!selected.includes(optionId) && safeIndex < total - 1) {
        window.setTimeout(() => setIndex(Math.min(safeIndex + 1, total - 1)), 180);
      }
    }
  }

  const atEnd = safeIndex >= total - 1;

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'grid', gap: '2.5rem', gridTemplateColumns: 'minmax(0, 1fr)' }} className="quiz-grid">
          <div className="stack stack-lg">
            {/* Kopf: Fortschritt und Modus */}
            <div className="stack">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span className="chip">{t('questionOf', { a: safeIndex + 1, b: total })}</span>
                <span className="chip chip--accent">{tl(sectionLabels[current.section])}</span>
                <div className="switch-group" role="group" aria-label={t('quizModeSwitch')} style={{ marginLeft: 'auto' }}>
                  {MODES.map((m) => (
                    <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
                      {m === 'beginner' ? t('modeBeginner') : m === 'advanced' ? t('modeAdvanced') : t('modeExpert')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="progress">
                <div className="progress__fill" style={{ width: `${((safeIndex + 1) / total) * 100}%` }} />
              </div>
            </div>

            {/* Frage */}
            <div className="stack">
              <div>
                <h1 style={{ fontSize: 'var(--step-2)', marginBottom: '0.35rem' }}>{tl(current.title)}</h1>
                {current.description && (
                  <p className="prose" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                    {tl(current.description)}
                  </p>
                )}
                {isMulti && (
                  <p style={{ fontSize: 'var(--step--1)', color: 'var(--ink-faint)', marginTop: '0.5rem', marginBottom: 0 }}>
                    {t('quizMultiHint')}
                  </p>
                )}
              </div>

              <div className="stack stack-sm" role="group" aria-label={tl(current.title)}>
                {current.options.map((option) => {
                  const active = selected.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className="answer"
                      aria-pressed={active}
                      onClick={() => choose(option.id)}
                    >
                      <span
                        className={`answer__box ${isMulti ? 'answer__box--check' : 'answer__box--radio'}`}
                        aria-hidden="true"
                      >
                        {active ? (isMulti ? '✓' : '●') : ''}
                      </span>
                      <span>
                        <span className="answer__label">{tl(option.label)}</span>
                        {option.hint && <span className="answer__hint">{tl(option.hint)}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>

              {current.help && (
                <details className="explainer">
                  <summary>{t('quizWhyTitle')}</summary>
                  <div>{tl(current.help)}</div>
                </details>
              )}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button type="button" className="btn" disabled={safeIndex === 0} onClick={() => setIndex(Math.max(0, safeIndex - 1))}>
                <span aria-hidden="true">←</span> {t('quizBack')}
              </button>
              {!atEnd && (
                <button type="button" className="btn" onClick={() => setIndex(Math.min(total - 1, safeIndex + 1))}>
                  {selected.length > 0 ? t('quizNext') : t('quizSkip')} <span aria-hidden="true">→</span>
                </button>
              )}
              <button type="button" className="btn btn--primary" onClick={() => navigate({ name: 'result' })}>
                {t('quizFinish')}
              </button>
              <button
                type="button"
                className="btn btn--quiet btn--small"
                style={{ marginLeft: 'auto' }}
                onClick={() => {
                  reset();
                  setIndex(0);
                }}
              >
                {t('quizRestart')}
              </button>
            </div>
          </div>

          {/* Zwischenstand */}
          <aside className="card" aria-live="polite">
            <h2 style={{ fontSize: 'var(--step-0)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-faint)' }}>
              {t('quizLivePreview')}
            </h2>
            <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 0.75rem', display: 'grid', gap: '0.6rem' }}>
              {preview.map((r, i) => (
                <li key={r.distro.id} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--ink-faint)', fontVariantNumeric: 'tabular-nums', width: '1.2em' }}>{i + 1}</span>
                  <Monogram distro={r.distro} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: 'block', fontSize: 'var(--step--1)' }}>{r.distro.name}</strong>
                    <span style={{ fontSize: 'var(--step--1)', color: 'var(--ink-faint)' }}>{r.score} {t('points')}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--ink-faint)', margin: 0 }}>{t('quizLivePreviewHint')}</p>
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--ink-faint)', marginTop: '0.5rem', marginBottom: 0 }}>
              {answeredCount} / {total}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
