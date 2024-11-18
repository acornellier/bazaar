import { colors } from '../util/colors.ts'

export const keywords = [
  'Ammo',
  'Aquatic',
  'Burn',
  'Damage',
  'Haste',
  'Poison',
  'Shield',
  'Slow',
  'Weapon',
] as const

export type Keyword = (typeof keywords)[number]

export function getKeyword(str: string) {
  return keywords.find((v) => v.toLowerCase() === str.toLowerCase())
}

export const keywordColors: Record<Keyword, string> = {
  Ammo: colors.ammo,
  Aquatic: 'text-indigo-300',
  Burn: colors.burn,
  Damage: colors.damage,
  Haste: colors.haste,
  Poison: colors.poison,
  Shield: colors.shield,
  Slow: colors.slow,
  Weapon: 'text-indigo-300',
}
