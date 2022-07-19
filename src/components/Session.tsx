import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  GetAurasStats,
  GetBaseStats,
  GetEnchantsStats,
  GetGemsStats,
  GetItemSetCounts,
  GetItemsStats,
  GetTalentsStats,
} from '../Common'
import {
  SetAurasStats,
  SetBaseStats,
  SetEnchantsStats,
  SetGemsStats,
  SetItemSetCounts,
  SetItemsStats,
  SetTalentsStats,
} from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import { RaceType, Setting } from '../Types'

export default function Session() {
  const player = useSelector((state: RootState) => state.player)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      SetBaseStats(
        GetBaseStats(player.Settings[Setting.race] as unknown as RaceType)
      )
    )
    dispatch(SetAurasStats(GetAurasStats(player.Auras)))
    dispatch(SetItemsStats(GetItemsStats(player.SelectedItems)))
    dispatch(
      SetGemsStats(
        GetGemsStats(
          player.SelectedItems,
          player.SelectedGems,
          player.SelectedEnchants
        )
      )
    )
    dispatch(
      SetEnchantsStats(
        GetEnchantsStats(player.SelectedItems, player.SelectedEnchants)
      )
    )
    dispatch(SetItemSetCounts(GetItemSetCounts(player.SelectedItems)))
    dispatch(SetTalentsStats(GetTalentsStats(player.Talents, player.Settings)))
    ;($('.tablesorter') as any).tablesorter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}
