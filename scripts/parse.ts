﻿import fs from 'fs'
import { getDirname } from './files.ts'
import { glob } from 'glob'
import yaml from 'js-yaml'
import path from 'path'
import nodeCmd from 'node-cmd'
import type {
  Ability,
  ActionType,
  Attribute,
  Card,
  Item,
  Monster,
  Skill,
  Tier,
  Tooltip,
} from '../src/data/types.ts'
import type { Tag } from '../src/data/tags.ts'
import type { Hero } from '../src/data/heroes.ts'

const dirname = getDirname(import.meta.url)
const exportDir = `${dirname}/../export`
const magickExe = 'M:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI\\magick.exe'

interface CardAsset {
  MonoBehaviour: {
    m_Name: string
    cardMaterial: { guid: string }
    cardGUID: string
    '<Name>k__BackingField': string
  }
}

interface MatAsset {
  Material: {
    m_Name: string
  }
}

interface MatMeta {
  guid: string
}

interface CardDataAbility {
  Id: string
  InternalDescription: string
  Priority: 'High' | 'Medium' | 'Low'
  TranslationKey: string
  Action: {
    $type: ActionType
    AttributeType: string
    Value: {
      $type: 'TFixedValue' | string
      Value: number
      AttributeType?: Attribute
      Modifier?: {
        Value: number
      }
    }
    SpawnContext: {
      Limit: {
        $type: 'TFixedValue'
        Value: number
      }
    }
  }
}

interface CardData {
  Id: string
  ArtKey: string
  Type:
    | 'Item'
    | 'Skill'
    | 'CombatEncounter'
    | 'PedestalEncounter'
    | 'EventEncounter'
    | 'EncounterStep'
  InternalName: string
  Size: 'Small' | 'Medium' | 'Large'
  Heroes: string[]
  Tags: string[]
  HiddenTags: string[]
  Tiers: Record<
    Tier,
    {
      Attributes: Record<string, number>
      TooltipIds: string[]
    }
  >
  Abilities: Record<string, CardDataAbility>
  Auras: Record<string, CardDataAbility>
  Localization: {
    Title?: { Text: string }
    Tooltips: Array<{
      Content: { Key: string; Text: string }
      TooltipType: 'Active' | 'Passive'
    }>
  }
}

interface MonsterData {
  Id: string
  InternalName: string
  Player: {
    Attributes: {
      Prestige: number
      HealthMax: number
      Level: number
    }
    Hand: {
      Items: Array<{
        TemplateId: string
      }>
    }
    Skills: Array<{
      TemplateId: string
    }>
  }
}

const cardAssetFiles = await glob(`${exportDir}/Assets/TheBazaar/Art/Heroes/**/*_CardData.asset`)
const cardMatMetaFiles = await glob([
  `${exportDir}/**/CF_*.mat.meta`,
  `${exportDir}/**/PNG_*.mat.meta`,
])
const textureFiles = await glob([`${exportDir}/**/CF_*.png`, `${exportDir}/**/PNG_*.png`])
const skillImageFiles = await glob([
  `${exportDir}/Assets/TheBazaar/Art/UI/Skills/**/Icon_Skill_*.png`,
])
const allPngFiles = await glob([`${exportDir}/**/*.png`])

function parseDataFile<T>(file: string) {
  const cardDatasFileContents = fs.readFileSync(file).toString()
  return Object.values(JSON.parse(cardDatasFileContents) as Record<string, T>)
}

function parseCardDatas(file: string) {
  return parseDataFile<CardData>(file).filter(
    (card) => !card.InternalName.toLowerCase().includes('debug'),
  )
}

const cardDatas = [
  ...parseCardDatas(`${exportDir}/v2_Cards_Derived.json`),
  ...parseCardDatas(`${exportDir}/v2_Cards.json`),
].filter((card) => card.Type === 'Item' || card.Type === 'Skill')

const monsterDatas = parseDataFile<MonsterData>(`${exportDir}/v2_Monsters.json`)

function loadYamlFile<T>(file: string) {
  const cardAssetFileContents = fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter((line) => !line.includes('%YAML') && !line.includes('!u!'))
    .join('\n')

  return yaml.load(cardAssetFileContents) as T
}

const matGuidToMatName: Record<string, string> = {}

for (const matMetaFile of cardMatMetaFiles) {
  const matMeta = loadYamlFile<MatMeta>(matMetaFile)
  const matAsset = loadYamlFile<MatAsset>(matMetaFile.replace('.meta', '')).Material
  matGuidToMatName[matMeta.guid] = matAsset.m_Name
}

fs.mkdirSync(`${dirname}/../public/images/cards`, { recursive: true })

function parseTexts(itemData: CardData): Tooltip[] {
  return itemData.Localization.Tooltips.map(({ Content, TooltipType }) => ({
    text: Content.Text,
    type: TooltipType,
  }))
}

function parseAbilities(abilities: Record<string, CardDataAbility>): Ability[] {
  return Object.entries(abilities).map(([id, ability]) => ({
    Id: id,
    Action: {
      $type: ability.Action.$type,
      AttributeType: ability.Action.AttributeType as Attribute,
      ...(ability.Action.Value
        ? {
            Value: {
              $type: ability.Action.Value.$type,
              Value: ability.Action.Value.Value,
              AttributeType: ability.Action.Value.AttributeType,
              Modifier: ability.Action.Value.Modifier,
            },
          }
        : undefined),
      ...(ability.Action.SpawnContext
        ? {
            SpawnContext: {
              Limit: ability.Action.SpawnContext.Limit,
            },
          }
        : undefined),
    },
  }))
}

function parseCard(cardData: CardData, id: string): Card | null {
  if (
    cardData.Localization.Tooltips.length === 0 ||
    cardData.Localization.Tooltips.some((tooltip) => !tooltip.Content)
  ) {
    // console.error(`Tooltips missing for ${cardData.InternalName}`)
    return null
  }

  return {
    id,
    name: cardData.Localization.Title?.Text ?? cardData.InternalName,
    size: cardData.Size === 'Small' ? 1 : cardData.Size === 'Medium' ? 2 : 3,
    heroes: cardData.Heroes as Hero[],
    tags: cardData.Tags as Tag[],
    hiddenTags: cardData.HiddenTags as Tag[],
    tooltips: parseTexts(cardData),
    abilities: parseAbilities(cardData.Abilities),
    auras: parseAbilities(cardData.Auras),
    tiers: Object.entries(cardData.Tiers).map(([tier, tierData]) => ({
      tier: tier as Tier,
      attributes: tierData.Attributes,
      TooltipIds: tierData.TooltipIds.map((id) => Number(id)),
    })),
  }
}

let potentialItems = 0

const items: Item[] = []
const usedIds = new Set()

for (const cardAssetFile of cardAssetFiles) {
  const cardAsset = loadYamlFile<CardAsset>(cardAssetFile).MonoBehaviour

  const id = cardAsset.cardGUID?.replaceAll('"', '')
  if (!id) continue
  if (usedIds.has(id)) continue
  usedIds.add(id)

  const internalName = cardAsset['<Name>k__BackingField']

  potentialItems += 1

  const cardData = cardDatas.find(
    (data) => data.Id === id || data.InternalName === internalName || data.ArtKey === id,
  )
  if (!cardData) {
    console.error(
      `Item data not found for ${path.basename(cardAssetFile)} with id ${id} or name ${internalName}`,
    )
    continue
  }

  const card = parseCard(cardData, id)
  if (card === null) continue

  const matName = matGuidToMatName[cardAsset.cardMaterial.guid]
  const imageFileName = new RegExp(`${matName}(_D)?.png`.toLowerCase())

  const backupImageName = cardData.InternalName.replaceAll(' ', '').toLowerCase()
  const backupFileName1 = new RegExp(`\\\\${backupImageName}.*.png`, 'i')
  const backupFileName2 = new RegExp(`${backupImageName}.*.png`, 'i')

  const imageFile =
    textureFiles.find((file) => matName && file.toLowerCase().match(imageFileName)) ??
    allPngFiles.find(
      (file) => file.match(backupFileName1) && !file.toLowerCase().includes('mask'),
    ) ??
    allPngFiles.find((file) => file.match(backupFileName2) && !file.toLowerCase().includes('mask'))

  if (!imageFile) {
    console.error(
      `Image data not found for item ${cardData.InternalName}, searched for "${imageFileName}" and "${backupFileName1}`,
    )
    continue
  }

  const outFile = `${dirname}/../public/images/cards/${id}.jpg`
  if (!fs.existsSync(outFile)) {
    console.log(`Copying image ${items.length} ${imageFile} to ${outFile}`)
    fs.copyFileSync(imageFile, outFile)
    const command = `"${magickExe}" "${outFile}" -alpha off -background white -flatten -quality 60 -resize 512x512 "${outFile}"`
    nodeCmd.runSync(command)
  }

  items.push(card)
}

let potentialSkills = 0

const skills: Skill[] = []
for (const cardData of cardDatas) {
  if (cardData.Type !== 'Skill') continue

  const id = cardData.Id
  if (!id) continue
  if (usedIds.has(id)) continue
  usedIds.add(id)

  potentialSkills += 1

  if (cardData.ArtKey.includes('Placeholder')) continue

  const card = parseCard(cardData, id)
  if (card === null) continue

  const imageFile = skillImageFiles.find((file) => file.includes(cardData.ArtKey))

  if (!imageFile) {
    console.error(`Image data not found for skill ${cardData.InternalName}`)
    continue
  }

  const outFile = `${dirname}/../public/images/cards/${id}.jpg`
  if (!fs.existsSync(outFile)) {
    console.log(`Copying image ${skills.length} ${imageFile} to ${outFile}`)
    fs.copyFileSync(imageFile, outFile)
    const command = `"${magickExe}" "${outFile}" -quality 60 -resize 256x256 "${outFile}"`
    nodeCmd.runSync(command)
  }

  skills.push(card)
}

let potentialMonsters = 0

const badMonsterName = /(Battle_?Player|\[|\])/
const monsters: Monster[] = []
for (const data of monsterDatas) {
  if (data.InternalName.match(badMonsterName)) continue

  potentialMonsters += 1

  const simpleName = data.InternalName.replaceAll(' ', '')
  const imageName1 = `Monster_${simpleName}_Portrait.png`.toLowerCase()
  const imageName2 = `ENC_Monster_${simpleName}_Char.png`.toLowerCase()
  const imageFile = allPngFiles.find(
    (file) => file.toLowerCase().includes(imageName1) || file.toLowerCase().includes(imageName2),
  )

  if (!imageFile) {
    // console.error(`Image data not found for monster ${data.InternalName}`)
    continue
  }

  const outFile = `${dirname}/../public/images/monsters/${data.Id}.png`
  if (!fs.existsSync(outFile)) {
    console.log(`Copying image ${monsters.length} ${imageFile} to ${outFile}`)
    fs.copyFileSync(imageFile, outFile)
    const command = `"${magickExe}" "${outFile}" -resize 256x256 "${outFile}"`
    nodeCmd.runSync(command)
  }

  monsters.push({
    id: data.Id,
    name: data.InternalName,
    health: data.Player.Attributes.HealthMax,
    level: data.Player.Attributes.Level,
    items: data.Player.Hand.Items.map((item) => item.TemplateId),
    skills: data.Player.Skills.map((item) => item.TemplateId),
  })
}

fs.writeFileSync(`${dirname}/../src/data/items.json`, JSON.stringify(items))
console.log(`Parsed ${items.length}/${potentialItems} items`)

fs.writeFileSync(`${dirname}/../src/data/skills.json`, JSON.stringify(skills))
console.log(`Parsed ${skills.length}/${potentialSkills} skills`)

fs.writeFileSync(`${dirname}/../src/data/monsters.json`, JSON.stringify(monsters))
console.log(`Parsed ${monsters.length}/${potentialMonsters} monsters`)
