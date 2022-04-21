import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAurasStats,
  getBaseStats,
  getEnchantsStats,
  getGemsStats,
  getItemSetCounts,
  getItemsStats,
} from '../Common'
import {
  setAurasStats,
  setBaseStats,
  setEnchantsStats,
  setGemsStats,
  setItemSetCounts,
  setItemsStats,
} from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import { Race, Setting } from '../Types'

export default function Session() {
  const playerStore = useSelector((state: RootState) => state.player)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      setBaseStats(
        getBaseStats(playerStore.Settings[Setting.race] as unknown as Race)
      )
    )
    dispatch(setAurasStats(getAurasStats(playerStore.Auras)))
    dispatch(setItemsStats(getItemsStats(playerStore.SelectedItems)))
    dispatch(
      setGemsStats(
        getGemsStats(playerStore.SelectedItems, playerStore.SelectedGems)
      )
    )
    dispatch(
      setEnchantsStats(
        getEnchantsStats(
          playerStore.SelectedItems,
          playerStore.SelectedEnchants
        )
      )
    )
    dispatch(setItemSetCounts(getItemSetCounts(playerStore.SelectedItems)))
    ;(jQuery('.tablesorter') as any).tablesorter()
  }, [])

  return <div></div>
}
