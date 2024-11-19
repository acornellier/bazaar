import React, { memo, useState } from 'react'
import type { Item } from '../data/types.ts'
import { colors, getTierBg } from '../util/colors.ts'
import { PiArrowFatRightDuotone } from 'react-icons/pi'
import { ItemText } from './ItemText.tsx'
import { isDev } from '../util/isDev.ts'
import { getTierAttributes } from '../util/attributes.ts'
import { GiHeavyBullets } from 'react-icons/gi'

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

  const attributes = getTierAttributes(curTier, item.tiers)

  if (attributes.Multicast !== undefined && attributes.Multicast > 1) {
    actives.push(`Multicast: ${attributes.Multicast}`)
  }

  return (
    <div className="h-48 p-1 flex flex-col" style={{ aspectRatio: `${item.size}/2` }}>
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
        <div
          className={`absolute opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
                      transition-opacity duration-300
                      ${selected ? 'opacity-100 pointer-events-auto' : ''}`}
        >
          <div className="flex ml-1">
            {item.tags.map((tag) => (
              <div
                key={tag}
                className={`px-2 py-0.5 bg-[#2b1c0e] border border-b-0 border-amber-800 font-bold text-sm 
                            rounded-t-md text-outline ${colors.tag}`}
              >
                {tag.toUpperCase()}
              </div>
            ))}
          </div>
          <div
            className={`w-72 flex flex-col gap-1 bg-[#2b1c0e] rounded-md px-4 p-2 border-2 border-amber-900
                      text-amber-100`}
          >
            <div className="text-xl font-serif font-bold text-outline">{item.name}</div>
            <div className="flex gap-1 text-xs font-bold text-black">
              {item.tiers.map(({ tier }) => {
                const bgColor = tier === curTier ? getTierBg(tier) : 'bg-[#ca8d67] opacity-50'
                const borderColor = tier === curTier ? 'border-gray-300' : 'border-amber-700'
                return (
                  <div
                    key={tier}
                    className={`cursor-pointer rounded-sm p-0.5 ${bgColor} border ${borderColor}`}
                    onClick={() => setCurTier(tier)}
                  >
                    {tier}
                  </div>
                )
              })}
            </div>
            <div className="bg-amber-900 h-0.5 my-1" />
            {actives.length > 0 && (
              <div className="relative text-sm text-outline">
                <div className="ml-4">
                  {actives.map((text, idx) => (
                    <div key={idx} className="flex gap-1">
                      <div className="pt-[3px]">
                        <PiArrowFatRightDuotone fill="black" className="active-arrow" size={16} />
                      </div>
                      <ItemText item={item} tooltip={text} tier={curTier} />
                    </div>
                  ))}
                </div>
                {attributes.CooldownMax && (
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-[75%]">
                    <div
                      className="flex items-center justify-center w-16 h-16 bg-contain bg-no-repeat"
                      style={{
                        backgroundImage: `url(/images/cooldown_clock.png)`,
                      }}
                    >
                      <div
                        className={`text-center leading-3 font-extrabold text-white -translate-x-[3px] translate-y-[1px]
                                  font-serif ${attributes.CooldownMax >= 10000 ? 'text-xl' : 'text-2xl'}`}
                      >
                        {(attributes.CooldownMax / 1000).toFixed(1)}
                        <br />
                        <span className="text-[10px] text-[#e1a35a] font-black">SEC</span>
                      </div>
                    </div>
                  </div>
                )}
                {attributes.AmmoMax && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[100%]">
                    <div
                      className={`bg-[#2b1c0e] border border-amber-800 rounded-sm p-1 
                                  flex flex-col items-center justify-center ${colors.ammo}`}
                    >
                      <GiHeavyBullets size={18} />
                      <span className="text-xl font-bold font-serif">{attributes.AmmoMax}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            {passives.length > 0 && actives.length > 0 && <div className="bg-amber-900 h-0.5" />}
            {passives.length > 0 && (
              <div className="text-sm text-outline">
                {passives.map((text, idx) => (
                  <div key={idx}>
                    <ItemText item={item} tooltip={text} tier={curTier} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const ItemComponent = memo(ItemComponentNoMemo)
