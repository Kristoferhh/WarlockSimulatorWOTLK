import { Auras } from './data/Auras'
import { Enchants } from './data/Enchants'
import { Gems } from './data/Gems'
import { Items } from './data/Items'
import { Races } from './data/Races'
import { Sockets } from './data/Sockets'
import { TalentTreeStruct } from './data/Talents'
import {
  AuraId,
  GemColor,
  InitialPlayerStats,
  InitialSetCounts,
  Item,
  ItemSlot,
  ItemSlotDetailed,
  ItemSlotDetailedStruct,
  Languages,
  Pet,
  PlayerState,
  Quality,
  Race,
  SavedItemDps,
  SelectedGemsStruct,
  SetsStruct,
  Setting,
  Settings,
  SocketColor,
  SourcesStruct,
  Stat,
  StatConstant,
  StatsCollection,
  SubSlotValue,
  TalentStore,
} from './Types'

export function ItemSlotToItemSlotDetailed(
  itemSlot: ItemSlot,
  itemSubSlot?: string
): ItemSlotDetailed {
  switch (itemSlot) {
    case ItemSlot.Head:
      return ItemSlotDetailed.Head
    case ItemSlot.Neck:
      return ItemSlotDetailed.Neck
    case ItemSlot.Shoulders:
      return ItemSlotDetailed.Shoulders
    case ItemSlot.Back:
      return ItemSlotDetailed.Back
    case ItemSlot.Chest:
      return ItemSlotDetailed.Chest
    case ItemSlot.Wrist:
      return ItemSlotDetailed.Wrist
    case ItemSlot.Hands:
      return ItemSlotDetailed.Hands
    case ItemSlot.Waist:
      return ItemSlotDetailed.Waist
    case ItemSlot.Legs:
      return ItemSlotDetailed.Legs
    case ItemSlot.Feet:
      return ItemSlotDetailed.Feet
    case ItemSlot.Finger:
      return itemSubSlot === '1'
        ? ItemSlotDetailed.Finger1
        : ItemSlotDetailed.Finger2
    case ItemSlot.Trinket:
      return itemSubSlot === '1'
        ? ItemSlotDetailed.Trinket1
        : ItemSlotDetailed.Trinket2
    case ItemSlot.Weapon:
      return ItemSlotDetailed.Weapon
    case ItemSlot.OffHand:
      return ItemSlotDetailed.OffHand
    case ItemSlot.Wand:
      return ItemSlotDetailed.Wand
  }
}

export function ItemSlotDetailedToItemSlot(
  itemSlot: ItemSlotDetailed
): ItemSlot {
  switch (itemSlot) {
    case ItemSlotDetailed.Head:
      return ItemSlot.Head
    case ItemSlotDetailed.Neck:
      return ItemSlot.Neck
    case ItemSlotDetailed.Shoulders:
      return ItemSlot.Shoulders
    case ItemSlotDetailed.Back:
      return ItemSlot.Back
    case ItemSlotDetailed.Chest:
      return ItemSlot.Chest
    case ItemSlotDetailed.Wrist:
      return ItemSlot.Wrist
    case ItemSlotDetailed.Hands:
      return ItemSlot.Hands
    case ItemSlotDetailed.Waist:
      return ItemSlot.Waist
    case ItemSlotDetailed.Legs:
      return ItemSlot.Legs
    case ItemSlotDetailed.Feet:
      return ItemSlot.Feet
    case ItemSlotDetailed.Finger1:
      return ItemSlot.Finger
    case ItemSlotDetailed.Finger2:
      return ItemSlot.Finger
    case ItemSlotDetailed.Trinket1:
      return ItemSlot.Trinket
    case ItemSlotDetailed.Trinket2:
      return ItemSlot.Trinket
    case ItemSlotDetailed.Weapon:
      return ItemSlot.Weapon
    case ItemSlotDetailed.OffHand:
      return ItemSlot.OffHand
    case ItemSlotDetailed.Wand:
      return ItemSlot.Wand
  }
}

export function itemMeetsSocketRequirements(params: {
  itemId: number
  selectedGems?: SelectedGemsStruct
  socketArray?: number[]
}): boolean {
  let socketArray = params.socketArray

  // If the socketArray parameter is undefined then find the array using the selectedGems parameter instead
  if (
    socketArray === undefined &&
    params.selectedGems === undefined &&
    params.selectedGems
  ) {
    for (const itemSlotKey of Object.keys(params.selectedGems)) {
      const itemSlot = ItemSlotDetailedToItemSlot(
        itemSlotKey as unknown as ItemSlotDetailed
      )
      const itemGemArrays = params.selectedGems[itemSlot]

      if (itemGemArrays && itemGemArrays[params.itemId]) {
        socketArray = itemGemArrays[params.itemId]
        break
      }
    }
  }

  if (socketArray) {
    // Loop through the gems in the item and if any of gems don't match the socket's color or if a gem isn't equipped then return false.
    for (let i = 0; i < socketArray.length; i++) {
      const currentGemId = socketArray[i]

      if (currentGemId === 0) {
        return false
      }

      const gemColor = Gems.find(e => e.Id === currentGemId)?.Color
      const socketColor = Items.find(e => e.Id === params.itemId)?.Sockets?.at(
        i
      )

      // Check if the array of valid gem colors for this socket color does not include the equipped gem color.
      if (
        gemColor &&
        !Sockets.find(e => e.Color === socketColor)?.ValidColors.includes(
          gemColor
        )
      ) {
        return false
      }
    }

    return true
  }

  return false
}

export function getRemainingTalentPoints(talents: TalentStore): number {
  return 71 - Object.values<number>(talents).reduce((a, b) => a + b, 0)
}

export function GetQualityCssColor(quality: Quality): string {
  switch (quality) {
    case Quality.Legendary:
      return '#ff8000'
    case Quality.Heirloom:
      return '#e6cc80'
    case Quality.Epic:
      return '#a335ee'
    case Quality.Rare:
      return '#0070dd'
    case Quality.Uncommon:
      return '#1eff00'
    case Quality.Common:
      return '#ffffff'
  }
}

export function isPetActive(
  settings: Settings,
  requiresAggressivePet: boolean,
  requiresPhysicalPet: boolean
): boolean {
  return (
    (!requiresAggressivePet || settings[Setting.petIsAggressive] === 'true') &&
    (!requiresPhysicalPet || settings[Setting.petChoice] !== Pet.Imp)
  )
}

export function canGemColorBeInsertedIntoSocketColor(
  socketColor: SocketColor,
  gemColor: GemColor
): boolean {
  return (
    (socketColor === SocketColor.Meta && gemColor === GemColor.Meta) ||
    (socketColor !== SocketColor.Meta && gemColor !== GemColor.Meta)
  )
}

/**
 * Returns an array of items meeting the criteria to be displayed in the item selection table.
 * The item needs to be of the specified item slot, the item's phase needs to be selected, it needs to not be hidden unless the player is showing hidden items
 * and the item needs to not be unique unless it is not equipped in the other item slot (only applicable to rings and trinkets).
 */
export function getItemTableItems(
  itemSlot: ItemSlot,
  itemSubSlot: SubSlotValue,
  selectedItems: ItemSlotDetailedStruct,
  sources: SourcesStruct,
  hiddenItems: number[],
  hidingItems: boolean,
  savedItemDps: SavedItemDps,
  isMultiItemSimulation: boolean
): Item[] {
  const itemSlotDetailed = ItemSlotToItemSlotDetailed(itemSlot, itemSubSlot)
  const savedItemSlotDpsExists = savedItemDps[itemSlotDetailed] != null
  const secondRingOrTrinket =
    selectedItems[
      ItemSlotToItemSlotDetailed(itemSlot, itemSubSlot === '1' ? '2' : '1')
    ]

  return Items.filter(e => {
    return (
      e.ItemSlot === itemSlot &&
      sources.includes(e.Phase) &&
      (!hiddenItems.includes(e.Id) || hidingItems) &&
      (!e.Unique || secondRingOrTrinket !== e.Id)
    )
  }).sort((a, b) => {
    // If it's a multi-item simulation then sort by phase from highest to lowest, otherwise sort by the saved dps or by phase as backup
    if (
      isMultiItemSimulation ||
      !savedItemSlotDpsExists ||
      (!savedItemDps[itemSlotDetailed][a.Id] &&
        !savedItemDps[itemSlotDetailed][b.Id])
    ) {
      return a.Phase < b.Phase ? 1 : -1
    } else if (!savedItemDps[itemSlotDetailed][b.Id]) {
      return -1
    } else if (!savedItemDps[itemSlotDetailed][a.Id]) {
      return 1
    } else {
      return savedItemDps[itemSlotDetailed][a.Id] <
        savedItemDps[itemSlotDetailed][b.Id]
        ? 1
        : -1
    }
  })
}

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function getStdev(array: number[]) {
  if (!array || array.length === 0) {
    return 0
  }
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(
    array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  )
}

export function average(nums?: number[]) {
  if (nums === undefined || nums.length === 0) {
    return 0
  }
  return nums.reduce((a, b) => a + b) / nums.length
}

export function getBaseStats(
  race: Race,
  statsObj?: StatsCollection
): StatsCollection {
  let stats = JSON.parse(JSON.stringify(InitialPlayerStats))
  const raceObj = Races.find(e => e.Race === race)

  if (raceObj && raceObj.Stats) {
    Object.entries(raceObj.Stats).forEach(stat => {
      AddOrMultiplyStat(statsObj || stats, stat[0] as unknown as Stat, stat[1])
    })
  }

  return statsObj || stats
}

export function getAurasStats(
  auras: AuraId[],
  statsObj?: StatsCollection
): StatsCollection {
  let stats: StatsCollection = JSON.parse(JSON.stringify(InitialPlayerStats))

  auras.forEach(aura => {
    const auraObj = Auras.find(e => e.Id === aura)

    if (auraObj && auraObj.Stats) {
      Object.entries(auraObj.Stats).forEach(auraStat => {
        AddOrMultiplyStat(
          statsObj || stats,
          auraStat[0] as unknown as Stat,
          auraStat[1]
        )
      })
    }
  })

  return statsObj || stats
}

export function getItemsStats(
  items: ItemSlotDetailedStruct,
  statsObj?: StatsCollection
): StatsCollection {
  let stats: StatsCollection = JSON.parse(JSON.stringify(InitialPlayerStats))

  Object.values(items).forEach(itemId => {
    const itemObj = Items.find(e => e.Id === itemId)

    if (itemObj?.Stats) {
      Object.entries(itemObj.Stats).forEach(item => {
        if (item[0] in Stat) {
          AddOrMultiplyStat(
            statsObj || stats,
            item[0] as unknown as Stat,
            item[1]
          )
        }
      })
    }
  })

  return statsObj || stats
}

export function getGemsStats(
  items: ItemSlotDetailedStruct,
  gems: SelectedGemsStruct,
  statsObj?: StatsCollection
): StatsCollection {
  let stats: StatsCollection = JSON.parse(JSON.stringify(InitialPlayerStats))

  Object.entries(items).forEach(item => {
    const itemSlotGems =
      gems[ItemSlotDetailedToItemSlot(item[0] as unknown as ItemSlotDetailed)]

    if (itemSlotGems) {
      const itemGemIds = itemSlotGems[item[1]]

      if (itemGemIds) {
        for (const gemId of itemGemIds) {
          if (gemId) {
            const gem = Gems.find(e => e.Id === gemId)

            gem?.Stats &&
              Object.entries(gem.Stats).forEach(gemStat => {
                AddOrMultiplyStat(
                  statsObj || stats,
                  gemStat[0] as unknown as Stat,
                  gemStat[1]
                )
              })
          }
        }

        if (
          itemMeetsSocketRequirements({
            itemId: item[1],
            socketArray: itemGemIds,
          })
        ) {
          const itemObj = Items.find(e => e.Id === item[1])

          if (itemObj?.SocketBonus) {
            Object.entries(itemObj.SocketBonus).forEach(stat => {
              AddOrMultiplyStat(
                statsObj || stats,
                stat[0] as unknown as Stat,
                stat[1]
              )
            })
          }
        }
      }
    }
  })

  return statsObj || stats
}

export function getEnchantsStats(
  items: ItemSlotDetailedStruct,
  enchants: ItemSlotDetailedStruct,
  statsObj?: StatsCollection
): StatsCollection {
  let stats: StatsCollection = JSON.parse(JSON.stringify(InitialPlayerStats))

  Object.entries(enchants).forEach(enchant => {
    // Only add the enchant's stats if the user has an item equipped in that slot as well.
    if (
      Items.find(e => e.Id === items[enchant[0] as unknown as ItemSlotDetailed])
    ) {
      const enchantObj = Enchants.find(e => e.Id === enchant[1])

      if (enchantObj?.Stats) {
        Object.entries(enchantObj.Stats).forEach(prop => {
          if (prop[0] in Stat) {
            AddOrMultiplyStat(
              statsObj || stats,
              prop[0] as unknown as Stat,
              prop[1]
            )
          }
        })
      }
    }
  })

  return statsObj || stats
}

export function GetTalentsStats(
  talents: TalentStore,
  settings: Settings,
  statsObj?: StatsCollection
): StatsCollection {
  let stats: StatsCollection = JSON.parse(JSON.stringify(InitialPlayerStats))
  const demonicEmbraceAmount = talents['Demonic Embrace'] || 0

  AddOrMultiplyStat(statsObj || stats, Stat.HitChance, talents.Suppression || 0)
  AddOrMultiplyStat(
    statsObj || stats,
    Stat.ShadowModifier,
    1 + (0.03 * talents['Shadow Mastery'] || 0)
  )
  AddOrMultiplyStat(
    statsObj || stats,
    Stat.ShadowModifier,
    1 + (0.01 * talents.Malediction || 0)
  )
  AddOrMultiplyStat(
    statsObj || stats,
    Stat.FireModifier,
    1 + (0.01 * talents.Malediction || 0)
  )
  AddOrMultiplyStat(
    statsObj || stats,
    Stat.StaminaModifier,
    demonicEmbraceAmount === 1
      ? 1.04
      : demonicEmbraceAmount === 2
      ? 1.07
      : demonicEmbraceAmount === 3
      ? 1.1
      : 1
  )
  AddOrMultiplyStat(
    statsObj || stats,
    Stat.HealthModifier,
    1 + (0.01 * talents['Fel Vitality'] || 0)
  )
  AddOrMultiplyStat(
    statsObj || stats,
    Stat.ManaModifier,
    1 + (0.01 * talents['Fel Vitality'] || 0)
  )
  AddOrMultiplyStat(
    statsObj || stats,
    Stat.SpellPower,
    Auras.find(x => x.Id === AuraId.FelArmor)!.Stats![Stat.SpellPower]! *
      0.1 *
      talents['Demonic Aegis'] || 0
  )

  if (
    settings[Setting.petChoice] === Pet.Imp ||
    settings[Setting.petChoice] === Pet.Felguard
  ) {
    AddOrMultiplyStat(
      statsObj || stats,
      Stat.FireModifier,
      1 + (0.01 * talents['Master Demonologist'] || 0)
    )
  }

  if (
    settings[Setting.petChoice] === Pet.Succubus ||
    settings[Setting.petChoice] === Pet.Felguard
  ) {
    AddOrMultiplyStat(
      statsObj || stats,
      Stat.ShadowModifier,
      1 + (0.01 * talents['Master Demonologist'] || 0)
    )
  }

  AddOrMultiplyStat(
    statsObj || stats,
    Stat.CritChance,
    2 * talents['Demonic Tactics'] || 0
  )
  AddOrMultiplyStat(
    statsObj || stats,
    Stat.FireModifier,
    1 + (0.02 * talents['Demonic Pact'] || 0)
  )
  AddOrMultiplyStat(
    statsObj || stats,
    Stat.ShadowModifier,
    1 + (0.02 * talents['Demonic Pact'] || 0)
  )
  AddOrMultiplyStat(statsObj || stats, Stat.CritChance, talents.Backlash || 0)
  AddOrMultiplyStat(
    statsObj || stats,
    Stat.FireModifier,
    1 + 0.03 * talents.Emberstorm || 0
  )

  return statsObj || stats
}

export function getItemSetCounts(items: ItemSlotDetailedStruct): SetsStruct {
  let sets = JSON.parse(JSON.stringify(InitialSetCounts))

  Object.values(items).forEach(itemId => {
    const itemObjSet = Items.find(e => e.Id === itemId)?.Set

    if (itemObjSet) {
      sets[itemObjSet]++
    }
  })

  return sets
}

export function AddOrMultiplyStat(
  statsCollection: StatsCollection,
  stat: Stat,
  value: number
): void {
  // TODO
  if (Stat[stat].includes('Modifier')) {
    statsCollection[stat]! *= value
  } else {
    statsCollection[stat]! += value
  }
}

export function calculatePlayerStats(
  playerState: PlayerState
): StatsCollection {
  let mainStatsObj: StatsCollection = JSON.parse(
    JSON.stringify(InitialPlayerStats)
  )

  getBaseStats(
    playerState.Settings[Setting.race] as unknown as Race,
    mainStatsObj
  )
  getAurasStats(playerState.Auras, mainStatsObj)
  getItemsStats(playerState.SelectedItems, mainStatsObj)
  getGemsStats(
    playerState.SelectedItems,
    playerState.SelectedGems,
    mainStatsObj
  )
  getEnchantsStats(
    playerState.SelectedItems,
    playerState.SelectedEnchants,
    mainStatsObj
  )
  GetTalentsStats(playerState.Talents, playerState.Settings, mainStatsObj)

  return mainStatsObj
}

export function getPlayerHitRating(playerState: PlayerState): number {
  return Object.values(playerState.Stats)
    .map(obj => obj[Stat.HitRating] || 0)
    .reduce((a, b) => a + b)
}

export function getPlayerHitPercent(
  playerState: PlayerState,
  hitRating?: number
): number {
  let hitPercent =
    (hitRating || getPlayerHitRating(playerState)) /
      StatConstant.HitRatingPerPercent +
    Object.values(playerState.Stats)
      .map(obj => obj[Stat.HitChance] || 0)
      .reduce((a, b) => a + b)

  return hitPercent
}

export function getAllocatedTalentsPointsInTree(
  talentState: TalentStore,
  tree: TalentTreeStruct
): number {
  let points = 0

  for (const row in tree.Rows) {
    for (const talent in tree.Rows[row]) {
      const talentKey = tree.Rows[row][talent].Name

      if (talentKey != null && talentState[talentKey]) {
        points += talentState[talentKey]
      }
    }
  }

  return points
}

export function getBaseWowheadUrl(language: string): string {
  return `https://${
    Languages.find(e => e.Iso === language)?.WowheadPrefix || ''
  }wowhead.com/wotlk`
}
