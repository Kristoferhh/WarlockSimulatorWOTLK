import { SocketColor, GemColor } from '../Types'

export const Sockets: {
  Color: SocketColor
  IconName: string
  ValidColors: GemColor[]
}[] = [
  {
    Color: SocketColor.Meta,
    IconName: 'UI-EmptySocket-Meta',
    ValidColors: [GemColor.Meta],
  },
  {
    Color: SocketColor.Red,
    IconName: 'UI-EmptySocket-Red',
    ValidColors: [
      GemColor.Red,
      GemColor.Orange,
      GemColor.Purple,
      GemColor.Void,
    ],
  },
  {
    Color: SocketColor.Yellow,
    IconName: 'UI-EmptySocket-Yellow',
    ValidColors: [
      GemColor.Yellow,
      GemColor.Orange,
      GemColor.Green,
      GemColor.Void,
    ],
  },
  {
    Color: SocketColor.Blue,
    IconName: 'UI-EmptySocket-Blue',
    ValidColors: [
      GemColor.Blue,
      GemColor.Green,
      GemColor.Purple,
      GemColor.Void,
    ],
  },
]
