import { Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Average,
  CalculatePlayerStats,
  GetItemSetCounts,
  GetItemTableItems,
  GetPlayerHitPercent,
  GetStdev,
  ItemSlotToItemSlotDetailed,
  Random,
} from '../Common'
import { Gems } from '../data/Gems'
import { Items } from '../data/Items'
import { Races } from '../data/Races'
import { RootState } from '../redux/Store'
import {
  ClearSavedItemSlotDps,
  SetCombatLogBreakdownValue,
  SetCombatLogData,
  SetCombatLogVisibility,
  SetHistogramData,
  SetHistogramVisibility,
  SetSavedItemDps,
  SetSimulationInProgressStatus,
  SetStatWeightValue,
  SetStatWeightVisibility,
} from '../redux/UiSlice'
import { SimWorker } from '../SimWorker.js'
import {
  CombatLogBreakdownData,
  GemColor,
  GlyphId,
  GlyphType,
  ItemSlot,
  ItemSlotDetailed,
  ItemSlotDetailedStruct,
  PlayerState,
  SelectedGemsStruct,
  Setting,
  SimulationType,
  Stat,
  StatConstant,
  StatWeightStats,
  WorkerParams,
} from '../Types'

interface SimulationUpdate {
  medianDps: number
  iteration: number
  iterationAmount: number
  itemId: number
  customStat: string
}

interface SimulationEnd {
  customStat: string
  itemId: number
  iterationAmount: number
  totalDuration: number
  maxDps: number
  minDps: number
  medianDps: number
}

interface IGetWorkerParams {
  ItemId: number
  EquippedItemId: number
  SimulationType: SimulationType
  RandomSeed: number
  CustomStat?: {
    Stat: string
    Value: number
  }
}

interface ISimulationProgressPercent {
  ItemId: number
  ProgressPercent: number
  CustomStat?: string
}

const statWeightStatIncrease = 100
const statWeightValues: { [key: string]: number } = {
  normal: 0,
  [Stat.Stamina]: statWeightStatIncrease,
  [Stat.Intellect]: statWeightStatIncrease,
  [Stat.Spirit]: statWeightStatIncrease,
  [Stat.SpellPower]: statWeightStatIncrease,
  [Stat.ShadowPower]: statWeightStatIncrease,
  [Stat.FirePower]: statWeightStatIncrease,
  [Stat.HitRating]: statWeightStatIncrease,
  [Stat.CritRating]: statWeightStatIncrease,
  [Stat.HasteRating]: statWeightStatIncrease,
  [Stat.Mp5]: statWeightStatIncrease,
}

function GetEquippedMetaGemId(
  items: ItemSlotDetailedStruct,
  gems: SelectedGemsStruct
): number {
  if (
    [null, 0].includes(items[ItemSlotDetailed.Head]) ||
    !gems[ItemSlot.Head] ||
    !gems[ItemSlot.Head][items[ItemSlotDetailed.Head]]
  ) {
    return 0
  }

  for (const gemId of gems[ItemSlot.Head][items[ItemSlotDetailed.Head]]) {
    if (Gems.find(e => e.Id === gemId)?.Color === GemColor.Meta) {
      return gemId
    }
  }

  return 0
}

let lastStatWeightUpdateTime: { [key: string]: number } = {}

export function SimulationButtons() {
  const player = useSelector((state: RootState) => state.player)
  const ui = useSelector((state: RootState) => state.ui)
  const dispatch = useDispatch()
  const [medianDps, setMedianDps] = useState(
    localStorage.getItem('medianDps') || ''
  )
  const [minDps, setMinDps] = useState(localStorage.getItem('minDps') || '')
  const [maxDps, setMaxDps] = useState(localStorage.getItem('maxDps') || '')
  const [simulationDuration, setSimulationDuration] = useState(
    localStorage.getItem('simulationDuration') || ''
  )
  const [simulationProgressPercent, setSimulationProgressPercent] = useState(0)
  const [dpsStdev, setDpsStdev] = useState('')
  const [simulationType, setSimulationType] = useState(SimulationType.Normal)
  let combatLogEntries: string[] = []

  function CombatLogButtonIsDisabled(): boolean {
    return ui.CombatLog.Data.length === 0
  }

  function HistogramButtonIsDisabled(): boolean {
    return ui.Histogram.Data === undefined
  }

  function GetWorkerParams(params: IGetWorkerParams): WorkerParams {
    let customPlayer: PlayerState = JSON.parse(JSON.stringify(player))
    let iterationAmount = parseInt(customPlayer.Settings[Setting.iterations])

    if (params.SimulationType === SimulationType.StatWeights) {
      // Set minimum iteration amount to 100,000 for stat weight sims
      iterationAmount = Math.max(iterationAmount, 100000)
      // Increase the iteration amount for stat weight sims if it's not the 'normal' sim with no added stats.
      if (params.CustomStat?.Stat !== 'normal') {
        iterationAmount += 20000
      }
    }

    if (params.SimulationType !== SimulationType.StatWeights) {
      customPlayer.SelectedItems[
        ItemSlotToItemSlotDetailed(ui.SelectedItemSlot, ui.SelectedItemSubSlot)
      ] = params.ItemId
    }

    let playerStats = CalculatePlayerStats(customPlayer)

    if (params.SimulationType === SimulationType.StatWeights) {
      if (params.CustomStat?.Stat && params.CustomStat.Stat !== 'normal') {
        let statValue = params.CustomStat.Value

        if (params.CustomStat.Stat === Stat[Stat.HitRating]) {
          const hitPercent = GetPlayerHitPercent(customPlayer)
          // If the user isn't hitcapped but adding the extra hit rating would overcap them
          // then instead remove hit rating instead of adding it so it doesn't get wasted.
          // Using 15.99 instead of 16 because using 16 was causing issues when a player had
          // e.g. 15.995 hit percent which would show as 16% in the sidebar but not technically be hit capped.
          if (
            hitPercent <= 15.99 &&
            hitPercent +
              statWeightValues[Stat.HitRating] /
                StatConstant.HitRatingPerPercent >
              StatConstant.HitPercentCap
          ) {
            statValue *= -1
          }
        }

        playerStats[params.CustomStat.Stat as unknown as Stat]! += statValue
      }
    }

    return {
      PlayerSettings: {
        Auras: customPlayer.Auras,
        Items: customPlayer.SelectedItems,
        Enchants: customPlayer.SelectedEnchants,
        Gems: customPlayer.SelectedGems,
        Talents: customPlayer.Talents,
        Rotation: customPlayer.Rotation,
        Stats: playerStats,
        Sets: GetItemSetCounts(customPlayer.SelectedItems),
        Settings: customPlayer.Settings,
        MetaGemId: GetEquippedMetaGemId(
          customPlayer.SelectedItems,
          customPlayer.SelectedGems
        ),
        Glyphs: customPlayer.Glyphs[GlyphType.Major].filter(
          x => x != null
        ) as GlyphId[],
      },
      SimulationSettings: {
        Iterations: iterationAmount,
        MinTime: parseInt(customPlayer.Settings[Setting.minFightLength]),
        MaxTime: parseInt(customPlayer.Settings[Setting.maxFightLength]),
      },
      RandomSeed: params.RandomSeed,
      ItemId: params.ItemId,
      SimulationType: params.SimulationType,
      ItemSubSlot: ui.SelectedItemSubSlot,
      CustomStat: params.CustomStat?.Stat || 'normal',
      EquippedItemSimulation:
        params.ItemId === params.EquippedItemId ||
        (params.ItemId === 0 && params.EquippedItemId == null),
    }
  }

  function Simulate(simulationParams: {
    type: SimulationType
    itemIdsToSim?: number[]
  }) {
    if (ui.SimulationInProgress) {
      return
    }

    const maxWorkers = window.navigator.hardwareConcurrency || 8 // Maximum amount of web workers that can be run concurrently.
    const simulations: SimWorker[] = []
    const itemSlot: ItemSlotDetailed = ItemSlotToItemSlotDetailed(
      ui.SelectedItemSlot,
      ui.SelectedItemSubSlot
    )
    const equippedItemId = player.SelectedItems[itemSlot]
    let simulationsFinished = 0
    let simulationsRunning = 0
    let simIndex = 0
    let dpsArray: number[] = []
    let dpsCount: { [key: string]: number } = {}
    let combatLogBreakdownArr: CombatLogBreakdownData[] = []
    let totalManaRegenerated = 0
    let totalDamageDone = 0
    let spellDamageDict: { [key: string]: number } = {}
    let spellManaGainDict: { [key: string]: number } = {}
    // Used to keep track of the progress % of sims for the progress bar.
    let simulationProgressPercentages: ISimulationProgressPercent[] = []
    let simWorkerParameters: IGetWorkerParams[] = []
    combatLogEntries = []

    dispatch(SetSimulationInProgressStatus(true))
    setSimulationType(simulationParams.type)
    if (simulationParams.type === SimulationType.AllItems) {
      dispatch(ClearSavedItemSlotDps(itemSlot))
    } else if (simulationParams.type === SimulationType.StatWeights) {
      dispatch(SetStatWeightVisibility(true))
    }

    const randomSeed = Random(0, 4294967295)

    if (simulationParams.type === SimulationType.StatWeights) {
      Object.entries(statWeightValues).forEach(statWeight => {
        simWorkerParameters.push({
          RandomSeed: randomSeed,
          ItemId: equippedItemId,
          EquippedItemId: equippedItemId,
          SimulationType: simulationParams.type,
          CustomStat: { Stat: statWeight[0], Value: statWeight[1] },
        })
      })
    } else if (simulationParams.itemIdsToSim) {
      simulationParams.itemIdsToSim.forEach(itemId => {
        simWorkerParameters.push({
          RandomSeed: randomSeed,
          ItemId: itemId,
          EquippedItemId: equippedItemId,
          SimulationType: simulationParams.type,
        })
      })
    }

    try {
      simWorkerParameters.forEach(simWorkerParameter => {
        simulationProgressPercentages.push({
          ItemId: simWorkerParameter.ItemId,
          ProgressPercent: 0,
          CustomStat: simWorkerParameter.CustomStat?.Stat,
        })
        simulations.push(
          new SimWorker(
            (dpsUpdate: { dps: number }) => {
              dpsArray.push(dpsUpdate.dps)
              const dps: string = Math.round(dpsUpdate.dps).toString()
              dpsCount[dps] = Math.round(dpsCount[dps]) + 1 || 1
            },
            (combatLogVector: {
              name: string
              damage: number
              manaGain: number
            }) => {
              spellDamageDict[combatLogVector.name] =
                spellDamageDict[combatLogVector.name] +
                  combatLogVector.damage || combatLogVector.damage
              spellManaGainDict[combatLogVector.name] =
                spellManaGainDict[combatLogVector.name] +
                  combatLogVector.manaGain || combatLogVector.manaGain
              totalManaRegenerated += combatLogVector.manaGain
              totalDamageDone += combatLogVector.damage
            },
            (errorCallback: { errorMsg: string }) => {
              PopulateCombatLog()
              ErrorCallbackHandler(errorCallback)
            },
            (combatLogUpdate: { combatLogEntry: string }) => {
              combatLogEntries.push(combatLogUpdate.combatLogEntry)
            },
            (combatLogBreakdown: CombatLogBreakdownData) => {
              combatLogBreakdownArr.push(combatLogBreakdown)
            },
            (params: SimulationEnd) => {
              const newMedianDps = params.medianDps
              simulationsFinished++
              FindSimulationProgressPercentObject({
                simulationProgressPercentages: simulationProgressPercentages,
                simType: simulationParams.type,
                itemId: params.itemId,
                stat: params.customStat,
              }).ProgressPercent = 100

              if (
                simulationParams.type !== SimulationType.StatWeights ||
                params.customStat === 'normal'
              ) {
                SetSavedItemDpsValue(
                  itemSlot,
                  params.itemId,
                  newMedianDps,
                  true
                )
              }

              // Callback for the currently equipped item
              if (
                simulationParams.type === SimulationType.Normal ||
                (simulationParams.type === SimulationType.AllItems &&
                  params.itemId === equippedItemId) ||
                (simulationParams.type === SimulationType.StatWeights &&
                  params.customStat === 'normal')
              ) {
                const newMinDps = Math.round(params.minDps * 100) / 100
                const newMaxDps = Math.round(params.maxDps * 100) / 100
                SetNewMedianDps(newMedianDps.toString(), true)
                SetNewMinDps(newMinDps.toString(), true)
                SetNewMaxDps(newMaxDps.toString(), true)
              }

              if (simulationParams.type === SimulationType.StatWeights) {
                UpdateStatWeightValue(params.customStat, newMedianDps)
              }

              if (simulationsFinished === simWorkerParameters.length) {
                dispatch(SetSimulationInProgressStatus(false))
                const totalSimDuration = (performance.now() - startTime) / 1000
                SetNewSimulationDuration(
                  (Math.round(totalSimDuration * 10000) / 10000).toString(),
                  true
                )
                setSimulationProgressPercent(0)

                // Either normal sim or multi-item sim
                if (
                  [SimulationType.Normal, SimulationType.AllItems].includes(
                    simulationParams.type
                  )
                ) {
                  PopulateCombatLog()
                }

                if (simulationParams.type === SimulationType.Normal) {
                  setDpsStdev(Math.round(GetStdev(dpsArray)).toString())
                  dispatch(SetHistogramData(dpsCount))

                  if (
                    player.Settings[Setting.automaticallyOpenSimDetails] ===
                    'true'
                  ) {
                    dispatch(
                      SetCombatLogBreakdownValue({
                        TotalDamageDone: totalDamageDone,
                        TotalManaGained: totalManaRegenerated,
                        TotalSimulationFightLength: params.totalDuration,
                        TotalIterationAmount: params.iterationAmount,
                        SpellDamageDict: spellDamageDict,
                        SpellManaGainDict: spellManaGainDict,
                        Data: combatLogBreakdownArr,
                      })
                    )
                    $('.breakdown-table').trigger('update')
                  }
                }
              } else if (simulationParams.type === SimulationType.AllItems) {
                if (
                  simulationsRunning - simulationsFinished < maxWorkers &&
                  simIndex < simulations.length
                ) {
                  simulations[simIndex++].start()
                  simulationsRunning++
                }
              }
            },
            (params: SimulationUpdate) => {
              let newMedianDps = params.medianDps
              const simProgressPercent = Math.ceil(
                (params.iteration / params.iterationAmount) * 100
              )

              FindSimulationProgressPercentObject({
                simulationProgressPercentages: simulationProgressPercentages,
                simType: simulationParams.type,
                itemId: params.itemId,
                stat: params.customStat,
              }).ProgressPercent = simProgressPercent
              setSimulationProgressPercent(
                Math.round(
                  Average(
                    simulationProgressPercentages.map(e => e.ProgressPercent)
                  )
                )
              )
              // Only update the item table dps value for every 10% of progress
              // because otherwise the simulation slows down too much.
              if (
                simulationParams.type === SimulationType.Normal ||
                (simulationParams.type === SimulationType.AllItems &&
                  simProgressPercent % 10 === 0)
              ) {
                const domElement = document.getElementById(
                  params.itemId.toString()
                )

                if (domElement) {
                  domElement.innerHTML = (
                    Math.round(newMedianDps * 100) / 100
                  ).toString()
                  $('#item-selection-table').trigger('update')
                }
              }
              if (
                simulationParams.type === SimulationType.Normal ||
                (simulationParams.type === SimulationType.AllItems &&
                  params.itemId === equippedItemId) ||
                (simulationParams.type === SimulationType.StatWeights &&
                  params.customStat === 'normal')
              ) {
                SetNewMedianDps(newMedianDps.toString(), false)
              } else if (simulationParams.type === SimulationType.StatWeights) {
                // Limit the updates to once every 5 seconds
                const dateNow = Date.now()
                if (
                  !lastStatWeightUpdateTime[params.customStat] ||
                  dateNow - lastStatWeightUpdateTime[params.customStat] > 5000
                ) {
                  UpdateStatWeightValue(params.customStat, params.medianDps)
                  lastStatWeightUpdateTime[params.customStat] = dateNow
                }
              }
            },
            GetWorkerParams({
              RandomSeed: randomSeed,
              ItemId: simWorkerParameter.ItemId,
              EquippedItemId: simWorkerParameter.EquippedItemId,
              SimulationType: simWorkerParameter.SimulationType,
              CustomStat: simWorkerParameter.CustomStat,
            })
          )
        )
      })

      const startTime = performance.now()
      while (
        (simulationsRunning < maxWorkers ||
          simulationParams.type === SimulationType.StatWeights) &&
        simIndex < simulations.length
      ) {
        simulations[simIndex++].start()
        simulationsRunning++
      }
    } catch (error) {
      dispatch(SetSimulationInProgressStatus(false))
      throw new Error('Error when trying to run simulation. ' + error)
    }
  }

  function UpdateStatWeightValue(stat: string, value: number): void {
    let dpsDifference = Math.abs(
      Math.round(
        ((value - Number(medianDps)) / statWeightStatIncrease) * 1000
      ) / 1000
    )
    if (dpsDifference < 0.05) {
      dpsDifference = 0
    }

    dispatch(
      SetStatWeightValue({
        stat: stat as unknown as [keyof StatWeightStats],
        value: dpsDifference,
      })
    )
  }

  function FindSimulationProgressPercentObject(params: {
    simulationProgressPercentages: ISimulationProgressPercent[]
    simType: SimulationType
    itemId: number
    stat: string
  }): ISimulationProgressPercent {
    return params.simulationProgressPercentages.find(
      e =>
        (e.ItemId === params.itemId &&
          params.simType !== SimulationType.StatWeights) ||
        e.CustomStat === params.stat
    )!
  }

  function SetSavedItemDpsValue(
    itemSlot: ItemSlotDetailed,
    itemId: number,
    newMedianDps: number,
    saveToLocalStorage: boolean
  ): void {
    dispatch(
      SetSavedItemDps({
        itemSlot: itemSlot,
        itemId: itemId,
        dps: newMedianDps,
        saveLocalStorage: saveToLocalStorage,
      })
    )
  }

  function PopulateCombatLog(): void {
    dispatch(SetCombatLogData(combatLogEntries))
  }

  function ErrorCallbackHandler(errorCallback: { errorMsg: string }): void {
    alert(
      'Error: ' +
        errorCallback.errorMsg +
        '\nPost in the #sim-bug-report channel on the Classic Warlock discord.'
    )
  }

  function SetNewMedianDps(newMedianDps: string, savingLocalStorage: boolean) {
    setMedianDps(newMedianDps)
    if (savingLocalStorage) {
      localStorage.setItem('medianDps', newMedianDps)
    }
  }

  function SetNewMinDps(newMinDps: string, savingLocalStorage: boolean) {
    setMinDps(newMinDps)
    if (savingLocalStorage) {
      localStorage.setItem('minDps', newMinDps)
    }
  }

  function SetNewMaxDps(newMaxDps: string, savingLocalStorage: boolean) {
    setMaxDps(newMaxDps)
    if (savingLocalStorage) {
      localStorage.setItem('maxDps', newMaxDps)
    }
  }

  function SetNewSimulationDuration(
    newSimulationDuration: string,
    savingLocalStorage: boolean
  ) {
    setSimulationDuration(newSimulationDuration)
    if (savingLocalStorage) {
      localStorage.setItem('simulationDuration', newSimulationDuration)
    }
  }

  return (
    <>
      {medianDps.length > 0 && (
        <Grid id='sim-result-dps-div'>
          <Typography>
            <span id='median-dps'>
              {Math.round(Number(medianDps) * 100) / 100}
            </span>
            <span> DPS</span>{' '}
            <span id='dps-stdev'>
              {dpsStdev.length > 0 ? '±' + dpsStdev : ''}
            </span>
          </Typography>
          {maxDps.length > 0 && minDps.length > 0 && (
            <Typography>
              Min: <span id='min-dps'>{minDps}</span> Max:{' '}
              <span id='max-dps'>{maxDps}</span>
            </Typography>
          )}
        </Grid>
      )}
      <Grid
        className='warlock-btn active-btn'
        onClick={() =>
          Simulate({
            itemIdsToSim: [
              Items.find(
                e =>
                  e.Id ===
                  player.SelectedItems[
                    ItemSlotToItemSlotDetailed(
                      ui.SelectedItemSlot,
                      ui.SelectedItemSubSlot
                    )
                  ]
              )?.Id || 0,
            ],
            type: SimulationType.Normal,
          })
        }
        style={{
          background:
            ui.SimulationInProgress && simulationType === SimulationType.Normal
              ? `linear-gradient(to right, #9482C9 ${simulationProgressPercent}%, transparent ${simulationProgressPercent}%)`
              : '',
        }}
      >
        <Typography>
          {ui.SimulationInProgress && simulationType === SimulationType.Normal
            ? `${simulationProgressPercent}%`
            : 'Simulate'}
        </Typography>
      </Grid>
      <Grid
        className='warlock-btn active-btn'
        onClick={() =>
          Simulate({
            itemIdsToSim: GetItemTableItems(
              ui.SelectedItemSlot,
              ui.SelectedItemSubSlot,
              player.SelectedItems,
              ui.Sources,
              ui.HiddenItems,
              false,
              ui.SavedItemDps,
              true,
              Races.find(x => x.Type === player.Settings[Setting.race])
            ).map(item => item.Id),
            type: SimulationType.AllItems,
          })
        }
        style={{
          background:
            ui.SimulationInProgress &&
            simulationType === SimulationType.AllItems
              ? `linear-gradient(to right, #9482C9 ${simulationProgressPercent}%, transparent ${simulationProgressPercent}%)`
              : '',
        }}
      >
        <Typography>
          {ui.SimulationInProgress && simulationType === SimulationType.AllItems
            ? `${simulationProgressPercent}%`
            : 'Simulate All Items'}
        </Typography>
      </Grid>
      <Grid
        className='warlock-btn active-btn'
        onClick={() => Simulate({ type: SimulationType.StatWeights })}
        style={{
          background:
            ui.SimulationInProgress &&
            simulationType === SimulationType.StatWeights
              ? `linear-gradient(to right, #9482C9 ${simulationProgressPercent}%, transparent ${simulationProgressPercent}%)`
              : '',
        }}
      >
        <Typography>
          {ui.SimulationInProgress &&
          simulationType === SimulationType.StatWeights
            ? `${simulationProgressPercent}%`
            : 'Stat Weights'}
        </Typography>
      </Grid>
      {
        <Grid
          className={
            'warlock-btn' +
            (CombatLogButtonIsDisabled() ? ' disabled-btn' : ' active-btn')
          }
          onClick={() =>
            !CombatLogButtonIsDisabled() &&
            dispatch(SetCombatLogVisibility(!ui.CombatLog.Visible))
          }
        >
          <Typography>Combat Log</Typography>
        </Grid>
      }
      {
        <Grid
          className={
            'warlock-btn' +
            (HistogramButtonIsDisabled() ? ' disabled-btn' : ' active-btn')
          }
          onClick={() =>
            !HistogramButtonIsDisabled() &&
            dispatch(SetHistogramVisibility(!ui.Histogram.Visible))
          }
        >
          <Typography>Histogram</Typography>
        </Grid>
      }
      <Typography style={{ marginBottom: '5px' }}>
        {simulationDuration.length > 0 ? simulationDuration + 's' : ''}
      </Typography>
    </>
  )
}
