import { useMemo, useState } from 'react';
import { distros } from '../data/distros';
import type { Audience, Distro, ReleaseModel } from '../data/types';
import {
  audienceLabels, familyLabels, installerShort, releaseModelLabels, releaseModelShort, useI18n,
} from '../i18n';
import { desktopById } from '../data/desktops';
import { CompareToggle, Link, Monogram } from './common';

type SortKey = 'name' | 'beginnerFriendly' | 'freshness' | 'lightweight';

const FAMILIES = [...new Set(distros.map((d) => d.family))].sort();
const RELEASE_MODELS: ReleaseModel[] = ['lts', 'fixed', 'semi-rolling', 'rolling', 'atomic'];
const DESKTOPS = [...new Set(distros.flatMap((d) => d.availableDesktops))].sort();
const AUDIENCES = [...new Set(distros.flatMap((d) => d.audiences))].sort() as Audience[];

function DistroTile({ distro }: { distro: Distro }) {
  const { tl, t } = useI18n();
  return (
    <article className="card" style={{ display: 'grid', gap: '0.75rem', alignContent: 'start' }}>
      <header style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <Monogram distro={distro} />
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: 'var(--step-1)', margin: 0 }}>
            <Link to={{ name: 'distro', id: distro.id }}>{distro.name}</Link>
          </h3>
          <p style={{ margin: 0, fontSize: 'var(--step--1)', color: 'var(--ink-faint)' }}>
            {tl(familyLabels[distro.family])} · {distro.currentVersion}
          </p>
        </div>
      </header>
      <p style={{ margin: 0, color: 'var(--ink-muted)', fontSize: 'var(--step--1)' }}>{tl(distro.tagline)}</p>
      <ul className="chiprow">
        <li className="chip">{tl(releaseModelShort[distro.releaseModel])}</li>
        <li className="chip">
          {distro.defaultDesktop === 'none' ? '—' : desktopById.get(distro.defaultDesktop)?.name ?? distro.defaultDesktop}
        </li>
        <li className="chip">{tl(installerShort[distro.installer])}</li>
      </ul>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        <Link to={{ name: 'distro', id: distro.id }} className="btn btn--small">
          {t('details')}
        </Link>
        <CompareToggle id={distro.id} small />
      </div>
    </article>
  );
}

export function BrowsePage() {
  const { t, tl, lang } = useI18n();
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('');
  const [release, setRelease] = useState('');
  const [desktop, setDesktop] = useState('');
  const [audience, setAudience] = useState('');
  const [maxDifficulty, setMaxDifficulty] = useState(10);
  const [sort, setSort] = useState<SortKey>('name');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = distros.filter((d) => {
      if (family && d.family !== family) return false;
      if (release && d.releaseModel !== release) return false;
      if (desktop && !d.availableDesktops.includes(desktop)) return false;
      if (audience && !d.audiences.includes(audience as Audience)) return false;
      if (d.installDifficulty > maxDifficulty) return false;
      if (!q) return true;
      const haystack = [
        d.name, d.id, d.tagline[lang], d.description[lang], ...d.tags, ...d.availableDesktops, d.currentVersion,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });

    return list.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, lang);
      return b.ratings[sort] - a.ratings[sort] || a.name.localeCompare(b.name, lang);
    });
  }, [query, family, release, desktop, audience, maxDifficulty, sort, lang]);

  const reset = () => {
    setQuery('');
    setFamily('');
    setRelease('');
    setDesktop('');
    setAudience('');
    setMaxDifficulty(10);
  };

  return (
    <section className="section">
      <div className="container stack stack-lg">
        <header>
          <h1 style={{ fontSize: 'var(--step-3)' }}>{t('browseTitle')}</h1>
          <p className="prose" style={{ color: 'var(--ink-muted)' }}>
            {t('browseLead', { n: distros.length })}
          </p>
        </header>

        <div className="card" style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label htmlFor="search">{t('search')}</label>
            <input
              id="search"
              type="search"
              value={query}
              placeholder={t('searchPlaceholder')}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="grid grid--4" style={{ gap: '0.75rem' }}>
            <div>
              <label htmlFor="f-family">{t('filterFamily')}</label>
              <select id="f-family" value={family} onChange={(e) => setFamily(e.target.value)}>
                <option value="">{t('filterAll')}</option>
                {FAMILIES.map((f) => (
                  <option key={f} value={f}>
                    {tl(familyLabels[f])}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-release">{t('filterReleaseModel')}</label>
              <select id="f-release" value={release} onChange={(e) => setRelease(e.target.value)}>
                <option value="">{t('filterAll')}</option>
                {RELEASE_MODELS.map((r) => (
                  <option key={r} value={r}>
                    {tl(releaseModelLabels[r])}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-desktop">{t('filterDesktop')}</label>
              <select id="f-desktop" value={desktop} onChange={(e) => setDesktop(e.target.value)}>
                <option value="">{t('filterAll')}</option>
                {DESKTOPS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-audience">{t('filterAudience')}</label>
              <select id="f-audience" value={audience} onChange={(e) => setAudience(e.target.value)}>
                <option value="">{t('filterAll')}</option>
                {AUDIENCES.map((a) => (
                  <option key={a} value={a}>
                    {tl(audienceLabels[a])}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-difficulty">
                {t('filterDifficulty')}: ≤ {maxDifficulty}
              </label>
              <input
                id="f-difficulty"
                type="range"
                min={1}
                max={10}
                value={maxDifficulty}
                onChange={(e) => setMaxDifficulty(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label htmlFor="f-sort">{t('sortBy')}</label>
              <select id="f-sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                <option value="name">{t('sortName')}</option>
                <option value="beginnerFriendly">{t('sortBeginner')}</option>
                <option value="freshness">{t('sortFreshness')}</option>
                <option value="lightweight">{t('sortLightweight')}</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="chip">{t('resultsCount', { n: filtered.length })}</span>
            <button type="button" className="btn btn--small btn--quiet" onClick={reset}>
              {t('filtersReset')}
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p>{t('noResults')}</p>
        ) : (
          <div className="grid grid--3">
            {filtered.map((d) => (
              <DistroTile key={d.id} distro={d} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
