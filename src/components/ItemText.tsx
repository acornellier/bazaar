import { type ActionTypeModifier, type Item, type Tier } from '../data/types.ts'
import { getAttributeData } from '../util/attributes.ts'
import { getTag, tagColors, tags } from '../data/tags.ts'

interface Props {
  item: Item
  tooltip: string
  tier: Tier
}

const specialTextRegex = new RegExp(
  `(\\[?\{(?:ability|aura)\..*?\}\\]?|${tags.map((tag) => `\\b${tag}\\b`).join('|')})`,
  'gi',
)

const buggedItems = ['Spices', 'Mothmeal']

interface SectionTextProps extends Props {
  section: string
}

function SectionText({ item, tier, section }: SectionTextProps) {
  if (!section.match(specialTextRegex)) return section

  if (!section.startsWith('{')) {
    const tag = getTag(section)
    if (!tag) return section

    return <span className={`${tagColors[tag]}`}>{tag}</span>
  }

  const abilityMatch = section.match(/\{(ability|aura)\.(\d)\.?(\w+)?(\|%)?\}/)

  if (abilityMatch === null) {
    console.error(`Variable does not match regex: ${section}`)
    return section
  }

  if (buggedItems.includes(item.name)) return section

  const type = abilityMatch[1] as 'ability' | 'aura'
  const abilityId = abilityMatch[2]
  const array = type === 'ability' ? item.abilities : item.auras
  const ability = array.find(({ Id }) => Id === abilityId)

  if (!ability) {
    console.error(`${type}.${abilityId} does not exist for item ${item.name}`)
    return section
  }

  if (ability.Action.Value?.$type === 'TFixedValue') {
    return <span>{ability.Action.Value.Value}</span>
  }

  if (ability.Action.SpawnContext?.Limit.$type === 'TFixedValue') {
    return <span>{ability.Action.SpawnContext?.Limit.Value}</span>
  }

  const modifier = (abilityMatch[3] ?? 'empty') as ActionTypeModifier

  const attributeData = getAttributeData(ability, modifier, tier, item.tiers)
  if (!attributeData) {
    console.error(
      `Item "${item.name}" ability ${section} modifier "${modifier}" missing attribute data`,
    )
    return section
  }

  const { value, formatting } = attributeData
  const formattedValue = formatting?.ms ? value / 1000 : value
  const size = modifier !== 'targets' ? 'text-lg' : ''
  return (
    <span className={`${formatting?.color}`}>
      {formatting?.Icon && <formatting.Icon className="inline-block mr-0.5 mb-1" size={20} />}
      <span className={`${size} leading-4 font-serif`}>{formattedValue}</span>
    </span>
  )
}

export function ItemText({ item, tooltip, tier }: Props) {
  const sections = tooltip.split(specialTextRegex).filter(Boolean)

  return (
    <span>
      {sections
        .filter((section) => !section.startsWith('['))
        .map((section, idx) => (
          <span key={idx} className="font-bold">
            <SectionText item={item} tooltip={tooltip} tier={tier} section={section} />
          </span>
        ))}
    </span>
  )
}
