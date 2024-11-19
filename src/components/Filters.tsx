import type { Item } from '../data/types.ts'
import { type Tag, tags } from '../data/tags.ts'
import { allItems } from '../data/items.ts'
import React, { useEffect, useMemo, useState } from 'react'
import { useDebounce } from '../util/hooks/useDebounce.ts'
import { useSetState } from '../util/hooks/useSetState.ts'
import { type Hero, heroes } from '../data/heroes.ts'

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
    <div className="flex flex-col gap-2">
      <input
        type="search"
        placeholder={`Search ${filteredItems.length} items...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="text-black rounded-sm p-0.5"
      />
      <div className="flex flex-wrap gap-2">
        {heroes.map((hero) => (
          <div key={hero} className="flex items-center">
            <input
              id={`filter-tag--${hero}`}
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={selectedHeroes.has(hero)}
              onChange={() => toggleHero(hero)}
            />
            <label
              htmlFor={`filter-hero-${hero}`}
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {hero}
            </label>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div key={tag} className="flex items-center">
            <input
              id={`filter-tag--${tag}`}
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={selectedTags.has(tag)}
              onChange={() => toggleTag(tag)}
            />
            <label
              htmlFor={`filter-tag-${tag}`}
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {tag}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
