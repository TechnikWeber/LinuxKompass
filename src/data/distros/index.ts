import type { Distro } from '../types';
import { ubuntuFamily } from './ubuntu-family';
import { ubuntuFlavours } from './ubuntu-flavours';
import { ubuntuDerivatives } from './ubuntu-derivatives';
import { debianFamily } from './debian-family';
import { fedoraFamily } from './fedora-family';
import { gamingAtomic } from './gaming-atomic';
import { enterprise } from './enterprise';
import { archFamily } from './arch-family';
import { suseFamily } from './suse-family';
import { mandrivaFamily } from './mandriva-family';
import { moreIndependent } from './more-independent';
import { moreDesktop } from './more-desktop';
import { independent } from './independent';
import { securitySpecial } from './security-special';

/** Alle Distributionen, alphabetisch nach Anzeigenamen sortiert. */
export const distros: Distro[] = [
  ...ubuntuFamily,
  ...ubuntuFlavours,
  ...ubuntuDerivatives,
  ...debianFamily,
  ...fedoraFamily,
  ...gamingAtomic,
  ...enterprise,
  ...archFamily,
  ...suseFamily,
  ...mandrivaFamily,
  ...moreIndependent,
  ...moreDesktop,
  ...independent,
  ...securitySpecial,
].sort((a, b) => a.name.localeCompare(b.name, 'de'));

export const distroById = new Map(distros.map((d) => [d.id, d]));

/*
 * Prüfdaten des Bestands.
 *
 * Jeder Eintrag trägt sein eigenes Datum, und das ist auch richtig so: Neue
 * Einträge kommen laufend dazu, alte werden nachgeprüft. Als „Datenstand" der
 * Sammlung taugt deshalb nur das älteste Datum – es sagt, wie alt die am
 * längsten nicht angefasste Angabe ist. Das jüngste zu nennen wäre schmeichelhaft
 * und irreführend.
 */
const checkDates = distros.map((d) => d.checkedAt).sort();
export const oldestCheckDate = checkDates[0] ?? '';
export const newestCheckDate = checkDates[checkDates.length - 1] ?? '';

/**
 * Die Namen, mit denen Leute hierherkommen.
 *
 * Keine Rangliste und keine Empfehlung, sondern eine Beobachtung: Nach diesen
 * Distributionen wird am häufigsten gefragt, weil sie in Foren, Videos und
 * Bekanntenkreisen zuerst fallen. Die Ergebnisseite bietet daraus drei zum
 * direkten Gegenlesen an – wer einen Namen im Kopf hat, soll ihn prüfen
 * können, statt ihn stillschweigend übergangen zu sehen.
 *
 * Bewusst als kurze, gepflegte Liste an einer Stelle und nicht als Merkmal an
 * jedem Datensatz: „Beliebtheit" ist eine redaktionelle Einschätzung und keine
 * Eigenschaft der Software.
 */
export const popularIds: string[] = [
  'linux-mint',
  'ubuntu',
  'fedora-workstation',
  'debian',
  'pop-os',
  'arch',
  'manjaro',
  'opensuse-tumbleweed',
];

/** Die beliebtesten Distributionen außer der genannten. */
export function popularAlternatives(exclude: string[], count = 3): Distro[] {
  return popularIds
    .filter((id) => !exclude.includes(id))
    .map((id) => distroById.get(id))
    .filter((d): d is Distro => Boolean(d))
    .slice(0, count);
}

export function getDistro(id: string): Distro | undefined {
  return distroById.get(id);
}
