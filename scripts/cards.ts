import fs from 'fs'
import { getDirname } from './files.ts'
import { glob } from 'glob'
import yaml from 'js-yaml'
import path from 'path'
import nodeCmd from 'node-cmd'
import type { ActionType, Item, Tier } from '../src/data/types.ts'

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
  InternalDescription: string
  Priority: 'High' | 'Medium' | 'Low'
  TranslationKey: string
  Action: {
    $type: ActionType
  }
}

interface CardData {
  Id: string
  ArtKey: string
  Type:
    | 'Item'
    | 'Skill'
    | 'PedestalEncounter'
    | 'EventEncounter'
    | 'EncounterStep'
    | 'CombatEncounter'
  InternalName: string
  Size: 'Small' | 'Medium' | 'Large'
  Heroes: string[]
  Tags: string[]
  Tiers: Record<
    Tier,
    {
      Attributes: Record<string, number>
    }
  >
  Abilities: Record<string, CardDataAbility>
  Localization: {
    Title?: { Text: string }
    Tooltips: Array<{
      Content: { Key: string; Text: string }
    }>
  }
}

const cardAssetFiles = await glob(`${exportDir}/Assets/TheBazaar/Art/Heroes/**/*_CardData.asset`)
const cardMatMetaFiles = await glob([
  `${exportDir}/**/CF_*.mat.meta`,
  `${exportDir}/**/PNG_*.mat.meta`,
])
const textureFiles = await glob([`${exportDir}/**/CF_*.png`, `${exportDir}/**/PNG_*.png`])
const allPngFiles = await glob([`${exportDir}/**/*.png`])

function parseCardDatas(file: string) {
  const cardDatasFileContents = fs.readFileSync(file).toString()
  return Object.values(JSON.parse(cardDatasFileContents) as Record<string, CardData>).filter(
    (card) => !card.InternalName.toLowerCase().includes('debug'),
  )
}

const cardDatas = [
  ...parseCardDatas(`${exportDir}/v2_Cards_Derived.json`),
  ...parseCardDatas(`${exportDir}/v2_Cards.json`),
]

let found = 0
let potential = 0

const itemDatas = cardDatas.filter((card) => card.Type === 'Item')

function loadYamlFile<T>(file: string) {
  const cardAssetFileContents = fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter((line) => !line.includes('%YAML') && !line.includes('!u!'))
    .join('\n')

  return yaml.load(cardAssetFileContents) as T
}

let matGuidToMatName: Record<string, string> = {}

for (const matMetaFile of cardMatMetaFiles) {
  const matMeta = loadYamlFile<MatMeta>(matMetaFile)
  const matAsset = loadYamlFile<MatAsset>(matMetaFile.replace('.meta', '')).Material
  matGuidToMatName[matMeta.guid] = matAsset.m_Name
}

let items: Item[] = []
let usedIds = new Set()

fs.mkdirSync(`${dirname}/../public/images/cards`, { recursive: true })

function parseTexts(itemData: CardData) {
  let usedKeys = new Set<string>()
  let texts: string[] = []
  for (const { Content } of itemData.Localization.Tooltips) {
    if (usedKeys.has(Content.Key)) continue
    usedKeys.add(Content.Key)
    texts.push(Content.Text)
  }
  return texts
}

for (const cardAssetFile of cardAssetFiles) {
  const cardAsset = loadYamlFile<CardAsset>(cardAssetFile).MonoBehaviour

  const id = cardAsset.cardGUID?.replaceAll('"', '')
  if (!id) continue
  if (usedIds.has(id)) continue
  usedIds.add(id)

  const internalName = cardAsset['<Name>k__BackingField']

  potential += 1

  const itemData = itemDatas.find(
    (data) => data.Id === id || data.InternalName === internalName || data.ArtKey === id,
  )
  if (!itemData) {
    console.error(
      `Item data not found for ${path.basename(cardAssetFile)} with id ${id} or name ${internalName}`,
    )
    continue
  }

  const matName = matGuidToMatName[cardAsset.cardMaterial.guid]
  const imageFileName = new RegExp(`${matName}(_D)?.png`.toLowerCase())

  const backupImageName = itemData.InternalName.replaceAll(' ', '').toLowerCase()
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
      `Image data not found for ${itemData.InternalName}, searched for "${imageFileName}" and "${backupFileName1}`,
    )
    continue
  }

  const outFile = `${dirname}/../public/images/cards/${id}.jpg`
  if (!fs.existsSync(outFile)) {
    console.log(`Copying image ${found} ${imageFile} to ${outFile}`)
    fs.copyFileSync(imageFile, outFile)
    const command = `"${magickExe}" "${outFile}" -alpha off -background white -flatten -quality 60 -resize 512x512 "${outFile}"`
    nodeCmd.runSync(command)
  }

  if (itemData.Localization.Tooltips.some((tooltip) => !tooltip.Content)) {
    console.error(`Tooltips missing for ${itemData.InternalName}`)
    continue
  }

  items.push({
    id,
    name: itemData.Localization.Title?.Text ?? itemData.InternalName,
    size: itemData.Size === 'Small' ? 1 : itemData.Size === 'Medium' ? 2 : 3,
    texts: parseTexts(itemData),
    abilities: Object.values(itemData.Abilities).map((ability) => ({ Action: ability.Action })),
    tiers: Object.entries(itemData.Tiers).map(([tier, tierData]) => ({
      tier: tier as Tier,
      attributes: tierData.Attributes,
    })),
  })

  found += 1
}

fs.writeFileSync(`${dirname}/../src/data/items.json`, JSON.stringify(items))
console.log(`Parsed ${found}/${potential} cards`)
