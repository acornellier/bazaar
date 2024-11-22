import { allMonsters } from '../data/monsters.ts'
import { itemsById } from '../data/items.ts'
import { useMemo } from 'react'
import type { Monster } from '../data/types.ts'
import { ItemList } from './ItemList.tsx'
import { skillsById } from '../data/skills.ts'
import { SkillList } from './SkillList.tsx'

interface Props {
  monster: Monster
}

function MonsterComponent({ monster }: Props) {
  const items = useMemo(
    () =>
      monster.items
        .map((id) => {
          if (!itemsById[id]) console.error(`missing item for ${monster.name}: ${id}`)
          return itemsById[id]
        })
        .filter(Boolean),
    [monster.items, monster.name],
  )

  const skills = useMemo(
    () =>
      monster.skills
        .map((id) => {
          if (!skillsById[id]) console.error(`missing skill for ${monster.name}: ${id}`)
          return skillsById[id]
        })
        .filter(Boolean),
    [monster.skills, monster.name],
  )

  return (
    <div>
      <div className="text-xl font-bold">
        {monster.name} - Level {monster.level}
      </div>
      <div
        className={`h-32 w-32 object-fill bg-repeat-round`}
        style={{
          backgroundImage: `url(/images/monsters/${monster.id}.png)`,
        }}
      />
      <ItemList items={items} />
      <SkillList skills={skills} />
    </div>
  )
}

export function MonsterList() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 flex-wrap">
        {allMonsters.map((monster, idx) => (
          <MonsterComponent key={idx} monster={monster} />
        ))}
      </div>
    </div>
  )
}
