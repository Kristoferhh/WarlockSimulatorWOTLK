import {
  Item,
  ItemSlot,
  ItemSource,
  SocketColor,
  Quality,
  ItemSet,
  Stat,
  ItemId,
} from '../Types'

export const Items: Item[] = [
  // Head
  {
    Phase: 1,
    Id: ItemId.ValorousPlagueheartCirclet,
    ItemSlot: ItemSlot.Head,
    Name: 'Valorous Plagueheart Circlet',
    Set: ItemSet.T7,
    Sockets: [SocketColor.Meta, SocketColor.Yellow],
    SocketBonus: { [Stat.HasteRating]: 8 },
    Stats: {
      [Stat.Stamina]: 99,
      [Stat.Intellect]: 59,
      [Stat.Spirit]: 50,
      [Stat.HasteRating]: 56,
      [Stat.SpellPower]: 99,
    },
    Quality: Quality.Epic,
    Source: ItemSource.Naxxramas25Normal,
    IconName: 'inv_crown_01',
  },
]
