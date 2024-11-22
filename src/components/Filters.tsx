import type { Card, CardType, Skill } from '../data/types.ts'
import { hiddenTags, type Tag, tagFormatting, tags } from '../data/tags.ts'
import { useEffect, useMemo, useState } from 'react'
import { useSetState } from '../util/hooks/useSetState.ts'
import { type Hero, heroes } from '../data/heroes.ts'
import { Checkbox } from './Checkbox.tsx'

interface Props {
  setCards: (items: Card[]) => void
  allCards: Skill[]
  type: CardType
}

export function Filters({ setCards, allCards, type }: Props) {
  const [search, setSearch] = useState('')

  const [selectedHeroes, toggleHero] = useSetState<Hero>(['Vanessa'])
  const [selectedTags, toggleTag] = useSetState<Tag>()

  const filteredItems = useMemo(() => {
    const finalSearch = search.toLowerCase()
    return allCards.filter((card) => {
      const allTags = new Set([...card.tags, ...card.hiddenTags])
      return (
        card.name.toLowerCase().includes(finalSearch) &&
        (selectedHeroes.size === 0 || selectedHeroes.intersection(new Set(card.heroes)).size) &&
        selectedTags.isSubsetOf(allTags)
      )
    })
  }, [allCards, search, selectedHeroes, selectedTags])

  useEffect(() => {
    setCards(filteredItems)
  }, [filteredItems, setCards])

  return (
    <div className="flex flex-col gap-2">
      <input
        type="search"
        placeholder={`Search ${filteredItems.length} items...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="fancy max-w-[300px]"
      />
      <div className="flex flex-wrap gap-1 items-center">
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
      {type === 'item' && (
        <div className="flex flex-wrap gap-1 items-center">
          <span className="font-bold min-w-20">Tags</span>
          {tags.map((tag) => (
            <Checkbox key={tag} checked={selectedTags.has(tag)} label={tag} toggle={toggleTag} />
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-1 items-center">
        <span className="font-bold min-w-20">Attributes</span>
        {hiddenTags.map((tag) => (
          <Checkbox
            key={tag}
            checked={selectedTags.has(tag)}
            label={tag}
            toggle={toggleTag}
            Icon={tagFormatting[tag].Icon}
            color={tagFormatting[tag].color}
          />
        ))}
      </div>
    </div>
  )
}
