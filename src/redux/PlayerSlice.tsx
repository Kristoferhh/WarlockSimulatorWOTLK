import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getRemainingTalentPoints } from '../Common'
import {
  AuraId,
  GlyphId,
  GlyphType,
  InitialGlyphs,
  InitialPlayerStats,
  InitialRotation,
  InitialSelectedGems,
  InitialSelectedItemsAndEnchants,
  InitialSetCounts,
  InitialSettings,
  ItemSlotDetailedStruct,
  PlayerState,
  ProfileContainer,
  RotationGroup,
  RotationGroups,
  RotationStruct,
  SelectedGemsStruct,
  SetsStruct,
  Setting,
  Settings,
  Spell,
  SpellId,
  StatsCollection,
  TalentStore,
} from '../Types'

const initialPlayerState: PlayerState = {
  Talents: JSON.parse(localStorage.getItem('wotlk_talents') || '{}'),
  TalentPointsRemaining: getRemainingTalentPoints(
    JSON.parse(localStorage.getItem('wotlk_talents') || '{}')
  ),
  SelectedItems: JSON.parse(
    localStorage.getItem('wotlk_selectedItems') ||
      JSON.stringify(InitialSelectedItemsAndEnchants)
  ),
  SelectedEnchants: JSON.parse(
    localStorage.getItem('wotlk_selectedEnchants') ||
      JSON.stringify(InitialSelectedItemsAndEnchants)
  ),
  SelectedGems: JSON.parse(
    localStorage.getItem('wotlk_selectedGems') ||
      JSON.stringify(InitialSelectedGems)
  ),
  Auras: JSON.parse(localStorage.getItem('wotlk_auras') || '[]'),
  Rotation: JSON.parse(
    localStorage.getItem('wotlk_rotation') || JSON.stringify(InitialRotation)
  ),
  Stats: {
    Base: InitialPlayerStats,
    Auras: InitialPlayerStats,
    Items: InitialPlayerStats,
    Gems: InitialPlayerStats,
    Enchants: InitialPlayerStats,
    Talents: InitialPlayerStats,
  },
  Settings: JSON.parse(
    localStorage.getItem('wotlk_settings') || JSON.stringify(InitialSettings)
  ),
  Profiles: JSON.parse(localStorage.getItem('wotlk_profiles') || '[]'),
  Sets: InitialSetCounts,
  Glyphs: JSON.parse(
    localStorage.getItem('wotlk_glyphs') || JSON.stringify(InitialGlyphs)
  ),
}

export const PlayerSlice = createSlice({
  name: 'player',
  initialState: initialPlayerState,
  reducers: {
    setSelectedTalents: (state, action: PayloadAction<TalentStore>) => {
      state.Talents = action.payload
      state.TalentPointsRemaining = getRemainingTalentPoints(state.Talents)
      localStorage.setItem('wotlk_talents', JSON.stringify(state.Talents))
    },
    setSelectedItems: (
      state,
      action: PayloadAction<ItemSlotDetailedStruct>
    ) => {
      state.SelectedItems = action.payload
      localStorage.setItem(
        'wotlk_selectedItems',
        JSON.stringify(state.SelectedItems)
      )
    },
    setSelectedEnchants: (
      state,
      action: PayloadAction<ItemSlotDetailedStruct>
    ) => {
      state.SelectedEnchants = action.payload
      localStorage.setItem(
        'wotlk_selectedEnchants',
        JSON.stringify(state.SelectedEnchants)
      )
    },
    setSelectedAuras: (state, action: PayloadAction<AuraId[]>) => {
      state.Auras = action.payload
      localStorage.setItem('wotlk_auras', JSON.stringify(state.Auras))
    },
    toggleRotationSpellSelection: (state, action: PayloadAction<Spell>) => {
      const rotationGroup = RotationGroups.find(
        e => e.Header === action.payload.Group
      )

      // TODO move this logic out of this function
      if (rotationGroup) {
        // If a filler/curse/aoe is being enabled then disable all other curse/filler/aoe abilities
        if (
          !state.Rotation[rotationGroup.Header].includes(action.payload.Id) &&
          [
            RotationGroup.Filler,
            RotationGroup.Curse,
            RotationGroup.Aoe,
          ].includes(rotationGroup.Header)
        ) {
          state.Rotation[rotationGroup.Header] = []
        }

        if (state.Rotation[rotationGroup.Header].includes(action.payload.Id)) {
          state.Rotation[rotationGroup.Header] = state.Rotation[
            rotationGroup.Header
          ].filter((e: SpellId) => e !== action.payload.Id)
        } else {
          state.Rotation[rotationGroup.Header].push(action.payload.Id)
        }

        localStorage.setItem('wotlk_rotation', JSON.stringify(state.Rotation))
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
    setTalentsStats: (state, action: PayloadAction<StatsCollection>) => {
      state.Stats.Talents = action.payload
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
      localStorage.setItem('wotlk_settings', JSON.stringify(state.Settings))
    },
    setProfile: (state, action: PayloadAction<ProfileContainer>) => {
      var existingProfile = state.Profiles.find(
        x => x.Name === action.payload.Name
      )

      if (existingProfile) {
        existingProfile.Profile = action.payload.Profile
      } else {
        state.Profiles.push(action.payload)
      }

      localStorage.setItem('wotlk_profiles', JSON.stringify(state.Profiles))
    },
    setSelectedGems: (state, action: PayloadAction<SelectedGemsStruct>) => {
      state.SelectedGems = action.payload
      localStorage.setItem(
        'wotlk_selectedGems',
        JSON.stringify(state.SelectedGems)
      )
    },
    deleteProfile: (state, action: PayloadAction<string>) => {
      state.Profiles = state.Profiles.filter(
        (x: ProfileContainer) => x.Name !== action.payload
      )
      localStorage.setItem('wotlk_profiles', JSON.stringify(state.Profiles))
      localStorage.removeItem('wotlk_selectedProfile')
    },
    renameProfile: (
      state,
      action: PayloadAction<{ oldName: string; newName: string }>
    ) => {
      state.Profiles.find(
        (x: ProfileContainer) => x.Name === action.payload.oldName
      )!.Name = action.payload.newName
      localStorage.setItem('wotlk_profiles', JSON.stringify(state.Profiles))
      localStorage.setItem('wotlk_selectedProfile', action.payload.newName)
    },
    setTalentsState: (state, action: PayloadAction<TalentStore>) => {
      state.Talents = action.payload
      localStorage.setItem('wotlk_talents', JSON.stringify(action.payload))
    },
    setRotationState: (state, action: PayloadAction<RotationStruct>) => {
      state.Rotation = action.payload
      localStorage.setItem('wotlk_rotation', JSON.stringify(action.payload))
    },
    setSettingsState: (state, action: PayloadAction<Settings>) => {
      state.Settings = action.payload
      localStorage.setItem('wotlk_settings', JSON.stringify(action.payload))
    },
    setGlyphSlotId: (
      state,
      action: PayloadAction<{ slot: number; id: GlyphId | undefined }>
    ) => {
      state.Glyphs[GlyphType.Major][action.payload.slot] = action.payload.id
      localStorage.setItem('wotlk_glyphs', JSON.stringify(state.Glyphs))
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
  setSelectedTalents,
  toggleRotationSpellSelection,
  modifySettingValue,
  setProfile,
  setTalentsStats,
  setGlyphSlotId,
} = PlayerSlice.actions
export default PlayerSlice.reducer
