import type { IconType } from 'react-icons'
import type { Tag } from './tags.ts'
import type { Hero } from './heroes.ts'

export const tiers = ['Bronze', 'Silver', 'Gold', 'Diamond'] as const
export type Tier = (typeof tiers)[number]

export type Attribute =
  | 'CooldownMax'
  | 'BuyPrice'
  | 'SellPrice'
  | 'DamageAmount'
  | 'CritChance'
  | 'HasteAmount'
  | 'HasteTargets'
  | 'AmmoMax'
  | 'ReloadAmount'
  | 'ReloadTargets'
  | 'ChargeAmount'
  | 'ChargeTargets'
  | 'HealAmount'
  | 'HealthRegen'
  | 'ShieldApplyAmount'
  | 'JoyApplyAmount'
  | 'SlowAmount'
  | 'SlowTargets'
  | 'FreezeAmount'
  | 'FreezeTargets'
  | 'DisableAmount'
  | 'DisableTargets'
  | 'PoisonApplyAmount'
  | 'BurnApplyAmount'
  | 'Multicast'
  | 'Custom_0'
  | 'Custom_2'
  | 'Custom_3'
  | 'Custom_4'

export type Attributes = { [key in Attribute]?: number }

export type ActionType =
  | 'TActionPlayerDamage'
  | 'TActionCardHaste'
  | 'TActionCardReload'
  | 'TActionCardCharge'
  | 'TActionPlayerHeal'
  | 'TActionPlayerShieldApply'
  | 'TActionPlayerJoyApply'
  | 'TActionCardSlow'
  | 'TActionCardFreeze'
  | 'TActionCardDisable'
  | 'TActionPlayerPoisonApply'
  | 'TActionPlayerBurnApply'
  | 'TActionPlayerCardAttribute'
  | 'TActionPlayerModifyAttribute'
  | 'TActionCardModifyAttribute'
  | 'TActionGameSpawnCards'
  | 'TAuraActionCardModifyAttribute'

export type ActionTypeModifier = 'empty' | 'targets' | 'mod' | 'ref'

export type Action = {
  $type: ActionType
  AttributeType?: Attribute
  Value?: {
    $type: 'TFixedValue' | string
    Value: number
    AttributeType?: Attribute
    Modifier?: {
      Value: number
    }
  }
  SpawnContext?: {
    Limit: {
      $type: 'TFixedValue'
      Value: number
    }
  }
}

export type Ability = {
  Id: string
  Action: Action
}

export type TierData = {
  tier: Tier
  attributes: Record<Attribute, number>
  TooltipIds: number[]
}

export type Tooltip = {
  text: string
  type: 'Active' | 'Passive'
}

export type Card = {
  id: string
  name: string
  size: 1 | 2 | 3
  heroes: Hero[]
  tags: Tag[]
  hiddenTags: Tag[]
  tooltips: Tooltip[]
  abilities: Ability[]
  auras: Ability[]
  tiers: TierData[]
}

export type CardType = 'item' | 'skill'

export type Item = Card
export type Skill = Card

export type IconComponent = IconType
