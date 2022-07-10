import {
  Button,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllocatedTalentsPointsInTree,
  getBaseWowheadUrl,
  GetTalentsStats,
} from '../Common'
import { PresetTalents } from '../data/PresetTalents'
import { Talents, TalentTreeStruct } from '../data/Talents'
import i18n from '../i18n/config'
import { setTalentsState, setTalentsStats } from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import { MouseButtonClick, Talent, TalentName, TalentStore } from '../Types'

export default function TalentTrees() {
  const playerState = useSelector((state: RootState) => state.player)
  const talentPointsRemaining = useSelector(
    (state: RootState) => state.player.TalentPointsRemaining
  )
  const dispatch = useDispatch()
  const { t } = useTranslation()

  function applyTalentTemplate(talentTemplate: {
    [key in TalentName]?: number
  }) {
    var emptyTalents: { [key: string]: number } = {}
    for (const talentKey in TalentName) {
      emptyTalents[talentKey] = 0
    }

    let newSelectedTalents: TalentStore = JSON.parse(
      JSON.stringify(emptyTalents)
    )

    for (const [talentKey, points] of Object.entries(talentTemplate)) {
      newSelectedTalents[talentKey as TalentName] = points
    }

    SaveTalents(newSelectedTalents)
  }

  function talentClickHandler(mouseButton: number, talent: Talent) {
    let newSelectedTalents: TalentStore = JSON.parse(
      JSON.stringify(playerState.Talents)
    )
    const currentTalentPointsValue = newSelectedTalents[talent.Name!] || 0

    if (
      mouseButton === MouseButtonClick.LeftClick &&
      currentTalentPointsValue < talent.RankIds!.length &&
      talentPointsRemaining > 0
    ) {
      newSelectedTalents[talent.Name!] =
        newSelectedTalents[talent.Name!] + 1 || 1
    } else if (
      mouseButton === MouseButtonClick.RightClick &&
      currentTalentPointsValue > 0
    ) {
      newSelectedTalents[talent.Name!] =
        newSelectedTalents[talent.Name!] - 1 || 0
    }

    SaveTalents(newSelectedTalents)
  }

  function clearTalentTree(talentTree: TalentTreeStruct) {
    let newSelectedTalents: TalentStore = JSON.parse(
      JSON.stringify(playerState.Talents)
    )

    for (const row in talentTree.Rows) {
      for (const talentKey in talentTree.Rows[row]) {
        let talentName = talentTree.Rows[row][talentKey]?.Name

        if (talentName) {
          newSelectedTalents[talentName] = 0
        }
      }
    }

    SaveTalents(newSelectedTalents)
  }

  function SaveTalents(talents: TalentStore) {
    dispatch(setTalentsState(talents))
    dispatch(setTalentsStats(GetTalentsStats(talents, playerState.Settings)))
  }

  return (
    <>
      <Grid container style={{ justifyContent: 'center' }}>
        {PresetTalents.map(talentTemplate => (
          <Grid item key={nanoid()}>
            <Button
              variant='contained'
              type='button'
              key={nanoid()}
              onClick={() => applyTalentTemplate(talentTemplate.Talents)}
            >
              {t(talentTemplate.Name)}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Grid>
        {Talents.map(talentTree => (
          <Grid key={talentTree.Name} className='talent-tree-div'>
            <img
              src={`${process.env.PUBLIC_URL}/img/talent_tree_background_${talentTree.Name}.jpg`}
              alt={talentTree.Name}
              style={{
                position: 'absolute',
                height: '534px',
                width: '204px',
                opacity: 0.3,
              }}
            />
            <Table
              id={`talent-table-${talentTree.Name}`}
              className='talent-tree-table'
            >
              <TableBody>
                {talentTree.Rows.map(row => (
                  <TableRow key={nanoid()}>
                    {row.map(talent => (
                      <TableCell
                        style={{ borderBottom: 'none' }}
                        key={nanoid()}
                      >
                        {talent.RankIds && (
                          <Grid
                            id={talent.Name}
                            className='talent-icon'
                            data-points={playerState.Talents[talent.Name!] || 0}
                            data-maxpoints={talent.RankIds.length}
                            onClick={e =>
                              talentClickHandler(e.nativeEvent.button, talent)
                            }
                            onContextMenu={e => {
                              talentClickHandler(e.nativeEvent.button, talent)
                              e.preventDefault()
                            }}
                          >
                            <Link
                              href={`${getBaseWowheadUrl(
                                i18n.language
                              )}/spell=${
                                talent.RankIds[
                                  Math.max(
                                    playerState.Talents[talent.Name!] - 1,
                                    0
                                  ) || 0
                                ]
                              }`}
                              onClick={e => e.preventDefault()}
                            >
                              <img
                                src={`${process.env.PUBLIC_URL}/img/${talent.IconName}.jpg`}
                                alt={t(talent.Name!)}
                              />
                              <span
                                id={`${talent.Name!}-point-amount`}
                                className={`talent-point-amount${
                                  playerState.Talents[talent.Name!] &&
                                  playerState.Talents[talent.Name!] ===
                                    talent.RankIds.length
                                    ? ' maxed-talent'
                                    : ''
                                }${
                                  playerState.Talents[talent.Name!] &&
                                  playerState.Talents[talent.Name!] > 0 &&
                                  playerState.Talents[talent.Name!] <
                                    talent.RankIds.length
                                    ? ' half-full-talent'
                                    : ''
                                }${
                                  playerState.Talents[talent.Name!] == null ||
                                  playerState.Talents[talent.Name!] === 0
                                    ? ' empty-talent'
                                    : ''
                                }`}
                              >
                                {playerState.Talents[talent.Name!] || 0}
                              </span>
                            </Link>
                          </Grid>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Grid className='talent-tree-name' style={{ padding: '10px' }}>
              <Typography style={{ display: 'inline-block' }}>
                {`${t(talentTree.Name)} ${
                  getAllocatedTalentsPointsInTree(
                    playerState.Talents,
                    talentTree
                  ) > 0
                    ? `(${getAllocatedTalentsPointsInTree(
                        playerState.Talents,
                        talentTree
                      )})`
                    : ''
                }`}
              </Typography>
              <span
                className='clear-talent-tree'
                onClick={() => clearTalentTree(talentTree)}
              >
                ❌
              </span>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
