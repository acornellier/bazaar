import React, { memo, useState } from 'react'
import type { Item } from '../data/types.ts'
import { getTierBg } from '../util/colors.ts'
import { PiArrowFatRightDuotone } from 'react-icons/pi'
import { ItemText } from './ItemText.tsx'
import { isDev } from '../util/isDev.ts'
import { getAttributeValue } from '../util/attributes.ts'

interface Props {
  item: Item
}

function ItemComponentNoMemo({ item }: Props) {
  const [selected, setSelected] = useState(false)
  const [curTier, setCurTier] = useState(item.tiers[0]!.tier)
  const curTierData = item.tiers.find((tierData) => tierData.tier === curTier)

  const tooltips = item.tooltips.filter((_, idx) => curTierData?.TooltipIds.includes(idx))
  const passives = tooltips.filter(({ type }) => type === 'Passive').map(({ text }) => text)
  const actives = tooltips.filter(({ type }) => type === 'Active').map(({ text }) => text)

  const multicastValue = getAttributeValue('Multicast', curTier, item.tiers)
  if (multicastValue !== null && multicastValue > 1) {
    actives.push(`Multicast: ${multicastValue}`)
  }

  const cooldown = getAttributeValue('CooldownMax', curTier, item.tiers)

  return (
    <div className="h-48 p-1 flex flex-col text-outline" style={{ aspectRatio: `${item.size}/2` }}>
      <div
        className={`group relative h-full transition-transform hover:scale-125 hover:z-10 
                    ${selected ? 'scale-125 z-10' : ''}`}
        onClick={() => isDev && setSelected((val) => !val)}
      >
        <div
          className="absolute top-0 h-full w-full object-fill bg-repeat-round rounded-md"
          style={{
            backgroundImage: `url(/images/card-frames/frame_${curTier.toLowerCase()}_${item.size}.png)`,
          }}
        />
        <div
          className="h-full w-full object-fill bg-repeat-round rounded-2xl"
          style={{
            backgroundImage: `url(/images/cards/${item.id}.jpg)`,
          }}
        />
        <div
          className={`absolute w-72 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
                      transition-opacity duration-300
                      flex flex-col gap-1 bg-[#2b1c0e] rounded-md px-4 p-2 border border-gray-400
                      text-amber-100
                      ${selected ? 'opacity-100 pointer-events-auto' : ''}`}
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
            <div className="relative">
              <div className="ml-4">
                {actives.map((text, idx) => (
                  <div key={idx} className="flex gap-1">
                    <div className="pt-[3px]">
                      <PiArrowFatRightDuotone fill="#69553a" color="blue" size={16} />
                    </div>
                    <ItemText item={item} tooltip={text} tier={curTier} />
                  </div>
                ))}
              </div>
              {cooldown && (
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-[75%]">
                  <div
                    className="flex items-center justify-center w-16 h-16 bg-contain bg-no-repeat"
                    style={{
                      backgroundImage: `url(/images/cooldown_clock.png)`,
                    }}
                  >
                    <div className="text-center leading-3 text-2xl font-extrabold text-white -translate-x-[3px] translate-y-[1px]">
                      {(cooldown / 1000).toFixed(1)}
                      <br />
                      <span className="text-[10px] text-[#e1a35a] font-black">SEC</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {passives.length > 0 && actives.length > 0 && <div className="bg-gray-500 h-0.5" />}
            {passives.map((text, idx) => (
              <div key={idx}>
                <ItemText item={item} tooltip={text} tier={curTier} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const ItemComponent = memo(ItemComponentNoMemo)
