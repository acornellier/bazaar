import { colors } from '../util/colors.ts'

export const tags = ['Aquatic', 'Food', 'Friend', 'Potion', 'Property', 'Tool', 'Vehicle', 'Weapon']

export const hiddenTags = [
  'Ammo',
  'Burn',
  'Charge',
  'Crit',
  'Cooldown',
  'Damage',
  'Freeze',
  'Haste',
  'Heal',
  'Poison',
  'Shield',
  'Slow',
] as const

export const allTags = [...tags, ...hiddenTags]

export type Tag = (typeof allTags)[number]

export function getTag(str: string) {
  return allTags.find((v) => v.toLowerCase() === str.toLowerCase())
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
  Crit: colors.crit,
  Cooldown: colors.haste,
  Damage: colors.damage,
  Haste: colors.haste,
  Heal: colors.heal,
  Freeze: colors.freeze,
  Poison: colors.poison,
  Shield: colors.shield,
  Slow: colors.slow,
}
