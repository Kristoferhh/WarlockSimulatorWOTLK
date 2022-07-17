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
  deleteProfile,
  renameProfile,
  setAurasStats,
  setBaseStats,
  setEnchantsStats,
  setGemsStats,
  setItemSetCounts,
  setItemsStats,
  setProfile,
  setRotationState,
  setSelectedAuras,
  setSelectedEnchants,
  setSelectedGems,
  setSelectedItems,
  setSelectedTalents,
  setSettingsState,
} from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import {
  setImportExportWindowVisibility,
  setSelectedProfile,
  togglePhase,
} from '../redux/UiSlice'
import { Phase, ProfileContainer, Race, Setting } from '../Types'

const phases: { title: string; phase: Phase }[] = [
  { title: 'TBC', phase: 0 },
  { title: 'P1', phase: 1 },
  { title: 'P2', phase: 2 },
  { title: 'P3', phase: 3 },
  { title: 'P4', phase: 4 },
]

export default function ProfilesAndSources() {
  const playerStore = useSelector((state: RootState) => state.player)
  const selectedProfileState = useSelector(
    (state: RootState) => state.ui.SelectedProfile
  )
  const sourcesState = useSelector((state: RootState) => state.ui.Sources)
  const dispatch = useDispatch()
  const [profileName, setProfileName] = useState('')
  const selectedProfileExists =
    playerStore.Profiles.find(x => x.Name === selectedProfileState) != null
  const { t } = useTranslation()

  function callSetProfile(newProfile: boolean) {
    const name = newProfile ? profileName : selectedProfileState

    dispatch(
      setProfile({
        Name: name,
        Profile: {
          Auras: playerStore.Auras,
          Items: playerStore.SelectedItems,
          Enchants: playerStore.SelectedEnchants,
          Gems: playerStore.SelectedGems,
          Talents: playerStore.Talents,
          Rotation: playerStore.Rotation,
          Settings: playerStore.Settings,
        },
      })
    )

    if (newProfile) {
      dispatch(setSelectedProfile(name))
      setProfileName('')
    }
  }

  function profileClickHandler(params: ProfileContainer) {
    dispatch(setSelectedProfile(params.Name))
    dispatch(setSelectedAuras(params.Profile.Auras))
    dispatch(setSelectedGems(params.Profile.Gems))
    dispatch(setSelectedItems(params.Profile.Items))
    dispatch(setSelectedTalents(params.Profile.Talents))
    dispatch(setRotationState(params.Profile.Rotation))
    dispatch(setSelectedEnchants(params.Profile.Enchants))
    dispatch(setSettingsState(params.Profile.Settings))
    // Recalculate the player's stats
    dispatch(
      setBaseStats(
        GetBaseStats(params.Profile.Settings[Setting.race] as unknown as Race)
      )
    )
    dispatch(setAurasStats(GetAurasStats(params.Profile.Auras)))
    dispatch(setItemsStats(GetItemsStats(params.Profile.Items)))
    dispatch(
      setGemsStats(GetGemsStats(params.Profile.Items, params.Profile.Gems))
    )
    dispatch(
      setEnchantsStats(
        GetEnchantsStats(params.Profile.Items, params.Profile.Enchants)
      )
    )
    dispatch(setItemSetCounts(GetItemSetCounts(params.Profile.Items)))
  }

  function deleteProfileHandler() {
    if (
      window.confirm(
        `Are you sure you want to delete profile '${selectedProfileState}'?`
      )
    ) {
      dispatch(deleteProfile(selectedProfileState))
    }
  }

  function renameProfileHandler() {
    const newName = prompt(
      `Enter the new name for profile '${selectedProfileState}'`
    )

    if (
      newName != null &&
      newName.length > 0 &&
      newName !== selectedProfileState
    ) {
      dispatch(
        renameProfile({
          oldName: selectedProfileState,
          newName: newName,
        })
      )
      dispatch(setSelectedProfile(newName))
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
          onChange={e => setProfileName(e.target.value)}
          name='profileName'
        />
        <Button
          variant='contained'
          id='save-new-profile-button'
          onClick={() => callSetProfile(true)}
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
            onClick={() => callSetProfile(false)}
          >
            <Typography>{t('Save')}</Typography>
          </Button>{' '}
          <Button
            variant='contained'
            style={{
              display: selectedProfileExists ? '' : 'none',
            }}
            id='delete-profile-button'
            onClick={() => deleteProfileHandler()}
          >
            <Typography>{t('Delete')}</Typography>
          </Button>{' '}
          <Button
            variant='contained'
            style={{
              display: selectedProfileExists ? '' : 'none',
            }}
            id='rename-profile-button'
            onClick={() => renameProfileHandler()}
          >
            <Typography>{t('Rename')}</Typography>
          </Button>{' '}
          <Button
            variant='contained'
            id='import-export-button'
            onClick={() => dispatch(setImportExportWindowVisibility(true))}
          >
            <Typography>{t('Import/Export')}</Typography>
          </Button>
        </Grid>
      </fieldset>
      <fieldset
        id='saved-profiles'
        style={{
          display: playerStore.Profiles.length === 0 ? 'none' : '',
        }}
      >
        <legend>
          <Typography>{t('Saved Profiles')}</Typography>
        </legend>
        <Grid container id='profile-list'>
          {playerStore.Profiles.map(profileContainer => (
            <Grid
              item
              key={nanoid()}
              className='saved-profile'
              data-checked={selectedProfileState === profileContainer.Name}
              onClick={() => profileClickHandler(profileContainer)}
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
              data-checked={sourcesState.includes(phase.phase)}
              className='phase-btn'
              onClick={() => dispatch(togglePhase(phase.phase))}
            >
              <Typography>{t(phase.title)}</Typography>
            </Grid>
          ))}
        </Grid>
      </fieldset>
    </Grid>
  )
}
