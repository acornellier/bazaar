import React, { memo, useState } from 'react'
import type { Item } from '../data/types.ts'
import { getTierBg } from '../util/colors.ts'
import { PiArrowFatRightDuotone } from 'react-icons/pi'
import { ItemText } from './ItemText.tsx'

interface Props {
  item: Item
}

function ItemComponentNoMemo({ item }: Props) {
  const [selected, setSelected] = useState(false)
  const [curTier, setCurTier] = useState(item.tiers[0]!.tier)

  return (
    <div className="h-48 p-1 flex flex-col text-outline" style={{ aspectRatio: `${item.size}/2` }}>
      <div
        className={`group relative h-full transition-transform hover:scale-125 hover:z-10 
                    ${selected ? 'scale-125 z-10' : ''}`}
        onClick={() => setSelected((val) => !val)}
      >
        <div
          className="absolute top-0 h-full w-full object-fill bg-repeat-round rounded-md"
          style={{
            backgroundImage: `url(/images/card-frames/frame_bronze_${item.size}.png)`,
          }}
        />
        <div
          className="h-full w-full object-fill bg-repeat-round rounded-2xl"
          style={{
            backgroundImage: `url(/images/cards/${item.id}.jpg)`,
          }}
        />
        <div
          className={`absolute w-72 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      flex flex-col gap-1 bg-[#2b1c0e] rounded-md px-4 p-2 border border-gray-400
                      text-amber-100
                      ${selected ? 'opacity-100' : ''}`}
        >
          <div className="text-xl">{item.name}</div>
          <div className="flex gap-1 text-xs">
            {item.tiers.map(({ tier }) => {
              const bgColor = tier === curTier ? getTierBg(tier) : 'bg-amber-900 opacity-70'
              return (
                <div
                  key={tier}
                  className={`cursor-pointer rounded-sm p-0.5 ${bgColor}`}
                  onClick={() => setCurTier(tier)}
                >
                  {tier}
                </div>
              )
            })}
          </div>
          <div className="flex flex-col gap-1 text-sm">
            {item.texts.map((text, idx) => (
              <div key={idx} className="flex gap-1">
                <div className="pt-[3px]">
                  <PiArrowFatRightDuotone fill="#69553a" size={16} />
                </div>
                <ItemText item={item} text={text} tier={curTier} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const ItemComponent = memo(ItemComponentNoMemo)
