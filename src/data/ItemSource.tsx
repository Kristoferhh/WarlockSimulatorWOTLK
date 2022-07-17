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
    Name: ItemSourceName.Sunwell,
    BindType: BindType.BoP,
    Instance: {
      Size: InstanceSize.TwentyFive,
      Difficulty: InstanceDifficulty.Normal,
      Type: InstanceType.Raid,
    },
  },
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
    Name: ItemSourceName.Jewelcrafting,
    BindType: BindType.BoP,
    Profession: Profession.Jewelcrafting,
  },
  {
    Name: ItemSourceName.JewelcraftingBoE,
    BindType: BindType.BoE,
    Profession: Profession.Jewelcrafting,
  },
]
