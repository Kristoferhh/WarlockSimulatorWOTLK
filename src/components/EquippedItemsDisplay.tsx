import {
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { nanoid } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  GetBaseWowheadUrl,
  GetQualityCssColor,
  ItemSlotDetailedToItemSlot,
} from '../Common'
import { Enchants } from '../data/Enchants'
import { Items } from '../data/Items'
import i18n from '../i18n/config'
import { RootState } from '../redux/Store'
import { setEquippedItemsWindowVisibility } from '../redux/UiSlice'
import { Enchant, Item, ItemSlotDetailed } from '../Types'
import ItemSocketDisplay from './ItemSocketDisplay'

function formatItemSlotName(itemSlot: ItemSlotDetailed): string {
  let formattedItemSlot = itemSlot.toString()

  // Check if the last char is '1' or '2', if so then it's an item slot
  // with sub-item slots so we put a space between the name and the sub-item slot value.
  const subItemSlotIndex = formattedItemSlot.length - 1
  if (['1', '2'].includes(formattedItemSlot.charAt(subItemSlotIndex))) {
    formattedItemSlot = `${formattedItemSlot.substring(
      0,
      subItemSlotIndex
    )} ${formattedItemSlot.substring(subItemSlotIndex)}`
  }

  return formattedItemSlot.charAt(0).toUpperCase() + formattedItemSlot.slice(1)
}

export default function EquippedItemsDisplay() {
  const uiState = useSelector((state: RootState) => state.ui)
  const playerState = useSelector((state: RootState) => state.player)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  function getEnchantInItemSlot(
    itemSlot: ItemSlotDetailed
  ): Enchant | undefined {
    let slot = itemSlot

    return Enchants.find(e => e.Id === playerState.SelectedEnchants[slot])
  }

  function getItemInItemSlot(itemSlot: ItemSlotDetailed): Item | undefined {
    return Items.find(e => e.Id === playerState.SelectedItems[itemSlot])
  }

  return (
    <Grid
      id='currently-equipped-items-container'
      style={{ display: uiState.EquippedItemsWindowVisible ? '' : 'none' }}
    >
      <Grid id='currently-equipped-items'>
        <Grid onClick={() => dispatch(setEquippedItemsWindowVisibility(false))}>
          <p className='close' id='currently-equipped-items-close-button'></p>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: 'white' }}>Slot</TableCell>
              <TableCell style={{ color: 'white' }}>Name</TableCell>
              <TableCell style={{ color: 'white' }}></TableCell>
              <TableCell style={{ color: 'white' }}>Enchant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(ItemSlotDetailed)
              // Don't show the offhand slot if a two handed weapon is equipped
              .filter(slot => {
                if (slot === ItemSlotDetailed.OffHand) {
                  const equippedWeaponId =
                    playerState.SelectedItems[ItemSlotDetailed.Weapon]
                  const equippedWeapon = Items.find(
                    x => x.Id === equippedWeaponId
                  )

                  return !equippedWeapon?.IsTwoHand
                }

                return true
              })
              .map(slot => {
                const equippedItem = getItemInItemSlot(slot as ItemSlotDetailed)
                const equippedEnchant = getEnchantInItemSlot(
                  slot as ItemSlotDetailed
                )

                return (
                  <TableRow key={nanoid()} className='equipped-item-row'>
                    <TableCell style={{ color: 'white' }}>
                      {t(formatItemSlotName(slot as ItemSlotDetailed))}
                    </TableCell>
                    <TableCell
                      style={{
                        color: equippedItem
                          ? GetQualityCssColor(equippedItem.Quality)
                          : '',
                      }}
                      className={'equipped-item-name'}
                    >
                      {equippedItem && (
                        <>
                          <Link
                            href={`${GetBaseWowheadUrl(i18n.language)}/item=${
                              equippedItem!.DisplayId || equippedItem!.Id
                            }`}
                            onClick={e => e.preventDefault()}
                            style={{ fontSize: '0px' }}
                          >
                            .
                          </Link>
                          <img
                            alt={equippedItem.Name}
                            src={`${process.env.PUBLIC_URL}/img/${equippedItem.IconName}.jpg`}
                            className='item-icon'
                          />
                          {t(equippedItem.Name)}
                        </>
                      )}
                    </TableCell>
                    <TableCell style={{ color: 'white' }}>
                      {playerState.SelectedItems[slot as ItemSlotDetailed] &&
                      equippedItem ? (
                        <ItemSocketDisplay
                          item={equippedItem!}
                          itemSlot={ItemSlotDetailedToItemSlot(
                            slot as ItemSlotDetailed
                          )}
                        />
                      ) : (
                        ''
                      )}
                    </TableCell>
                    <TableCell
                      className={`equipped-item-enchant-name ${equippedEnchant?.Quality}`}
                      style={{
                        color: equippedEnchant
                          ? GetQualityCssColor(equippedEnchant.Quality)
                          : '',
                      }}
                    >
                      {equippedEnchant && (
                        <>
                          <Link
                            href={`${GetBaseWowheadUrl(i18n.language)}/spell=${
                              equippedEnchant.Id
                            }`}
                            onClick={e => e.preventDefault()}
                            style={{ fontSize: '0px' }}
                          >
                            .
                          </Link>
                          {t(equippedEnchant.Name)}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )
}
