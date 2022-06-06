import { TalentName } from '../Types'

export const PresetTalents: {
  Name: string
  Talents: { [key in TalentName]?: number }
}[] = [
  {
    Name: 'Affliction',
    Talents: {
      'Improved Curse of Agony': 2,
      Suppression: 3,
      'Improved Corruption': 5,
      'Soul Siphon': 2,
      'Fel Concentration': 3,
      Nightfall: 2,
      'Empowered Corruption': 3,
      'Shadow Embrace': 5,
      'Siphon Life': 1,
      'Improved Felhunter': 2,
      'Shadow Mastery': 5,
      Eradication: 3,
      Contagion: 5,
      Malediction: 3,
      "Death's Embrace": 3,
      'Unstable Affliction': 1,
      Pandemic: 1,
      'Everlasting Affliction': 5,
      Haunt: 1,
      'Improved Shadow Bolt': 5,
      Bane: 5,
      Ruin: 5,
      Intensity: 1,
    },
  },
  {
    Name: 'Demonology',
    Talents: {
      'Demonic Embrace': 3,
      'Fel Synergy': 2,
      'Demonic Brutality': 3,
      'Fel Vitality': 3,
      'Soul Link': 1,
      'Fel Domination': 1,
      'Demonic Aegis': 3,
      'Unholy Power': 5,
      'Master Summoner': 2,
      'Master Conjuror': 2,
      'Master Demonologist': 5,
      'Molten Core': 3,
      'Demonic Empowerment': 1,
      'Demonic Knowledge': 3,
      'Demonic Tactics': 5,
      Decimation: 2,
      'Improved Demonic Tactics': 3,
      'Summon Felguard': 1,
      Nemesis: 2,
      'Demonic Pact': 5,
      Metamorphosis: 1,
      'Improved Shadow Bolt': 5,
      Bane: 5,
      Ruin: 5,
    },
  },
  {
    Name: 'Destruction',
    Talents: {
      'Improved Imp': 3,
      'Demonic Embrace': 3,
      'Fel Synergy': 1,
      'Fel Vitality': 3,
      'Demonic Aegis': 3,
      Bane: 5,
      Aftermath: 2,
      Cataclysm: 3,
      'Demonic Power': 2,
      Ruin: 5,
      Intensity: 2,
      'Destructive Reach': 1,
      Backlash: 3,
      'Improved Immolate': 3,
      Devastation: 1,
      Emberstorm: 5,
      Conflagrate: 1,
      'Soul Leech': 3,
      Pyroclasm: 3,
      'Shadow and Flame': 5,
      'Improved Soul Leech': 2,
      Backdraft: 3,
      'Empowered Imp': 3,
      'Fire and Brimstone': 5,
      'Chaos Bolt': 1,
    },
  },
]