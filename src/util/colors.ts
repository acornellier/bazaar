import type { Tier } from '../data/types.ts'

export const colors = {
  burn: 'text-orange-400',
  damage: 'text-red-400',
  haste: 'text-cyan-400',
  poison: 'text-green-400',
} as const

export const bgColors = {
  bronze: 'bg-amber-700',
  silver: 'bg-gray-400',
  gold: 'bg-yellow-500',
  diamond: 'bg-cyan-300',
} as const

export function getTierBg(tier: Tier) {
  switch (tier) {
    case 'Bronze':
      return bgColors.bronze
    case 'Silver':
      return bgColors.silver
    case 'Gold':
      return bgColors.gold
    case 'Diamond':
      return bgColors.diamond
  }
}
