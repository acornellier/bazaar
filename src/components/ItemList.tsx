import type { Item } from '../data/types.ts'
import { CardComponent } from './Card.tsx'
import { useState } from 'react'

interface Props {
  items: Item[]
}

export function ItemList({ items }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
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
  )
}
