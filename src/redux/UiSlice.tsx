import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  CombatLogBreakdown,
  GemSelectionTableStruct,
  InitialGemSelectionTableValue,
  ItemSlotDetailed,
  ItemSlot,
  Phase,
  Stat,
  StatWeightStats,
  SubSlotValue,
  UiState,
} from '../Types'

const initialUiState: UiState = {
  Sources: JSON.parse(
    localStorage.getItem('sources') || JSON.stringify([0, 1, 2, 3, 4, 5])
  ),
  GemSelectionTable: InitialGemSelectionTableValue,
  GemPreferences: JSON.parse(
    localStorage.getItem('gemPreferences') ||
      JSON.stringify({ hidden: [], favorites: [] })
  ),
  SelectedProfile: localStorage.getItem('selectedProfile') || '',
  ImportExportWindowVisible: false,
  EquippedItemsWindowVisible: false,
  FillItemSocketsWindowVisible: false,
  HiddenItems: JSON.parse(
    localStorage.getItem('hiddenItems') || JSON.stringify([])
  ),
  SelectedItemSlot:
    (localStorage.getItem('selectedItemSlot') as ItemSlot) || ItemSlot.Weapon,
  SelectedItemSubSlot:
    (localStorage.getItem('selectedItemSubSlot') as SubSlotValue) || '1',
  SavedItemDps: JSON.parse(localStorage.getItem('savedItemDps') || '{}'),
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
}

export const UiSlice = createSlice({
  name: 'ui',
  initialState: initialUiState,
  reducers: {
    togglePhase: (state, action: PayloadAction<Phase>) => {
      if (state.Sources.includes(action.payload)) {
        state.Sources = state.Sources.filter((e) => e !== action.payload)
      } else {
        state.Sources.push(action.payload)
      }

      localStorage.setItem('sources', JSON.stringify(state.Sources))
    },
    setGemSelectionTable: (
      state,
      action: PayloadAction<GemSelectionTableStruct>
    ) => {
      state.GemSelectionTable = action.payload
    },
    favoriteGem: (state, action: PayloadAction<number>) => {
      if (state.GemPreferences.favorites.includes(action.payload)) {
        state.GemPreferences.favorites = state.GemPreferences.favorites.filter(
          (e) => e !== action.payload
        )
      } else {
        state.GemPreferences.favorites.push(action.payload)
      }

      localStorage.setItem(
        'gemPreferences',
        JSON.stringify(state.GemPreferences)
      )
    },
    hideGem: (state, action: PayloadAction<number>) => {
      if (state.GemPreferences.hidden.includes(action.payload)) {
        state.GemPreferences.hidden = state.GemPreferences.hidden.filter(
          (e) => e !== action.payload
        )
      } else {
        state.GemPreferences.hidden.push(action.payload)
      }

      localStorage.setItem(
        'gemPreferences',
        JSON.stringify(state.GemPreferences)
      )
    },
    setSelectedProfile: (state, action: PayloadAction<string>) => {
      state.SelectedProfile = action.payload
      localStorage.setItem('selectedProfile', action.payload)
    },
    setImportExportWindowVisibility: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.ImportExportWindowVisible = action.payload
    },
    setEquippedItemsWindowVisibility: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.EquippedItemsWindowVisible = action.payload
    },
    setFillItemSocketsWindowVisibility: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.FillItemSocketsWindowVisible = action.payload
    },
    toggleHiddenItemId: (state, action: PayloadAction<number>) => {
      if (state.HiddenItems.includes(action.payload)) {
        state.HiddenItems = state.HiddenItems.filter(
          (e) => e !== action.payload
        )
      } else {
        state.HiddenItems.push(action.payload)
      }

      localStorage.setItem('hiddenItems', JSON.stringify(state.HiddenItems))
    },
    setSelectedItemSlot: (state, action: PayloadAction<ItemSlot>) => {
      state.SelectedItemSlot = action.payload
      localStorage.setItem('selectedItemSlot', state.SelectedItemSlot)
    },
    setSelectedItemSubSlot: (state, action: PayloadAction<SubSlotValue>) => {
      state.SelectedItemSubSlot = action.payload
      localStorage.setItem('selectedItemSubSlot', state.SelectedItemSubSlot)
    },
    setSavedItemDps: (
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
        localStorage.setItem('savedItemDps', JSON.stringify(state.SavedItemDps))
      }
    },
    setCombatLogVisibility: (state, action: PayloadAction<boolean>) => {
      state.CombatLog.Visible = action.payload
    },
    setCombatLogData: (state, action: PayloadAction<string[]>) => {
      state.CombatLog.Data = action.payload
    },
    setCombatLogBreakdownValue: (
      state,
      action: PayloadAction<CombatLogBreakdown>
    ) => {
      state.CombatLogBreakdown = action.payload
    },
    clearSavedItemSlotDps: (state, action: PayloadAction<ItemSlotDetailed>) => {
      state.SavedItemDps[action.payload] = {}
    },
    setHistogramVisibility: (state, action: PayloadAction<boolean>) => {
      state.Histogram.Visible = action.payload
    },
    setHistogramData: (
      state,
      action: PayloadAction<{ [key: string]: number }>
    ) => {
      state.Histogram.Data = action.payload
    },
    setStatWeightVisibility: (state, action: PayloadAction<boolean>) => {
      state.StatWeights.Visible = action.payload
    },
    setStatWeightValue: (
      state,
      action: PayloadAction<{ stat: [keyof StatWeightStats]; value: number }>
    ) => {
      state.StatWeights.StatValues[action.payload.stat as unknown as Stat] =
        action.payload.value
    },
    setSimulationInProgressStatus: (state, action: PayloadAction<boolean>) => {
      state.SimulationInProgress = action.payload
    },
  },
})

export const {
  setStatWeightValue,
  setSimulationInProgressStatus,
  setStatWeightVisibility,
  setHistogramData,
  setHistogramVisibility,
  clearSavedItemSlotDps,
  setCombatLogBreakdownValue,
  setCombatLogData,
  setCombatLogVisibility,
  setSavedItemDps,
  setSelectedItemSubSlot,
  setSelectedItemSlot,
  setFillItemSocketsWindowVisibility,
  setEquippedItemsWindowVisibility,
  toggleHiddenItemId,
  setImportExportWindowVisibility,
  setSelectedProfile,
  togglePhase,
  setGemSelectionTable,
  favoriteGem,
  hideGem,
} = UiSlice.actions
export default UiSlice.reducer
