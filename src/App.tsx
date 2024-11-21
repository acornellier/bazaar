import { allItems } from './data/items.ts'
import { Filters } from './components/Filters.tsx'
import { useState } from 'react'
import { ItemComponent } from './components/Item.tsx'
import { allSkills } from './data/skills.ts'

export function App() {
  const [items, setItems] = useState(allItems)
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)

  return (
    <div className="flex flex-col p-16">
      <Filters setItems={setItems} />
      <div className="flex gap-2 flex-wrap">
        {allSkills.map((skill) => (
          <ItemComponent
            key={skill.id}
            item={skill}
            hovered={hoveredItemId === skill.id}
            setHoveredItemId={setHoveredItemId}
            type="skill"
          />
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        {items.map((item) => (
          <ItemComponent
            key={item.id}
            item={item}
            hovered={hoveredItemId === item.id}
            setHoveredItemId={setHoveredItemId}
            type="item"
          />
        ))}
      </div>
    </div>
  )
}
