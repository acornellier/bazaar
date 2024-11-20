import React, { memo, useState } from 'react'
import type { Item } from '../data/types.ts'
import { isDev } from '../util/isDev.ts'
import { getTierAttributes } from '../util/attributes.ts'
import { ItemTooltip } from './ItemTooltip.tsx'

interface Props {
  item: Item
  hovered: boolean
  setHoveredItemId: (id: string | null) => void
}

function ItemComponentNoMemo({ item, hovered, setHoveredItemId }: Props) {
  const [selected, setSelected] = useState(false)
  const [curTier, setCurTier] = useState(item.tiers[0]!.tier)

  const attributes = getTierAttributes(curTier, item.tiers)

  return (
    <div className="h-48 p-1 flex flex-col" style={{ aspectRatio: `${item.size}/2` }}>
      <div
        className={`group relative h-full transition-transform hover:scale-125 hover:z-10 
                    ${selected ? 'scale-125 z-10' : ''}`}
        onClick={() => isDev && setSelected((val) => !val)}
        onMouseOver={() => setHoveredItemId(item.id)}
        onMouseOut={() => setHoveredItemId(null)}
      >
        <div
          className="absolute top-0 h-full w-full object-fill bg-repeat-round rounded-md"
          style={{
            backgroundImage: `url(/images/card-frames/frame_${curTier.toLowerCase()}_${item.size}.png)`,
          }}
        />
        <div
          className="absolute bottom-4 -left-3 h-6 w-12 object-fill bg-repeat-round rounded-2xl -rotate-12 
                     flex items-center justify-center text-xl font-serif font-bold text-outline"
          style={{
            backgroundImage: `url(/images/price_tag.png)`,
          }}
        >
          <span>{attributes.BuyPrice}</span>
        </div>
        <div
          className="h-full w-full object-fill bg-repeat-round rounded-2xl"
          style={{
            backgroundImage: `url(/images/cards/${item.id}.jpg)`,
          }}
        />
        {(hovered || selected) && (
          <ItemTooltip
            item={item}
            selected={selected}
            attributes={attributes}
            curTier={curTier}
            setCurTier={setCurTier}
          />
        )}
      </div>
    </div>
  )
}

export const ItemComponent = memo(ItemComponentNoMemo)
