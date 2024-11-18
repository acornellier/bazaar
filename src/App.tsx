import React, { useMemo, useState } from 'react'
import { items } from './data/items.ts'
import { useDebounce } from './util/hooks/useDebounce.ts'
import { ItemComponent } from './components/Item.tsx'

export function App() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 100)

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.texts.some((text) => text.toLowerCase().includes(debouncedSearch)),
    )
  }, [items, debouncedSearch])

  return (
    <div className="flex flex-col gap-2 p-16">
      <input
        type="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="text-black rounded-sm p-0.5"
      />
      <div className="flex gap-2 flex-wrap">
        {filteredItems.map((item) => (
          <ItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
