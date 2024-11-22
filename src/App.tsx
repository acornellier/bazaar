import { allItems } from './data/items.ts'
import { Filters } from './components/Filters.tsx'
import { useState } from 'react'
import { CardComponent } from './components/Card.tsx'
import { allSkills } from './data/skills.ts'
import type { CardType, Item, Skill } from './data/types.ts'
import { Button } from './components/Button.tsx'

function SkillList() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <Filters allCards={allSkills} setCards={setSkills} type="skill" />
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
    </div>
  )
}

function ItemList() {
  const [items, setItems] = useState<Item[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <Filters allCards={allItems} setCards={setItems} type="item" />
      <div className="flex gap-3 flex-wrap">
        {items.map((item) => (
          <CardComponent
            key={item.id}
            item={item}
            hovered={hoveredId === item.id}
            setHoveredItemId={setHoveredId}
            type="item"
          />
        ))}
      </div>
    </div>
  )
}

export function App() {
  const [page, setPage] = useState<CardType>('item')

  return (
    <div className="p-16 flex flex-col gap-2 mb-64">
      <div className="flex gap-2">
        <Button onClick={() => setPage('item')} active={page === 'item'}>
          Items
        </Button>
        <Button onClick={() => setPage('skill')} active={page === 'skill'}>
          Skills
        </Button>
      </div>
      {page === 'item' ? <ItemList /> : <SkillList />}
    </div>
  )
}
