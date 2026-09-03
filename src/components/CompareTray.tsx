import { getDistro } from '../data/distros';
import { desktopById } from '../data/desktops';
import { useI18n } from '../i18n';
import { useApp } from '../state/app';
import { Link } from './common';

/** Sticky Leiste am unteren Rand, solange etwas in der engeren Wahl liegt. */
export function CompareTray() {
  const { compare, compareDesktops, toggleCompare, clearCompare, route } = useApp();
  const { t } = useI18n();

  const total = compare.length + compareDesktops.length;
  if (total === 0 || route.name === 'compare') return null;

  return (
    <div className="traybar no-print">
      <div className="container traybar__inner">
        <span className="chip chip--accent">{t('compareCount', { n: total })}</span>
        <ul className="traybar__items">
          {compare.map((id) => {
            const d = getDistro(id);
            if (!d) return null;
            return (
              <li key={`d-${id}`}>
                <button type="button" className="chip" onClick={() => toggleCompare(id, 'distro')} title={t('compareRemove')}>
                  {d.name} <span aria-hidden="true">✕</span>
                </button>
              </li>
            );
          })}
          {compareDesktops.map((id) => {
            const de = desktopById.get(id);
            if (!de) return null;
            return (
              <li key={`e-${id}`}>
                <button
                  type="button"
                  className="chip chip--accent"
                  onClick={() => toggleCompare(id, 'desktop')}
                  title={t('compareRemove')}
                >
                  {de.name} <span aria-hidden="true">✕</span>
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className="btn btn--small btn--quiet" onClick={() => clearCompare()}>
          {t('compareClear')}
        </button>
        <Link to={{ name: 'compare' }} className="btn btn--small btn--primary">
          {t('compareOpen')}
        </Link>
      </div>
    </div>
  );
}
