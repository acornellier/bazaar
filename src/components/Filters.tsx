﻿import type { Item } from '../data/types.ts'
import { hiddenTags, type Tag, tags } from '../data/tags.ts'
import { allItems } from '../data/items.ts'
import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from '../util/hooks/useDebounce.ts'
import { useSetState } from '../util/hooks/useSetState.ts'
import { type Hero, heroes } from '../data/heroes.ts'
import { Checkbox } from './Checkbox.tsx'

interface Props {
  setItems: (items: Item[]) => void
}

export function Filters({ setItems }: Props) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 100)

  const [selectedHeroes, toggleHero] = useSetState<Hero>()
  const [selectedTags, toggleTag] = useSetState<Tag>()

  const filteredItems = useMemo(() => {
    const finalSearch = debouncedSearch.toLowerCase()
    return allItems.filter((item) => {
      const allTags = new Set([...item.tags, ...item.hiddenTags])
      return (
        item.name.toLowerCase().includes(finalSearch) &&
        selectedHeroes.isSubsetOf(new Set(item.heroes)) &&
        selectedTags.isSubsetOf(allTags)
      )
    })
  }, [debouncedSearch, selectedHeroes, selectedTags])

  useEffect(() => {
    setItems(filteredItems)
  }, [filteredItems, setItems])

  return (
    <div className="flex flex-col gap-4">
      <input
        type="search"
        placeholder={`Search ${filteredItems.length} items...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="text-black rounded-sm p-0.5"
      />
      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-bold min-w-20">Heroes</span>
        {heroes.map((hero) => (
          <Checkbox
            key={hero}
            checked={selectedHeroes.has(hero)}
            label={hero}
            toggle={toggleHero}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-bold min-w-20">Tags</span>
        {tags.map((tag) => (
          <Checkbox key={tag} checked={selectedTags.has(tag)} label={tag} toggle={toggleTag} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-bold min-w-20">Attributes</span>
        {hiddenTags.map((tag) => (
          <Checkbox key={tag} checked={selectedTags.has(tag)} label={tag} toggle={toggleTag} />
        ))}
      </div>
    </div>
  )
}
