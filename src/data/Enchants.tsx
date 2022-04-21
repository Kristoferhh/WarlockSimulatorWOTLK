import {
  ItemSlot,
  Enchant,
  ItemSource,
  Quality,
  EnchantId,
  Stat,
} from '../Types'

export const Enchants: Enchant[] = [
  // Head
  {
    Phase: 1,
    Id: EnchantId.ArcanumOfBurningMysteries,
    Name: 'Arcanum of Burning Mysteries',
    ItemSlot: ItemSlot.Head,
    Quality: Quality.Heirloom,
    Stats: { [Stat.SpellPower]: 30, [Stat.CritRating]: 20 },
    Source: ItemSource.KirinTorRevered,
  },
]
