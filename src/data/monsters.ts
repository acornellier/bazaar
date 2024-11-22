import monstersJson from './monsters.json'
import { type Monster } from './types.ts'

// @ts-ignore
export const allMonsters = (monstersJson as Monster[]).sort((a, b) => {
  return a.level - b.level
})
