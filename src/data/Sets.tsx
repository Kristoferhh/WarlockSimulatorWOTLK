import { ItemSet, Quality } from '../Types'

export const Sets: {
  Name: string
  Set: ItemSet
  Quality: Quality
  Bonuses: number[]
}[] = [
  {
    Name: 'Malefic Raiment',
    Set: ItemSet.T6,
    Quality: Quality.Epic,
    Bonuses: [2, 4],
  },
  {
    Name: `Gul'dan's Regalia`,
    Set: ItemSet.T9Horde,
    Quality: Quality.Epic,
    Bonuses: [2, 4],
  },
  {
    Name: `Kel'thuzad's Regalia`,
    Set: ItemSet.T9Alliance,
    Quality: Quality.Epic,
    Bonuses: [2, 4],
  },
  {
    Name: 'Duskweaver',
    Set: ItemSet.Duskweaver,
    Quality: Quality.Uncommon,
    Bonuses: [2, 4],
  },
  {
    Name: `Gladiator's Felshroud`,
    Set: ItemSet.GladiatorsFelshroud,
    Quality: Quality.Epic,
    Bonuses: [2, 4],
  },
  {
    Name: 'Plagueheart Garb',
    Set: ItemSet.T7,
    Quality: Quality.Epic,
    Bonuses: [2, 4],
  },
  {
    Name: 'Frostsavage Battlegear',
    Set: ItemSet.FrostsavageBattlegear,
    Quality: Quality.Rare,
    Bonuses: [4, 6],
  },
  {
    Name: 'Deathbringer Garb',
    Set: ItemSet.T8,
    Quality: Quality.Epic,
    Bonuses: [2, 4],
  },
  {
    Name: `Dark Coven's Regalia`,
    Set: ItemSet.T10,
    Quality: Quality.Epic,
    Bonuses: [2, 4],
  },
]
