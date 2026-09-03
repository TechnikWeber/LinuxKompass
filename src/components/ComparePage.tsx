import { Fragment, useMemo, useState, type ReactNode } from 'react';
import { distros, getDistro } from '../data/distros';
import { desktopById } from '../data/desktops';
import type { DesktopEnvironment, Distro, RatingKey } from '../data/types';
import {
  archLabels, familyLabels, governanceLabels, initLabels, installerLabels, libcLabels,
  maintenanceLabels, nvidiaLabels, packageFormatLabels, packageManagerLabels, ratingLabels,
  releaseModelLabels, secureBootLabels, useI18n,
} from '../i18n';
import { useApp } from '../state/app';
import { Link, Monogram } from './common';

interface Row {
  label: string;
  /** Für den Unterschieds-Filter: normalisierte Werte. */
  keys: string[];
  cells: ReactNode[];
  group: string;
}

const RATING_ROWS: RatingKey[] = [
  'beginnerFriendly', 'stability', 'freshness', 'lightweight', 'gaming', 'hardwareSupport',
  'customizability', 'germanSupport', 'documentation', 'privacy', 'enterpriseReady',
  'softwareAvailability', 'upgradeSmoothness', 'creativeWork',
];

export function ComparePage() {
  const { t, tl, lang } = useI18n();
  const { compare, compareDesktops, toggleCompare, clearCompare } = useApp();
  const [onlyDiffs, setOnlyDiffs] = useState(false);

  const selected = useMemo(
    () => compare.map((id) => getDistro(id)).filter((d): d is Distro => Boolean(d)),
    [compare],
  );
  const selectedDesktops = useMemo(
    () => compareDesktops.map((id) => desktopById.get(id)).filter((d): d is DesktopEnvironment => Boolean(d)),
    [compareDesktops],
  );

  const rows = useMemo<Row[]>(() => {
    if (selected.length === 0) return [];
    const yes = t('yes');
    const no = t('no');
    const bool = (v: boolean) => (v ? `✓ ${yes}` : `– ${no}`);

    const make = (group: string, label: string, fn: (d: Distro) => string): Row => {
      const values = selected.map(fn);
      return { group, label, keys: values, cells: values.map((v, i) => <span key={i}>{v}</span>) };
    };

    const basics: Row[] = [
      make('basics', t('fieldVersion'), (d) => `${d.currentVersion} (${d.currentVersionDate})`),
      make('basics', t('fieldSupportUntil'), (d) => tl(d.supportUntil)),
      make('basics', t('fieldReleaseModel'), (d) => tl(releaseModelLabels[d.releaseModel])),
      make('basics', t('fieldReleaseCadence'), (d) => tl(d.releaseCadence)),
      make('basics', t('fieldFamily'), (d) => tl(familyLabels[d.family])),
      make('basics', t('detailBasedOn'), (d) => (d.basedOn ? getDistro(d.basedOn)?.name ?? d.basedOn : '—')),
      make('basics', t('fieldOrigin'), (d) => `${d.originCountry} · ${d.firstRelease}`),
      make('basics', t('fieldGovernance'), (d) => tl(governanceLabels[d.governance])),
      make('basics', t('fieldMaintenance'), (d) => tl(maintenanceLabels[d.maintenanceLoad])),
      make('basics', t('fieldCommercialSupport'), (d) => bool(d.commercialSupport)),
    ];

    const desktop: Row[] = [
      make('desktop', t('fieldDefaultDesktop'), (d) =>
        d.defaultDesktop === 'none' ? t('none') : desktopById.get(d.defaultDesktop)?.name ?? d.defaultDesktop,
      ),
      make('desktop', t('fieldDesktops'), (d) =>
        d.availableDesktops.length === 0 ? t('none') : d.availableDesktops.map((x) => desktopById.get(x)?.name ?? x).join(', '),
      ),
      make('desktop', t('fieldWayland'), (d) => bool(d.waylandDefault)),
      make('desktop', t('fieldX11'), (d) => bool(d.x11SessionAvailable)),
    ];

    const packages: Row[] = [
      make('packages', t('fieldPackageManager'), (d) => tl(packageManagerLabels[d.packageManager])),
      make('packages', t('fieldPackageFormat'), (d) => tl(packageFormatLabels[d.packageFormat])),
      make('packages', t('fieldFlatpak'), (d) => bool(d.flatpakReady)),
      make('packages', t('fieldSnap'), (d) => bool(d.snapReady)),
      make('packages', t('fieldAur'), (d) => bool(d.aur)),
      make('packages', t('fieldInit'), (d) => tl(initLabels[d.init])),
      make('packages', t('fieldLibc'), (d) => tl(libcLabels[d.libc])),
      make('packages', t('fieldAtomic'), (d) => bool(d.atomic)),
    ];

    const hardware: Row[] = [
      make('hardware', t('fieldMinRam'), (d) => `${d.minRamGb} ${t('gb')}`),
      make('hardware', t('fieldRecommendedRam'), (d) => `${d.recommendedRamGb} ${t('gb')}`),
      make('hardware', t('fieldMinStorage'), (d) => `${d.minStorageGb} ${t('gb')}`),
      make('hardware', t('fieldArchitectures'), (d) => d.architectures.map((a) => tl(archLabels[a])).join(', ')),
      make('hardware', t('field32bit'), (d) => bool(d.supports32Bit)),
      make('hardware', t('fieldRaspberry'), (d) => bool(d.runsOnRaspberryPi)),
      make('hardware', t('fieldSecureBoot'), (d) => tl(secureBootLabels[d.secureBoot])),
      make('hardware', t('fieldNvidia'), (d) => tl(nvidiaLabels[d.nvidia])),
      make('hardware', t('fieldCodecs'), (d) => bool(d.codecsOutOfBox)),
      make('hardware', t('fieldInstaller'), (d) => `${tl(installerLabels[d.installer])} (${d.installDifficulty}/10)`),
      make('hardware', t('fieldFde'), (d) => bool(d.fullDiskEncryptionInInstaller)),
      make('hardware', t('fieldSnapshots'), (d) => bool(d.snapshotRollback)),
    ];

    const ratings: Row[] = RATING_ROWS.map((key) => {
      const values = selected.map((d) => d.ratings[key]);
      const best = Math.max(...values);
      return {
        group: 'ratings',
        label: tl(ratingLabels[key]),
        keys: values.map(String),
        cells: values.map((v, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontVariantNumeric: 'tabular-nums', minWidth: '2.2ch', fontWeight: v === best ? 700 : 400 }}>{v}</span>
            <span className="meter__track" style={{ width: '4.5rem', gridColumn: 'auto' }}>
              <span
                className="meter__fill"
                style={{ display: 'block', width: `${v * 10}%`, background: v === best ? 'var(--accent)' : 'var(--rule-strong)' }}
              />
            </span>
          </span>
        )),
      };
    });

    const telemetry: Row[] = [make('other', t('fieldTelemetry'), (d) => tl(d.telemetry))];

    return [...basics, ...desktop, ...packages, ...hardware, ...ratings, ...telemetry];
  }, [selected, t, tl]);


  const desktopRows = useMemo<Row[]>(() => {
    if (selectedDesktops.length === 0) return [];

    const make = (label: string, fn: (de: DesktopEnvironment) => string): Row => {
      const values = selectedDesktops.map(fn);
      return { group: 'desktop', label, keys: values, cells: values.map((v, i) => <span key={i}>{v}</span>) };
    };

    const sessionLabel = (v: DesktopEnvironment['x11Session'] | DesktopEnvironment['waylandSession']) => {
      const map: Record<string, string> = lang === 'de'
        ? { available: 'verfügbar', ending: 'läuft aus', none: 'nicht verfügbar', default: 'Standard', optional: 'optional' }
        : { available: 'available', ending: 'being phased out', none: 'not available', default: 'default', optional: 'optional' };
      return map[v] ?? v;
    };

    const numeric = (label: string, pick: (de: DesktopEnvironment) => number): Row => {
      const values = selectedDesktops.map(pick);
      const best = Math.max(...values);
      return {
        group: 'desktop',
        label,
        keys: values.map(String),
        cells: values.map((v, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontVariantNumeric: 'tabular-nums', minWidth: '2.2ch', fontWeight: v === best ? 700 : 400 }}>{v}</span>
            <span className="meter__track" style={{ width: '4.5rem', gridColumn: 'auto' }}>
              <span
                className="meter__fill"
                style={{ display: 'block', width: `${v * 10}%`, background: v === best ? 'var(--accent)' : 'var(--rule-strong)' }}
              />
            </span>
          </span>
        )),
      };
    };

    return [
      make(t('desktopFeelsLike'), (de) => tl(de.feelsLike)),
      make(t('desktopMemory'), (de) => `~${de.ramFootprintMb} MB`),
      make(t('fieldX11'), (de) => sessionLabel(de.x11Session)),
      make(t('fieldWayland'), (de) => sessionLabel(de.waylandSession)),
      make(t('desktopWayland'), (de) => tl(de.waylandStatus)),
      numeric(t('sortBeginner'), (de) => de.beginnerFriendly),
      numeric(t('desktopCustomizability'), (de) => de.customizability),
      numeric(t('sortLightweight'), (de) => de.lightweight),
      numeric(t('desktopTouch'), (de) => de.touchFriendly),
      numeric(t('desktopAccessibility'), (de) => de.accessibility),
      make(t('desktopUsedBy'), (de) => {
        const names = distros.filter((d) => d.defaultDesktop === de.id).map((d) => d.name);
        return names.length > 0 ? names.slice(0, 6).join(', ') : '—';
      }),
    ];
  }, [selectedDesktops, t, tl, lang]);

  const groupTitles: Record<string, string> = {
    basics: lang === 'de' ? 'Grunddaten' : 'Basics',
    desktop: lang === 'de' ? 'Oberfläche' : 'Desktop',
    packages: lang === 'de' ? 'Software und Unterbau' : 'Software and plumbing',
    hardware: lang === 'de' ? 'Hardware und Installation' : 'Hardware and installation',
    ratings: t('detailRatings'),
    other: lang === 'de' ? 'Sonstiges' : 'Other',
  };

  if (selected.length === 0 && selectedDesktops.length === 0) {
    return (
      <section className="section">
        <div className="container container--narrow stack">
          <h1 style={{ fontSize: 'var(--step-3)' }}>{t('compareTitle')}</h1>
          <div className="callout callout--info">
            <p style={{ margin: 0 }}>{t('compareEmpty')}</p>
          </div>
          <div>
            <Link to={{ name: 'browse' }} className="btn btn--primary">
              {t('navBrowse')}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const visibleRows = onlyDiffs ? rows.filter((r) => new Set(r.keys).size > 1) : rows;
  let lastGroup = '';

  return (
    <section className="section">
      <div className="container container--wide stack stack-lg">
        <header className="stack">
          <h1 style={{ fontSize: 'var(--step-3)' }}>{t('compareTitle')}</h1>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="chip">{t('compareCount', { n: selected.length + selectedDesktops.length })}</span>
            <label style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={onlyDiffs} onChange={(e) => setOnlyDiffs(e.target.checked)} style={{ width: 'auto' }} />
              {t('compareOnlyDiffs')}
            </label>
            <button type="button" className="btn btn--small btn--quiet" onClick={() => clearCompare()}>
              {t('compareClear')}
            </button>
          </div>
        </header>

        <p className="callout callout--info" style={{ fontSize: 'var(--step--1)' }}>
          {t('compareBothHint')}
        </p>

        {selected.length > 0 && (
          <section className="stack">
            <h2 style={{ fontSize: 'var(--step-2)' }}>{t('compareDistros')}</h2>
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th scope="col" style={{ minWidth: '12rem' }}>
                    &nbsp;
                  </th>
                  {selected.map((d) => (
                    <th key={d.id} scope="col" style={{ minWidth: '14rem' }}>
                      <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Monogram distro={d} />
                        <span style={{ minWidth: 0 }}>
                          <Link to={{ name: 'distro', id: d.id }}>{d.name}</Link>
                          <button
                            type="button"
                            className="btn btn--quiet btn--small no-print"
                            onClick={() => toggleCompare(d.id)}
                            aria-label={`${t('compareRemove')}: ${d.name}`}
                            style={{ padding: '0 0.35em' }}
                          >
                            ✕
                          </button>
                        </span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => {
                  const differs = new Set(row.keys).size > 1;
                  const showGroup = row.group !== lastGroup;
                  lastGroup = row.group;
                  return (
                    <Fragment key={`${row.group}-${row.label}`}>
                      {showGroup && (
                        <tr>
                          <th
                            scope="row"
                            colSpan={selected.length + 1}
                            style={{
                              background: 'var(--paper-sunken)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.07em',
                              fontSize: 'var(--step--1)',
                              color: 'var(--ink-faint)',
                            }}
                          >
                            {groupTitles[row.group]}
                          </th>
                        </tr>
                      )}
                      <tr className={differs ? 'row--differs' : undefined}>
                        <th scope="row">{row.label}</th>
                        {row.cells.map((cell, i) => (
                          <td key={i}>{cell}</td>
                        ))}
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid--2">
            {selected.map((d) => (
              <article key={d.id} className="card">
                <h2 style={{ fontSize: 'var(--step-1)' }}>{d.name}</h2>
                <h3 style={{ fontSize: 'var(--step-0)', fontFamily: 'var(--font-body)', color: 'var(--ink-faint)' }}>
                  {t('detailWarnings')}
                </h3>
                <ul>
                  {(lang === 'de' ? d.warnings.de : d.warnings.en).map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          </section>
        )}

        {selectedDesktops.length > 0 && (
          <section className="stack">
            <h2 style={{ fontSize: 'var(--step-2)' }}>{t('compareDesktops')}</h2>
            <div className="tablewrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col" style={{ minWidth: '12rem' }}>
                      &nbsp;
                    </th>
                    {selectedDesktops.map((de) => (
                      <th key={de.id} scope="col" style={{ minWidth: '13rem' }}>
                        <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span
                            aria-hidden="true"
                            style={{ width: '0.7rem', height: '0.7rem', borderRadius: 3, background: `hsl(${de.accent})`, flex: 'none' }}
                          />
                          {de.name}
                          <button
                            type="button"
                            className="btn btn--quiet btn--small no-print"
                            onClick={() => toggleCompare(de.id, 'desktop')}
                            aria-label={`${t('compareRemove')}: ${de.name}`}
                            style={{ padding: '0 0.35em' }}
                          >
                            ✕
                          </button>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {desktopRows.map((row) => {
                    const differs = new Set(row.keys).size > 1;
                    if (onlyDiffs && !differs) return null;
                    return (
                      <tr key={row.label} className={differs ? 'row--differs' : undefined}>
                        <th scope="row">{row.label}</th>
                        {row.cells.map((cell, i) => (
                          <td key={i}>{cell}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--ink-muted)' }}>
              <Link to={{ name: 'desktops' }}>{t('desktopPickAll')}</Link>
            </p>
          </section>
        )}


      </div>
    </section>
  );
}
