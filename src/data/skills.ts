import skillsJson from './skills.json'
import { type Skill, tiers } from './types.ts'
import { mapBy } from '../util/nodash.ts'

// @ts-ignore
export const allSkills = (skillsJson as Skill[]).sort((a, b) => {
  const minTierA = a.tiers[0]?.tier
  const minTierB = b.tiers[0]?.tier
  if (minTierA && minTierB && minTierA !== minTierB) {
    return tiers.indexOf(minTierA) - tiers.indexOf(minTierB)
  }

  return a.name.localeCompare(b.name)
})

export const skillsById = mapBy<string, Skill>(allSkills, 'id')
