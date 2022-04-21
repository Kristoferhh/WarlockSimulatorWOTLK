import { Talents, TalentTreeStruct } from '../data/Talents'
import { RootState } from '../redux/Store'
import { useSelector, useDispatch } from 'react-redux'
import { setTalentPointValue } from '../redux/PlayerSlice'
import { PresetTalents } from '../data/PresetTalents'
import { Talent, TalentName, TalentTree } from '../Types'
import { nanoid } from 'nanoid'
import { getAllocatedTalentsPointsInTree, getBaseWowheadUrl } from '../Common'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n/config'

export default function TalentTrees() {
  const talentState = useSelector((state: RootState) => state.player.Talents)
  const talentPointsRemaining = useSelector(
    (state: RootState) => state.player.TalentPointsRemaining
  )
  const dispatch = useDispatch()
  const { t } = useTranslation()

  function applyTalentTemplate(talentTemplate: {
    [key in TalentName]?: number
  }) {
    for (const talentKey in TalentName) {
      dispatch(
        setTalentPointValue({
          name: talentKey as TalentName,
          points: 0,
        })
      )
    }
    for (const [talentKey, points] of Object.entries(talentTemplate)) {
      dispatch(
        setTalentPointValue({
          name: talentKey as TalentName,
          points: points,
        })
      )
    }
  }

  function talentClickHandler(mouseButton: number, talent: Talent) {
    const currentTalentPointsValue = talentState[talent.Name!!] || 0

    // 0 is left click and 2 is right click
    if (
      mouseButton === 0 &&
      currentTalentPointsValue < talent.RankIds!!.length &&
      talentPointsRemaining > 0
    ) {
      dispatch(
        setTalentPointValue({
          name: talent.Name!!,
          points: currentTalentPointsValue + 1,
        })
      )
    } else if (mouseButton === 2 && currentTalentPointsValue > 0) {
      dispatch(
        setTalentPointValue({
          name: talent.Name!!,
          points: currentTalentPointsValue - 1,
        })
      )
    }
  }

  function clearTalentTree(talentTree: TalentTreeStruct) {
    for (const row in talentTree.Rows) {
      for (const talentKey in talentTree.Rows[row]) {
        dispatch(
          setTalentPointValue({
            name: talentTree.Rows[row][talentKey].Name!!,
            points: 0,
          })
        )
      }
    }
  }

  return (
    <div id='talents-container'>
      <div id='preset-talent-buttons'>
        {PresetTalents.map((talentTemplate) => (
          <button
            className='btn btn-primary btn-sm'
            type='button'
            key={nanoid()}
            onClick={() => applyTalentTemplate(talentTemplate.talents)}
          >
            {t(talentTemplate.name)}
          </button>
        ))}
      </div>
      <section id='talents-section'>
        {Talents.map((talentTree) => (
          <div key={talentTree.Name} className='talent-tree-div'>
            <img
              src={`${process.env.PUBLIC_URL}/img/talent_tree_background_${talentTree.Name}.jpg`}
              alt={talentTree.Name}
              style={{ position: 'absolute', height: '554px', width: '204px' }}
            />
            <table
              id={'talent-table-' + talentTree.Name}
              className='talent-tree-table'
            >
              <tbody>
                {talentTree.Rows.map((row) => (
                  <tr key={nanoid()}>
                    {row.map((talent) => (
                      <td key={nanoid()}>
                        {talent.RankIds && (
                          <div
                            id={talent.Name}
                            className='talent-icon'
                            data-points={talentState[talent.Name!] || 0}
                            data-maxpoints={talent.RankIds.length}
                            onClick={(e) =>
                              talentClickHandler(e.nativeEvent.button, talent)
                            }
                            onContextMenu={(e) => {
                              talentClickHandler(e.nativeEvent.button, talent)
                              e.preventDefault()
                            }}
                          >
                            <a
                              href={`${getBaseWowheadUrl(
                                i18n.language
                              )}/spell=${
                                talent.RankIds[
                                  Math.max(talentState[talent.Name!] - 1, 0) ||
                                    0
                                ]
                              }`}
                              onClick={(e) => e.preventDefault()}
                            >
                              <img
                                src={`${process.env.PUBLIC_URL}/img/${talent.IconName}.jpg`}
                                alt={t(talent.Name!)}
                              />
                              <span
                                id={`${talent.Name!}-point-amount`}
                                className={`talent-point-amount${
                                  talentState[talent.Name!] &&
                                  talentState[talent.Name!] ===
                                    talent.RankIds.length
                                    ? ' maxed-talent'
                                    : ''
                                }${
                                  talentState[talent.Name!] &&
                                  talentState[talent.Name!] > 0 &&
                                  talentState[talent.Name!] <
                                    talent.RankIds.length
                                    ? ' half-full-talent'
                                    : ''
                                }${
                                  talentState[talent.Name!] == null ||
                                  talentState[talent.Name!] === 0
                                    ? ' empty-talent'
                                    : ''
                                }`}
                              >
                                {talentState[talent.Name!] || 0}
                              </span>
                            </a>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='talent-tree-name'>
              <h3 style={{ display: 'inline-block' }}>
                {`${t(talentTree.Name)} ${
                  getAllocatedTalentsPointsInTree(talentState, talentTree) > 0
                    ? `(${getAllocatedTalentsPointsInTree(
                        talentState,
                        talentTree
                      )})`
                    : ''
                }`}
              </h3>
              <span
                className='clear-talent-tree'
                onClick={() => clearTalentTree(talentTree)}
              >
                ❌
              </span>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
