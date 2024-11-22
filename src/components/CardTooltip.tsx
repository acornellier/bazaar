import { colors, getTierBg } from '../util/colors.ts'
import { PiArrowFatRightDuotone } from 'react-icons/pi'
import { CardText } from './CardText.tsx'
import { GiHeavyBullets } from 'react-icons/gi'
import type { Attributes, CardType, Item, Tier } from '../data/types.ts'
import { useEffect, useRef, useState } from 'react'

interface Props {
  item: Item
  selected?: boolean
  attributes: Attributes
  curTier: Tier
  setCurTier: (tier: Tier) => void
  type: CardType
}

interface TooltipPosition {
  x: 'left' | 'right'
  y: 'top' | 'bottom'
}

export function CardTooltip({ item, selected, attributes, curTier, setCurTier, type }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<TooltipPosition | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = rect.right + 70 > window.innerWidth ? 'right' : 'left'
    const y = rect.bottom + 70 > window.innerHeight ? 'top' : 'bottom'
    setPosition({ x, y })
  }, [])

  const curTierData = item.tiers.find((tierData) => tierData.tier === curTier)

  const tooltips = item.tooltips.filter((_, idx) => curTierData?.TooltipIds.includes(idx))
  const passives = tooltips.filter(({ type }) => type === 'Passive').map(({ text }) => text)
  const actives = tooltips.filter(({ type }) => type === 'Active').map(({ text }) => text)

  if (attributes.Multicast !== undefined && attributes.Multicast > 1) {
    actives.push(`Multicast: ${attributes.Multicast}`)
  }

  return (
    <div
      ref={ref}
      className={`absolute opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
                  transition-opacity duration-300 z-50
                  ${position === null ? 'invisible' : ''}
                  ${position?.x === 'right' ? 'right-0' : ''} ${position?.y === 'top' ? 'bottom-full' : ''}
                  ${selected ? 'opacity-100 pointer-events-auto' : ''}`}
    >
      {type === 'item' && (
        <div className="flex ml-1">
          {item.tags.map((tag) => (
            <div
              key={tag}
              className={`px-2 py-0.5 bg-[#1c0d03] border border-b-0 border-amber-800 font-bold text-sm 
                        rounded-t-md text-outline ${colors.tag}`}
            >
              {tag.toUpperCase()}
            </div>
          ))}
        </div>
      )}
      <div
        className={`w-72 flex flex-col gap-1 rounded-md px-4 p-2 border-2 border-amber-900
                  text-amber-100`}
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(19, 9, 2), rgb(47, 22, 7), rgb(19, 9, 2))',
        }}
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
                  <CardText item={item} tooltip={text} tier={curTier} />
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
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[105%]">
                <div
                  className={`bg-[#1c0d03] border border-amber-800 rounded-md p-1 
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
                <CardText item={item} tooltip={text} tier={curTier} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
