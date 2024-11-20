import itemsJson from './items.json'
import type { Item } from './types.ts'
import { heroes } from './heroes.ts'

// @ts-ignore
export const allItems = (itemsJson as Item[]).sort((a, b) => {
  const heroA = a.heroes[0]
  const heroB = b.heroes[0]
  if (heroA && heroB && heroA !== heroB) {
    return heroes.indexOf(heroA) - heroes.indexOf(heroB)
  }
  return a.name.localeCompare(b.name)
})
