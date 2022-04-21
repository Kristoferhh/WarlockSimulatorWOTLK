import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getAllocatedTalentsPointsInTree } from '../Common'
import { Talents } from '../data/Talents'
import { RootState } from '../redux/Store'
import { setStatWeightVisibility } from '../redux/UiSlice'
import { Stat, StatWeightStats, TalentTree } from '../Types'

export default function StatWeights() {
  const playerState = useSelector((state: RootState) => state.player)
  const uiState = useSelector((state: RootState) => state.ui)
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
    <section
      id='stat-weights-section'
      style={{ display: uiState.StatWeights.Visible ? '' : 'none' }}
    >
      <div>
        <h2 style={{ display: 'inline-block' }}>Stat Weights</h2>
        <p
          className='close'
          id='stat-weight-close-button'
          onClick={(e) => {
            dispatch(setStatWeightVisibility(false))
            e.preventDefault()
          }}
        ></p>
      </div>
      <ul className='character-stats' id='stat-weights'>
        {statDisplay.map((stat) => (
          <li key={nanoid()}>
            <p className='character-stat'>{stat.DisplayName}</p>
            <p className='character-stat-val'>
              {uiState.StatWeights.StatValues[stat.Stat as unknown as Stat]}
            </p>
          </li>
        ))}
        <button
          className='btn btn-primary btn-sm'
          style={{
            marginTop: '15px',
            display: uiState.SimulationInProgress ? 'none' : '',
          }}
          onClick={() => {
            let talentTreePoints: { name: TalentTree; points: number }[] = [
              {
                name: TalentTree.Affliction,
                points: getAllocatedTalentsPointsInTree(
                  playerState.Talents,
                  Talents.find((e) => e.Name === TalentTree.Affliction)!
                ),
              },
              {
                name: TalentTree.Demonology,
                points: getAllocatedTalentsPointsInTree(
                  playerState.Talents,
                  Talents.find((e) => e.Name === TalentTree.Demonology)!
                ),
              },
              {
                name: TalentTree.Destruction,
                points: getAllocatedTalentsPointsInTree(
                  playerState.Talents,
                  Talents.find((e) => e.Name === TalentTree.Destruction)!
                ),
              },
            ]
            // Gets the name of the talent tree with the most amount of points allocated by the player.
            const playerSpec = talentTreePoints.find(
              (e) =>
                e.points ===
                Math.max.apply(
                  Math,
                  talentTreePoints.map((a) => a.points)
                )
            )?.name

            navigator.clipboard.writeText(
              `( Pawn: v1: "${
                uiState.SelectedProfile || 'Warlock'
              }": Class=Warlock, Spec=${playerSpec}` +
                `, Stamina=${uiState.StatWeights.StatValues[Stat.Stamina]}` +
                `, Intellect=${
                  uiState.StatWeights.StatValues[Stat.Intellect]
                }` +
                `, Spirit=${uiState.StatWeights.StatValues[Stat.Spirit]}` +
                `, SpellCritRating=${
                  uiState.StatWeights.StatValues[Stat.CritRating]
                }` +
                `, SpellHitRating=${
                  uiState.StatWeights.StatValues[Stat.HitRating]
                }` +
                `, FireSpellDamage=${
                  uiState.StatWeights.StatValues[Stat.FirePower]
                }` +
                `, ShadowSpellDamage=${
                  uiState.StatWeights.StatValues[Stat.ShadowPower]
                }` +
                `, SpellDamage=${
                  uiState.StatWeights.StatValues[Stat.SpellPower]
                }` +
                `, Mp5=${uiState.StatWeights.StatValues[Stat.Mp5]}` +
                `, SpellHasteRating=${
                  uiState.StatWeights.StatValues[Stat.HasteRating]
                })`
            )
          }}
        >
          Copy Pawn Import String
        </button>
      </ul>
    </section>
  )
}
