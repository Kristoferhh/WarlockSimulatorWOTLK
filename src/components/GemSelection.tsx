import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  CanGemColorBeInsertedIntoSocketColor,
  GetBaseWowheadUrl,
  GetGemsStats,
  GetQualityCssColor,
} from '../Common'
import { Gems } from '../data/Gems'
import { Items } from '../data/Items'
import i18n from '../i18n/config'
import { SetGemsStats, SetSelectedGems } from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import { FavoriteGem, HideGem, SetGemSelectionTable } from '../redux/UiSlice'
import {
  Gem,
  InitialGemSelectionTableValue,
  SelectedGemsStruct,
} from '../Types'

export default function GemSelection() {
  const ui = useSelector((state: RootState) => state.ui)
  const player = useSelector((state: RootState) => state.player)
  const dispatch = useDispatch()
  const [showingHiddenGems, SetShowingHiddenGems] = useState(false)
  const { t } = useTranslation()

  function GemClickHandler(gem: Gem) {
    let newSelectedGems: SelectedGemsStruct = JSON.parse(
      JSON.stringify(player.SelectedGems)
    )
    let selectedGemsInItemSlot = newSelectedGems[ui.GemSelectionTable.ItemSlot]

    // If the item doesn't have a socket array yet then initialize it to an array of gem IDs 0
    // The first element is the socket color (not gem color) and the second element is the gem id.
    let currentItemGemIds = selectedGemsInItemSlot[ui.GemSelectionTable.ItemId]
    if (!currentItemGemIds) {
      const itemSocketAmount = Items.find(
        i => i.Id === parseInt(ui.GemSelectionTable.ItemId)
      )?.Sockets?.length
      currentItemGemIds = Array(itemSocketAmount).fill(0)
    } else {
      currentItemGemIds = JSON.parse(JSON.stringify(currentItemGemIds))

      // Return if the clicked gem is the same as the already equipped gem
      if (currentItemGemIds[ui.GemSelectionTable.SocketNumber] === gem.Id) {
        return
      }
    }

    currentItemGemIds[ui.GemSelectionTable.SocketNumber] = gem.Id
    newSelectedGems[ui.GemSelectionTable.ItemSlot][
      ui.GemSelectionTable.ItemId
    ] = currentItemGemIds
    dispatch(SetSelectedGems(newSelectedGems))
    dispatch(
      SetGemsStats(
        GetGemsStats(
          player.SelectedItems,
          newSelectedGems,
          player.SelectedEnchants
        )
      )
    )
  }

  return (
    <Table
      id='gem-selection-table'
      cellSpacing={0}
      data-color='none'
      style={{
        width: '380px',
        borderCollapse: 'unset',
        display: ui.GemSelectionTable.Visible ? '' : 'none',
      }}
      onClick={e => e.stopPropagation()}
    >
      <TableBody>
        {ui.GemPreferences.hidden.length > 0 && (
          <TableRow>
            <TableCell style={{ borderBottom: 'none' }}></TableCell>
            <TableCell
              id='show-hidden-gems-button'
              onClick={() => SetShowingHiddenGems(!showingHiddenGems)}
            >
              <Typography>
                {(showingHiddenGems ? 'Hide' : 'Show') + ' Hidden Gems'}
              </Typography>
            </TableCell>
          </TableRow>
        )}
        {Gems.filter(
          gem =>
            CanGemColorBeInsertedIntoSocketColor(
              ui.GemSelectionTable.SocketColor,
              gem.Color
            ) /*&&
            ui.Sources.some(source => { // TODO fix this

              return source && gem.Phase && source >= gem.Phase
            })*/
        )
          .sort(function (a, b) {
            return (
              Number(ui.GemPreferences.favorites.includes(b.Id)) -
              Number(ui.GemPreferences.favorites.includes(a.Id))
            )
          })
          .map(gem => (
            <TableRow
              key={gem.Id}
              className='gem-row'
              data-hidden={false}
              style={{
                display:
                  ui.GemPreferences.hidden.includes(gem.Id) &&
                  !showingHiddenGems
                    ? 'none'
                    : '',
              }}
            >
              <TableCell
                style={{ borderBottom: 'none' }}
                className='gem-info gem-favorite-star'
                title={
                  ui.GemPreferences.favorites.includes(gem.Id)
                    ? 'Remove gem from favorites'
                    : 'Add gem to favorites'
                }
                data-favorited={ui.GemPreferences.favorites.includes(gem.Id)}
                onClick={() => dispatch(FavoriteGem(gem.Id))}
              >
                ★
              </TableCell>
              <TableCell
                style={{ borderBottom: 'none' }}
                className='gem-info gem-name'
                onClick={e => {
                  GemClickHandler(gem)
                  dispatch(SetGemSelectionTable(InitialGemSelectionTableValue))
                  e.preventDefault()
                }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/img/${gem.IconName}.jpg`}
                  alt={t(gem.Name)}
                  width={20}
                  height={20}
                />
                <Link
                  href={`${GetBaseWowheadUrl(i18n.language)}/item=${gem.Id}`}
                  style={{ color: GetQualityCssColor(gem.Quality) }}
                >
                  {t(gem.Name)}
                </Link>
              </TableCell>
              <TableCell
                style={{ borderBottom: 'none' }}
                className='gem-info gem-hide'
                title={
                  ui.GemPreferences.hidden.includes(gem.Id)
                    ? 'Show Gem'
                    : 'Hide Gem'
                }
                data-hidden={ui.GemPreferences.hidden.includes(gem.Id)}
                onClick={() => dispatch(HideGem(gem.Id))}
              >
                ❌
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
