import { Enchant, ItemSlot, ItemSource, Quality, Stat } from '../Types'

export const Enchants: Enchant[] = [
  // Head
  {
    Phase: 1,
    Id: 59970,
    Name: 'Arcanum of Burning Mysteries',
    ItemSlot: ItemSlot.Head,
    Quality: Quality.Heirloom,
    Stats: { [Stat.SpellPower]: 30, [Stat.CritRating]: 20 },
    Source: ItemSource.KirinTorRevered,
  },

  // Shoulders
  {
    Phase: 1,
    Id: 61120,
    Name: `Master's Inscription of the Storm`,
    ItemSlot: ItemSlot.Shoulders,
    Quality: Quality.Uncommon,
    Stats: { [Stat.SpellPower]: 70, [Stat.CritRating]: 15 },
    Source: ItemSource.Inscription,
  },

  // Back
  {
    Phase: 1,
    Id: 55642,
    Name: 'Lightweave Embroidery',
    ItemSlot: ItemSlot.Back,
    Quality: Quality.Uncommon,
    Source: ItemSource.Tailoring,
  },

  // Chest
  {
    Phase: 1,
    Id: 60692,
    Name: 'Powerful Stats',
    ItemSlot: ItemSlot.Chest,
    Quality: Quality.Uncommon,
    Stats: { [Stat.Stamina]: 10, [Stat.Intellect]: 10, [Stat.Spirit]: 10 },
    Source: ItemSource.Enchanting,
  },

  // Wrist
  {
    Phase: 1,
    Id: 60767,
    Name: 'Superior Spellpower',
    ItemSlot: ItemSlot.Wrist,
    Quality: Quality.Uncommon,
    Stats: { [Stat.SpellPower]: 30 },
    Source: ItemSource.Enchanting,
  },

  // Hands
  {
    Phase: 1,
    Id: 44592,
    Name: 'Exceptional Spellpower',
    ItemSlot: ItemSlot.Hands,
    Quality: Quality.Uncommon,
    Stats: { [Stat.SpellPower]: 28 },
    Source: ItemSource.Enchanting,
  },

  // Waist
  {
    Phase: 1,
    Id: 55655,
    Name: 'Eternal Belt Buckle',
    ItemSlot: ItemSlot.Waist,
    Quality: Quality.Rare,
    Source: ItemSource.Blacksmithing,
  },

  // Legs
  {
    Phase: 1,
    Id: 55631,
    Name: 'Brilliant Spellthread',
    ItemSlot: ItemSlot.Legs,
    Quality: Quality.Epic,
    Source: ItemSource.Tailoring,
  },

  // Feet
  {
    Phase: 1,
    Id: 47901,
    Name: `Tuskarr's Vitality`,
    ItemSlot: ItemSlot.Feet,
    Quality: Quality.Uncommon,
    Source: ItemSource.Enchanting,
  },

  // Weapon
  {
    Phase: 1,
    Id: 60714,
    Name: 'Mighty Spellpower',
    ItemSlot: ItemSlot.Weapon,
    Quality: Quality.Rare,
    Source: ItemSource.Enchanting,
  },
]
