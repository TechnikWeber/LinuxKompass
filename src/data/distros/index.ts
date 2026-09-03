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
  ...independent,
  ...securitySpecial,
].sort((a, b) => a.name.localeCompare(b.name, 'de'));

export const distroById = new Map(distros.map((d) => [d.id, d]));

export function getDistro(id: string): Distro | undefined {
  return distroById.get(id);
}
