import { ItemSourceUiName, Source } from '../Types'

export const UiSources: Source[] = [
  { Name: ItemSourceUiName.P1, Phase: 1 },
  { Name: ItemSourceUiName.P2, Phase: 2 },
  { Name: ItemSourceUiName.P3, Phase: 3 },
  { Name: ItemSourceUiName.P4, Phase: 4 },
  { Name: ItemSourceUiName.Dungeon, Dungeon: true },
  { Name: ItemSourceUiName.Raid, Raid: true },
  { Name: ItemSourceUiName.Heroic, Heroic: true },
  { Name: ItemSourceUiName.Normal, Normal: true },
  { Name: ItemSourceUiName.TenMan, TenMan: true },
  { Name: ItemSourceUiName.TwentyFiveMan, TwentyFiveMan: true },
  { Name: ItemSourceUiName.Professions, Professions: true },
  { Name: ItemSourceUiName.BoE, BoE: true },
]
