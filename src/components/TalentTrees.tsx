import { Talents, TalentTreeStruct } from "../data/Talents";
import { RootState } from "../redux/Store";
import { useSelector, useDispatch } from "react-redux";
import { setTalentsState, setTalentsStats } from "../redux/PlayerSlice";
import { PresetTalents } from "../data/PresetTalents";
import { MouseButtonClick, Talent, TalentName, TalentStore } from "../Types";
import { nanoid } from "nanoid";
import {
  getAllocatedTalentsPointsInTree,
  getBaseWowheadUrl,
  GetTalentsStats,
} from "../Common";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/config";

export default function TalentTrees() {
  const playerState = useSelector((state: RootState) => state.player);
  const talentPointsRemaining = useSelector(
    (state: RootState) => state.player.TalentPointsRemaining
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function applyTalentTemplate(talentTemplate: {
    [key in TalentName]?: number;
  }) {
    let newSelectedTalents: TalentStore = JSON.parse(
      JSON.stringify(playerState.Talents)
    );

    for (const [talentKey, points] of Object.entries(talentTemplate)) {
      newSelectedTalents[talentKey as TalentName] = points;
    }

    SaveTalents(newSelectedTalents);
  }

  function talentClickHandler(mouseButton: number, talent: Talent) {
    let newSelectedTalents: TalentStore = JSON.parse(
      JSON.stringify(playerState.Talents)
    );
    const currentTalentPointsValue = newSelectedTalents[talent.Name!] || 0;

    if (
      mouseButton === MouseButtonClick.LeftClick &&
      currentTalentPointsValue < talent.RankIds!.length &&
      talentPointsRemaining > 0
    ) {
      newSelectedTalents[talent.Name!] =
        newSelectedTalents[talent.Name!] + 1 || 1;
    } else if (
      mouseButton === MouseButtonClick.RightClick &&
      currentTalentPointsValue > 0
    ) {
      newSelectedTalents[talent.Name!] =
        newSelectedTalents[talent.Name!] - 1 || 0;
    }

    SaveTalents(newSelectedTalents);
  }

  function clearTalentTree(talentTree: TalentTreeStruct) {
    let newSelectedTalents: TalentStore = JSON.parse(
      JSON.stringify(playerState.Talents)
    );

    for (const row in talentTree.Rows) {
      for (const talentKey in talentTree.Rows[row]) {
        newSelectedTalents[talentKey as TalentName] = 0;
      }
    }

    SaveTalents(newSelectedTalents);
  }

  function SaveTalents(talents: TalentStore) {
    dispatch(setTalentsState(talents));
    dispatch(setTalentsStats(GetTalentsStats(talents, playerState.Settings)));
  }

  return (
    <div id="talents-container">
      <div id="preset-talent-buttons">
        {PresetTalents.map((talentTemplate) => (
          <button
            className="btn btn-primary btn-sm"
            type="button"
            key={nanoid()}
            onClick={() => applyTalentTemplate(talentTemplate.talents)}
          >
            {t(talentTemplate.name)}
          </button>
        ))}
      </div>
      <section id="talents-section">
        {Talents.map((talentTree) => (
          <div key={talentTree.Name} className="talent-tree-div">
            <img
              src={`${process.env.PUBLIC_URL}/img/talent_tree_background_${talentTree.Name}.jpg`}
              alt={talentTree.Name}
              style={{ position: "absolute", height: "554px", width: "204px" }}
            />
            <table
              id={`talent-table-${talentTree.Name}`}
              className="talent-tree-table"
            >
              <tbody>
                {talentTree.Rows.map((row) => (
                  <tr key={nanoid()}>
                    {row.map((talent) => (
                      <td key={nanoid()}>
                        {talent.RankIds && (
                          <div
                            id={talent.Name}
                            className="talent-icon"
                            data-points={playerState.Talents[talent.Name!] || 0}
                            data-maxpoints={talent.RankIds.length}
                            onClick={(e) =>
                              talentClickHandler(e.nativeEvent.button, talent)
                            }
                            onContextMenu={(e) => {
                              talentClickHandler(e.nativeEvent.button, talent);
                              e.preventDefault();
                            }}
                          >
                            <a
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
                              onClick={(e) => e.preventDefault()}
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
                                    ? " maxed-talent"
                                    : ""
                                }${
                                  playerState.Talents[talent.Name!] &&
                                  playerState.Talents[talent.Name!] > 0 &&
                                  playerState.Talents[talent.Name!] <
                                    talent.RankIds.length
                                    ? " half-full-talent"
                                    : ""
                                }${
                                  playerState.Talents[talent.Name!] == null ||
                                  playerState.Talents[talent.Name!] === 0
                                    ? " empty-talent"
                                    : ""
                                }`}
                              >
                                {playerState.Talents[talent.Name!] || 0}
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
            <div className="talent-tree-name">
              <h3 style={{ display: "inline-block" }}>
                {`${t(talentTree.Name)} ${
                  getAllocatedTalentsPointsInTree(
                    playerState.Talents,
                    talentTree
                  ) > 0
                    ? `(${getAllocatedTalentsPointsInTree(
                        playerState.Talents,
                        talentTree
                      )})`
                    : ""
                }`}
              </h3>
              <span
                className="clear-talent-tree"
                onClick={() => clearTalentTree(talentTree)}
              >
                ❌
              </span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
