import * as react from 'react'
import { type ForwardRefExoticComponent } from 'react'
import type { LucideProps } from 'lucide-react'

export type Tier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond'

export type Attribute =
  | 'CooldownMax'
  | 'BuyPrice'
  | 'SellPrice'
  | 'DamageAmount'
  | 'HasteAmount'
  | 'HasteTargets'
  | 'ReloadAmount'
  | 'ReloadTargets'
  | 'ChargeAmount'
  | 'ChargeTargets'
  | 'HealAmount'
  | 'ShieldApplyAmount'
  | 'JoyApplyAmount'
  | 'SlowAmount'
  | 'SlowTargets'
  | 'FreezeAmount'
  | 'FreezeTargets'
  | 'DisableAmount'
  | 'DisableTargets'
  | 'PoisonApplyAmount'
  | 'Multicast'
  | 'Custom_0'
  | 'Custom_2'
  | 'Custom_3'
  | 'Custom_4'

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

export type ActionTypeModifier = 'empty' | 'targets' | 'mod' | 'ref'

export type Action = {
  $type: ActionType
  Value?: {
    $type: 'TFixedValue'
    Value: number
  }
}

export type Ability = {
  description: string
  priority: 'High' | 'Medium' | 'Low'
  Action: Action
}

export type TierData = {
  tier: Tier
  attributes: Record<Attribute, number>
}

export type Item = {
  id: string
  name: string
  size: 1 | 2 | 3
  abilities: Ability[]
  tiers: TierData[]
}

export type IconComponent = ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & react.RefAttributes<SVGSVGElement>
>
