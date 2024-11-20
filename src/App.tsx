import { allItems } from './data/items.ts'
import { Filters } from './components/Filters.tsx'
import { useState } from 'react'
import { ItemComponent } from './components/Item.tsx'

export function App() {
  const [items, setItems] = useState(allItems)
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2 p-16">
      <Filters setItems={setItems} />
      <div className="flex gap-2 flex-wrap">
        {items.map((item) => (
          <ItemComponent
            key={item.id}
            item={item}
            hovered={hoveredItemId === item.id}
            setHoveredItemId={setHoveredItemId}
          />
        ))}
      </div>
    </div>
  )
}
