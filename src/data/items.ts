import itemsJson from './items.json'
import { type Item, tiers } from './types.ts'
import { heroes } from './heroes.ts'
import { mapBy } from '../util/nodash.ts'

// @ts-ignore
export const allItems = (itemsJson as Item[]).sort((a, b) => {
  const minTierA = a.tiers[0]?.tier
  const minTierB = b.tiers[0]?.tier
  if (minTierA && minTierB && minTierA !== minTierB) {
    return tiers.indexOf(minTierA) - tiers.indexOf(minTierB)
  }

  const heroA = a.heroes[0]
  const heroB = b.heroes[0]
  if (heroA && heroB && heroA !== heroB) {
    return heroes.indexOf(heroA) - heroes.indexOf(heroB)
  }

  return a.name.localeCompare(b.name)
})

export const itemsById = mapBy<string, Item>(allItems, 'id')
