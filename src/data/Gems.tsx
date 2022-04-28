import { Gem, GemColor, GemId, Stat } from "../Types";

export const Gems: Gem[] = [
  // Meta
  {
    Id: GemId.ChaoticSkyflareDiamond,
    Name: "Chaotic Skyflare Diamond",
    Color: GemColor.Meta,
    IconName: "inv_jewelcrafting_icediamond_02",
    Phase: 1,
    Stats: { [Stat.CritRating]: 21 },
  },

  // Red
  {
    Id: GemId.RunedCardinalRuby,
    Name: "Runed Cardinal Ruby",
    Color: GemColor.Red,
    IconName: "inv_jewelcrafting_gem_37",
    Phase: 1,
    Stats: { [Stat.SpellPower]: 23 },
  },

  // Orange
  {
    Id: GemId.VeiledAmetrine,
    Name: "Veiled Ametrine",
    Color: GemColor.Orange,
    IconName: "inv_jewelcrafting_gem_39",
    Phase: 1,
    Stats: { [Stat.SpellPower]: 12, [Stat.HitRating]: 10 },
  },
  {
    Id: GemId.RecklessAmetrine,
    Name: "Reckless Ametrine",
    Color: GemColor.Orange,
    IconName: "inv_jewelcrafting_gem_39",
    Phase: 1,
    Stats: { [Stat.SpellPower]: 12, [Stat.HasteRating]: 10 },
  },

  // Yellow
  {
    Id: GemId.RigidKingsAmber,
    Name: `Rigid King's Amber`,
    Color: GemColor.Yellow,
    IconName: "inv_jewelcrafting_gem_38",
    Phase: 1,
    Stats: { [Stat.HitRating]: 20 },
  },
  {
    Id: GemId.QuickKingsAmber,
    Name: `Quick King's Amber`,
    Color: GemColor.Yellow,
    IconName: "inv_jewelcrafting_gem_38",
    Phase: 1,
    Stats: { [Stat.HasteRating]: 20 },
  },

  // Purple
  {
    Id: GemId.PurifiedDreadstone,
    Name: "Purified Dreadstone",
    Color: GemColor.Purple,
    IconName: "inv_jewelcrafting_gem_40",
    Phase: 1,
    Stats: { [Stat.SpellPower]: 12, [Stat.Spirit]: 10 },
  },

  // Green
  {
    Id: GemId.ShiningEyeOfZul,
    Name: "Shining Eye of Zul",
    Color: GemColor.Green,
    IconName: "inv_jewelcrafting_gem_41",
    Phase: 1,
    Stats: { [Stat.HitRating]: 10, [Stat.Spirit]: 10 },
  },

  // Blue

  // Void
];
