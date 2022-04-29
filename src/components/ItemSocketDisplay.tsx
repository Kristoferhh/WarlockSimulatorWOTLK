import { nanoid } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { getBaseWowheadUrl } from "../Common";
import { Gems } from "../data/Gems";
import { Sockets } from "../data/Sockets";
import i18n from "../i18n/config";
import { RootState } from "../redux/Store";
import { Item, ItemSlot, SocketColor } from "../Types";

interface Props {
  item: Item;
  itemSlot: ItemSlot;
  itemSocketClickHandler?: (
    itemId: string,
    socketNumber: number,
    socketColor: SocketColor
  ) => void;
  removeGemFromSocket?: (itemId: string, socketNumber: number) => void;
}

export default function ItemSocketDisplay(props: Props) {
  const playerState = useSelector((state: RootState) => state.player);
  const itemSockets = playerState.SelectedGems[props.itemSlot];

  return (
    <div className="item-sockets-container">
      {props.item.Sockets?.map((socket, j) => {
        const equippedGemId =
          itemSockets &&
          itemSockets[props.item.Id] &&
          itemSockets[props.item.Id][j];

        return (
          <a
            target="_blank"
            rel="noreferrer"
            href={
              equippedGemId !== 0
                ? `${getBaseWowheadUrl(i18n.language)}/item=${equippedGemId}`
                : ""
            }
            key={nanoid()}
            onClick={(e) => {
              props.itemSocketClickHandler &&
                props.itemSocketClickHandler(
                  props.item.Id.toString(),
                  j,
                  socket
                );
              e.preventDefault();
              e.stopPropagation();
            }}
            onContextMenu={(e) => {
              props.removeGemFromSocket &&
                props.removeGemFromSocket(props.item.Id.toString(), j);
              e.preventDefault();
            }}
          >
            <img
              width={16}
              height={16}
              data-color={socket}
              src={`${process.env.PUBLIC_URL}/img/${
                equippedGemId && equippedGemId > 0
                  ? Gems.find((e) => e.Id === equippedGemId)?.IconName
                  : Sockets.find((s) => s.Color === socket)?.IconName
              }.jpg`}
              alt={`${socket} socket`}
            />
          </a>
        );
      })}
    </div>
  );
}
