import {
  BindType,
  InstanceDifficulty,
  InstanceSize,
  InstanceType,
  ItemSource,
  ItemSourceName,
  Profession,
} from '../Types'

export const ItemSources: ItemSource[] = [
  {
    Name: ItemSourceName.Oculus,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.OculusHeroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.InscriptionBoE,
    BindType: BindType.BoE,
    Profession: Profession.Inscription,
  },
  {
    Name: ItemSourceName.OculusBoE,
    BindType: BindType.BoE,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.VioletHoldBoE,
    BindType: BindType.BoE,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.Jewelcrafting,
    BindType: BindType.BoP,
    Profession: Profession.Jewelcrafting,
  },
  {
    Name: ItemSourceName.JewelcraftingBoE,
    BindType: BindType.BoE,
    Profession: Profession.Jewelcrafting,
  },
  {
    Name: ItemSourceName.TailoringBoE,
    BindType: BindType.BoE,
    Profession: Profession.Tailoring,
  },
  {
    Name: ItemSourceName.Naxxramas10,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Ten,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.Naxxramas25,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.TwentyFive,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.HallsOfStone,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.HallsOfLightning,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.HallsOfLightningHeroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.AhnkahetTheOldKingdomHeroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Dungeon,
    },
  },
  { Name: ItemSourceName.EmblemOfConquest, BindType: BindType.BoP },
  {
    Name: ItemSourceName.VioletHoldHeroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.Naxxramas10BoE,
    BindType: BindType.BoE,
    Instance: {
      Size: InstanceSize.Ten,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.CullingOfStratholme,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.CullingOfStratholmeHeroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.EyeOfEternity10,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Ten,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.EyeOfEternity25,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.TwentyFive,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.NexusHeroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.Blacksmithing,
    BindType: BindType.BoP,
    Profession: Profession.Blacksmithing,
  },
  {
    Name: ItemSourceName.BlacksmithingBoE,
    BindType: BindType.BoE,
    Profession: Profession.Blacksmithing,
  },
  {
    Name: ItemSourceName.ChampionsSeal,
    BindType: BindType.BoP,
  },
  {
    Name: ItemSourceName.EmblemOfHeroism,
    BindType: BindType.BoP,
  },
  {
    Name: ItemSourceName.EmblemOfTriumph,
    BindType: BindType.BoP,
  },
  {
    Name: ItemSourceName.EmblemOfFrost,
    BindType: BindType.BoP,
  },
  {
    Name: ItemSourceName.Engineering,
    BindType: BindType.BoP,
    Profession: Profession.Engineering,
  },
  {
    Name: ItemSourceName.ObsidianSanctum10,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Ten,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.ObsidianSanctum25,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.TwentyFive,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.Quest,
    BindType: BindType.BoP,
  },
  {
    Name: ItemSourceName.Ulduar10,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Ten,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.Ulduar25,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.TwentyFive,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.Ulduar10Heroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Ten,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.Ulduar25Heroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.TwentyFive,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.TrialOfTheChampion,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.TrialOfTheChampionHeroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.TrialOfTheCrusader25,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.TwentyFive,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.TrialOfTheCrusader25Heroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.TwentyFive,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.Onyxia10,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Ten,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.Onyxia25,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.TwentyFive,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.HallsOfReflection,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.HallsOfReflectionHeroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.IcecrownCitadel25,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.TwentyFive,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.IcecrownCitadel25Heroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.TwentyFive,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.IcecrownCitadel10,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Ten,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.IcecrownCitadel10Heroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Ten,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.DrakTharonKeep,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.DrakTharonKeepHeroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.UtgardePinnacle,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.UtgardePinnacleHeroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.TrialOfTheCrusader10,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Ten,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.TrialOfTheCrusader10Heroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Ten,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Raid,
    },
  },
  {
    Name: ItemSourceName.BoE,
    BindType: BindType.BoE,
  },
  {
    Name: ItemSourceName.ForgeOfSouls,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.ForgeOfSoulsHeroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.PitOfSaron,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.PitOfSaronHeroic,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Heroic,
      Type: InstanceType.Dungeon,
    },
  },
  {
    Name: ItemSourceName.Ahune,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.Five,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Dungeon,
    },
  },
]
