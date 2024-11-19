import type {
  Ability,
  ActionType,
  ActionTypeModifier,
  Attribute,
  IconComponent,
  Tier,
  TierData,
} from '../data/types.ts'
import { colors } from './colors.ts'
import { IoShieldHalfOutline, IoStopwatchOutline } from 'react-icons/io5'
import { FaBoltLightning, FaBurst, FaRegSnowflake } from 'react-icons/fa6'
import { ImFire } from 'react-icons/im'
import { GiDeathSkull, GiHealthNormal, GiHeavyBullets } from 'react-icons/gi'
import { SlTarget } from 'react-icons/sl'
import { FaHeart } from 'react-icons/fa'

export type ActionTypeModifiers = { [key in ActionTypeModifier]?: Attribute }

export function getActionTypeModifiers(actionType: ActionType): ActionTypeModifiers {
  switch (actionType) {
    case 'TActionPlayerDamage':
      return { empty: 'DamageAmount', mod: 'Custom_0' }
    case 'TActionCardHaste':
      return { empty: 'HasteAmount', targets: 'HasteTargets' }
    case 'TActionCardReload':
      return { empty: 'ReloadAmount', targets: 'ReloadTargets' }
    case 'TActionCardCharge':
      return { empty: 'ChargeAmount', targets: 'ChargeTargets' }
    case 'TActionPlayerHeal':
      return { empty: 'HealAmount', mod: 'HealAmount' }
    case 'TActionPlayerShieldApply':
      return { empty: 'ShieldApplyAmount', mod: 'Custom_0', ref: 'ShieldApplyAmount' }
    case 'TActionPlayerJoyApply':
      return { empty: 'JoyApplyAmount' }
    case 'TActionCardSlow':
      return { empty: 'SlowAmount', targets: 'SlowTargets' }
    case 'TActionCardFreeze':
      return { empty: 'FreezeAmount', targets: 'FreezeTargets' }
    case 'TActionCardDisable':
      return { empty: 'DisableAmount', targets: 'DisableTargets' }
    case 'TActionPlayerPoisonApply':
      return { empty: 'PoisonApplyAmount' }
    case 'TActionPlayerBurnApply':
      return { empty: 'BurnApplyAmount' }
    case 'TActionPlayerCardAttribute':
      return { empty: 'Custom_0' } // TODO: incorrect
    case 'TActionPlayerModifyAttribute':
      return { empty: 'Custom_0', mod: 'Custom_0' } // TODO: incorrect
    case 'TActionCardModifyAttribute':
    case 'TAuraActionCardModifyAttribute':
      return { empty: 'Custom_0' } // TODO: incorrect
    case 'TActionGameSpawnCards':
      return { empty: 'Custom_0' } // TODO: incorrect
    default:
      return {}
  }
}

type AttributeFormatting = {
  color?: string
  ms?: boolean
  Icon?: IconComponent
}

const attributeFormattings: { [key in Attribute]?: AttributeFormatting } = {
  BurnApplyAmount: {
    color: colors.burn,
    Icon: ImFire,
  },
  ChargeAmount: {
    color: colors.haste,
    ms: true,
    Icon: FaBoltLightning,
  },
  CooldownMax: {
    ms: true,
  },
  CritChance: {
    color: colors.crit,
    Icon: SlTarget,
  },
  DamageAmount: {
    color: colors.damage,
    Icon: FaBurst,
  },
  FreezeAmount: {
    color: colors.freeze,
    ms: true,
    Icon: FaRegSnowflake,
  },
  HasteAmount: {
    color: colors.haste,
    ms: true,
    Icon: IoStopwatchOutline,
  },
  HealAmount: {
    color: colors.heal,
    Icon: GiHealthNormal,
  },
  HealthRegen: {
    color: colors.heal,
    Icon: FaHeart,
  },
  PoisonApplyAmount: {
    color: colors.poison,
    Icon: GiDeathSkull,
  },
  ReloadAmount: {
    color: colors.ammo,
    Icon: GiHeavyBullets,
  },
  ShieldApplyAmount: {
    color: colors.shield,
    Icon: IoShieldHalfOutline,
  },
  SlowAmount: {
    color: colors.slow,
    ms: true,
    Icon: IoStopwatchOutline,
  },
}

type AttributeResult = {
  main: Attribute
  accessor?: Attribute
}

type AttributeData = {
  value: number
  formatting?: AttributeFormatting
}

export function getAttribute(
  ability: Ability,
  modifier: ActionTypeModifier,
): AttributeResult | null {
  if (ability.Action.Value?.AttributeType) {
    if (ability.Action.AttributeType) {
      return { main: ability.Action.AttributeType, accessor: ability.Action.Value?.AttributeType }
    }

    return { main: ability.Action.Value?.AttributeType }
  }

  const actionTypeModifiers = getActionTypeModifiers(ability.Action.$type)
  const attribute = actionTypeModifiers[modifier]
  if (!attribute) return null

  return { main: attribute }
}

export function getAttributeValue(attribute: Attribute, tier: Tier, tiers: TierData[]) {
  let found = false
  for (const tierData of tiers.toReversed()) {
    if (!found && tier != tierData.tier) continue
    found = true

    const attributeValue = tierData.attributes[attribute]
    if (attributeValue !== undefined) return attributeValue
  }

  return null
}

export function getAttributeData(
  ability: Ability,
  modifier: ActionTypeModifier,
  tier: Tier,
  tiers: TierData[],
): AttributeData | null {
  if (modifier === 'mod') {
    const attribute = ability.Action.AttributeType
    const value = ability.Action.Value?.Modifier?.Value
    if (!attribute || !value) return null

    const formatting = attributeFormattings[attribute]
    return { value, formatting }
  }

  const attribute = getAttribute(ability, modifier)
  if (!attribute) return null

  const attributeValue = getAttributeValue(attribute.accessor ?? attribute.main, tier, tiers)
  if (attributeValue !== null) {
    const formatting = attributeFormattings[attribute.main]
    return { value: attributeValue, formatting }
  }

  return null
}

export function getTierAttributes(tier: Tier, tiers: TierData[]) {
  const attributes: { [key in Attribute]?: number } = {}

  let found = false
  for (const tierData of tiers.toReversed()) {
    if (!found && tier != tierData.tier) continue
    found = true

    for (const [attribute, value] of Object.entries(tierData.attributes)) {
      if (!(attribute in attributes)) {
        attributes[attribute as Attribute] = value
      }
    }
  }

  return attributes
}
