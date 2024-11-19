import { useCallback, useState } from 'react'

export function useSetState<T>() {
  const [items, setItems] = useState<Set<T>>(new Set())

  const toggleItem = useCallback((item: T) => {
    setItems((prev) => {
      if (prev.delete(item)) {
        return new Set(prev)
      } else {
        return new Set(prev.add(item))
      }
    })
  }, [])

  return [items, toggleItem] as const
}
