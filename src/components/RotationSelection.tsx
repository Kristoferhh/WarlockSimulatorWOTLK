import { nanoid } from "nanoid";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getBaseWowheadUrl } from "../Common";
import { Spells } from "../data/Spells";
import i18n from "../i18n/config";
import { toggleRotationSpellSelection } from "../redux/PlayerSlice";
import { RootState } from "../redux/Store";
import { RotationGroup, RotationGroups, Setting } from "../Types";

export default function RotationSelection() {
  const playerStore = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <section id="rotation-section">
      <h3>{t("Rotation")}</h3>
      <ul id="rotation-list">
        {RotationGroups.filter((group) => {
          // If the fight type is AOE then only show aoe spells, otherwise if it's single target, show everything but the aoe spells
          return playerStore.Settings[Setting.fightType] === "aoe"
            ? group.Header === RotationGroup.Aoe
            : group.Header !== RotationGroup.Aoe;
        }).map((group) => (
          <li
            key={nanoid()}
            style={{
              display:
                group.Header !== RotationGroup.Curse &&
                playerStore.Settings[Setting.rotationOption] === "simChooses"
                  ? "none"
                  : "",
            }}
          >
            <h4>{t(group.Header)}</h4>
            {Spells.filter((s) => s.Group === group.Header).map((spell) => (
              <div
                key={nanoid()}
                data-checked={playerStore.Rotation[group.Header].includes(
                  spell.Id
                )}
                onClick={(e) => {
                  dispatch(toggleRotationSpellSelection(spell));
                  e.preventDefault();
                }}
              >
                <a
                  href={`${getBaseWowheadUrl(i18n.language)}/spell=${spell.Id}`}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/img/${spell.IconName}.jpg`}
                    alt={t(spell.Name)}
                  />
                </a>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </section>
  );
}
