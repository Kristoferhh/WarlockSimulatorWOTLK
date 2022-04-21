import { RotationGroup, Spell } from '../Types';

export const Spells: Spell[] = [
  { Group: RotationGroup.Dots, Name: 'Immolate', IconName: 'spell_fire_immolation', Id: 27215 },
  { Group: RotationGroup.Dots, Name: 'Corruption', IconName: 'spell_shadow_abominationexplosion', Id: 27216 },
  { Group: RotationGroup.Dots, Name: 'Siphon Life', IconName: 'spell_shadow_requiem', Id: 30911 },
  { Group: RotationGroup.Dots, Name: 'Unstable Affliction', IconName: 'spell_shadow_unstableaffliction_3', Id: 30405 },

  { Group: RotationGroup.Filler, Name: 'Searing Pain', IconName: 'spell_fire_soulburn', Id: 30459 },
  { Group: RotationGroup.Filler, Name: 'Shadow Bolt', IconName: 'spell_shadow_shadowbolt', Id: 27209 },
  { Group: RotationGroup.Filler, Name: 'Incinerate', IconName: 'spell_fire_burnout', Id: 32231 },

  { Group: RotationGroup.Curse, Name: 'Curse of Recklessness', IconName: 'spell_shadow_unholystrength', Id: 27226 },
  { Group: RotationGroup.Curse, Name: 'Curse of the Elements', IconName: 'spell_shadow_chilltouch', Id: 27228 },
  { Group: RotationGroup.Curse, Name: 'Curse of Doom', IconName: 'spell_shadow_auraofdarkness', Id: 30910 },
  { Group: RotationGroup.Curse, Name: 'Curse of Agony', IconName: 'spell_shadow_curseofsargeras', Id: 27218 },

  { Group: RotationGroup.Finishers, Name: 'Death Coil', IconName: 'spell_shadow_deathcoil', Id: 27223 },
  { Group: RotationGroup.Finishers, Name: 'Shadowburn', IconName: 'spell_shadow_scourgebuild', Id: 30546 },
  { Group: RotationGroup.Finishers, Name: 'Conflagrate', IconName: 'spell_fire_fireball', Id: 30912 },

  { Group: RotationGroup.Other, Name: 'Shadowfury', IconName: 'spell_shadow_shadowfury', Id: 30414 },
  { Group: RotationGroup.Other, Name: 'Amplify Curse', IconName: 'spell_shadow_contagion', Id: 18288 },
  { Group: RotationGroup.Other, Name: 'Dark Pact', IconName: 'spell_shadow_darkritual', Id: 27265 },

  { Name: 'Life Tap', IconName: 'spell_shadow_burningspirit', Id: 27222 },
  { Name: 'Mp5', IconName: 'inv_elemental_mote_mana', Id: 0 },
  { Name: 'Melee', IconName: 'ability_meleedamage', Id: 0 },
  { Name: 'Cleave', IconName: 'ability_warrior_cleave', Id: 30224 },
  { Name: 'Lash of Pain', IconName: 'spell_shadow_curse', Id: 27274 },
  { Name: 'Firebolt', IconName: 'spell_fire_firebolt', Id: 27267 },
  { Name: 'Seed of Corruption', IconName: 'spell_shadow_seedofdestruction', Id: 27243 },
]