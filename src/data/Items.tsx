import {
  Item,
  ItemId,
  ItemSet,
  ItemSlot,
  ItemSource,
  Quality,
  SocketColor,
  Stat,
} from '../Types'

export const Items: Item[] = [
  // Head
  {
    Phase: 1,
    Id: ItemId.ValorousPlagueheartCirclet,
    ItemSlot: ItemSlot.Head,
    Name: 'Valorous Plagueheart Circlet',
    Set: ItemSet.T7,
    Sockets: [SocketColor.Meta, SocketColor.Yellow],
    SocketBonus: { [Stat.HasteRating]: 8 },
    Stats: {
      [Stat.Stamina]: 99,
      [Stat.Intellect]: 59,
      [Stat.Spirit]: 50,
      [Stat.HasteRating]: 56,
      [Stat.SpellPower]: 99,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas25Normal,
    IconName: 'inv_crown_01',
  },

  // Neck
  {
    Phase: 1,
    Id: ItemId.PendantOfLostVocations,
    ItemSlot: ItemSlot.Neck,
    Name: 'Pendant of Lost Vocations',
    Stats: {
      [Stat.Stamina]: 31,
      [Stat.Intellect]: 41,
      [Stat.HasteRating]: 36,
      [Stat.Mp5]: 15,
      [Stat.SpellPower]: 57,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas10Normal,
    IconName: 'inv_jewelry_necklace_29naxxramas',
  },

  // Shoulders
  {
    Phase: 1,
    Id: ItemId.ValorousPlagueheartShoulderpads,
    ItemSlot: ItemSlot.Shoulders,
    Name: 'Valorous Plagueheart Shoulderpads',
    Set: ItemSet.T7,
    Sockets: [SocketColor.Red],
    SocketBonus: {
      [Stat.Stamina]: 6,
    },
    Stats: {
      [Stat.Stamina]: 73,
      [Stat.Intellect]: 50,
      [Stat.HasteRating]: 55,
      [Stat.HitRating]: 35,
      [Stat.SpellPower]: 78,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas25Normal,
    IconName: 'inv_shoulder_25',
  },

  // Back
  {
    Phase: 1,
    Id: ItemId.CloakOfTheDying,
    ItemSlot: ItemSlot.Back,
    Name: 'Cloak of the Dying',
    Stats: {
      [Stat.Stamina]: 42,
      [Stat.Intellect]: 43,
      [Stat.CritRating]: 38,
      [Stat.Mp5]: 19,
      [Stat.SpellPower]: 66
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas10Normal,
    IconName: 'inv_misc_cape_naxxramas_02'
  },

  // Chest
  {
    Phase: 1,
    Id: ItemId.ValorousPlagueheartRobe,
    ItemSlot: ItemSlot.Chest,
    Name: 'Valorous Plagueheart Robe',
    Set: ItemSet.T7,
    Sockets: [SocketColor.Red, SocketColor.Yellow],
    SocketBonus: {
      [Stat.Spirit]: 6,
    },
    Stats: {
      [Stat.Stamina]: 99,
      [Stat.Intellect]: 67,
      [Stat.Spirit]: 66,
      [Stat.HitRating]: 51,
      [Stat.SpellPower]: 99,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas25Normal,
    IconName: 'inv_chest_cloth_43',
  },

  // Wrist
  {
    Phase: 1,
    Id: ItemId.ResurgentPhantomBindings,
    ItemSlot: ItemSlot.Wrist,
    Name: 'Resurgent Phantom Bindings',
    Stats: {
      [Stat.Stamina]: 37,
      [Stat.Intellect]: 32,
      [Stat.Spirit]: 38,
      [Stat.HasteRating]: 33,
      [Stat.SpellPower]: 59,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas10Normal,
    IconName: 'inv_bracer_08',
  },

  // Hands
  {
    Phase: 1,
    Id: ItemId.ValorousPlagueheartGloves,
    ItemSlot: ItemSlot.Hands,
    Name: 'Valorous Plagueheart Gloves',
    Set: ItemSet.T7,
    Sockets: [SocketColor.Red],
    SocketBonus: { [Stat.Stamina]: 6 },
    Stats: {
      [Stat.Stamina]: 75,
      [Stat.Intellect]: 50,
      [Stat.HasteRating]: 53,
      [Stat.CritChance]: 43,
      [Stat.SpellPower]: 69,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas25Normal,
    IconName: 'inv_gauntlets_17',
  },

  // Waist
  {
    Phase: 1,
    Id: ItemId.NecrogenicBelt,
    ItemSlot: ItemSlot.Waist,
    Name: 'Necrogenic Belt',
    Stats: {
      [Stat.Stamina]: 57,
      [Stat.Intellect]: 48,
      [Stat.CritChance]: 44,
      [Stat.Mp5]: 23,
      [Stat.SpellPower]: 77,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas10Normal,
    IconName: 'inv_belt_15',
  },

  // Legs
  {
    Phase: 1,
    Id: ItemId.ValorousPlagueheartLeggings,
    ItemSlot: ItemSlot.Legs,
    Name: 'Valorous Plagueheart Leggings',
    Set: ItemSet.T7,
    Sockets: [SocketColor.Red, SocketColor.Yellow],
    SocketBonus: { [Stat.HasteRating]: 6 },
    Stats: {
      [Stat.Stamina]: 87,
      [Stat.Intellect]: 72,
      [Stat.CritChance]: 51,
      [Stat.HasteRating]: 66,
      [Stat.SpellPower]: 99,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas25Normal,
    IconName: 'inv_pants_cloth_05',
  },

  // Feet
  {
    Phase: 1,
    Id: ItemId.BootsOfTheFollower,
    ItemSlot: ItemSlot.Feet,
    Name: 'Boots of the Follower',
    Stats: {
      [Stat.Stamina]: 37,
      [Stat.Intellect]: 44,
      [Stat.Spirit]: 66,
      [Stat.HasteRating]: 32,
      [Stat.SpellPower]: 77,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas10Normal,
    IconName: 'inv_boots_08',
  },

  // Finger
  {
    Phase: 1,
    Id: ItemId.BandOfNeglectedPleas,
    ItemSlot: ItemSlot.Finger,
    Name: 'Band of Neglected Pleas',
    Stats: {
      [Stat.Stamina]: 37,
      [Stat.Intellect]: 38,
      [Stat.CritRating]: 33,
      [Stat.Mp5]: 16,
      [Stat.SpellPower]: 59,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas10Normal,
    IconName: 'inv_jewelry_ring_51naxxramas',
    Unique: true,
  },
  {
    Phase: 1,
    Id: ItemId.SignetOfTheMalevolent,
    ItemSlot: ItemSlot.Finger,
    Name: 'Signet of the Malevolent',
    Stats: {
      [Stat.Stamina]: 49,
      [Stat.Intellect]: 34,
      [Stat.HitRating]: 49,
      [Stat.HasteRating]: 33,
      [Stat.SpellPower]: 46,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas10Normal,
    IconName: 'inv_jewelry_ring_52naxxramas',
    Unique: true,
  },

  // Trinket
  {
    Phase: 1,
    Id: ItemId.PendulumOfTelluricCurrents,
    ItemSlot: ItemSlot.Trinket,
    Name: 'Pendulum of Telluric Currents',
    Stats: {
      [Stat.HasteRating]: 74,
    },
    Quality: Quality.Rare,
    Source: ItemSource.OculusHeroic,
    IconName: 'inv_misc_enggizmos_12',
    Unique: true,
  },
  {
    Phase: 1,
    Id: ItemId.SparkOfLife,
    ItemSlot: ItemSlot.Trinket,
    Name: 'Spark of Life',
    Stats: {
      [Stat.HasteRating]: 73,
    },
    Quality: Quality.Epic,
    Source: ItemSource.HallsOfStoneHeroic,
    IconName: 'inv_misc_enggizmos_06',
    Unique: true,
  },

  // Weapon
  {
    Phase: 1,
    Id: ItemId.TheSoulblade,
    ItemSlot: ItemSlot.Weapon,
    Name: 'The Soulblade',
    Stats: {
      [Stat.Stamina]: 39,
      [Stat.Intellect]: 44,
      [Stat.Spirit]: 42,
      [Stat.HitRating]: 30,
      [Stat.SpellPower]: 461,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas10Normal,
    IconName: 'inv_knife_1h_stratholme_d_02',
  },

  // Off-Hand
  {
    Phase: 1,
    Id: ItemId.WatchfulEye,
    ItemSlot: ItemSlot.OffHand,
    Name: 'Watchful Eye',
    Stats: {
      [Stat.Stamina]: 37,
      [Stat.Intellect]: 38,
      [Stat.Spirit]: 36,
      [Stat.HitRating]: 28,
      [Stat.SpellPower]: 59,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas10Normal,
    IconName: 'inv_offhand_naxxramas_03',
  },

  // Wand
  {
    Phase: 1,
    Id: ItemId.WandOfTheArchlich,
    ItemSlot: ItemSlot.Wand,
    Name: 'Wand of the Archlich',
    Stats: {
      [Stat.Stamina]: 22,
      [Stat.Intellect]: 21,
      [Stat.Spirit]: 24,
      [Stat.HasteRating]: 20,
      [Stat.SpellPower]: 37,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas10Normal,
    IconName: 'inv_wand_1h_stratholme_d_02',
  },
]
