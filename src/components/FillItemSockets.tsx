import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { nanoid } from 'nanoid'
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
import { SetFillItemSocketsWindowVisibility } from '../redux/UiSlice'
import { Item, SelectedGemsStruct, SocketColor } from '../Types'

const socketOptions: { name: string; color: SocketColor }[] = [
  { name: 'Meta Socket', color: SocketColor.Meta },
  { name: 'Red Socket', color: SocketColor.Red },
  { name: 'Yellow Socket', color: SocketColor.Yellow },
  { name: 'Blue Socket', color: SocketColor.Blue },
]

const useStyles = makeStyles(() => ({
  formControl: {
    justifyContent: 'center',
    flexDirection: 'row !important' as 'row',
  },
  label: {
    '& span': {
      color: 'white',
    },
  },
}))

export function FillItemSockets() {
  const ui = useSelector((state: RootState) => state.ui)
  const player = useSelector((state: RootState) => state.player)
  const dispatch = useDispatch()
  const [socketColor, setSocketColor] = useState(SocketColor.Red)
  const [selectedGemId, setSelectedGemId] = useState(0)
  const [itemSlotToFill, setItemSlotToFill] = useState<
    'currentSlot' | 'allSlots'
  >('currentSlot')
  const [replacingExistingGems, setReplacingExistingGems] = useState(false)
  const { t } = useTranslation()
  const mui = useStyles()

  function FillSockets(): void {
    if (selectedGemId !== 0) {
      let newSelectedGems = JSON.parse(JSON.stringify(player.SelectedGems))

      Items.filter(
        item =>
          (item.ItemSlot === ui.SelectedItemSlot &&
            itemSlotToFill === 'currentSlot') ||
          itemSlotToFill === 'allSlots'
      ).forEach(item => {
        FillSocketsInItem(item, newSelectedGems)
      })

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
      dispatch(SetFillItemSocketsWindowVisibility(false))
    }
  }

  function FillSocketsInItem(
    item: Item,
    selectedGemsObj: SelectedGemsStruct
  ): void {
    if (item.Sockets) {
      // Create an empty gem array.
      // If the item already has a gem array then replace it with the existing one.
      let itemGemArray = Array(item.Sockets.length).fill(['', 0])
      if (
        player.SelectedGems[item.ItemSlot] &&
        player.SelectedGems[item.ItemSlot][item.Id]
      ) {
        itemGemArray = JSON.parse(
          JSON.stringify(player.SelectedGems[item.ItemSlot][item.Id])
        )
      }

      // Loop through the sockets in the item and insert the gem if the socket color matches the user's choice or if the user is inserting into all sockets
      // and if the socket is empty or if the user chose to replace existing gems as well
      for (let i = 0; i < item.Sockets.length; i++) {
        if (
          item.Sockets[i] === socketColor &&
          ([null, 0].includes(itemGemArray[i][1]) || replacingExistingGems)
        ) {
          itemGemArray[i] = [item.Sockets[i], selectedGemId]
        }
      }

      selectedGemsObj[item.ItemSlot] = selectedGemsObj[item.ItemSlot] || {}
      selectedGemsObj[item.ItemSlot][item.Id.toString()] = itemGemArray
    }
  }

  function SocketColorClickHandler(newColor: SocketColor) {
    if (
      (socketColor === SocketColor.Meta && newColor !== SocketColor.Meta) ||
      (socketColor !== SocketColor.Meta && newColor === SocketColor.Meta)
    ) {
      setSelectedGemId(0)
    }

    setSocketColor(newColor)
  }

  return (
    <Grid
      id='gem-options-window'
      style={{ display: ui.FillItemSocketsWindowVisible ? '' : 'none' }}
    >
      <FormControl className={mui.formControl} fullWidth={true}>
        <RadioGroup>
          <FormControlLabel
            key={nanoid()}
            className={replacingExistingGems !== false ? mui.label : ''}
            onChange={() => setReplacingExistingGems(false)}
            checked={replacingExistingGems === false}
            control={<Radio />}
            label='Fill empty sockets'
          />
          <FormControlLabel
            key={nanoid()}
            className={replacingExistingGems !== true ? mui.label : ''}
            onChange={() => setReplacingExistingGems(true)}
            checked={replacingExistingGems === true}
            control={<Radio />}
            label='Fill all sockets'
          />
        </RadioGroup>
        <RadioGroup>
          <FormControlLabel
            key={nanoid()}
            className={itemSlotToFill !== 'currentSlot' ? mui.label : ''}
            onChange={() => setItemSlotToFill('currentSlot')}
            checked={itemSlotToFill === 'currentSlot'}
            control={<Radio />}
            label='Current item slot'
          />
          <FormControlLabel
            key={nanoid()}
            className={itemSlotToFill !== 'allSlots' ? mui.label : ''}
            onChange={() => setItemSlotToFill('allSlots')}
            checked={itemSlotToFill === 'allSlots'}
            control={<Radio />}
            label='All item slots'
          />
        </RadioGroup>
        <RadioGroup>
          {socketOptions.map(socket => (
            <FormControlLabel
              key={nanoid()}
              className={socketColor !== socket.color ? mui.label : ''}
              onChange={() => SocketColorClickHandler(socket.color)}
              checked={socketColor === socket.color}
              control={<Radio />}
              label={socket.name}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Grid id='gem-options-gem-list'>
        <Grid id='gem-options-gem-list'>
          {Gems.filter(e =>
            CanGemColorBeInsertedIntoSocketColor(socketColor, e.Color)
          ).map(gem => (
            <Grid
              className='gem-options-gem'
              key={gem.Id}
              onClick={e => {
                setSelectedGemId(gem.Id)
                e.preventDefault()
              }}
              data-checked={selectedGemId === gem.Id}
            >
              <img
                src={`${process.env.PUBLIC_URL}/img/${gem.IconName}.jpg`}
                alt={t(gem.Name)}
              />
              <Link href={`${GetBaseWowheadUrl(i18n.language)}/item=${gem.Id}`}>
                <Typography style={{ color: GetQualityCssColor(gem.Quality) }}>
                  {t(gem.Name)}
                </Typography>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Button
        variant='contained'
        id='gem-options-apply-button'
        onClick={() => FillSockets()}
        disabled={selectedGemId === 0}
      >
        Apply
      </Button>{' '}
      <Button
        variant='contained'
        onClick={() => dispatch(SetFillItemSocketsWindowVisibility(false))}
      >
        Close
      </Button>
    </Grid>
  )
}
