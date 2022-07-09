import WarningIcon from '@mui/icons-material/Warning'
import {
  Button,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  getBaseWowheadUrl,
  getEnchantsStats,
  getGemsStats,
  getItemSetCounts,
  getItemsStats,
  getItemTableItems,
  GetQualityCssColor,
  ItemSlotToItemSlotDetailed,
} from '../Common'
import { Enchants } from '../data/Enchants'
import { Items } from '../data/Items'
import i18n from '../i18n/config'
import {
  setEnchantsStats,
  setGemsStats,
  setItemSetCounts,
  setItemsStats,
  setSelectedEnchants,
  setSelectedGems,
  setSelectedItems,
} from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import {
  setEquippedItemsWindowVisibility,
  setFillItemSocketsWindowVisibility,
  setGemSelectionTable,
  setSelectedItemSlot,
  setSelectedItemSubSlot,
  toggleHiddenItemId,
} from '../redux/UiSlice'
import {
  Enchant,
  Item,
  ItemSlot,
  ItemSlotDetailed,
  SelectedGemsStruct,
  SocketColor,
  Stat,
  SubSlotValue,
} from '../Types'
import { FillItemSockets } from './FillItemSockets'
import ItemSocketDisplay from './ItemSocketDisplay'

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
  const [items, setItems] = useState<Item[] | undefined>()
  const [enchants, setEnchants] = useState<Enchant[] | undefined>()

  useEffect(() => {
    setItems(
      getItemTableItems(
        uiStore.SelectedItemSlot,
        uiStore.SelectedItemSubSlot,
        playerStore.SelectedItems,
        uiStore.Sources,
        uiStore.HiddenItems,
        hidingItems,
        uiStore.SavedItemDps,
        false
      )
    )
  }, [
    uiStore.SelectedItemSlot,
    uiStore.SelectedItemSubSlot,
    uiStore.Sources,
    uiStore.HiddenItems,
    uiStore.SavedItemDps,
    playerStore.SelectedItems,
    hidingItems,
  ])

  useEffect(() => {
    setEnchants(
      items?.filter(item => !uiStore.HiddenItems.includes(item.Id))?.length
        ? Enchants.filter(
            e =>
              e.ItemSlot === uiStore.SelectedItemSlot &&
              uiStore.Sources.includes(e.Phase)
          )
        : undefined
    )
  }, [items, uiStore.HiddenItems, uiStore.SelectedItemSlot, uiStore.Sources])

  function changeEquippedItemId(itemSlot: ItemSlotDetailed, newItemId: number) {
    if (playerStore.SelectedItems[itemSlot] === newItemId) {
      return
    }

    let newSelectedItems = JSON.parse(JSON.stringify(playerStore.SelectedItems))
    newSelectedItems[itemSlot] = newItemId

    if (newItemId !== 0) {
      const itemBeingEquipped = Items.find(x => x.Id === newItemId)

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
      Enchants.find(e => e.ItemSlot === itemSlot) == null
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
    <Grid id='item-selection-container' style={{ width: '100%' }}>
      <List id='item-slot-selection-list' style={{ display: 'inline-flex' }}>
        {itemSlotInformation.map(slot => (
          <ListItem
            key={nanoid()}
            style={{
              padding: '8px',
              justifyContent: 'center',
            }}
          >
            <Typography
              onClick={() => itemSlotClickHandler(slot.ItemSlot, slot.SubSlot)}
              data-selected={
                uiStore.SelectedItemSlot === slot.ItemSlot &&
                (!slot.SubSlot || uiStore.SelectedItemSubSlot === slot.SubSlot)
              }
            >
              {t(slot.Name)}
            </Typography>
            {shouldDisplayMissingEnchantWarning(
              slot.ItemSlot,
              slot.SubSlot
            ) && <WarningIcon titleAccess='Missing enchant!'></WarningIcon>}
          </ListItem>
        ))}
      </List>
      <Button variant='contained' onClick={() => setHidingItems(!hidingItems)}>
        <Typography>{t('Hide / Show Items')}</Typography>
      </Button>{' '}
      <Button
        variant='contained'
        onClick={() =>
          dispatch(
            setFillItemSocketsWindowVisibility(
              !uiStore.FillItemSocketsWindowVisible
            )
          )
        }
      >
        <Typography>{t('Fill Item Sockets')}</Typography>
      </Button>{' '}
      <Button
        variant='contained'
        onClick={() =>
          dispatch(
            setEquippedItemsWindowVisibility(
              !uiStore.EquippedItemsWindowVisible
            )
          )
        }
      >
        <Typography>{t('Show Equipped Items')}</Typography>
      </Button>
      <FillItemSockets />
      <Table
        id='item-selection-table'
        data-type='mainhand'
        className='tablesorter'
        data-sortlist='[[12,1]]'
      >
        {items?.length ? (
          <TableHead>
            <TableRow id='item-selection-header'>
              <TableCell
                style={{ display: hidingItems ? '' : 'none', color: 'white' }}
              ></TableCell>
              <TableCell style={{ color: 'white' }} id='header-name'>
                {t('Name')}
              </TableCell>
              <TableCell
                style={{ color: 'white' }}
                id='header-gems'
              ></TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-source'
              >
                {t('Source')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-stamina'
              >
                {t('Stam')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-intellect'
              >
                {t('Int')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-spell-power'
              >
                {t('Spell Power')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-shadow-power'
              >
                {t('Shadow')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-fire-power'
              >
                {t('Fire')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-crit'
              >
                {t('Crit')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-hit'
              >
                {t('Hit')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-haste'
              >
                {t('Haste')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-dps'
              >
                {t('DPS')}
              </TableCell>
            </TableRow>
          </TableHead>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell
                style={{
                  color: 'white',
                  textAlign: 'center',
                  borderBottom: 'none',
                }}
              >
                <Typography variant='h6'>
                  No items found 😱 try selecting different item sources.
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
        <TableBody aria-live='polite'>
          {items?.map(item => (
            <TableRow
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
              <TableCell
                className='hide-item-btn'
                style={{
                  display: hidingItems ? 'table-cell' : 'none',
                  color: 'white',
                }}
                title={
                  uiStore.HiddenItems.includes(item.Id)
                    ? 'Show Item'
                    : 'Hide Item'
                }
                onClick={e => {
                  dispatch(toggleHiddenItemId(item.Id))
                  e.stopPropagation()
                }}
              >
                ❌
              </TableCell>
              <TableCell
                className={`item-row-name`}
                style={{
                  color: GetQualityCssColor(item.Quality),
                }}
              >
                <Link
                  href={`${getBaseWowheadUrl(i18n.language)}/item=${
                    item.DisplayId || item.Id
                  }`}
                  onClick={e => e.preventDefault()}
                  style={{ fontSize: '0px' }}
                >
                  .
                </Link>
                <img
                  src={`${process.env.PUBLIC_URL}/img/${item.IconName}.jpg`}
                  alt={t(item.Name)}
                  className='item-icon'
                />
                {t(item.Name)}
              </TableCell>
              <TableCell style={{ color: 'white', textAlign: 'center' }}>
                {
                  <ItemSocketDisplay
                    item={item}
                    itemSlot={uiStore.SelectedItemSlot}
                    itemSocketClickHandler={itemSocketClickHandler}
                    removeGemFromSocket={removeGemFromSocket}
                  />
                }
              </TableCell>
              <TableCell style={{ color: 'white', textAlign: 'center' }}>
                {item.Source && t(item.Source)}
              </TableCell>
              <TableCell style={{ color: 'white', textAlign: 'center' }}>
                {item.Stats && item.Stats[Stat.Stamina]}
              </TableCell>
              <TableCell style={{ color: 'white', textAlign: 'center' }}>
                {item.Stats && item.Stats[Stat.Intellect]}
              </TableCell>
              <TableCell style={{ color: 'white', textAlign: 'center' }}>
                {item.Stats && item.Stats[Stat.SpellPower]}
              </TableCell>
              <TableCell style={{ color: 'white', textAlign: 'center' }}>
                {item.Stats && item.Stats[Stat.ShadowPower]}
              </TableCell>
              <TableCell style={{ color: 'white', textAlign: 'center' }}>
                {item.Stats && item.Stats[Stat.FirePower]}
              </TableCell>
              <TableCell style={{ color: 'white', textAlign: 'center' }}>
                {item.Stats && item.Stats[Stat.CritRating]}
              </TableCell>
              <TableCell style={{ color: 'white', textAlign: 'center' }}>
                {item.Stats && item.Stats[Stat.HitRating]}
              </TableCell>
              <TableCell style={{ color: 'white', textAlign: 'center' }}>
                {item.Stats && item.Stats[Stat.HasteRating]}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id={item.Id.toString()}
              >
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {enchants && enchants.length > 0 && items && items.length > 0 && (
        <Table id='enchant-selection-table' data-type='mainhand'>
          <TableHead>
            <TableRow id='enchant-selection-header'>
              <TableCell style={{ color: 'white' }} id='header-enchant-name'>
                {t('Enchant')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-enchant-spell-power'
              >
                {t('Spell Power')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-enchant-shadow-power'
              >
                {t('Shadow Power')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-enchant-fire-power'
              >
                {t('Fire Power')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-enchant-hit-rating'
              >
                {t('Hit Rating')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-enchant-crit-rating'
              >
                {t('Crit Rating')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-enchant-stamina'
              >
                {t('Stamina')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-enchant-intellect'
              >
                {t('Intellect')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-enchant-mp5'
              >
                {t('MP5')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-enchant-spell-penetration'
              >
                {t('Spell Pen')}
              </TableCell>
              <TableCell
                style={{ color: 'white', textAlign: 'center' }}
                id='header-enchant-dps'
              >
                {t('DPS')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody aria-live='polite'>
            {enchants?.map(enchant => (
              <TableRow
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
                <TableCell
                  style={{ color: GetQualityCssColor(enchant.Quality) }}
                  className={`enchant-row-name`}
                >
                  <Link
                    href={`${getBaseWowheadUrl(i18n.language)}/spell=${
                      enchant.Id
                    }`}
                    onClick={e => e.preventDefault()}
                    style={{ fontSize: '0px' }}
                  >
                    .
                  </Link>
                  {t(enchant.Name)}
                </TableCell>
                <TableCell style={{ color: 'white', textAlign: 'center' }}>
                  {enchant.Stats && enchant.Stats[Stat.SpellPower]}
                </TableCell>
                <TableCell style={{ color: 'white', textAlign: 'center' }}>
                  {enchant.Stats && enchant.Stats[Stat.ShadowPower]}
                </TableCell>
                <TableCell style={{ color: 'white', textAlign: 'center' }}>
                  {enchant.Stats && enchant.Stats[Stat.FirePower]}
                </TableCell>
                <TableCell style={{ color: 'white', textAlign: 'center' }}>
                  {enchant.Stats && enchant.Stats[Stat.HitRating]}
                </TableCell>
                <TableCell style={{ color: 'white', textAlign: 'center' }}>
                  {enchant.Stats && enchant.Stats[Stat.CritRating]}
                </TableCell>
                <TableCell style={{ color: 'white', textAlign: 'center' }}>
                  {enchant.Stats && enchant.Stats[Stat.Stamina]}
                </TableCell>
                <TableCell style={{ color: 'white', textAlign: 'center' }}>
                  {enchant.Stats && enchant.Stats[Stat.Intellect]}
                </TableCell>
                <TableCell style={{ color: 'white', textAlign: 'center' }}>
                  {enchant.Stats && enchant.Stats[Stat.Mp5]}
                </TableCell>
                <TableCell style={{ color: 'white', textAlign: 'center' }}>
                  {enchant.Stats && enchant.Stats[Stat.SpellPenetration]}
                </TableCell>
                <TableCell
                  style={{ color: 'white', textAlign: 'center' }}
                ></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Grid>
  )
}
