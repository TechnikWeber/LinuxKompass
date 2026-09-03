import { useEffect } from 'react';
import { useI18n } from './i18n';
import { useApp } from './state/app';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { TriagePage } from './components/TriagePage';
import { QuizPage } from './components/QuizPage';
import { ResultPage } from './components/ResultPage';
import { BrowsePage } from './components/BrowsePage';
import { DistroPage } from './components/DistroPage';
import { ComparePage } from './components/ComparePage';
import { DesktopsPage } from './components/DesktopsPage';
import { AboutPage } from './components/AboutPage';
import { getDistro } from './data/distros';

/** Setzt den Seitentitel passend zur Ansicht – wichtig für Verlauf und Vorlesen. */
function useDocumentTitle() {
  const { route } = useApp();
  const { t, lang } = useI18n();
  useEffect(() => {
    const app = t('appName');
    const suffix =
      route.name === 'home' ? t('tagline')
      : route.name === 'distro' ? getDistro(route.id)?.name ?? ''
      : route.name === 'quiz' || route.name === 'triage' ? t('navQuiz')
      : route.name === 'result' ? t('resultTitle')
      : route.name === 'browse' ? t('navBrowse')
      : route.name === 'compare' ? t('navCompare')
      : route.name === 'desktops' ? t('desktopsTitle')
      : t('navAbout');
    document.title = suffix ? `${app} – ${suffix}` : app;
  }, [route, t, lang]);
}

export default function App() {
  const { route } = useApp();
  useDocumentTitle();

  return (
    <Layout>
      {route.name === 'home' && <HomePage />}
      {route.name === 'triage' && <TriagePage />}
      {route.name === 'quiz' && <QuizPage />}
      {route.name === 'result' && <ResultPage />}
      {route.name === 'browse' && <BrowsePage />}
      {route.name === 'distro' && <DistroPage id={route.id} />}
      {route.name === 'compare' && <ComparePage />}
      {route.name === 'desktops' && <DesktopsPage />}
      {route.name === 'about' && <AboutPage />}
    </Layout>
  );
}
