import { type Ability, type ActionTypeModifier, type Tier, type TierData } from '../data/types.ts'
import {
  type ActionTypeModifiers,
  getActionTypeModifiers,
  getAttributeData,
  keywordColors,
} from '../util/attributes.ts'
import { getKeyword, keywords } from '../data/keywords.ts'

interface Props {
  ability: Ability
  tier: Tier
  tiers: TierData[]
}

const specialTextRegex = new RegExp(`(\{.*?\}|${keywords.join('|')})`, 'i')

interface SectionTextProps extends Props {
  section: string
  actionTypeModifiers: ActionTypeModifiers
}

function SectionText({ ability, tier, tiers, section, actionTypeModifiers }: SectionTextProps) {
  if (!section.match(specialTextRegex)) return section

  if (!section.startsWith('{')) {
    const keyword = getKeyword(section)
    if (!keyword) return section

    return <span className={`${keywordColors[keyword]}`}>{keyword}</span>
  }

  const modifierMatch = section.match(/\{ability\.\d\.(\w+)\}/)
  const modifier = modifierMatch === null ? 'empty' : (modifierMatch[1] as ActionTypeModifier)

  if (ability.Action.Value?.$type === 'TFixedValue') {
    return <span>{ability.Action.Value.Value}</span>
  }

  const attribute = actionTypeModifiers[modifier]
  if (!attribute) {
    console.error(
      `Modifier ${modifier} missing for action ${ability.Action.$type} from "${section}" in "${ability.description}`,
    )
    return section
  }

  const attributeData = getAttributeData(attribute, tier, tiers)
  if (!attributeData) {
    console.error(`Attribute data not found for "${ability.description}"`)
    return section
  }

  const { value, formatting } = attributeData
  const formattedValue = formatting?.ms ? value / 1000 : value
  return (
    <span className={`${formatting?.color}`}>
      {formatting?.Icon && <formatting.Icon className="inline-block mr-0.5 mb-1" size={20} />}
      <span className="text-lg leading-4">{formattedValue}</span>
    </span>
  )
}

export function AbilityText({ ability, tier, tiers }: Props) {
  const actionTypeModifiers = getActionTypeModifiers(ability.Action.$type)
  const sections = ability.description.split(specialTextRegex).filter(Boolean)

  return (
    <span>
      {sections.map((section, idx) => (
        <span key={idx}>
          <SectionText
            ability={ability}
            tier={tier}
            tiers={tiers}
            section={section}
            actionTypeModifiers={actionTypeModifiers}
          />
        </span>
      ))}
    </span>
  )
}
