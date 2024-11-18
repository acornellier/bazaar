import { colors } from '../util/colors.ts'

export const tags = ['Aquatic', 'Friend', 'Property', 'Tool', 'Vehicle', 'Weapon'] as const

export const keywords = [
  ...tags,
  'Ammo',
  'Burn',
  'Crit Chance',
  'Cooldown',
  'Damage',
  'Freeze',
  'Haste',
  'Heal',
  'Poison',
  'Shield',
  'Slow',
] as const

export type Keyword = (typeof keywords)[number]

export function getKeyword(str: string) {
  return keywords.find((v) => v.toLowerCase() === str.toLowerCase())
}

export const keywordColors: Record<Keyword, string> = {
  Aquatic: colors.tag,
  Friend: colors.tag,
  Property: colors.tag,
  Tool: colors.tag,
  Vehicle: colors.tag,
  Weapon: colors.tag,

  Ammo: colors.ammo,
  Burn: colors.burn,
  'Crit Chance': colors.crit,
  Cooldown: colors.haste,
  Damage: colors.damage,
  Haste: colors.haste,
  Heal: colors.heal,
  Freeze: colors.freeze,
  Poison: colors.poison,
  Shield: colors.shield,
  Slow: colors.slow,
}
