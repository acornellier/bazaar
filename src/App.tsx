import { useState } from 'react'
import { Button } from './components/Button.tsx'
import { ItemPage } from './components/ItemPage.tsx'
import { SkillPage } from './components/SkillPage.tsx'
import { MonsterList } from './components/MonsterList.tsx'

export function App() {
  const [page, setPage] = useState<'item' | 'skill' | 'monster'>('item')

  return (
    <div className="px-16 py-4 flex flex-col gap-2 mb-64">
      <div className="flex gap-2">
        <Button onClick={() => setPage('item')} active={page === 'item'}>
          Items
        </Button>
        <Button onClick={() => setPage('skill')} active={page === 'skill'}>
          Skills
        </Button>
        <Button onClick={() => setPage('monster')} active={page === 'monster'}>
          Monsters
        </Button>
      </div>
      {page === 'item' ? <ItemPage /> : page === 'skill' ? <SkillPage /> : <MonsterList />}
    </div>
  )
}
