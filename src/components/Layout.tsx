import type { ReactNode } from 'react';
import { useI18n } from '../i18n';
import { useApp } from '../state/app';
import { Link } from './common';
import { CompareTray } from './CompareTray';
import { distros } from '../data/distros';

const CHECK_DATE = distros[0]?.checkedAt ?? '';

/** Kompassnadel im Ring – identisch zum Symbol im Browser-Tab. */
function BrandMark() {
  return (
    <svg className="brand__mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill="var(--accent)" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="var(--accent-ink)" strokeWidth="2.5" opacity="0.5" />
      <path d="M32 12 L38 30 L32 52 L26 30 Z" fill="var(--accent-ink)" />
      <circle cx="32" cy="32" r="3.4" fill="var(--accent)" />
    </svg>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useApp();
  const { t } = useI18n();
  const next = theme === 'dark' ? 'light' : 'dark';
  // Benennt das Ziel, nicht die Handlung: „Farbschema wechseln" ließ offen,
  // wohin – vorgelesen wie angetippt.
  const label = next === 'dark' ? t('themeToDark') : t('themeToLight');
  return (
    <button
      type="button"
      className="btn btn--quiet btn--icon"
      onClick={() => setTheme(next)}
      title={label}
      aria-label={label}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
    </button>
  );
}

function LangToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="switch-group" role="group" aria-label={t('langSwitch')}>
      <button type="button" aria-pressed={lang === 'de'} onClick={() => setLang('de')} lang="de">
        DE
      </button>
      <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')} lang="en">
        EN
      </button>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        {t('skipToContent')}
      </a>

      <header className="masthead no-print">
        <div className="container masthead__inner">
          <Link to={{ name: 'home' }} className="brand">
            <BrandMark />
            {t('appName')}
          </Link>
          <nav className="masthead__nav" aria-label={t('appName')}>
            {/* Der Fragebogen beginnt bei der Einstufung – aus der Navigation
                heraus also immer von vorn, nicht mitten in alten Antworten. */}
            <Link to={{ name: 'triage' }} className="navlink" fresh>
              {t('navQuiz')}
            </Link>
            <Link to={{ name: 'browse' }} className="navlink">
              {t('navBrowse')}
            </Link>
            <Link to={{ name: 'desktops' }} className="navlink">
              {t('navDesktops')}
            </Link>
            <Link to={{ name: 'compare' }} className="navlink">
              {t('navCompare')}
            </Link>
            <Link to={{ name: 'about' }} className="navlink">
              {t('navAbout')}
            </Link>
          </nav>
          <div className="masthead__tools">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="colophon">
        <div className="container colophon__grid">
          <div>
            <h4>{t('appName')}</h4>
            <p style={{ maxWidth: '34ch' }}>{t('footerBlurb')}</p>
          </div>
          <div>
            <h4>{t('navStart')}</h4>
            <ul className="stack-sm stack">
              <li>
                <Link to={{ name: 'triage' }} fresh>{t('navQuiz')}</Link>
              </li>
              <li>
                <Link to={{ name: 'browse' }}>{t('navBrowse')}</Link>
              </li>
              <li>
                <Link to={{ name: 'desktops' }}>{t('navDesktops')}</Link>
              </li>
              <li>
                <Link to={{ name: 'compare' }}>{t('navCompare')}</Link>
              </li>
              <li>
                <Link to={{ name: 'about' }}>{t('navAbout')}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>{t('heroCheckedNote')}</h4>
            <p>
              <time dateTime={CHECK_DATE}>{CHECK_DATE}</time>
            </p>
            <p>
              <a href="https://github.com/TechnikWeber/LinuxKompass" rel="noreferrer noopener" target="_blank">
                GitHub
              </a>
            </p>
          </div>
        </div>
      </footer>

      <CompareTray />
    </div>
  );
}
