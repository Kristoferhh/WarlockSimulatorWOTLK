import { Race, Stat, StatsCollection } from '../Types'

export const Races: { Name: string; Race: Race; Stats: StatsCollection }[] = [
  {
    Name: 'Gnome',
    Race: Race.Gnome,
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
    Stats: {
      [Stat.Health]: 7164,
      [Stat.Mana]: 3856,
      [Stat.Stamina]: 89,
      [Stat.Intellect]: 162,
      [Stat.Spirit]: 164,
    },
  },
]
