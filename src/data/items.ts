import itemsJson from './items.json'
import type { Item } from './types.ts'

// @ts-ignore
export const allItems = itemsJson as Item[]
