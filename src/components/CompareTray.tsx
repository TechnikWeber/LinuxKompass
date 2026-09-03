import { getDistro } from '../data/distros';
import { useI18n } from '../i18n';
import { useApp } from '../state/app';
import { Link } from './common';

/** Sticky Leiste am unteren Rand, solange etwas in der engeren Wahl liegt. */
export function CompareTray() {
  const { compare, toggleCompare, clearCompare, route } = useApp();
  const { t } = useI18n();

  if (compare.length === 0 || route.name === 'compare') return null;

  return (
    <div className="traybar no-print">
      <div className="container traybar__inner">
        <span className="chip chip--accent">{t('compareCount', { n: compare.length })}</span>
        <ul className="traybar__items">
          {compare.map((id) => {
            const d = getDistro(id);
            if (!d) return null;
            return (
              <li key={id}>
                <button type="button" className="chip" onClick={() => toggleCompare(id)} title={t('compareRemove')}>
                  {d.name} <span aria-hidden="true">✕</span>
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className="btn btn--small btn--quiet" onClick={clearCompare}>
          {t('compareClear')}
        </button>
        <Link to={{ name: 'compare' }} className="btn btn--small btn--primary">
          {t('compareOpen')}
        </Link>
      </div>
    </div>
  );
}
