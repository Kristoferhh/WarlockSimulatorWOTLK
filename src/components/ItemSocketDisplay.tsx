import { Grid, Link } from '@mui/material'
import { nanoid } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { GetBaseWowheadUrl } from '../Common'
import { Gems } from '../data/Gems'
import { Sockets } from '../data/Sockets'
import i18n from '../i18n/config'
import { RootState } from '../redux/Store'
import { EnchantId, Item, ItemSlot, SocketColor } from '../Types'

interface Props {
  item: Item
  itemSlot: ItemSlot
  itemSocketClickHandler?: (
    itemId: string,
    socketNumber: number,
    socketColor: SocketColor
  ) => void
  removeGemFromSocket?: (itemId: string, socketNumber: number) => void
}

export default function ItemSocketDisplay(props: Props) {
  const player = useSelector((state: RootState) => state.player)
  const equippedGemsInItemSlot = player.SelectedGems[props.itemSlot]
  const [sockets, setSockets] = useState<SocketColor[] | undefined>()

  useEffect(() => {
    let socketArray: SocketColor[] = []
    let itemSockets = props.item.Sockets

    if (itemSockets !== undefined) {
      socketArray = socketArray.concat(itemSockets)
    }

    if (
      props.itemSlot === ItemSlot.Waist &&
      player.SelectedEnchants.Waist === EnchantId.EternalBeltBuckle
    ) {
      socketArray.push(SocketColor.Prismatic)
    }

    setSockets(socketArray)
  }, [player.SelectedEnchants.Waist, props.item.Sockets, props.itemSlot])

  return (
    <Grid className='item-sockets-container'>
      {sockets?.map((socket, j) => {
        const equippedGemId =
          equippedGemsInItemSlot &&
          equippedGemsInItemSlot[props.item.Id] &&
          equippedGemsInItemSlot[props.item.Id][j]

        return (
          <Link
            target='_blank'
            rel='noreferrer'
            href={
              equippedGemId !== 0
                ? `${GetBaseWowheadUrl(i18n.language)}/item=${equippedGemId}`
                : ''
            }
            key={nanoid()}
            onClick={e => {
              props.itemSocketClickHandler &&
                props.itemSocketClickHandler(
                  props.item.Id.toString(),
                  j,
                  socket
                )
              e.preventDefault()
              e.stopPropagation()
            }}
            onContextMenu={e => {
              props.removeGemFromSocket &&
                props.removeGemFromSocket(props.item.Id.toString(), j)
              e.preventDefault()
            }}
          >
            <img
              width={16}
              height={16}
              data-color={socket}
              src={`${process.env.PUBLIC_URL}/img/${
                equippedGemId && equippedGemId > 0
                  ? Gems.find(e => e.Id === equippedGemId)?.IconName
                  : Sockets.find(s => s.Color === socket)?.IconName
              }.jpg`}
              alt={`${socket} socket`}
            />
          </Link>
        )
      })}
    </Grid>
  )
}
