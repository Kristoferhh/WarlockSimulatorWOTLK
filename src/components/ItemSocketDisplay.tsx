import { Grid, Link } from '@mui/material'
import { nanoid } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { GetBaseWowheadUrl } from '../Common'
import { Gems } from '../data/Gems'
import { Sockets } from '../data/Sockets'
import i18n from '../i18n/config'
import { RootState } from '../redux/Store'
import { Item, ItemSlot, SocketColor } from '../Types'

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
  const itemSockets = player.SelectedGems[props.itemSlot]

  return (
    <Grid className='item-sockets-container'>
      {props.item.Sockets?.map((socket, j) => {
        const equippedGemId =
          itemSockets &&
          itemSockets[props.item.Id] &&
          itemSockets[props.item.Id][j]

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
