import skillsJson from './skills.json'
import type { Skill } from './types.ts'

// @ts-ignore
export const allSkills = skillsJson as Skill[]
