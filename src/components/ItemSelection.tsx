import { Items } from '../data/Items'
import {
  Enchant,
  Item,
  ItemSlotDetailed,
  ItemSlot,
  SocketColor,
  SubSlotValue,
  Stat,
  SelectedGemsStruct,
} from '../Types'
import { useState } from 'react'
import { Enchants } from '../data/Enchants'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/Store'
import {
  setEnchantsStats,
  setGemsStats,
  setItemSetCounts,
  setItemsStats,
  setSelectedEnchants,
  setSelectedGems,
  setSelectedItems,
} from '../redux/PlayerSlice'
import {
  getBaseWowheadUrl,
  getEnchantsStats,
  getGemsStats,
  getItemSetCounts,
  getItemsStats,
  getItemTableItems,
  ItemSlotToItemSlotDetailed,
} from '../Common'
import {
  setEquippedItemsWindowVisibility,
  setFillItemSocketsWindowVisibility,
  setGemSelectionTable,
  setSelectedItemSlot,
  setSelectedItemSubSlot,
  toggleHiddenItemId,
} from '../redux/UiSlice'
import ItemSocketDisplay from './ItemSocketDisplay'
import { FillItemSockets } from './FillItemSockets'
import { nanoid } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n/config'

const itemSlotInformation: {
  Name: string
  ItemSlot: ItemSlot
  SubSlot: SubSlotValue
}[] = [
  { Name: 'Weapon', ItemSlot: ItemSlot.Weapon, SubSlot: '' },
  { Name: 'Off Hand', ItemSlot: ItemSlot.OffHand, SubSlot: '' },
  { Name: 'Head', ItemSlot: ItemSlot.Head, SubSlot: '' },
  { Name: 'Neck', ItemSlot: ItemSlot.Neck, SubSlot: '' },
  { Name: 'Shoulders', ItemSlot: ItemSlot.Shoulders, SubSlot: '' },
  { Name: 'Back', ItemSlot: ItemSlot.Back, SubSlot: '' },
  { Name: 'Chest', ItemSlot: ItemSlot.Chest, SubSlot: '' },
  { Name: 'Bracer', ItemSlot: ItemSlot.Wrist, SubSlot: '' },
  { Name: 'Gloves', ItemSlot: ItemSlot.Hands, SubSlot: '' },
  { Name: 'Belt', ItemSlot: ItemSlot.Waist, SubSlot: '' },
  { Name: 'Legs', ItemSlot: ItemSlot.Legs, SubSlot: '' },
  { Name: 'Boots', ItemSlot: ItemSlot.Feet, SubSlot: '' },
  { Name: 'Ring 1', ItemSlot: ItemSlot.Finger, SubSlot: '1' },
  { Name: 'Ring 2', ItemSlot: ItemSlot.Finger, SubSlot: '2' },
  { Name: 'Trinket 1', ItemSlot: ItemSlot.Trinket, SubSlot: '1' },
  { Name: 'Trinket 2', ItemSlot: ItemSlot.Trinket, SubSlot: '2' },
  { Name: 'Wand', ItemSlot: ItemSlot.Wand, SubSlot: '' },
]

export default function ItemSelection() {
  const [hidingItems, setHidingItems] = useState(false)
  const playerStore = useSelector((state: RootState) => state.player)
  const uiStore = useSelector((state: RootState) => state.ui)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  function changeEquippedItemId(itemSlot: ItemSlotDetailed, newItemId: number) {
    if (playerStore.SelectedItems[itemSlot] === newItemId) {
      return
    }

    let newSelectedItems = JSON.parse(JSON.stringify(playerStore.SelectedItems))
    newSelectedItems[itemSlot] = newItemId

    if (newItemId !== 0) {
      const itemBeingEquipped = Items.find((x) => x.Id === newItemId)

      if (itemBeingEquipped?.IsTwoHand) {
        newSelectedItems[ItemSlotDetailed.OffHand] = 0
      }
    }

    dispatch(setSelectedItems(newSelectedItems))
    dispatch(setItemsStats(getItemsStats(newSelectedItems)))
    dispatch(
      setGemsStats(getGemsStats(newSelectedItems, playerStore.SelectedGems))
    )
    dispatch(
      setEnchantsStats(
        getEnchantsStats(newSelectedItems, playerStore.SelectedEnchants)
      )
    )
    dispatch(setItemSetCounts(getItemSetCounts(newSelectedItems)))
  }

  function itemClickHandler(item: Item, itemSlot: ItemSlotDetailed) {
    changeEquippedItemId(
      itemSlot,
      playerStore.SelectedItems[itemSlot] === item.Id ? 0 : item.Id
    )
  }

  function enchantClickHandler(enchant: Enchant, itemSlot: ItemSlotDetailed) {
    let newSelectedEnchants = JSON.parse(
      JSON.stringify(playerStore.SelectedEnchants)
    )
    newSelectedEnchants[itemSlot] =
      newSelectedEnchants[itemSlot] === enchant.Id ? 0 : enchant.Id
    dispatch(setSelectedEnchants(newSelectedEnchants))
    dispatch(
      setEnchantsStats(
        getEnchantsStats(playerStore.SelectedItems, newSelectedEnchants)
      )
    )
  }

  function itemSlotClickHandler(slot: ItemSlot, subSlot: SubSlotValue) {
    dispatch(setSelectedItemSlot(slot))
    dispatch(setSelectedItemSubSlot(subSlot))
  }

  function itemSocketClickHandler(
    itemId: string,
    socketNumber: number,
    socketColor: SocketColor
  ) {
    dispatch(
      setGemSelectionTable({
        Visible: true,
        ItemId: itemId,
        ItemSlot: uiStore.SelectedItemSlot,
        SocketNumber: socketNumber,
        SocketColor: socketColor,
        ItemSubSlot: uiStore.SelectedItemSubSlot,
      })
    )
  }

  function removeGemFromSocket(itemId: string, socketNumber: number) {
    let newSelectedGems: SelectedGemsStruct = JSON.parse(
      JSON.stringify(playerStore.SelectedGems)
    )

    let currentItemSocketsValue =
      newSelectedGems[uiStore.SelectedItemSlot][itemId]

    if (currentItemSocketsValue[socketNumber] !== 0) {
      currentItemSocketsValue[socketNumber] = 0
      dispatch(setSelectedGems(newSelectedGems))
      dispatch(
        setGemsStats(getGemsStats(playerStore.SelectedItems, newSelectedGems))
      )
    }
  }

  function shouldDisplayMissingEnchantWarning(
    itemSlot: ItemSlot,
    subSlot: SubSlotValue
  ): boolean {
    const equippedEnchantId =
      playerStore.SelectedEnchants[
        ItemSlotToItemSlotDetailed(itemSlot, subSlot)
      ]

    if (
      itemSlot === ItemSlot.Finger ||
      Enchants.find((e) => e.ItemSlot === itemSlot) == null
    ) {
      return false
    }

    // Checks if the user has an item equipped in the slot but no enchant.
    return (
      (!equippedEnchantId || [null, 0].includes(equippedEnchantId)) &&
      [0, null].includes(
        playerStore.SelectedItems[ItemSlotToItemSlotDetailed(itemSlot, subSlot)]
      ) === false
    )
  }

  return (
    <div id='item-selection-container'>
      <ul id='item-slot-selection-list'>
        {itemSlotInformation.map((slot) => (
          <li key={nanoid()}>
            <p
              style={{ display: 'inline-block' }}
              onClick={() => itemSlotClickHandler(slot.ItemSlot, slot.SubSlot)}
              data-selected={
                uiStore.SelectedItemSlot === slot.ItemSlot &&
                (!slot.SubSlot || uiStore.SelectedItemSubSlot === slot.SubSlot)
              }
            >
              {t(slot.Name)}
            </p>
            {shouldDisplayMissingEnchantWarning(
              slot.ItemSlot,
              slot.SubSlot
            ) && (
              <i
                title='Missing enchant!'
                className='fas fa-exclamation-triangle'
                style={{ marginLeft: '2px' }}
              ></i>
            )}
          </li>
        ))}
      </ul>
      <button
        className='btn btn-primary btn-sm'
        onClick={(e) => setHidingItems(!hidingItems)}
      >
        {t('Hide / Show Items')}
      </button>{' '}
      <button
        className='btn btn-primary btn-sm'
        onClick={(e) =>
          dispatch(
            setFillItemSocketsWindowVisibility(
              !uiStore.FillItemSocketsWindowVisible
            )
          )
        }
      >
        {t('Fill Item Sockets')}
      </button>{' '}
      <button
        className='btn btn-primary btn-sm'
        onClick={(e) =>
          dispatch(
            setEquippedItemsWindowVisibility(
              !uiStore.EquippedItemsWindowVisible
            )
          )
        }
      >
        {t('Show Equipped Items')}
      </button>
      <FillItemSockets />
      <table
        id='item-selection-table'
        data-type='mainhand'
        className='tablesorter'
        data-sortlist='[[12,1]]'
      >
        {
          // If no items are found by the filter then don't display the item table headers
          Items.find(
            (e) =>
              e.ItemSlot === uiStore.SelectedItemSlot &&
              uiStore.Sources.includes(e.Phase)
          ) != null ? (
            <>
              <colgroup id='item-selection-colgroup'>
                <col
                  style={{ width: '2%', display: hidingItems ? '' : 'none' }}
                />
                <col />
                <col style={{ width: '5%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '3%' }} />
                <col style={{ width: '3%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '4%' }} />
                <col style={{ width: '4%' }} />
                <col style={{ width: '3%' }} />
                <col style={{ width: '3%' }} />
                <col style={{ width: '3%' }} />
                <col style={{ width: '8%' }} />
              </colgroup>
              <thead>
                <tr id='item-selection-header'>
                  <th style={{ display: hidingItems ? '' : 'none' }}></th>
                  <th id='header-name'>{t('Name')}</th>
                  <th id='header-gems'></th>
                  <th id='header-source'>{t('Source')}</th>
                  <th id='header-stamina'>{t('Stam')}</th>
                  <th id='header-intellect'>{t('Int')}</th>
                  <th id='header-spell-power'>{t('Spell Power')}</th>
                  <th id='header-shadow-power'>{t('Shadow')}</th>
                  <th id='header-fire-power'>{t('Fire')}</th>
                  <th id='header-crit'>{t('Crit')}</th>
                  <th id='header-hit'>{t('Hit')}</th>
                  <th id='header-haste'>{t('Haste')}</th>
                  <th id='header-dps'>{t('DPS')}</th>
                </tr>
              </thead>
            </>
          ) : (
            <tbody>
              <tr>
                <td>
                  <h3>
                    No items found 😱 try selecting different item sources.
                  </h3>
                </td>
              </tr>
            </tbody>
          )
        }
        <tbody aria-live='polite'>
          {getItemTableItems(
            uiStore.SelectedItemSlot,
            uiStore.SelectedItemSubSlot,
            playerStore.SelectedItems,
            uiStore.Sources,
            uiStore.HiddenItems,
            hidingItems,
            uiStore.SavedItemDps,
            false
          ).map((item) => (
            <tr
              key={item.Id}
              className='item-row'
              data-selected={
                playerStore.SelectedItems[
                  ItemSlotToItemSlotDetailed(
                    uiStore.SelectedItemSlot,
                    uiStore.SelectedItemSubSlot
                  )
                ] === item.Id
              }
              data-hidden={uiStore.HiddenItems.includes(item.Id)}
              onClick={() =>
                itemClickHandler(
                  item,
                  ItemSlotToItemSlotDetailed(
                    uiStore.SelectedItemSlot,
                    uiStore.SelectedItemSubSlot
                  )
                )
              }
            >
              <td
                className='hide-item-btn'
                style={{ display: hidingItems ? 'table-cell' : 'none' }}
                title={
                  uiStore.HiddenItems.includes(item.Id)
                    ? 'Show Item'
                    : 'Hide Item'
                }
                onClick={(e) => {
                  dispatch(toggleHiddenItemId(item.Id))
                  e.stopPropagation()
                }}
              >
                ❌
              </td>
              <td className={`${item.Quality} item-row-name`}>
                <a
                  href={`${getBaseWowheadUrl(i18n.language)}/item=${
                    item.DisplayId || item.Id
                  }`}
                  onClick={(e) => e.preventDefault()}
                  style={{ fontSize: '0px' }}
                >
                  .
                </a>
                <img
                  src={`${process.env.PUBLIC_URL}/img/${item.IconName}.jpg`}
                  alt={t(item.Name)}
                  className='item-icon'
                />
                {t(item.Name)}
              </td>
              <td>
                {
                  <ItemSocketDisplay
                    item={item}
                    itemSlot={uiStore.SelectedItemSlot}
                    itemSocketClickHandler={itemSocketClickHandler}
                    removeGemFromSocket={removeGemFromSocket}
                  />
                }
              </td>
              <td>{t(item.Source)}</td>
              <td>{item.Stats[Stat.Stamina]}</td>
              <td>{item.Stats[Stat.Intellect]}</td>
              <td>{item.Stats[Stat.SpellPower]}</td>
              <td>{item.Stats[Stat.ShadowPower]}</td>
              <td>{item.Stats[Stat.FirePower]}</td>
              <td>{item.Stats[Stat.CritRating]}</td>
              <td>{item.Stats[Stat.HitRating]}</td>
              <td>{item.Stats[Stat.HasteRating]}</td>
              <td id={item.Id.toString()}>
                {uiStore.SavedItemDps[
                  ItemSlotToItemSlotDetailed(
                    uiStore.SelectedItemSlot,
                    uiStore.SelectedItemSubSlot
                  )
                ] &&
                uiStore.SavedItemDps[
                  ItemSlotToItemSlotDetailed(
                    uiStore.SelectedItemSlot,
                    uiStore.SelectedItemSubSlot
                  )
                ][item.Id]
                  ? (
                      Math.round(
                        uiStore.SavedItemDps[
                          ItemSlotToItemSlotDetailed(
                            uiStore.SelectedItemSlot,
                            uiStore.SelectedItemSubSlot
                          )
                        ][item.Id] * 100
                      ) / 100
                    ).toString()
                  : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {Enchants.filter(
        (e) =>
          e.ItemSlot === uiStore.SelectedItemSlot &&
          uiStore.Sources.includes(e.Phase)
      ).length > 0 && (
        <table id='enchant-selection-table' data-type='mainhand'>
          <colgroup id='enchant-selection-colgroup'>
            <col style={{ width: '20%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr id='enchant-selection-header'>
              <th id='header-enchant-name'>{t('Enchant')}</th>
              <th id='header-enchant-spell-power'>{t('Spell Power')}</th>
              <th id='header-enchant-shadow-power'>{t('Shadow Power')}</th>
              <th id='header-enchant-fire-power'>{t('Fire Power')}</th>
              <th id='header-enchant-hit-rating'>{t('Hit Rating')}</th>
              <th id='header-enchant-crit-rating'>{t('Crit Rating')}</th>
              <th id='header-enchant-stamina'>{t('Stamina')}</th>
              <th id='header-enchant-intellect'>{t('Intellect')}</th>
              <th id='header-enchant-mp5'>{t('MP5')}</th>
              <th id='header-enchant-spell-penetration'>{t('Spell Pen')}</th>
              <th id='header-enchant-dps'>{t('DPS')}</th>
            </tr>
          </thead>
          <tbody aria-live='polite'>
            {Enchants.filter(
              (e) =>
                e.ItemSlot === uiStore.SelectedItemSlot &&
                uiStore.Sources.includes(e.Phase)
            ).map((enchant) => (
              <tr
                key={enchant.Id}
                className='enchant-row'
                data-selected={
                  playerStore.SelectedEnchants[
                    ItemSlotToItemSlotDetailed(
                      uiStore.SelectedItemSlot,
                      uiStore.SelectedItemSubSlot
                    )
                  ] === enchant.Id
                }
                onClick={() =>
                  enchantClickHandler(
                    enchant,
                    ItemSlotToItemSlotDetailed(
                      uiStore.SelectedItemSlot,
                      uiStore.SelectedItemSubSlot
                    )
                  )
                }
              >
                <td className={`${enchant.Quality} enchant-row-name`}>
                  <a
                    href={`${getBaseWowheadUrl(i18n.language)}/spell=${
                      enchant.Id
                    }`}
                    onClick={(e) => e.preventDefault()}
                    style={{ fontSize: '0px' }}
                  >
                    .
                  </a>
                  {t(enchant.Name)}
                </td>
                <td>{enchant.Stats[Stat.SpellPower]}</td>
                <td>{enchant.Stats[Stat.ShadowPower]}</td>
                <td>{enchant.Stats[Stat.FirePower]}</td>
                <td>{enchant.Stats[Stat.HitRating]}</td>
                <td>{enchant.Stats[Stat.CritRating]}</td>
                <td>{enchant.Stats[Stat.Stamina]}</td>
                <td>{enchant.Stats[Stat.Intellect]}</td>
                <td>{enchant.Stats[Stat.Mp5]}</td>
                <td>{enchant.Stats[Stat.SpellPenetration]}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
