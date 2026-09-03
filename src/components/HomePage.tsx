import { distros } from '../data/distros';
import { allQuestions, baseQuestionCount } from '../data/questions';
import { useI18n } from '../i18n';
import { Link } from './common';

const ATTRIBUTE_COUNT = 45;

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="score" style={{ color: 'var(--accent)' }}>
        {value}
      </div>
      <div style={{ fontSize: 'var(--step--1)', color: 'var(--ink-muted)' }}>{label}</div>
    </div>
  );
}

export function HomePage() {
  const { t, lang } = useI18n();
  const checked = distros[0]?.checkedAt ?? '';

  const features = [
    { title: t('featureModesTitle'), text: t('featureModesText') },
    { title: t('featureExplainTitle'), text: t('featureExplainText') },
    { title: t('featureCompareTitle'), text: t('featureCompareText') },
    { title: t('featureHonestTitle'), text: t('featureHonestText') },
  ];

  return (
    <>
      <section className="section">
        <div className="container">
          <p className="chip chip--accent">{t('heroKicker')}</p>
          <h1 style={{ maxWidth: '15ch', marginTop: '1rem' }}>{t('heroTitle')}</h1>
          <p className="prose" style={{ fontSize: 'var(--step-1)', color: 'var(--ink-muted)' }}>
            {t('heroLead')}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
            <Link to={{ name: 'triage' }} className="btn btn--primary">
              {t('heroStart')} <span aria-hidden="true">→</span>
            </Link>
            <Link to={{ name: 'browse' }} className="btn">
              {t('heroBrowse')}
            </Link>
          </div>

          <div className="grid grid--3" style={{ marginTop: '3rem', maxWidth: '760px' }}>
            <Stat value={String(distros.length)} label={t('heroStatDistros')} />
            <Stat value={String(allQuestions.length)} label={t('heroStatQuestions')} />
            <Stat value={`${ATTRIBUTE_COUNT}+`} label={t('heroStatAttributes')} />
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: 'var(--step--1)', color: 'var(--ink-faint)' }}>
            {t('heroCheckedNote')}: <time dateTime={checked}>{checked}</time>
          </p>
        </div>
      </section>

      <section className="section section--sunken">
        <div className="container">
          <div className="grid grid--2">
            {features.map((f) => (
              <article key={f.title} className="card card--raised">
                <h3 style={{ fontSize: 'var(--step-1)' }}>{f.title}</h3>
                <p style={{ color: 'var(--ink-muted)', margin: 0 }}>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{lang === 'de' ? 'Die drei Tiefen' : 'The three depths'}</h2>
          <div className="grid grid--3" style={{ marginTop: '1.5rem' }}>
            {(
              [
                ['beginner', t('modeBeginner'), t('modeBeginnerDesc')],
                ['advanced', t('modeAdvanced'), t('modeAdvancedDesc')],
                ['expert', t('modeExpert'), t('modeExpertDesc')],
              ] as const
            ).map(([mode, title, desc]) => (
              <article key={mode} className="card">
                <h3 style={{ fontSize: 'var(--step-1)' }}>{title}</h3>
                <p className="chip">{t('modeQuestionCount', { n: baseQuestionCount(mode) })}</p>
                <p style={{ color: 'var(--ink-muted)', marginTop: '0.75rem', marginBottom: 0 }}>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
