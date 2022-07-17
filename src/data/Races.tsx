import { Faction, Race, Stat, StatsCollection } from '../Types'

export const Races: { Name: string; Race: Race; Stats: StatsCollection, Faction: Faction }[] = [
  {
    Name: 'Gnome',
    Race: Race.Gnome,
    Faction: Faction.Alliance,
    Stats: {
      [Stat.Health]: 7164,
      [Stat.Mana]: 3856,
      [Stat.Stamina]: 89,
      [Stat.Intellect]: 163,
      [Stat.Spirit]: 166,
      [Stat.IntellectModifier]: 1.05,
    },
  },
  {
    Name: 'Human',
    Race: Race.Human,
    Faction: Faction.Alliance,
    Stats: {
      [Stat.Health]: 7164,
      [Stat.Mana]: 3856,
      [Stat.Stamina]: 89,
      [Stat.Intellect]: 159,
      [Stat.Spirit]: 166,
      [Stat.SpiritModifier]: 1.1,
    },
  },
  {
    Name: 'Orc',
    Race: Race.Orc,
    Faction: Faction.Horde,
    Stats: {
      [Stat.Health]: 7164,
      [Stat.Mana]: 3856,
      [Stat.Stamina]: 90,
      [Stat.Intellect]: 156,
      [Stat.Spirit]: 168,
      [Stat.PetDamageModifier]: 1.05,
    },
  },
  {
    Name: 'Undead',
    Race: Race.Undead,
    Faction: Faction.Horde,
    Stats: {
      [Stat.Health]: 7164,
      [Stat.Mana]: 3856,
      [Stat.Stamina]: 89,
      [Stat.Intellect]: 157,
      [Stat.Spirit]: 171,
    },
  },
  {
    Name: 'Blood Elf',
    Race: Race.BloodElf,
    Faction: Faction.Horde,
    Stats: {
      [Stat.Health]: 7164,
      [Stat.Mana]: 3856,
      [Stat.Stamina]: 89,
      [Stat.Intellect]: 162,
      [Stat.Spirit]: 164,
    },
  },
]
