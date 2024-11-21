import { memo, useState } from 'react'
import type { CardType, Item } from '../data/types.ts'
import { isDev } from '../util/isDev.ts'
import { getTierAttributes } from '../util/attributes.ts'
import { ItemTooltip } from './ItemTooltip.tsx'

interface Props {
  item: Item
  hovered: boolean
  setHoveredItemId: (id: string | null) => void
  type: CardType
}

function ItemComponentNoMemo({ item, hovered, setHoveredItemId, type }: Props) {
  const [selected, setSelected] = useState(false)
  const [curTier, setCurTier] = useState(item.tiers[0]!.tier)

  const attributes = getTierAttributes(curTier, item.tiers)

  const sizeClass = type === 'item' ? 'h-48' : 'h-32'

  const frameImage =
    type === 'item'
      ? `frame_${curTier.toLowerCase()}_${item.size}.png`
      : `skill_frame_${curTier.toLowerCase()}_3.png`

  const roundFrameClass = type === 'skill' ? 'rounded-full overflow-hidden' : ''

  const priceTagClass =
    type === 'item'
      ? 'h-6 w-12 bottom-4 -left-3 -rotate-12 text-xl'
      : 'h-5 w-10 top-1 left-1/2 -translate-x-1/2'

  return (
    <div className={`${sizeClass} flex flex-col`} style={{ aspectRatio: `${item.size}/2` }}>
      <div
        className={`group relative h-full transition-transform hover:scale-125 hover:z-10 ${selected ? 'z-50 scale-125' : ''}`}
        onClick={() => isDev && setSelected((val) => !val)}
        onMouseOver={() => setHoveredItemId(item.id)}
        onMouseOut={() => setHoveredItemId(null)}
      >
        <div className={`h-full ${roundFrameClass}`}>
          <div className={`h-full ${type === 'skill' ? 'scale-75' : ''} ${roundFrameClass}`}>
            <div
              className={`relative h-full object-fill bg-repeat-round rounded-2xl`}
              style={{
                backgroundImage: `url(/images/cards/${item.id}.jpg)`,
              }}
            />
          </div>
          <div
            className="absolute top-0 h-full w-full object-fill bg-repeat-round rounded-md z-0"
            style={{
              backgroundImage: `url(/images/card-frames/${frameImage})`,
            }}
          />
          <div
            className={`absolute object-fill bg-repeat-round rounded-2xl
                     flex items-center justify-center font-serif font-bold text-outline
                     ${priceTagClass}`}
            style={{
              backgroundImage: `url(/images/price_tag.png)`,
            }}
          >
            <span>{attributes.BuyPrice}</span>
          </div>
        </div>
        {(hovered || selected) && (
          <ItemTooltip
            item={item}
            selected={selected}
            attributes={attributes}
            curTier={curTier}
            setCurTier={setCurTier}
            type={type}
          />
        )}
      </div>
    </div>
  )
}

export const ItemComponent = memo(ItemComponentNoMemo)
