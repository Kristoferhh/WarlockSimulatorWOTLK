import { Enchant, EnchantId, ItemSlot, ItemSourceName, Quality, Stat } from '../Types'

export const Enchants: Enchant[] = [
  {
    Phase: 1,
    Id: 59970,
    Name: 'Arcanum of Burning Mysteries',
    ItemSlot: ItemSlot.Head,
    Quality: Quality.Heirloom,
    Stats: { [Stat.SpellPower]: 30, [Stat.CritRating]: 20 },
    Sources: [ItemSourceName.KirinTorRevered],
  },
  {
    Phase: 1,
    Id: 61120,
    Name: `Master's Inscription of the Storm`,
    ItemSlot: ItemSlot.Shoulders,
    Quality: Quality.Uncommon,
    Stats: { [Stat.SpellPower]: 70, [Stat.CritRating]: 15 },
    Sources: [ItemSourceName.Inscription],
  },
  {
    Phase: 1,
    Id: 55642,
    Name: 'Lightweave Embroidery',
    ItemSlot: ItemSlot.Back,
    Quality: Quality.Uncommon,
    Sources: [ItemSourceName.Tailoring],
  },
  {
    Phase: 1,
    Id: 60692,
    Name: 'Powerful Stats',
    ItemSlot: ItemSlot.Chest,
    Quality: Quality.Uncommon,
    Stats: { [Stat.Stamina]: 10, [Stat.Intellect]: 10, [Stat.Spirit]: 10 },
    Sources: [ItemSourceName.Enchanting],
  },
  {
    Phase: 1,
    Id: 60767,
    Name: 'Superior Spellpower',
    ItemSlot: ItemSlot.Wrist,
    Quality: Quality.Uncommon,
    Stats: { [Stat.SpellPower]: 30 },
    Sources: [ItemSourceName.Enchanting],
  },
  {
    Phase: 1,
    Id: 44592,
    Name: 'Exceptional Spellpower',
    ItemSlot: ItemSlot.Hands,
    Quality: Quality.Uncommon,
    Stats: { [Stat.SpellPower]: 28 },
    Sources: [ItemSourceName.Enchanting],
  },
  {
    Phase: 1,
    Id: EnchantId.EternalBeltBuckle,
    Name: 'Eternal Belt Buckle',
    ItemSlot: ItemSlot.Waist,
    Quality: Quality.Rare,
    Sources: [ItemSourceName.Blacksmithing],
  },
  {
    Phase: 1,
    Id: 55631,
    Name: 'Brilliant Spellthread',
    ItemSlot: ItemSlot.Legs,
    Quality: Quality.Epic,
    Sources: [ItemSourceName.Tailoring],
  },
  {
    Phase: 1,
    Id: 47901,
    Name: `Tuskarr's Vitality`,
    ItemSlot: ItemSlot.Feet,
    Quality: Quality.Uncommon,
    Sources: [ItemSourceName.Enchanting],
  },
  {
    Phase: 1,
    Id: 60714,
    Name: 'Mighty Spellpower',
    ItemSlot: ItemSlot.Weapon,
    Quality: Quality.Rare,
    Sources: [ItemSourceName.Enchanting],
  },
  {
    Phase: 1,
    Id: 50338,
    Name: 'Greater Inscription of the Storm',
    ItemSlot: ItemSlot.Shoulders,
    Quality: Quality.Heirloom,
    Sources: [ItemSourceName.TheSonsOfHodirExalted],
    Stats: {
      [Stat.SpellPower]: 24,
      [Stat.CritRating]: 15,
    },
  },
  {
    Phase: 1,
    Id: 47898,
    Name: 'Greater Speed',
    ItemSlot: ItemSlot.Back,
    Quality: Quality.Uncommon,
    Sources: [ItemSourceName.Enchanting],
    Stats: {
      [Stat.HasteRating]: 23,
    },
  },
  {
    Phase: 1,
    Id: 44593,
    Name: 'Major Spirit',
    ItemSlot: ItemSlot.Chest,
    Quality: Quality.Uncommon,
    Sources: [ItemSourceName.Enchanting],
    Stats: {
      [Stat.Spirit]: 18,
    },
  },
  {
    Phase: 1,
    Id: 56039,
    Name: 'Sanctified Spellthread',
    ItemSlot: ItemSlot.Legs,
    Quality: Quality.Epic,
    Sources: [ItemSourceName.Tailoring],
    Stats: {
      [Stat.SpellPower]: 50,
      [Stat.Spirit]: 20,
    },
  },
  {
    Phase: 1,
    Id: 60623,
    Name: 'Icewalker',
    ItemSlot: ItemSlot.Feet,
    Quality: Quality.Uncommon,
    Sources: [ItemSourceName.Enchanting],
    Stats: {
      [Stat.CritRating]: 12,
      [Stat.HitRating]: 12,
    },
  },
  {
    Phase: 1,
    Id: 44635,
    Name: 'Greater Spellpower',
    ItemSlot: ItemSlot.Weapon,
    Quality: Quality.Rare,
    Sources: [ItemSourceName.Enchanting],
    Stats: {
      [Stat.SpellPower]: 23,
    },
  },
  {
    Phase: 1,
    Id: 59625,
    Name: 'Black Magic',
    ItemSlot: ItemSlot.Weapon,
    Quality: Quality.Rare,
    Sources: [ItemSourceName.Enchanting],
  },
]
