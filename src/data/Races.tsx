import { Faction, Race, RaceType, Stat } from '../Types'

export const Races: Race[] = [
  {
    Name: 'Gnome',
    Type: RaceType.Gnome,
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
    Type: RaceType.Human,
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
    Type: RaceType.Orc,
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
    Type: RaceType.Undead,
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
    Type: RaceType.BloodElf,
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
