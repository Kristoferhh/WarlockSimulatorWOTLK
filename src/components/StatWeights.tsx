import { Button, Grid, List, ListItem, Typography } from '@mui/material'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { GetAllocatedTalentsPointsInTree } from '../Common'
import { Talents } from '../data/Talents'
import { RootState } from '../redux/Store'
import { setStatWeightVisibility } from '../redux/UiSlice'
import { Stat, StatWeightStats, TalentTree } from '../Types'

export default function StatWeights() {
  const player = useSelector((state: RootState) => state.player)
  const ui = useSelector((state: RootState) => state.ui)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const statDisplay: { DisplayName: string; Stat: [keyof StatWeightStats] }[] =
    [
      { DisplayName: t('Stamina'), Stat: [Stat.Stamina] },
      { DisplayName: t('Intellect'), Stat: [Stat.Intellect] },
      { DisplayName: t('Spirit'), Stat: [Stat.Spirit] },
      { DisplayName: t('Spell Power'), Stat: [Stat.SpellPower] },
      { DisplayName: t('Shadow Power'), Stat: [Stat.ShadowPower] },
      { DisplayName: t('Fire Power'), Stat: [Stat.FirePower] },
      { DisplayName: t('Hit Rating'), Stat: [Stat.HitRating] },
      { DisplayName: t('Crit Rating'), Stat: [Stat.CritRating] },
      { DisplayName: t('Haste Rating'), Stat: [Stat.HasteRating] },
      { DisplayName: t('Mp5'), Stat: [Stat.Mp5] },
    ]

  return (
    <>
      <Grid>
        <Typography
          variant='h5'
          style={{ display: 'inline-block', margin: '5px 0 0 10px' }}
        >
          Stat Weights
        </Typography>
        <p
          className='close'
          id='stat-weight-close-button'
          onClick={e => {
            dispatch(setStatWeightVisibility(false))
            e.preventDefault()
          }}
        ></p>
      </Grid>
      <List>
        {statDisplay.map(stat => (
          <ListItem
            key={nanoid()}
            style={{
              justifyContent: 'space-between',
            }}
          >
            <Typography style={{ lineHeight: '1' }}>
              {stat.DisplayName}
            </Typography>
            <Typography style={{ lineHeight: '1' }}>
              {ui.StatWeights.StatValues[stat.Stat as unknown as Stat]}
            </Typography>
          </ListItem>
        ))}
        <Button
          variant='contained'
          style={{
            marginTop: '15px',
            display: ui.SimulationInProgress ? 'none' : '',
          }}
          onClick={() => {
            let talentTreePoints: { name: TalentTree; points: number }[] = [
              {
                name: TalentTree.Affliction,
                points: GetAllocatedTalentsPointsInTree(
                  player.Talents,
                  Talents.find(e => e.Name === TalentTree.Affliction)!
                ),
              },
              {
                name: TalentTree.Demonology,
                points: GetAllocatedTalentsPointsInTree(
                  player.Talents,
                  Talents.find(e => e.Name === TalentTree.Demonology)!
                ),
              },
              {
                name: TalentTree.Destruction,
                points: GetAllocatedTalentsPointsInTree(
                  player.Talents,
                  Talents.find(e => e.Name === TalentTree.Destruction)!
                ),
              },
            ]
            // Gets the name of the talent tree with the most amount of points allocated by the player.
            const playerSpec = talentTreePoints.find(
              e =>
                e.points ===
                Math.max.apply(
                  Math,
                  talentTreePoints.map(a => a.points)
                )
            )?.name

            navigator.clipboard.writeText(
              `( Pawn: v1: "${
                ui.SelectedProfile || 'Warlock'
              }": Class=Warlock, Spec=${playerSpec}` +
                `, Stamina=${ui.StatWeights.StatValues[Stat.Stamina]}` +
                `, Intellect=${
                  ui.StatWeights.StatValues[Stat.Intellect]
                }` +
                `, Spirit=${ui.StatWeights.StatValues[Stat.Spirit]}` +
                `, SpellCritRating=${
                  ui.StatWeights.StatValues[Stat.CritRating]
                }` +
                `, SpellHitRating=${
                  ui.StatWeights.StatValues[Stat.HitRating]
                }` +
                `, FireSpellDamage=${
                  ui.StatWeights.StatValues[Stat.FirePower]
                }` +
                `, ShadowSpellDamage=${
                  ui.StatWeights.StatValues[Stat.ShadowPower]
                }` +
                `, SpellDamage=${
                  ui.StatWeights.StatValues[Stat.SpellPower]
                }` +
                `, Mp5=${ui.StatWeights.StatValues[Stat.Mp5]}` +
                `, SpellHasteRating=${
                  ui.StatWeights.StatValues[Stat.HasteRating]
                })`
            )
          }}
        >
          Copy Pawn Import String
        </Button>
      </List>
    </>
  )
}
