import { colors } from '../util/colors.ts'
import type { IconComponent } from './types.ts'
import { GiDeathSkull, GiHealthNormal, GiHeavyBullets } from 'react-icons/gi'
import { ImFire } from 'react-icons/im'
import { FaBoltLightning, FaBurst, FaRegSnowflake } from 'react-icons/fa6'
import { SlTarget } from 'react-icons/sl'
import { IoShieldHalfOutline, IoStopwatchOutline } from 'react-icons/io5'

export const tags = [
  'Aquatic',
  'Food',
  'Friend',
  'Potion',
  'Property',
  'Tool',
  'Vehicle',
  'Weapon',
] as const

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
  Food: colors.tag,
  Friend: colors.tag,
  Potion: colors.tag,
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
  Freeze: colors.freeze,
  Haste: colors.haste,
  Heal: colors.heal,
  Poison: colors.poison,
  Shield: colors.shield,
  Slow: colors.slow,
}

type TagFormatting = {
  color: string
  Icon?: IconComponent
}

export const tagFormatting: Record<Tag, TagFormatting> = {
  Aquatic: { color: colors.tag },
  Food: { color: colors.tag },
  Friend: { color: colors.tag },
  Potion: { color: colors.tag },
  Property: { color: colors.tag },
  Tool: { color: colors.tag },
  Vehicle: { color: colors.tag },
  Weapon: { color: colors.tag },

  Ammo: { color: colors.ammo, Icon: GiHeavyBullets },
  Burn: { color: colors.burn, Icon: ImFire },
  Charge: { color: colors.haste, Icon: FaBoltLightning },
  Crit: { color: colors.crit, Icon: SlTarget },
  Cooldown: { color: colors.haste },
  Damage: { color: colors.damage, Icon: FaBurst },
  Freeze: { color: colors.freeze, Icon: FaRegSnowflake },
  Haste: { color: colors.haste, Icon: IoStopwatchOutline },
  Heal: { color: colors.heal, Icon: GiHealthNormal },
  Poison: { color: colors.poison, Icon: GiDeathSkull },
  Shield: { color: colors.shield, Icon: IoShieldHalfOutline },
  Slow: { color: colors.slow, Icon: IoStopwatchOutline },
} as const
