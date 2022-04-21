import { Gem, GemColor, GemId, Stat } from '../Types'

export const Gems: Gem[] = [
  // Meta
  {
    Id: GemId.ChaoticSkyflareDiamond,
    Name: 'Chaotic Skyflare Diamond',
    Color: GemColor.Meta,
    IconName: '',
    Phase: 1,
    Stats: { [Stat.CritRating]: 21 },
  },

  // Red
  {
    Id: GemId.RunedCardinalRuby,
    Name: 'Runed Cardinal Ruby',
    Color: GemColor.Red,
    IconName: '',
    Phase: 1,
    Stats: { [Stat.SpellPower]: 23 },
  },

  // Orange
  {
    Id: GemId.VeiledAmetrine,
    Name: 'Veiled Ametrine',
    Color: GemColor.Orange,
    IconName: '',
    Phase: 1,
    Stats: { [Stat.SpellPower]: 12, [Stat.HitRating]: 10 },
  },
  {
    Id: GemId.RecklessAmetrine,
    Name: 'Reckless Ametrine',
    Color: GemColor.Orange,
    IconName: '',
    Phase: 1,
    Stats: { [Stat.SpellPower]: 12, [Stat.HasteRating]: 10 },
  },

  // Yellow
  {
    Id: GemId.RigidKingsAmber,
    Name: `Rigid King's Amber`,
    Color: GemColor.Yellow,
    IconName: '',
    Phase: 1,
    Stats: { [Stat.HitRating]: 20 },
  },
  {
    Id: GemId.QuickKingsAmber,
    Name: `Quick King's Amber`,
    Color: GemColor.Yellow,
    IconName: '',
    Phase: 1,
    Stats: { [Stat.HasteRating]: 20 },
  },

  // Purple
  {
    Id: GemId.PurifiedDreadstone,
    Name: 'Purified Dreadstone',
    Color: GemColor.Purple,
    IconName: '',
    Phase: 1,
    Stats: { [Stat.SpellPower]: 12, [Stat.Spirit]: 10 },
  },

  // Green
  {
    Id: GemId.ShiningEyeOfZul,
    Name: 'Shining Eye of Zul',
    Color: GemColor.Green,
    IconName: '',
    Phase: 1,
    Stats: { [Stat.HitRating]: 10, [Stat.Spirit]: 10 },
  },

  // Blue

  // Void
]
