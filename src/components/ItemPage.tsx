import { useState } from 'react'
import type { Item } from '../data/types.ts'
import { CardFilters } from './CardFilters.tsx'
import { allItems } from '../data/items.ts'
import { ItemList } from './ItemList.tsx'

export function ItemPage() {
  const [items, setItems] = useState<Item[]>([])

  return (
    <div className="flex flex-col gap-4">
      <CardFilters allCards={allItems} setCards={setItems} type="item" />
      <ItemList items={items} />
    </div>
  )
}
