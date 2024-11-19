import { colors } from '../util/colors.ts'

export const tags = [
  'Ammo',
  'Aquatic',
  'Burn',
  'Charge',
  'Crit Chance',
  'Cooldown',
  'Damage',
  'Friend',
  'Freeze',
  'Haste',
  'Heal',
  'Poison',
  'Property',
  'Shield',
  'Slow',
  'Tool',
  'Vehicle',
  'Weapon',
] as const

export type Tag = (typeof tags)[number]

export function getTag(str: string) {
  return tags.find((v) => v.toLowerCase() === str.toLowerCase())
}

export const tagColors: Record<Tag, string> = {
  Aquatic: colors.tag,
  Friend: colors.tag,
  Property: colors.tag,
  Tool: colors.tag,
  Vehicle: colors.tag,
  Weapon: colors.tag,

  Ammo: colors.ammo,
  Burn: colors.burn,
  Charge: colors.haste,
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
