import { Button, Grid } from '@mui/material'
import { useState } from 'react'
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
  SetAurasStats,
  SetBaseStats,
  SetEnchantsStats,
  SetGemsStats,
  SetItemSetCounts,
  SetItemsStats,
  SetRotationState,
  SetSelectedAuras,
  SetSelectedEnchants,
  SetSelectedGems,
  SetSelectedItems,
  SetSelectedTalents,
  SetSettingsState,
} from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import { SetImportExportWindowVisibility } from '../redux/UiSlice'
import {
  AuraId,
  ItemSlotDetailedStruct,
  RaceType,
  RotationStruct,
  SelectedGemsStruct,
  Settings,
  TalentStore,
} from '../Types'

interface ProfileJsonExport {
  Auras: AuraId[]
  Gems: SelectedGemsStruct
  Items: ItemSlotDetailedStruct
  Talents: TalentStore
  Rotation: RotationStruct
  Enchants: ItemSlotDetailedStruct
  Settings: Settings
}

export default function ImportExport() {
  const player = useSelector((state: RootState) => state.player)
  const ui = useSelector((state: RootState) => state.ui)
  const dispatch = useDispatch()
  const [contentString, setContentString] = useState('')

  function ExportProfile() {
    setContentString(
      JSON.stringify({
        Auras: player.Auras,
        Gems: player.SelectedGems,
        Items: player.SelectedItems,
        Talents: player.Talents,
        Rotation: player.Rotation,
        Enchants: player.SelectedEnchants,
        Settings: player.Settings,
      } as ProfileJsonExport)
    )

    setTimeout(
      () =>
        (
          document.getElementById('import-export-textarea') as HTMLInputElement
        )?.select(),
      100
    )
  }

  function ImportProfile() {
    try {
      const data: ProfileJsonExport = JSON.parse(contentString)

      if (data.Auras) {
        dispatch(SetSelectedAuras(data.Auras))
        dispatch(SetAurasStats(GetAurasStats(data.Auras)))
      }

      if (data.Items) {
        dispatch(SetSelectedItems(data.Items))
        dispatch(SetItemsStats(GetItemsStats(data.Items)))
        dispatch(SetItemSetCounts(GetItemSetCounts(data.Items)))
      }

      if (data.Enchants) {
        dispatch(SetSelectedEnchants(data.Enchants))
        dispatch(
          SetEnchantsStats(
            GetEnchantsStats(
              data.Items ? data.Items : player.SelectedItems,
              data.Enchants
            )
          )
        )
      }

      if (data.Gems) {
        dispatch(SetSelectedGems(data.Gems))
        dispatch(
          SetGemsStats(
            GetGemsStats(
              data.Items ? data.Items : player.SelectedItems,
              data.Gems
            )
          )
        )
      }

      if (data.Talents) {
        dispatch(SetSelectedTalents(data.Talents))
      }

      if (data.Rotation) {
        dispatch(SetRotationState(data.Rotation))
      }

      if (data.Settings) {
        dispatch(SetSettingsState(data.Settings))
        dispatch(SetBaseStats(GetBaseStats(data.Settings.race as RaceType)))
      }

      dispatch(SetImportExportWindowVisibility(false))
    } catch (error) {
      alert(`Error importing profile: ${error}`)
    }
  }

  return (
    <Grid
      id='import-export-window'
      className='close-button-target'
      style={{ display: ui.ImportExportWindowVisible ? '' : 'none' }}
    >
      <textarea
        id='import-export-textarea'
        value={contentString}
        onChange={e => setContentString(e.target.value)}
      ></textarea>
      <Button
        variant='contained'
        id='import-button'
        onClick={() => {
          ImportProfile()
          setContentString('')
        }}
      >
        Import
      </Button>{' '}
      <Button variant='contained' id='export-button' onClick={ExportProfile}>
        Export
      </Button>{' '}
      <Button
        variant='contained'
        id='export-close-button'
        onClick={() => {
          dispatch(SetImportExportWindowVisibility(false))
          setContentString('')
        }}
      >
        Close
      </Button>
    </Grid>
  )
}
