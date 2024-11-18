export const keywords = ['Aquatic', 'Burn', 'Damage', 'Haste', 'Poison', 'Weapon'] as const
export type Keyword = (typeof keywords)[number]

export function getKeyword(str: string) {
  return keywords.find((v) => v.toLowerCase() === str.toLowerCase())
}
