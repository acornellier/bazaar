import { allItems } from './data/items.ts'
import { ItemComponent } from './components/Item.tsx'
import { Filters } from './components/Filters.tsx'
import { useState } from 'react'

export function App() {
  const [items, setItems] = useState(allItems)

  return (
    <div className="flex flex-col gap-2 p-16">
      <Filters setItems={setItems} />
      <div className="flex gap-2 flex-wrap">
        {items.map((item) => (
          <ItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
