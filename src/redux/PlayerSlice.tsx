import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GetRemainingTalentPoints } from '../Common'
import {
  AuraId,
  GlyphId,
  GlyphStore,
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
  TalentStore
} from '../Types'

const initialPlayerState: PlayerState = {
  Talents: JSON.parse(localStorage.getItem('wotlk_talents') || '{}'),
  TalentPointsRemaining: GetRemainingTalentPoints(
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
    SetSelectedTalents: (state, action: PayloadAction<TalentStore>) => {
      state.Talents = action.payload
      state.TalentPointsRemaining = GetRemainingTalentPoints(state.Talents)
      localStorage.setItem('wotlk_talents', JSON.stringify(state.Talents))
    },
    SetSelectedItems: (
      state,
      action: PayloadAction<ItemSlotDetailedStruct>
    ) => {
      state.SelectedItems = action.payload
      localStorage.setItem(
        'wotlk_selectedItems',
        JSON.stringify(state.SelectedItems)
      )
    },
    SetSelectedEnchants: (
      state,
      action: PayloadAction<ItemSlotDetailedStruct>
    ) => {
      state.SelectedEnchants = action.payload
      localStorage.setItem(
        'wotlk_selectedEnchants',
        JSON.stringify(state.SelectedEnchants)
      )
    },
    SetSelectedAuras: (state, action: PayloadAction<AuraId[]>) => {
      state.Auras = action.payload
      localStorage.setItem('wotlk_auras', JSON.stringify(state.Auras))
    },
    ToggleRotationSpellSelection: (state, action: PayloadAction<Spell>) => {
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
    SetBaseStats: (state, action: PayloadAction<StatsCollection>) => {
      state.Stats.Base = action.payload
    },
    SetAurasStats: (state, action: PayloadAction<StatsCollection>) => {
      state.Stats.Auras = action.payload
    },
    SetItemsStats: (state, action: PayloadAction<StatsCollection>) => {
      state.Stats.Items = action.payload
    },
    SetTalentsStats: (state, action: PayloadAction<StatsCollection>) => {
      state.Stats.Talents = action.payload
    },
    SetGemsStats: (state, action: PayloadAction<StatsCollection>) => {
      state.Stats.Gems = action.payload
    },
    SetEnchantsStats: (state, action: PayloadAction<StatsCollection>) => {
      state.Stats.Enchants = action.payload
    },
    SetItemSetCounts: (state, action: PayloadAction<SetsStruct>) => {
      state.Sets = action.payload
    },
    SodifySettingValue: (
      state,
      action: PayloadAction<{ Setting: Setting; Value: string }>
    ) => {
      state.Settings[action.payload.Setting] = action.payload.Value
      localStorage.setItem('wotlk_settings', JSON.stringify(state.Settings))
    },
    SetProfile: (state, action: PayloadAction<ProfileContainer>) => {
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
    SetSelectedGems: (state, action: PayloadAction<SelectedGemsStruct>) => {
      state.SelectedGems = action.payload
      localStorage.setItem(
        'wotlk_selectedGems',
        JSON.stringify(state.SelectedGems)
      )
    },
    DeleteProfile: (state, action: PayloadAction<string>) => {
      state.Profiles = state.Profiles.filter(
        (x: ProfileContainer) => x.Name !== action.payload
      )
      localStorage.setItem('wotlk_profiles', JSON.stringify(state.Profiles))
      localStorage.removeItem('wotlk_selectedProfile')
    },
    RenameProfile: (
      state,
      action: PayloadAction<{ OldName: string; NewName: string }>
    ) => {
      state.Profiles.find(
        (x: ProfileContainer) => x.Name === action.payload.OldName
      )!.Name = action.payload.NewName
      localStorage.setItem('wotlk_profiles', JSON.stringify(state.Profiles))
      localStorage.setItem('wotlk_selectedProfile', action.payload.NewName)
    },
    SetRotationState: (state, action: PayloadAction<RotationStruct>) => {
      state.Rotation = action.payload
      localStorage.setItem('wotlk_rotation', JSON.stringify(action.payload))
    },
    SetSettingsState: (state, action: PayloadAction<Settings>) => {
      state.Settings = action.payload
      localStorage.setItem('wotlk_settings', JSON.stringify(action.payload))
    },
    SetGlyphSlotId: (
      state,
      action: PayloadAction<{ slot: number; id: GlyphId | undefined }>
    ) => {
      state.Glyphs[GlyphType.Major][action.payload.slot] = action.payload.id
      localStorage.setItem('wotlk_glyphs', JSON.stringify(state.Glyphs))
    },
    SetSelectedGlyphs: (state, action: PayloadAction<GlyphStore>) => {
      state.Glyphs = action.payload
      localStorage.setItem('wotlk_glyphs', JSON.stringify(action.payload))
    },
  },
})

export const {
  SetSettingsState,
  SetRotationState,
  SetSelectedGems,
  SetSelectedEnchants,
  SetSelectedItems,
  SetSelectedAuras,
  SetItemSetCounts,
  SetAurasStats,
  SetBaseStats,
  SetEnchantsStats,
  SetGemsStats,
  SetItemsStats,
  RenameProfile,
  DeleteProfile,
  SetSelectedTalents,
  ToggleRotationSpellSelection,
  SodifySettingValue,
  SetProfile,
  SetTalentsStats,
  SetGlyphSlotId,
  SetSelectedGlyphs,
} = PlayerSlice.actions
export default PlayerSlice.reducer
