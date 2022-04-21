import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getRemainingTalentPoints } from '../Common'
import {
  RotationGroup,
  Spell,
  PlayerState,
  InitialPlayerStats,
  InitialSelectedItemsAndEnchants,
  InitialSettings,
  InitialSelectedGems,
  TalentName,
  Setting,
  StatsCollection,
  InitialSetCounts,
  SetsStruct,
  ItemSlotDetailedStruct,
  SelectedGemsStruct,
  TalentStore,
  RotationStruct,
  Settings,
  RotationGroups,
  AuraId,
  InitialRotation,
  ProfileContainer,
} from '../Types'

const initialPlayerState: PlayerState = {
  Talents: JSON.parse(localStorage.getItem('talents') || '{}'),
  TalentPointsRemaining: getRemainingTalentPoints(
    JSON.parse(localStorage.getItem('talents') || '{}')
  ),
  SelectedItems: JSON.parse(
    localStorage.getItem('selectedItems') ||
      JSON.stringify(InitialSelectedItemsAndEnchants)
  ),
  SelectedEnchants: JSON.parse(
    localStorage.getItem('selectedEnchants') ||
      JSON.stringify(InitialSelectedItemsAndEnchants)
  ),
  SelectedGems: JSON.parse(
    localStorage.getItem('selectedGems') || JSON.stringify(InitialSelectedGems)
  ),
  Auras: JSON.parse(localStorage.getItem('auras') || '[]'),
  Rotation: JSON.parse(
    localStorage.getItem('rotation') || JSON.stringify(InitialRotation)
  ),
  Stats: {
    Base: InitialPlayerStats,
    Auras: InitialPlayerStats,
    Items: InitialPlayerStats,
    Gems: InitialPlayerStats,
    Enchants: InitialPlayerStats,
  },
  Settings: JSON.parse(
    localStorage.getItem('settings') || JSON.stringify(InitialSettings)
  ),
  Profiles: JSON.parse(localStorage.getItem('profiles') || '[]'),
  Sets: InitialSetCounts,
}

export const PlayerSlice = createSlice({
  name: 'player',
  initialState: initialPlayerState,
  reducers: {
    setTalentPointValue: (
      state,
      talent: PayloadAction<{ name: TalentName; points: number }>
    ) => {
      state.Talents[talent.payload.name] = talent.payload.points
      state.TalentPointsRemaining = getRemainingTalentPoints(state.Talents)
      localStorage.setItem('talents', JSON.stringify(state.Talents))
    },
    setSelectedItems: (
      state,
      action: PayloadAction<ItemSlotDetailedStruct>
    ) => {
      state.SelectedItems = action.payload
      localStorage.setItem('selectedItems', JSON.stringify(state.SelectedItems))
    },
    setSelectedEnchants: (
      state,
      action: PayloadAction<ItemSlotDetailedStruct>
    ) => {
      state.SelectedEnchants = action.payload
      localStorage.setItem(
        'selectedEnchants',
        JSON.stringify(state.SelectedEnchants)
      )
    },
    setSelectedAuras: (state, action: PayloadAction<AuraId[]>) => {
      state.Auras = action.payload
      localStorage.setItem('auras', JSON.stringify(state.Auras))
    },
    toggleRotationSpellSelection: (state, action: PayloadAction<Spell>) => {
      const rotationGroup = RotationGroups.find(
        (e) => e.Header === action.payload.Group
      )

      if (rotationGroup) {
        // If a filler/curse is being enabled then disable all other curses/fillers
        if (
          !state.Rotation[rotationGroup.Header].includes(action.payload.Id) &&
          [RotationGroup.Filler, RotationGroup.Curse].includes(
            rotationGroup.Header
          )
        ) {
          state.Rotation[rotationGroup.Header] = []
        }

        if (state.Rotation[rotationGroup.Header].includes(action.payload.Id)) {
          state.Rotation[rotationGroup.Header] = state.Rotation[
            rotationGroup.Header
          ].filter((e) => e !== action.payload.Id)
        } else {
          state.Rotation[rotationGroup.Header].push(action.payload.Id)
        }

        localStorage.setItem('rotation', JSON.stringify(state.Rotation))
      }
    },
    setBaseStats: (state, action: PayloadAction<StatsCollection>) => {
      state.Stats.Base = action.payload
    },
    setAurasStats: (state, action: PayloadAction<StatsCollection>) => {
      state.Stats.Auras = action.payload
    },
    setItemsStats: (state, action: PayloadAction<StatsCollection>) => {
      state.Stats.Items = action.payload
    },
    setGemsStats: (state, action: PayloadAction<StatsCollection>) => {
      state.Stats.Gems = action.payload
    },
    setEnchantsStats: (state, action: PayloadAction<StatsCollection>) => {
      state.Stats.Enchants = action.payload
    },
    setItemSetCounts: (state, action: PayloadAction<SetsStruct>) => {
      state.Sets = action.payload
    },
    modifySettingValue: (
      state,
      action: PayloadAction<{ setting: Setting; value: string }>
    ) => {
      state.Settings[action.payload.setting] = action.payload.value
      localStorage.setItem('settings', JSON.stringify(state.Settings))
    },
    setProfile: (state, action: PayloadAction<ProfileContainer>) => {
      state.Profiles.push(action.payload)
      localStorage.setItem('profiles', JSON.stringify(state.Profiles))
    },
    setSelectedGems: (state, action: PayloadAction<SelectedGemsStruct>) => {
      state.SelectedGems = action.payload
      localStorage.setItem('selectedGems', JSON.stringify(state.SelectedGems))
    },
    deleteProfile: (state, action: PayloadAction<string>) => {
      state.Profiles = state.Profiles.filter((x) => x.Name !== action.payload)
      localStorage.setItem('profiles', JSON.stringify(state.Profiles))
      localStorage.removeItem('selectedProfile')
    },
    renameProfile: (
      state,
      action: PayloadAction<{ oldName: string; newName: string }>
    ) => {
      state.Profiles.find((x) => x.Name === action.payload.oldName)!.Name =
        action.payload.newName
      localStorage.setItem('profiles', JSON.stringify(state.Profiles))
      localStorage.setItem('selectedProfile', action.payload.newName)
    },
    setTalentsState: (state, action: PayloadAction<TalentStore>) => {
      state.Talents = action.payload
      localStorage.setItem('talents', JSON.stringify(action.payload))
    },
    setRotationState: (state, action: PayloadAction<RotationStruct>) => {
      state.Rotation = action.payload
      localStorage.setItem('rotation', JSON.stringify(action.payload))
    },
    setSettingsState: (state, action: PayloadAction<Settings>) => {
      state.Settings = action.payload
      localStorage.setItem('settings', JSON.stringify(action.payload))
    },
  },
})

export const {
  setSettingsState,
  setRotationState,
  setTalentsState,
  setSelectedGems,
  setSelectedEnchants,
  setSelectedItems,
  setSelectedAuras,
  setItemSetCounts,
  setAurasStats,
  setBaseStats,
  setEnchantsStats,
  setGemsStats,
  setItemsStats,
  renameProfile,
  deleteProfile,
  setTalentPointValue,
  toggleRotationSpellSelection,
  modifySettingValue,
  setProfile,
} = PlayerSlice.actions
export default PlayerSlice.reducer
