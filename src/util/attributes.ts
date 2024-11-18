import type {
  ActionType,
  ActionTypeModifier,
  Attribute,
  IconComponent,
  Tier,
  TierData,
} from '../data/types.ts'
import type { Keyword } from '../data/keywords.ts'
import { ClockIcon } from 'lucide-react'
import { colors } from './colors.ts'

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
      return { empty: 'HealAmount', mod: 'Custom_0' }
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
      return { empty: 'DamageAmount' }
    case 'TActionPlayerCardAttribute':
      return { empty: 'Custom_0' } // TODO: incorrect
    case 'TActionPlayerModifyAttribute':
      return { empty: 'Custom_0', mod: 'Custom_0' } // TODO: incorrect
    case 'TActionCardModifyAttribute':
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
  HasteAmount: {
    color: colors.haste,
    ms: true,
    Icon: ClockIcon,
  },
  PoisonApplyAmount: {
    color: colors.poison,
  },
}

type AttributeData = {
  value: number
  formatting?: AttributeFormatting
}

export function getAttributeData(
  attribute: Attribute,
  tier: Tier,
  tiers: TierData[],
): AttributeData | null {
  let found = false
  for (const tierData of tiers.toReversed()) {
    if (!found && tier != tierData.tier) continue
    found = true

    const attributeValue = tierData.attributes[attribute]
    if (attributeValue !== undefined) {
      const formatting = attributeFormattings[attribute]
      return { value: attributeValue, formatting }
    }
  }

  return null
}

export const keywordColors: Record<Keyword, string> = {
  Aquatic: 'text-indigo-300',
  Burn: colors.burn,
  Damage: colors.damage,
  Haste: colors.haste,
  Poison: colors.poison,
  Weapon: 'text-indigo-300',
}
