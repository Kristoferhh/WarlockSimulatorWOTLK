import { Button, Grid, TextField, Typography } from '@mui/material'
import { nanoid } from '@reduxjs/toolkit'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  GetAurasStats,
  GetBaseStats,
  GetEnchantsStats,
  GetGemsStats,
  GetItemSetCounts,
  GetItemsStats,
} from '../Common'
import {
  DeleteProfile,
  RenameProfile,
  SetAurasStats,
  SetBaseStats,
  SetEnchantsStats,
  SetGemsStats,
  SetItemSetCounts,
  SetItemsStats,
  SetProfile,
  SetRotationState,
  SetSelectedAuras,
  SetSelectedEnchants,
  SetSelectedGems,
  SetSelectedItems,
  SetSelectedTalents,
  SetSettingsState,
} from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import {
  SetImportExportWindowVisibility,
  SetSelectedProfile,
  TogglePhase,
} from '../redux/UiSlice'
import { Phase, ProfileContainer, RaceType, Setting } from '../Types'

const phases: { title: string; phase: Phase }[] = [
  { title: 'TBC', phase: 0 },
  { title: 'P1', phase: 1 },
  { title: 'P2', phase: 2 },
  { title: 'P3', phase: 3 },
  { title: 'P4', phase: 4 },
]

export default function ProfilesAndSources() {
  const player = useSelector((state: RootState) => state.player)
  const ui = useSelector((state: RootState) => state.ui)
  const dispatch = useDispatch()
  const [profileName, SetProfileName] = useState('')
  const selectedProfileExists =
    player.Profiles.find(x => x.Name === ui.SelectedProfile) != null
  const { t } = useTranslation()

  function CallSetProfile(newProfile: boolean) {
    const name = newProfile ? profileName : ui.SelectedProfile

    dispatch(
      SetProfile({
        Name: name,
        Profile: {
          Auras: player.Auras,
          Items: player.SelectedItems,
          Enchants: player.SelectedEnchants,
          Gems: player.SelectedGems,
          Talents: player.Talents,
          Rotation: player.Rotation,
          Settings: player.Settings,
        },
      })
    )

    if (newProfile) {
      dispatch(SetSelectedProfile(name))
      SetProfileName('')
    }
  }

  function ProfileClickHandler(params: ProfileContainer) {
    dispatch(SetSelectedProfile(params.Name))
    dispatch(SetSelectedAuras(params.Profile.Auras))
    dispatch(SetSelectedGems(params.Profile.Gems))
    dispatch(SetSelectedItems(params.Profile.Items))
    dispatch(SetSelectedTalents(params.Profile.Talents))
    dispatch(SetRotationState(params.Profile.Rotation))
    dispatch(SetSelectedEnchants(params.Profile.Enchants))
    dispatch(SetSettingsState(params.Profile.Settings))
    // Recalculate the player's stats
    dispatch(
      SetBaseStats(
        GetBaseStats(
          params.Profile.Settings[Setting.race] as unknown as RaceType
        )
      )
    )
    dispatch(SetAurasStats(GetAurasStats(params.Profile.Auras)))
    dispatch(SetItemsStats(GetItemsStats(params.Profile.Items)))
    dispatch(
      SetGemsStats(GetGemsStats(params.Profile.Items, params.Profile.Gems))
    )
    dispatch(
      SetEnchantsStats(
        GetEnchantsStats(params.Profile.Items, params.Profile.Enchants)
      )
    )
    dispatch(SetItemSetCounts(GetItemSetCounts(params.Profile.Items)))
  }

  function DeleteProfileHandler() {
    if (
      window.confirm(
        `Are you sure you want to delete profile '${ui.SelectedProfile}'?`
      )
    ) {
      dispatch(DeleteProfile(ui.SelectedProfile))
    }
  }

  function RenameProfileHandler() {
    const newName = prompt(
      `Enter the new name for profile '${ui.SelectedProfile}'`
    )

    if (
      newName != null &&
      newName.length > 0 &&
      newName !== ui.SelectedProfile
    ) {
      dispatch(
        RenameProfile({
          OldName: ui.SelectedProfile,
          NewName: newName,
        })
      )
      dispatch(SetSelectedProfile(newName))
    }
  }

  return (
    <Grid
      container
      id='profiles-and-sources'
      style={{ paddingLeft: '40px', paddingRight: '40px' }}
    >
      <fieldset id='profile-fieldset'>
        <legend>
          <Typography>{t('Profile Options')}</Typography>
        </legend>
        <TextField
          size='small'
          placeholder={t('E.g. "P3 Shadow BiS"')}
          id='profile-name-input'
          value={profileName}
          onChange={e => SetProfileName(e.target.value)}
          name='profileName'
        />
        <Button
          variant='contained'
          id='save-new-profile-button'
          onClick={() => CallSetProfile(true)}
          disabled={profileName.length === 0}
        >
          <Typography>{t('Save New Profile')}</Typography>
        </Button>
        <Grid id='update-profile-Grid'>
          <Button
            variant='contained'
            style={{
              display: selectedProfileExists ? '' : 'none',
            }}
            id='save-profile-button'
            onClick={() => CallSetProfile(false)}
          >
            <Typography>{t('Save')}</Typography>
          </Button>{' '}
          <Button
            variant='contained'
            style={{
              display: selectedProfileExists ? '' : 'none',
            }}
            id='delete-profile-button'
            onClick={() => DeleteProfileHandler()}
          >
            <Typography>{t('Delete')}</Typography>
          </Button>{' '}
          <Button
            variant='contained'
            style={{
              display: selectedProfileExists ? '' : 'none',
            }}
            id='rename-profile-button'
            onClick={() => RenameProfileHandler()}
          >
            <Typography>{t('Rename')}</Typography>
          </Button>{' '}
          <Button
            variant='contained'
            id='import-export-button'
            onClick={() => dispatch(SetImportExportWindowVisibility(true))}
          >
            <Typography>{t('Import/Export')}</Typography>
          </Button>
        </Grid>
      </fieldset>
      <fieldset
        id='saved-profiles'
        style={{
          display: player.Profiles.length === 0 ? 'none' : '',
        }}
      >
        <legend>
          <Typography>{t('Saved Profiles')}</Typography>
        </legend>
        <Grid container id='profile-list'>
          {player.Profiles.map(profileContainer => (
            <Grid
              item
              key={nanoid()}
              className='saved-profile'
              data-checked={ui.SelectedProfile === profileContainer.Name}
              onClick={() => ProfileClickHandler(profileContainer)}
            >
              <Typography>{profileContainer.Name}</Typography>
            </Grid>
          ))}
        </Grid>
      </fieldset>

      <fieldset id='source-filters'>
        <legend>
          <Typography>{t('Sources')}</Typography>
        </legend>
        <Grid container id='source-list'>
          {phases.map(phase => (
            <Grid
              item
              key={phase.phase}
              data-checked={ui.Sources.includes(phase.phase)}
              className='phase-btn'
              onClick={() => dispatch(TogglePhase(phase.phase))}
            >
              <Typography>{t(phase.title)}</Typography>
            </Grid>
          ))}
        </Grid>
      </fieldset>
    </Grid>
  )
}
