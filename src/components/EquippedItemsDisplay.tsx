import { nanoid } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getBaseWowheadUrl, ItemSlotDetailedToItemSlot } from '../Common'
import { Enchants } from '../data/Enchants'
import { Items } from '../data/Items'
import i18n from '../i18n/config'
import { RootState } from '../redux/Store'
import { setEquippedItemsWindowVisibility } from '../redux/UiSlice'
import { Enchant, Item, ItemSlotDetailed, Quality } from '../Types'
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

    return Enchants.find((e) => e.Id === playerState.SelectedEnchants[slot])
  }

  function getItemInItemSlot(itemSlot: ItemSlotDetailed): Item | undefined {
    return Items.find((e) => e.Id === playerState.SelectedItems[itemSlot])
  }

  return (
    <div
      id='currently-equipped-items-container'
      style={{ display: uiState.EquippedItemsWindowVisible ? '' : 'none' }}
    >
      <div id='currently-equipped-items'>
        <div onClick={(e) => dispatch(setEquippedItemsWindowVisibility(false))}>
          <p className='close' id='currently-equipped-items-close-button'></p>
        </div>
        <table>
          <colgroup>
            <col style={{ width: '13%' }} />
            <col style={{ width: '45%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '32%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Slot</th>
              <th>Name</th>
              <th></th>
              <th>Enchant</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(ItemSlotDetailed)
              // Don't show the offhand slot if a two handed weapon is equipped
              .filter((slot) => {
                if (slot === ItemSlotDetailed.OffHand) {
                  const equippedWeaponId =
                    playerState.SelectedItems[ItemSlotDetailed.Weapon]
                  const equippedWeapon = Items.find(
                    (x) => x.Id === equippedWeaponId
                  )

                  return !equippedWeapon?.IsTwoHand
                }

                return true
              })
              .map((slot) => {
                const equippedItem = getItemInItemSlot(slot as ItemSlotDetailed)
                const equippedEnchant = getEnchantInItemSlot(
                  slot as ItemSlotDetailed
                )

                return (
                  <tr key={nanoid()} className='equipped-item-row'>
                    <td>{t(formatItemSlotName(slot as ItemSlotDetailed))}</td>
                    <td
                      className={
                        'equipped-item-name ' +
                        (playerState.SelectedItems[slot as ItemSlotDetailed] !=
                        null
                          ? equippedItem?.Quality
                          : '')
                      }
                    >
                      {equippedItem && (
                        <>
                          <a
                            href={`${getBaseWowheadUrl(i18n.language)}/item=${
                              equippedItem!.DisplayId || equippedItem!.Id
                            }`}
                            onClick={(e) => e.preventDefault()}
                            style={{ fontSize: '0px' }}
                          >
                            .
                          </a>
                          <img
                            alt={equippedItem.Name}
                            src={`${process.env.PUBLIC_URL}/img/${equippedItem.IconName}.jpg`}
                            className='item-icon'
                          />
                          {t(equippedItem.Name)}
                        </>
                      )}
                    </td>
                    <td>
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
                    </td>
                    <td
                      className={`equipped-item-enchant-name ${equippedEnchant?.Quality}`}
                    >
                      {equippedEnchant && (
                        <>
                          <a
                            href={`${getBaseWowheadUrl(i18n.language)}/spell=${
                              equippedEnchant.Id
                            }`}
                            onClick={(e) => e.preventDefault()}
                            style={{ fontSize: '0px' }}
                          >
                            .
                          </a>
                          {t(equippedEnchant.Name)}
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
