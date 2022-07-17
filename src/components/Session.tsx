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
  setAurasStats,
  setBaseStats,
  setEnchantsStats,
  setGemsStats,
  setItemSetCounts,
  setItemsStats,
  setTalentsStats,
} from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import { Race, Setting } from '../Types'

export default function Session() {
  const playerStore = useSelector((state: RootState) => state.player)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      setBaseStats(
        GetBaseStats(playerStore.Settings[Setting.race] as unknown as Race)
      )
    )
    dispatch(setAurasStats(GetAurasStats(playerStore.Auras)))
    dispatch(setItemsStats(GetItemsStats(playerStore.SelectedItems)))
    dispatch(
      setGemsStats(
        GetGemsStats(playerStore.SelectedItems, playerStore.SelectedGems)
      )
    )
    dispatch(
      setEnchantsStats(
        GetEnchantsStats(
          playerStore.SelectedItems,
          playerStore.SelectedEnchants
        )
      )
    )
    dispatch(setItemSetCounts(GetItemSetCounts(playerStore.SelectedItems)))
    dispatch(
      setTalentsStats(
        GetTalentsStats(playerStore.Talents, playerStore.Settings)
      )
    )
    ;($('.tablesorter') as any).tablesorter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}
