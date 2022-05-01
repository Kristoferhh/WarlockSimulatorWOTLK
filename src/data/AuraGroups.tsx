import { IAuraGroup, AuraGroup } from '../Types'

export const AuraGroups: IAuraGroup[] = [
  { Heading: AuraGroup.Buffs, Type: 'spell' },
  { Heading: AuraGroup.Debuffs, Type: 'spell' },
  { Heading: AuraGroup.Consumables, Type: 'item' },
  { Heading: AuraGroup.PetBuffs, Type: 'spell' },
]
