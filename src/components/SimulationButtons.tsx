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
  clearSavedItemSlotDps,
  setCombatLogBreakdownValue,
  setCombatLogData,
  setCombatLogVisibility,
  setHistogramData,
  setHistogramVisibility,
  setSavedItemDps,
  setSimulationInProgressStatus,
  setStatWeightValue,
  setStatWeightVisibility,
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

function getEquippedMetaGemId(
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
  const playerState = useSelector((state: RootState) => state.player)
  const uiState = useSelector((state: RootState) => state.ui)
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

  function combatLogButtonIsDisabled(): boolean {
    return uiState.CombatLog.Data.length === 0
  }

  function histogramButtonIsDisabled(): boolean {
    return uiState.Histogram.Data === undefined
  }

  function getWorkerParams(params: IGetWorkerParams): WorkerParams {
    let customPlayerState: PlayerState = JSON.parse(JSON.stringify(playerState))
    let iterationAmount = parseInt(
      customPlayerState.Settings[Setting.iterations]
    )

    if (params.SimulationType === SimulationType.StatWeights) {
      // Set minimum iteration amount to 100,000 for stat weight sims
      iterationAmount = Math.max(iterationAmount, 100000)
      // Increase the iteration amount for stat weight sims if it's not the 'normal' sim with no added stats.
      if (params.CustomStat?.Stat !== 'normal') {
        iterationAmount += 20000
      }
    }

    if (params.SimulationType !== SimulationType.StatWeights) {
      customPlayerState.SelectedItems[
        ItemSlotToItemSlotDetailed(
          uiState.SelectedItemSlot,
          uiState.SelectedItemSubSlot
        )
      ] = params.ItemId
    }

    let playerStats = CalculatePlayerStats(customPlayerState)

    if (params.SimulationType === SimulationType.StatWeights) {
      if (params.CustomStat?.Stat && params.CustomStat.Stat !== 'normal') {
        let statValue = params.CustomStat.Value

        if (params.CustomStat.Stat === Stat[Stat.HitRating]) {
          const hitPercent = GetPlayerHitPercent(customPlayerState)
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
        Auras: customPlayerState.Auras,
        Items: customPlayerState.SelectedItems,
        Enchants: customPlayerState.SelectedEnchants,
        Gems: customPlayerState.SelectedGems,
        Talents: customPlayerState.Talents,
        Rotation: customPlayerState.Rotation,
        Stats: playerStats,
        Sets: GetItemSetCounts(customPlayerState.SelectedItems),
        Settings: customPlayerState.Settings,
        MetaGemId: getEquippedMetaGemId(
          customPlayerState.SelectedItems,
          customPlayerState.SelectedGems
        ),
        Glyphs: customPlayerState.Glyphs[GlyphType.Major].filter(
          x => x != null
        ) as GlyphId[],
      },
      SimulationSettings: {
        Iterations: iterationAmount,
        MinTime: parseInt(customPlayerState.Settings[Setting.minFightLength]),
        MaxTime: parseInt(customPlayerState.Settings[Setting.maxFightLength]),
      },
      RandomSeed: params.RandomSeed,
      ItemId: params.ItemId,
      SimulationType: params.SimulationType,
      ItemSubSlot: uiState.SelectedItemSubSlot,
      CustomStat: params.CustomStat?.Stat || 'normal',
      EquippedItemSimulation:
        params.ItemId === params.EquippedItemId ||
        (params.ItemId === 0 && params.EquippedItemId == null),
    }
  }

  function simulate(simulationParams: {
    type: SimulationType
    itemIdsToSim?: number[]
  }) {
    if (uiState.SimulationInProgress) {
      return
    }

    const maxWorkers = window.navigator.hardwareConcurrency || 8 // Maximum amount of web workers that can be run concurrently.
    const simulations: SimWorker[] = []
    const itemSlot: ItemSlotDetailed = ItemSlotToItemSlotDetailed(
      uiState.SelectedItemSlot,
      uiState.SelectedItemSubSlot
    )
    const equippedItemId = playerState.SelectedItems[itemSlot]
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

    dispatch(setSimulationInProgressStatus(true))
    setSimulationType(simulationParams.type)
    if (simulationParams.type === SimulationType.AllItems) {
      dispatch(clearSavedItemSlotDps(itemSlot))
    } else if (simulationParams.type === SimulationType.StatWeights) {
      dispatch(setStatWeightVisibility(true))
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
              populateCombatLog()
              errorCallbackHandler(errorCallback)
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
              findSimulationProgressPercentObject({
                simulationProgressPercentages: simulationProgressPercentages,
                simType: simulationParams.type,
                itemId: params.itemId,
                stat: params.customStat,
              }).ProgressPercent = 100

              if (
                simulationParams.type !== SimulationType.StatWeights ||
                params.customStat === 'normal'
              ) {
                setSavedItemDpsValue(
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
                setNewMedianDps(newMedianDps.toString(), true)
                setNewMinDps(newMinDps.toString(), true)
                setNewMaxDps(newMaxDps.toString(), true)
              }

              if (simulationParams.type === SimulationType.StatWeights) {
                updateStatWeightValue(params.customStat, newMedianDps)
              }

              if (simulationsFinished === simWorkerParameters.length) {
                dispatch(setSimulationInProgressStatus(false))
                const totalSimDuration = (performance.now() - startTime) / 1000
                setNewSimulationDuration(
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
                  populateCombatLog()
                }

                if (simulationParams.type === SimulationType.Normal) {
                  setDpsStdev(Math.round(GetStdev(dpsArray)).toString())
                  dispatch(setHistogramData(dpsCount))

                  if (
                    playerState.Settings[
                      Setting.automaticallyOpenSimDetails
                    ] === 'true'
                  ) {
                    dispatch(
                      setCombatLogBreakdownValue({
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

              findSimulationProgressPercentObject({
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
                setNewMedianDps(newMedianDps.toString(), false)
              } else if (simulationParams.type === SimulationType.StatWeights) {
                // Limit the updates to once every 5 seconds
                const dateNow = Date.now()
                if (
                  !lastStatWeightUpdateTime[params.customStat] ||
                  dateNow - lastStatWeightUpdateTime[params.customStat] > 5000
                ) {
                  updateStatWeightValue(params.customStat, params.medianDps)
                  lastStatWeightUpdateTime[params.customStat] = dateNow
                }
              }
            },
            getWorkerParams({
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
      dispatch(setSimulationInProgressStatus(false))
      throw new Error('Error when trying to run simulation. ' + error)
    }
  }

  function updateStatWeightValue(stat: string, value: number): void {
    let dpsDifference = Math.abs(
      Math.round(
        ((value - Number(medianDps)) / statWeightStatIncrease) * 1000
      ) / 1000
    )
    if (dpsDifference < 0.05) {
      dpsDifference = 0
    }

    dispatch(
      setStatWeightValue({
        stat: stat as unknown as [keyof StatWeightStats],
        value: dpsDifference,
      })
    )
  }

  function findSimulationProgressPercentObject(params: {
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

  function setSavedItemDpsValue(
    itemSlot: ItemSlotDetailed,
    itemId: number,
    newMedianDps: number,
    saveToLocalStorage: boolean
  ): void {
    dispatch(
      setSavedItemDps({
        itemSlot: itemSlot,
        itemId: itemId,
        dps: newMedianDps,
        saveLocalStorage: saveToLocalStorage,
      })
    )
  }

  function populateCombatLog(): void {
    dispatch(setCombatLogData(combatLogEntries))
  }

  function errorCallbackHandler(errorCallback: { errorMsg: string }): void {
    alert(
      'Error: ' +
        errorCallback.errorMsg +
        '\nPost in the #sim-bug-report channel on the Classic Warlock discord.'
    )
  }

  function setNewMedianDps(newMedianDps: string, savingLocalStorage: boolean) {
    setMedianDps(newMedianDps)
    if (savingLocalStorage) {
      localStorage.setItem('medianDps', newMedianDps)
    }
  }

  function setNewMinDps(newMinDps: string, savingLocalStorage: boolean) {
    setMinDps(newMinDps)
    if (savingLocalStorage) {
      localStorage.setItem('minDps', newMinDps)
    }
  }

  function setNewMaxDps(newMaxDps: string, savingLocalStorage: boolean) {
    setMaxDps(newMaxDps)
    if (savingLocalStorage) {
      localStorage.setItem('maxDps', newMaxDps)
    }
  }

  function setNewSimulationDuration(
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
          simulate({
            itemIdsToSim: [
              Items.find(
                e =>
                  e.Id ===
                  playerState.SelectedItems[
                    ItemSlotToItemSlotDetailed(
                      uiState.SelectedItemSlot,
                      uiState.SelectedItemSubSlot
                    )
                  ]
              )?.Id || 0,
            ],
            type: SimulationType.Normal,
          })
        }
        style={{
          background:
            uiState.SimulationInProgress &&
            simulationType === SimulationType.Normal
              ? `linear-gradient(to right, #9482C9 ${simulationProgressPercent}%, transparent ${simulationProgressPercent}%)`
              : '',
        }}
      >
        <Typography>
          {uiState.SimulationInProgress &&
          simulationType === SimulationType.Normal
            ? `${simulationProgressPercent}%`
            : 'Simulate'}
        </Typography>
      </Grid>
      <Grid
        className='warlock-btn active-btn'
        onClick={() =>
          simulate({
            itemIdsToSim: GetItemTableItems(
              uiState.SelectedItemSlot,
              uiState.SelectedItemSubSlot,
              playerState.SelectedItems,
              uiState.Sources,
              uiState.HiddenItems,
              false,
              uiState.SavedItemDps,
              true,
              Races.find(x => x.Type === playerState.Settings[Setting.race])
            ).map(item => item.Id),
            type: SimulationType.AllItems,
          })
        }
        style={{
          background:
            uiState.SimulationInProgress &&
            simulationType === SimulationType.AllItems
              ? `linear-gradient(to right, #9482C9 ${simulationProgressPercent}%, transparent ${simulationProgressPercent}%)`
              : '',
        }}
      >
        <Typography>
          {uiState.SimulationInProgress &&
          simulationType === SimulationType.AllItems
            ? `${simulationProgressPercent}%`
            : 'Simulate All Items'}
        </Typography>
      </Grid>
      <Grid
        className='warlock-btn active-btn'
        onClick={() => simulate({ type: SimulationType.StatWeights })}
        style={{
          background:
            uiState.SimulationInProgress &&
            simulationType === SimulationType.StatWeights
              ? `linear-gradient(to right, #9482C9 ${simulationProgressPercent}%, transparent ${simulationProgressPercent}%)`
              : '',
        }}
      >
        <Typography>
          {uiState.SimulationInProgress &&
          simulationType === SimulationType.StatWeights
            ? `${simulationProgressPercent}%`
            : 'Stat Weights'}
        </Typography>
      </Grid>
      {
        <Grid
          className={
            'warlock-btn' +
            (combatLogButtonIsDisabled() ? ' disabled-btn' : ' active-btn')
          }
          onClick={() =>
            !combatLogButtonIsDisabled() &&
            dispatch(setCombatLogVisibility(!uiState.CombatLog.Visible))
          }
        >
          <Typography>Combat Log</Typography>
        </Grid>
      }
      {
        <Grid
          className={
            'warlock-btn' +
            (histogramButtonIsDisabled() ? ' disabled-btn' : ' active-btn')
          }
          onClick={() =>
            !histogramButtonIsDisabled() &&
            dispatch(setHistogramVisibility(!uiState.Histogram.Visible))
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
