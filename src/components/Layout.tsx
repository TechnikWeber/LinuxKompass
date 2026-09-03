import type { ReactNode } from 'react';
import { useI18n } from '../i18n';
import { useApp } from '../state/app';
import { Link } from './common';
import { distros } from '../data/distros';

const CHECK_DATE = distros[0]?.checkedAt ?? '';

function ThemeToggle() {
  const { theme, setTheme } = useApp();
  const { t } = useI18n();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className="btn btn--quiet btn--icon"
      onClick={() => setTheme(next)}
      title={t('themeToggle')}
      aria-label={t('themeToggle')}
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
            <span className="brand__mark" aria-hidden="true">
              ◈
            </span>
            {t('appName')}
          </Link>
          <nav className="masthead__nav" aria-label={t('appName')}>
            <Link to={{ name: 'quiz' }} className="navlink">
              {t('navQuiz')}
            </Link>
            <Link to={{ name: 'browse' }} className="navlink">
              {t('navBrowse')}
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
            <p style={{ maxWidth: '32ch' }}>{t('heroLead').split('.')[0]}.</p>
          </div>
          <div>
            <h4>{t('navStart')}</h4>
            <ul className="stack-sm stack">
              <li>
                <Link to={{ name: 'triage' }}>{t('navQuiz')}</Link>
              </li>
              <li>
                <Link to={{ name: 'browse' }}>{t('navBrowse')}</Link>
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
    </div>
  );
}
