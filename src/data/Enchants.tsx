import {
  Enchant,
  EnchantId,
  ItemSlot,
  ItemSource,
  Quality,
  Stat,
} from '../Types'

export const Enchants: Enchant[] = [
  // Head
  {
    Phase: 1,
    Id: EnchantId.ArcanumOfBurningMysteries,
    Name: 'Arcanum of Burning Mysteries',
    ItemSlot: ItemSlot.Head,
    Quality: Quality.Heirloom,
    Stats: { [Stat.SpellPower]: 30, [Stat.CritRating]: 20 },
    Source: ItemSource.KirinTorRevered,
  },

  // Shoulders
  {
    Phase: 1,
    Id: EnchantId.MastersInscriptionOfTheStorm,
    Name: `Master's Inscription of the Storm`,
    ItemSlot: ItemSlot.Shoulders,
    Quality: Quality.Uncommon,
    Stats: { [Stat.SpellPower]: 70, [Stat.CritRating]: 15 },
    Source: ItemSource.Inscription,
  },

  // Back
  {
    Phase: 1,
    Id: EnchantId.LightweaveEmbroidery,
    Name: 'Lightweave Embroidery',
    ItemSlot: ItemSlot.Back,
    Quality: Quality.Uncommon,
    Source: ItemSource.Tailoring,
  },

  // Chest
  {
    Phase: 1,
    Id: EnchantId.PowerfulStats,
    Name: 'Powerful Stats',
    ItemSlot: ItemSlot.Chest,
    Quality: Quality.Uncommon,
    Stats: { [Stat.Stamina]: 10, [Stat.Intellect]: 10, [Stat.Spirit]: 10 },
    Source: ItemSource.Enchanting,
  },

  // Wrist
  {
    Phase: 1,
    Id: EnchantId.SuperiorSpellpower,
    Name: 'Superior Spellpower',
    ItemSlot: ItemSlot.Wrist,
    Quality: Quality.Uncommon,
    Stats: { [Stat.SpellPower]: 30 },
    Source: ItemSource.Enchanting,
  },

  // Hands
  {
    Phase: 1,
    Id: EnchantId.ExceptionalSpellpower,
    Name: 'Exceptional Spellpower',
    ItemSlot: ItemSlot.Hands,
    Quality: Quality.Uncommon,
    Stats: { [Stat.SpellPower]: 28 },
    Source: ItemSource.Enchanting,
  },

  // Waist
  {
    Phase: 1,
    Id: EnchantId.EternalBeltBuckle,
    Name: 'Eternal Belt Buckle',
    ItemSlot: ItemSlot.Waist,
    Quality: Quality.Rare,
    Source: ItemSource.Blacksmithing,
  },

  // Legs
  {
    Phase: 1,
    Id: EnchantId.BrilliantSpellthread,
    Name: 'Brilliant Spellthread',
    ItemSlot: ItemSlot.Legs,
    Quality: Quality.Epic,
    Source: ItemSource.Tailoring,
  },

  // Feet
  {
    Phase: 1,
    Id: EnchantId.TuskarrsVitality,
    Name: `Tuskarr's Vitality`,
    ItemSlot: ItemSlot.Feet,
    Quality: Quality.Uncommon,
    Source: ItemSource.Enchanting,
  },

  // Weapon
  {
    Phase: 1,
    Id: EnchantId.MightySpellpower,
    Name: 'Mighty Spellpower',
    ItemSlot: ItemSlot.Weapon,
    Quality: Quality.Rare,
    Source: ItemSource.Enchanting,
  },
]
