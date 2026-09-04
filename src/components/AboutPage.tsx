import { distros } from '../data/distros';
import { allQuestions } from '../data/questions';
import { requirementList } from '../engine/requirements';
import { useI18n } from '../i18n';
import { Link } from './common';

export function AboutPage() {
  const { t, lang } = useI18n();
  const de = lang === 'de';
  const checked = distros[0]?.checkedAt ?? '';

  return (
    <section className="section">
      <div className="container container--narrow stack stack-lg">
        <header>
          <h1 style={{ fontSize: 'var(--step-3)' }}>{t('aboutTitle')}</h1>
          <p style={{ fontSize: 'var(--step-1)', color: 'var(--ink-muted)' }}>
            {de
              ? 'Ein Wegweiser für Menschen, die auf Linux umsteigen möchten und nicht wissen, wo sie anfangen sollen. Zweisprachig, quelloffen, ohne Werbung und ohne Nutzerverfolgung.'
              : 'A guide for people who want to move to Linux and do not know where to start. Bilingual, open source, no ads and no tracking.'}
          </p>
        </header>

        <section className="stack">
          <h2>{t('aboutMethodTitle')}</h2>
          <p>
            {de
              ? 'Jede Antwort im Fragebogen wirkt auf drei Arten: Sie gewichtet Bewertungsdimensionen (etwa „Stabilität" oder „Sparsamkeit"), sie kann harte Anforderungen setzen (etwa „muss Secure Boot unterstützen"), und sie kann einzelne Distributionen gezielt bevorzugen, wenn eine Antwort sehr eindeutig auf sie zeigt.'
              : 'Every answer in the questionnaire acts in three ways: it weights rating dimensions (such as "stability" or "frugality"), it can set hard requirements (such as "must support Secure Boot"), and it can favour specific distributions when an answer points at them unambiguously.'}
          </p>
          <p>
            {de
              ? `Die Grundpunktzahl ist ein gewichteter Mittelwert über ${
                  Object.keys(distros[0].ratings).length
                } Bewertungsdimensionen, normiert auf 0 bis 100. Zuschläge aus Vorlieben werden gedämpft, damit einzelne Treffer die Gesamtwertung nicht überfahren. Harte Anforderungen schließen aus – aber nur, solange danach noch genügend Kandidaten übrig bleiben. Sonst wird die Anforderung gelockert, die am meisten kostet, und das Ergebnis sagt dir, welche das war.`
              : `The base score is a weighted average across ${
                  Object.keys(distros[0].ratings).length
                } rating dimensions, normalised to 0–100. Bonuses from preferences are damped so single matches cannot run away with the total. Hard requirements exclude — but only while enough candidates remain. Otherwise the most expensive requirement is relaxed, and the result tells you which one it was.`}
          </p>
          <p>
            {de
              ? `Aktuell gibt es ${requirementList.length} benannte harte Anforderungen und ${allQuestions.length} Fragen. Die Bewertungen sind relativ zueinander gemeint: „8 von 10 bei Stabilität" heißt „stabiler als die meisten anderen Desktop-Distributionen", nicht „80 % fehlerfrei".`
              : `There are currently ${requirementList.length} named hard requirements and ${allQuestions.length} questions. Ratings are meant relative to one another: "8 out of 10 for stability" means "more stable than most other desktop distributions", not "80 % bug-free".`}
          </p>
        </section>

        <section className="stack">
          <h2>{t('aboutDataTitle')}</h2>
          <p>
            {de
              ? `Alle ${distros.length} Einträge wurden am ${checked} anhand der offiziellen Ankündigungen, Release Notes und Projektseiten geprüft. Zu jeder Distribution stehen die verwendeten Quellen und das Prüfdatum auf der Detailseite.`
              : `All ${distros.length} entries were checked on ${checked} against official announcements, release notes and project pages. Each distribution's detail page lists the sources used and the date of the check.`}
          </p>
          <p>
            {de
              ? 'Versionsnummern und Supportzeiträume veralten schnell. Wenn dir etwas auffällt, das nicht mehr stimmt: Melde es bitte – das ist der schnellste Weg, den Wegweiser besser zu machen.'
              : 'Version numbers and support windows go stale quickly. If you spot something that is no longer correct, please report it — that is the fastest way to improve this guide.'}
          </p>
        </section>

        <section className="stack">
          <h2>{t('aboutLimitsTitle')}</h2>
          <ul>
            <li>
              {de
                ? 'Er kennt deine Hardware nicht. Ein Live-System auf einem USB-Stick sagt dir in zehn Minuten mehr über WLAN, Grafik und Drucker als jede Empfehlung.'
                : 'It does not know your hardware. A live session on a USB stick tells you more about Wi-Fi, graphics and printers in ten minutes than any recommendation can.'}
            </li>
            <li>
              {de
                ? 'Er ersetzt keine Datensicherung. Vor jeder Installation gehören die eigenen Daten auf eine externe Platte.'
                : 'It does not replace a backup. Before any installation, your data belongs on an external drive.'}
            </li>
            <li>
              {de
                ? 'Er entscheidet nicht über Geschmack. Wenn zwei Distributionen gleichauf liegen, gibt es keine technisch richtige Antwort mehr.'
                : 'It cannot decide taste. When two distributions tie, there is no longer a technically correct answer.'}
            </li>
            <li>
              {de
                ? 'Bewertungen enthalten Urteil. Sie sind begründet und belegt, aber sie sind keine Messwerte.'
                : 'Ratings contain judgement. They are argued and sourced, but they are not measurements.'}
            </li>
          </ul>
        </section>

        <section className="stack">
          <h2>{t('aboutContributeTitle')}</h2>
          <p>
            {de
              ? 'Der gesamte Quellcode und alle Daten liegen öffentlich auf GitHub. Korrekturen an Versionsnummern, Bewertungen oder Texten sind ausdrücklich erwünscht – ebenso Übersetzungen und neue Distributionen.'
              : 'All source code and data are public on GitHub. Corrections to version numbers, ratings or wording are explicitly welcome — as are translations and new distributions.'}
          </p>
          <p>
            <a className="btn" href="https://github.com/TechnikWeber/LinuxKompass" target="_blank" rel="noreferrer noopener">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </p>
        </section>

        <section className="stack">
          <h2>{de ? 'Danke an' : 'Thanks to'}</h2>
          <p>
            {de
              ? 'Die Projekte hinter distrochooser.de und dem LinuxChooser von The Morpheus haben gezeigt, dass so etwas gebraucht wird und wie man es sinnvoll aufzieht. LinuxKompass ist eine eigenständige Umsetzung mit eigenem Datenbestand, eigener Bewertungslogik und eigener Gestaltung.'
              : 'The projects behind distrochooser.de and The Morpheus’ LinuxChooser showed that this is needed and how to structure it sensibly. LinuxKompass is an independent implementation with its own data, its own scoring logic and its own design.'}
          </p>
          <ul className="chiprow">
            <li>
              <a className="chip" href="https://distrochooser.de" target="_blank" rel="noreferrer noopener">
                distrochooser.de ↗
              </a>
            </li>
            <li>
              <a className="chip" href="https://themorpheus407.github.io/LinuxChooser/" target="_blank" rel="noreferrer noopener">
                LinuxChooser ↗
              </a>
            </li>
          </ul>
        </section>

        <div>
          <Link to={{ name: 'triage' }} className="btn btn--primary" fresh>
            {t('heroStart')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
