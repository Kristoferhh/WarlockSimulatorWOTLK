import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  CombatLogBreakdown,
  GemSelectionTableStruct,
  InitialGemSelectionTableValue,
  InitialGlyphSelectionTableValue,
  ItemSlot,
  ItemSlotDetailed,
  Phase,
  Stat,
  StatWeightStats,
  SubSlotValue,
  UiState,
} from '../Types'

const initialUiState: UiState = {
  Sources: JSON.parse(
    localStorage.getItem('wotlk_sources') || JSON.stringify([0, 1, 2, 3, 4, 5])
  ),
  GemSelectionTable: InitialGemSelectionTableValue,
  GemPreferences: JSON.parse(
    localStorage.getItem('wotlk_gemPreferences') ||
      JSON.stringify({ hidden: [], favorites: [] })
  ),
  SelectedProfile: localStorage.getItem('wotlk_selectedProfile') || '',
  ImportExportWindowVisible: false,
  EquippedItemsWindowVisible: false,
  FillItemSocketsWindowVisible: false,
  HiddenItems: JSON.parse(
    localStorage.getItem('wotlk_hiddenItems') || JSON.stringify([])
  ),
  SelectedItemSlot:
    (localStorage.getItem('wotlk_selectedItemSlot') as ItemSlot) ||
    ItemSlot.Weapon,
  SelectedItemSubSlot:
    (localStorage.getItem('wotlk_selectedItemSubSlot') as SubSlotValue) || '1',
  SavedItemDps: JSON.parse(localStorage.getItem('wotlk_savedItemDps') || '{}'),
  CombatLog: { Visible: false, Data: [] },
  CombatLogBreakdown: {
    TotalDamageDone: 0,
    TotalManaGained: 0,
    TotalSimulationFightLength: 0,
    TotalIterationAmount: 0,
    SpellDamageDict: {},
    SpellManaGainDict: {},
    Data: [],
  },
  Histogram: { Visible: false },
  SimulationInProgress: false,
  StatWeights: {
    Visible: false,
    StatValues: {
      [Stat.Stamina]: 0,
      [Stat.Intellect]: 0,
      [Stat.Spirit]: 0,
      [Stat.SpellPower]: 0,
      [Stat.ShadowPower]: 0,
      [Stat.FirePower]: 0,
      [Stat.HitRating]: 0,
      [Stat.CritRating]: 0,
      [Stat.HasteRating]: 0,
      [Stat.Mp5]: 0,
    },
  },
  GlyphSelectionTable: InitialGlyphSelectionTableValue,
}

export const UiSlice = createSlice({
  name: 'ui',
  initialState: initialUiState,
  reducers: {
    TogglePhase: (state, action: PayloadAction<Phase>) => {
      if (state.Sources.includes(action.payload)) {
        state.Sources = state.Sources.filter(
          (e: number) => e !== action.payload
        )
      } else {
        state.Sources.push(action.payload)
      }

      localStorage.setItem('wotlk_sources', JSON.stringify(state.Sources))
    },
    SetGemSelectionTable: (
      state,
      action: PayloadAction<GemSelectionTableStruct>
    ) => {
      state.GemSelectionTable = action.payload
    },
    FavoriteGem: (state, action: PayloadAction<number>) => {
      if (state.GemPreferences.favorites.includes(action.payload)) {
        state.GemPreferences.favorites = state.GemPreferences.favorites.filter(
          (e: number) => e !== action.payload
        )
      } else {
        state.GemPreferences.favorites.push(action.payload)
      }

      localStorage.setItem(
        'wotlk_gemPreferences',
        JSON.stringify(state.GemPreferences)
      )
    },
    HideGem: (state, action: PayloadAction<number>) => {
      if (state.GemPreferences.hidden.includes(action.payload)) {
        state.GemPreferences.hidden = state.GemPreferences.hidden.filter(
          (e: number) => e !== action.payload
        )
      } else {
        state.GemPreferences.hidden.push(action.payload)
      }

      localStorage.setItem(
        'wotlk_gemPreferences',
        JSON.stringify(state.GemPreferences)
      )
    },
    SetSelectedProfile: (state, action: PayloadAction<string>) => {
      state.SelectedProfile = action.payload
      localStorage.setItem('wotlk_selectedProfile', action.payload)
    },
    SetImportExportWindowVisibility: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.ImportExportWindowVisible = action.payload
    },
    SetEquippedItemsWindowVisibility: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.EquippedItemsWindowVisible = action.payload
    },
    SetFillItemSocketsWindowVisibility: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.FillItemSocketsWindowVisible = action.payload
    },
    ToggleHiddenItemId: (state, action: PayloadAction<number>) => {
      if (state.HiddenItems.includes(action.payload)) {
        state.HiddenItems = state.HiddenItems.filter(
          (e: number) => e !== action.payload
        )
      } else {
        state.HiddenItems.push(action.payload)
      }

      localStorage.setItem(
        'wotlk_hiddenItems',
        JSON.stringify(state.HiddenItems)
      )
    },
    SetSelectedItemSlot: (state, action: PayloadAction<ItemSlot>) => {
      state.SelectedItemSlot = action.payload
      localStorage.setItem('wotlk_selectedItemSlot', state.SelectedItemSlot)
    },
    SetSelectedItemSubSlot: (state, action: PayloadAction<SubSlotValue>) => {
      state.SelectedItemSubSlot = action.payload
      localStorage.setItem(
        'wotlk_selectedItemSubSlot',
        state.SelectedItemSubSlot
      )
    },
    SetSavedItemDps: (
      state,
      action: PayloadAction<{
        itemSlot: ItemSlotDetailed
        itemId: number
        dps: number
        saveLocalStorage: boolean
      }>
    ) => {
      if (!state.SavedItemDps[action.payload.itemSlot]) {
        state.SavedItemDps[action.payload.itemSlot] = {}
      }

      state.SavedItemDps[action.payload.itemSlot][action.payload.itemId] =
        action.payload.dps
      if (action.payload.saveLocalStorage) {
        localStorage.setItem(
          'wotlk_savedItemDps',
          JSON.stringify(state.SavedItemDps)
        )
      }
    },
    SetCombatLogVisibility: (state, action: PayloadAction<boolean>) => {
      state.CombatLog.Visible = action.payload
    },
    SetCombatLogData: (state, action: PayloadAction<string[]>) => {
      state.CombatLog.Data = action.payload
    },
    SetCombatLogBreakdownValue: (
      state,
      action: PayloadAction<CombatLogBreakdown>
    ) => {
      state.CombatLogBreakdown = action.payload
    },
    ClearSavedItemSlotDps: (state, action: PayloadAction<ItemSlotDetailed>) => {
      state.SavedItemDps[action.payload] = {}
    },
    SetHistogramVisibility: (state, action: PayloadAction<boolean>) => {
      state.Histogram.Visible = action.payload
    },
    SetHistogramData: (
      state,
      action: PayloadAction<{ [key: string]: number }>
    ) => {
      state.Histogram.Data = action.payload
    },
    SetStatWeightVisibility: (state, action: PayloadAction<boolean>) => {
      state.StatWeights.Visible = action.payload
    },
    SetStatWeightValue: (
      state,
      action: PayloadAction<{ stat: [keyof StatWeightStats]; value: number }>
    ) => {
      state.StatWeights.StatValues[action.payload.stat as unknown as Stat] =
        action.payload.value
    },
    SetSimulationInProgressStatus: (state, action: PayloadAction<boolean>) => {
      state.SimulationInProgress = action.payload
    },
    SetGlyphSelectionTableVisibility: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.GlyphSelectionTable.Visible = action.payload
    },
    SetGlyphSelectionTableGlyphSlot: (state, action: PayloadAction<number>) => {
      state.GlyphSelectionTable.GlyphSlot = action.payload
    },
  },
})

export const {
  SetStatWeightValue,
  SetSimulationInProgressStatus,
  SetStatWeightVisibility,
  SetHistogramData,
  SetHistogramVisibility,
  ClearSavedItemSlotDps,
  SetCombatLogBreakdownValue,
  SetCombatLogData,
  SetCombatLogVisibility,
  SetSavedItemDps,
  SetSelectedItemSubSlot,
  SetSelectedItemSlot,
  SetFillItemSocketsWindowVisibility,
  SetEquippedItemsWindowVisibility,
  ToggleHiddenItemId,
  SetImportExportWindowVisibility,
  SetSelectedProfile,
  TogglePhase,
  SetGemSelectionTable,
  FavoriteGem,
  HideGem,
  SetGlyphSelectionTableGlyphSlot,
  SetGlyphSelectionTableVisibility,
} = UiSlice.actions
export default UiSlice.reducer
