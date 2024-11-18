import { type ActionTypeModifier, type Item, type Tier } from '../data/types.ts'
import { getActionTypeModifiers, getAttributeData } from '../util/attributes.ts'
import { getKeyword, keywordColors, keywords } from '../data/keywords.ts'

interface Props {
  item: Item
  text: string
  tier: Tier
}

const specialTextRegex = new RegExp(`(\{ability\..*\}|${keywords.join('|')})`, 'i')

interface SectionTextProps extends Props {
  section: string
}

function SectionText({ item, tier, section }: SectionTextProps) {
  if (!section.match(specialTextRegex)) return section

  if (!section.startsWith('{')) {
    const keyword = getKeyword(section)
    if (!keyword) return section

    return <span className={`${keywordColors[keyword]}`}>{keyword}</span>
  }

  const abilityMatch = section.match(/\{ability\.(\d)\.?(\w+)?\}/)

  if (abilityMatch === null) {
    console.error(`Variable does not match regex: ${section}`)
    return section
  }

  const abilityIndex = Number(abilityMatch[1]!)
  const ability = item.abilities[abilityIndex]

  if (!ability) {
    console.error(`Ability index ${abilityIndex} does not exist for item ${item.name}`)
    return section
  }

  if (ability.Action.Value?.$type === 'TFixedValue') {
    return <span>{ability.Action.Value.Value}</span>
  }

  if (ability.Action.SpawnContext?.Limit.$type === 'TFixedValue') {
    return <span>{ability.Action.SpawnContext?.Limit.Value}</span>
  }

  const actionTypeModifiers = getActionTypeModifiers(ability.Action.$type)
  const modifier = (abilityMatch[2] ?? 'empty') as ActionTypeModifier

  const attribute = actionTypeModifiers[modifier]
  if (!attribute) {
    // console.error(
    //   `Modifier ${modifier} missing for action ${ability.Action.$type} from "${section}" in "${ability.description}`,
    // )
    return section
  }

  const attributeData = getAttributeData(attribute, tier, item.tiers)
  if (!attributeData) {
    console.error(`Item "${item.name}" attribute ${attribute} data not found`)
    return section
  }

  const { value, formatting } = attributeData
  const formattedValue = formatting?.ms ? value / 1000 : value
  const size = modifier !== 'targets' ? 'text-lg' : ''
  return (
    <span className={`${formatting?.color}`}>
      {formatting?.Icon && <formatting.Icon className="inline-block mr-0.5 mb-1" size={20} />}
      <span className={`${size} leading-4`}>{formattedValue}</span>
    </span>
  )
}

export function ItemText({ item, text, tier }: Props) {
  const sections = text.split(specialTextRegex).filter(Boolean)

  return (
    <span>
      {sections.map((section, idx) => (
        <span key={idx} className="font-bold">
          <SectionText item={item} text={text} tier={tier} section={section} />
        </span>
      ))}
    </span>
  )
}
