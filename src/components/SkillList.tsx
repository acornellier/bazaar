import type { Skill } from '../data/types.ts'
import { CardComponent } from './Card.tsx'
import { useState } from 'react'

interface Props {
  skills: Skill[]
}

export function SkillList({ skills }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="flex gap-1 flex-wrap">
      {skills.map((skill) => (
        <CardComponent
          key={skill.id}
          item={skill}
          hovered={hoveredId === skill.id}
          setHoveredItemId={setHoveredId}
          type="skill"
        />
      ))}
    </div>
  )
}
