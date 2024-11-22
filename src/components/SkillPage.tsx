import { useState } from 'react'
import type { Skill } from '../data/types.ts'
import { CardFilters } from './CardFilters.tsx'
import { allSkills } from '../data/skills.ts'
import { SkillList } from './SkillList.tsx'

export function SkillPage() {
  const [skills, setSkills] = useState<Skill[]>([])

  return (
    <div className="flex flex-col gap-4">
      <CardFilters allCards={allSkills} setCards={setSkills} type="skill" />
      <SkillList skills={skills} />
    </div>
  )
}
