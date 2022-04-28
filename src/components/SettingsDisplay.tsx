import { nanoid } from "nanoid";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getBaseStats, isPetActive } from "../Common";
import { Races } from "../data/Races";
import { modifySettingValue, setBaseStats } from "../redux/PlayerSlice";
import { RootState } from "../redux/Store";
import { AuraId, Pet, Race, Setting } from "../Types";

export default function SettingsDisplay() {
  const playerStore = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function settingModifiedHandler(setting: Setting, value: string) {
    dispatch(
      modifySettingValue({
        setting: setting,
        value: value,
      })
    );
  }

  return (
    <section id="sim-settings">
      <fieldset>
        <legend>{t("Rotation Options")}</legend>
        <input
          id="sim-chooses-option"
          onChange={(e) =>
            settingModifiedHandler(Setting.rotationOption, e.target.value)
          }
          type="radio"
          name="rotationOption"
          value="simChooses"
          checked={
            playerStore.Settings[Setting.rotationOption] === "simChooses"
          }
        />
        <label htmlFor="sim-chooses-option">
          {t("Simulation chooses spells for me")}
        </label>
        <br />
        <input
          id="user-chooses-option"
          onChange={(e) =>
            settingModifiedHandler(Setting.rotationOption, e.target.value)
          }
          type="radio"
          name="rotationOption"
          value="userChooses"
          checked={
            playerStore.Settings[Setting.rotationOption] === "userChooses"
          }
        />
        <label htmlFor="user-chooses-option">{t("Choose spells myself")}</label>
      </fieldset>
      <ul>
        <li>
          <label className="settings-left">{t("Race")}</label>
          <select
            onChange={(e) => {
              const race = Races.find((race) => race.Race === e.target.value);

              settingModifiedHandler(Setting.race, e.target.value);
              race && dispatch(setBaseStats(getBaseStats(race.Race)));
            }}
            name="race"
            id="race-dropdown-list"
            className="settings-right"
            value={playerStore.Settings[Setting.race]}
          >
            <option value={Race.Gnome}>{t("Gnome")}</option>
            <option value={Race.Human}>{t("Human")}</option>
            <option value={Race.Orc}>{t("Orc")}</option>
            <option value={Race.Undead}>{t("Undead")}</option>
            <option value={Race.BloodElf}>{t("Blood Elf")}</option>
          </select>
        </li>
        <li>
          <label htmlFor="iterations" className="settings-left">
            {t("Iterations")}
          </label>
          <input
            id="iterations"
            onChange={(e) =>
              settingModifiedHandler(Setting.iterations, e.target.value)
            }
            value={playerStore.Settings[Setting.iterations]}
            step="1000"
            min="1000"
            type="number"
            name="iterations"
            className="settings-right"
          />
        </li>
        <li>
          <label htmlFor="min-fight-length" className="settings-left">
            {t("Min Fight Length")}
          </label>
          <input
            id="min-fight-length"
            onChange={(e) =>
              settingModifiedHandler(Setting.minFightLength, e.target.value)
            }
            value={playerStore.Settings[Setting.minFightLength]}
            type="number"
            name="min-fight-length"
            className="settings-right"
          />
        </li>
        <li>
          <label htmlFor="max-fight-length" className="settings-left">
            {t("Max Fight Length")}
          </label>
          <input
            id="max-fight-length"
            onChange={(e) =>
              settingModifiedHandler(Setting.maxFightLength, e.target.value)
            }
            value={playerStore.Settings[Setting.maxFightLength]}
            type="number"
            name="max-fight-length"
            className="settings-right"
          />
        </li>
        <li>
          <label htmlFor="target-level" className="settings-left">
            {t("Target Level")}
          </label>
          <input
            id="target-level"
            onChange={(e) =>
              settingModifiedHandler(Setting.targetLevel, e.target.value)
            }
            value={playerStore.Settings[Setting.targetLevel]}
            type="number"
            name="target-level"
            className="settings-right"
          />
        </li>
        <li>
          <label htmlFor="target-shadow-resistance" className="settings-left">
            {t("Target Shadow Resistance")}
          </label>
          <input
            id="target-shadow-resistance"
            onChange={(e) =>
              settingModifiedHandler(
                Setting.targetShadowResistance,
                e.target.value
              )
            }
            value={playerStore.Settings[Setting.targetShadowResistance]}
            type="number"
            name="target-shadow-resistance"
            className="settings-right"
          />
        </li>
        <li>
          <label htmlFor="target-fire-resistance" className="settings-left">
            {t("Target Fire Resistance")}
          </label>
          <input
            id="target-fire-resistance"
            onChange={(e) =>
              settingModifiedHandler(
                Setting.targetFireResistance,
                e.target.value
              )
            }
            value={playerStore.Settings[Setting.targetFireResistance]}
            type="number"
            name="target-fire-resistance"
            className="settings-right"
          />
        </li>
        <li>
          <label className="settings-left">{t("Fight Type")}</label>
          <select
            onChange={(e) =>
              settingModifiedHandler(Setting.fightType, e.target.value)
            }
            value={playerStore.Settings[Setting.fightType]}
            name="fightType"
            id="fight-type"
            className="settings-right"
          >
            <option value="singleTarget">{t("Single Target")}</option>
            <option value="aoe">{t("AoE (Seed of Corruption)")}</option>
          </select>
        </li>
        {playerStore.Settings[Setting.fightType] === "aoe" && (
          <li
            id="enemy-amount"
            title="Including the target you're casting Seed of Corruption on"
          >
            <label className="settings-left">{t("Enemy Amount")}</label>
            <input
              name="enemyAmount"
              className="settings-right"
              onChange={(e) =>
                settingModifiedHandler(Setting.enemyAmount, e.target.value)
              }
              value={playerStore.Settings[Setting.enemyAmount]}
              step="1"
              min="1"
              type="number"
            />
          </li>
        )}
        <li id="automatically-open-sim-details">
          <label
            className="settings-left"
            htmlFor="automatically-open-sim-details"
          >
            {t("Show Damage & Aura Tables")}
          </label>
          <select
            className="settings-right"
            name="automatically-open-sim-details"
            onChange={(e) =>
              settingModifiedHandler(
                Setting.automaticallyOpenSimDetails,
                e.target.value
              )
            }
            value={playerStore.Settings[Setting.automaticallyOpenSimDetails]}
          >
            <option value="yes">{t("Yes")}</option>
            <option value="no">{t("No")}</option>
          </select>
        </li>
        <li
          id="randomizeValues"
          title={t(
            "Chooses a random value between a minimum and a maximum value instead of taking the average of the two."
          )}
        >
          <label className="settings-left" htmlFor="randomizeValues">
            {t("Randomize instead of averaging")}
          </label>
          <select
            className="settings-right"
            name="randomizeValues"
            onChange={(e) =>
              settingModifiedHandler(Setting.randomizeValues, e.target.value)
            }
            value={playerStore.Settings[Setting.randomizeValues]}
          >
            <option value="no">{t("No")}</option>
            <option value="yes">{t("Yes")}</option>
          </select>
        </li>
        <li id="infinitePlayerMana">
          <label className="settings-left" htmlFor="infinitePlayerMana">
            {t("Infinite player mana?")}
          </label>
          <select
            className="settings-right"
            name="infinitePlayerMana"
            onChange={(e) =>
              settingModifiedHandler(Setting.infinitePlayerMana, e.target.value)
            }
            value={playerStore.Settings[Setting.infinitePlayerMana]}
          >
            <option value="no">{t("No")}</option>
            <option value="yes">{t("Yes")}</option>
          </select>
        </li>
        <li id="infinitePetMana">
          <label className="settings-left" htmlFor="infinitePetMana">
            {t("Infinite pet mana?")}
          </label>
          <select
            className="settings-right"
            name="infinitePetMana"
            onChange={(e) =>
              settingModifiedHandler(Setting.infinitePetMana, e.target.value)
            }
            value={playerStore.Settings[Setting.infinitePetMana]}
          >
            <option value="no">{t("No")}</option>
            <option value="yes">{t("Yes")}</option>
          </select>
        </li>
        <li id="petChoice">
          <label className="settings-left" htmlFor="petChoice">
            {t("Pet")}
          </label>
          <select
            className="settings-right"
            name="petChoice"
            onChange={(e) =>
              settingModifiedHandler(Setting.petChoice, e.target.value)
            }
            value={playerStore.Settings[Setting.petChoice]}
          >
            <option value={Pet.Imp}>{t("Imp")}</option>
            <option value={Pet.Succubus}>{t("Succubus")}</option>
            <option value={Pet.Felhunter}>{t("Felhunter")}</option>
            <option value={Pet.Felguard}>{t("Felguard")}</option>
          </select>
        </li>
        {isPetActive(playerStore.Settings, false, false) && (
          <li id="petMode">
            <label className="settings-left" htmlFor="petMode">
              {t("Pet mode")}
            </label>
            <select
              className="settings-right"
              name="petMode"
              onChange={(e) =>
                settingModifiedHandler(Setting.petMode, e.target.value)
              }
              value={playerStore.Settings[Setting.petMode]}
            >
              <option value="0">{t("Passive")}</option>
              <option value="1">{t("Aggressive")}</option>
            </select>
          </li>
        )}
        {isPetActive(playerStore.Settings, true, false) && (
          <li id="prepopBlackBook">
            <label className="settings-left" htmlFor="prepopBlackBook">
              {t("Prepop Black Book")}?
            </label>
            <select
              className="settings-right"
              name="prepopBlackBook"
              onChange={(e) =>
                settingModifiedHandler(Setting.prepopBlackBook, e.target.value)
              }
              value={playerStore.Settings[Setting.prepopBlackBook]}
            >
              <option value="no">{t("No")}</option>
              <option value="yes">{t("Yes")}</option>
            </select>
          </li>
        )}
        {
          // Display if pet is succubus, pet is aggressive, and pet is not being sacrificed.
          isPetActive(playerStore.Settings, true, true) &&
            playerStore.Settings[Setting.petChoice] === Pet.Succubus && (
              <li id="lashOfPainUsage">
                <label className="settings-left" htmlFor="lashOfPainUsage">
                  {t("When to use Lash of Pain")}?
                </label>
                <select
                  className="settings-right"
                  name="lashOfPainUsage"
                  onChange={(e) =>
                    settingModifiedHandler(
                      Setting.lashOfPainUsage,
                      e.target.value
                    )
                  }
                  value={playerStore.Settings[Setting.lashOfPainUsage]}
                >
                  <option value="noISB">{t("When ISB is not up")}</option>
                  <option value="onCooldown">{t("On Cooldown")}</option>
                </select>
              </li>
            )
        }
        {isPetActive(playerStore.Settings, true, true) && (
          <li id="enemyArmor">
            <label className="settings-left" htmlFor="enemyArmor">
              {t("Enemy Armor")}
            </label>
            <input
              className="settings-right"
              onChange={(e) =>
                settingModifiedHandler(Setting.enemyArmor, e.target.value)
              }
              value={playerStore.Settings[Setting.enemyArmor]}
              type="number"
              min="0"
              max="10000"
              name="enemyArmor"
            />
          </li>
        )}
        {playerStore.Auras.includes(AuraId.PowerInfusion) && (
          <li id="powerInfusionAmount">
            <label className="settings-left" htmlFor="powerInfusionAmount">
              {t("Power Infusion amount")}
            </label>
            <select
              className="settings-right"
              name="powerInfusionAmount"
              onChange={(e) =>
                settingModifiedHandler(
                  Setting.powerInfusionAmount,
                  e.target.value
                )
              }
              value={playerStore.Settings[Setting.powerInfusionAmount]}
            >
              {Array.from(Array(12), (_e, i) => i + 1).map((number) => (
                <option value={number} key={nanoid()}>
                  {number}
                </option>
              ))}
            </select>
          </li>
        )}
        {playerStore.Auras.includes(AuraId.Innervate) && (
          <li id="innervateAmount">
            <label className="settings-left" htmlFor="innervateAmount">
              {t("Innervate amount")}
            </label>
            <select
              className="settings-right"
              name="innervateAmount"
              onChange={(e) =>
                settingModifiedHandler(Setting.innervateAmount, e.target.value)
              }
              value={playerStore.Settings[Setting.innervateAmount]}
            >
              {Array.from(Array(18), (_e, i) => i + 1).map((number) => (
                <option value={number} key={nanoid()}>
                  {number}
                </option>
              ))}
            </select>
          </li>
        )}
        {playerStore.Auras.includes(AuraId.TotemOfWrath) && (
          <li id="totemOfWrathAmount">
            <label className="settings-left" htmlFor="totemOfWrathAmount">
              {t("Totem of Wrath amount")}
            </label>
            <select
              className="settings-right"
              name="totemOfWrathAmount"
              onChange={(e) =>
                settingModifiedHandler(
                  Setting.totemOfWrathAmount,
                  e.target.value
                )
              }
              value={playerStore.Settings[Setting.totemOfWrathAmount]}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </li>
        )}
        {playerStore.Auras.includes(AuraId.FerociousInspiration) && (
          <li id="ferociousInspirationAmount">
            <label
              className="settings-left"
              htmlFor="ferociousInspirationAmount"
            >
              {t("Ferocious Inspiration amount")}
            </label>
            <select
              className="settings-right"
              name="ferociousInspirationAmount"
              onChange={(e) =>
                settingModifiedHandler(
                  Setting.ferociousInspirationAmount,
                  e.target.value
                )
              }
              value={playerStore.Settings[Setting.ferociousInspirationAmount]}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </li>
        )}
        {playerStore.Auras.includes(AuraId.BloodPact) && (
          <li id="improvedImpSetting">
            <label className="settings-left" htmlFor="improvedImpSetting">
              {t("Improved Imp")}?
            </label>
            <select
              className="settings-right"
              name="improvedImpSetting"
              onChange={(e) =>
                settingModifiedHandler(
                  Setting.improvedImpSetting,
                  e.target.value
                )
              }
              value={playerStore.Settings[Setting.improvedImpSetting]}
            >
              <option value="0">{t("No")}</option>
              <option value="1">1/3</option>
              <option value="2">2/3</option>
              <option value="3">3/3</option>
            </select>
          </li>
        )}
        {playerStore.Auras.includes(AuraId.FaerieFire) &&
          isPetActive(playerStore.Settings, true, true) && (
            <li id="improvedFaerieFire">
              <label className="settings-left" htmlFor="improvedFaerieFire">
                {t("Improved Faerie Fire")}?
              </label>
              <select
                className="settings-right"
                name="improvedFaerieFire"
                onChange={(e) =>
                  settingModifiedHandler(
                    Setting.improvedFaerieFire,
                    e.target.value
                  )
                }
                value={playerStore.Settings[Setting.improvedFaerieFire]}
              >
                <option value="no">{t("No")}</option>
                <option value="yes">Yes</option>
              </select>
            </li>
          )}
        {playerStore.Auras.includes(AuraId.ExposeArmor) &&
          isPetActive(playerStore.Settings, true, true) && (
            <li id="improvedExposeArmor">
              <label className="settings-left" htmlFor="improvedExposeArmor">
                {t("Improved Expose Armor")}?
              </label>
              <select
                className="settings-right"
                name="improvedExposeArmor"
                onChange={(e) =>
                  settingModifiedHandler(
                    Setting.improvedExposeArmor,
                    e.target.value
                  )
                }
                value={playerStore.Settings[Setting.improvedExposeArmor]}
              >
                <option value="0">{t("No")}</option>
                <option value="1">1/2</option>
                <option value="2">2/2</option>
              </select>
            </li>
          )}
        {playerStore.Auras.includes(AuraId.ExposeWeakness) &&
          isPetActive(playerStore.Settings, true, true) && (
            <div>
              <li id="survivalHunterAgility">
                <label
                  className="settings-left"
                  htmlFor="survivalHunterAgility"
                >
                  {t("Survival Hunter Agility")}
                </label>
                <input
                  className="settings-right"
                  onChange={(e) =>
                    settingModifiedHandler(
                      Setting.survivalHunterAgility,
                      e.target.value
                    )
                  }
                  value={playerStore.Settings[Setting.survivalHunterAgility]}
                  type="number"
                  min="0"
                  name="survivalHunterAgility"
                />
              </li>
              <li id="exposeWeaknessUptime">
                <label className="settings-left" htmlFor="exposeWeaknessUptime">
                  {t("Expose Weakness Uptime")} %
                </label>
                <input
                  className="settings-right"
                  onChange={(e) =>
                    settingModifiedHandler(
                      Setting.exposeWeaknessUptime,
                      e.target.value
                    )
                  }
                  value={playerStore.Settings[Setting.exposeWeaknessUptime]}
                  type="number"
                  min="0"
                  name="exposeWeaknessUptime"
                />
              </li>
            </div>
          )}
        <li id="customIsbUptime">
          <label className="settings-left" htmlFor="customIsbUptime">
            {t("Use custom ISB uptime")} %?
          </label>
          <select
            className="settings-right"
            name="customIsbUptime"
            onChange={(e) =>
              settingModifiedHandler(Setting.customIsbUptime, e.target.value)
            }
            value={playerStore.Settings[Setting.customIsbUptime]}
          >
            <option value="yes">{t("Yes")}</option>
            <option value="no">{t("No")}</option>
          </select>
        </li>
        {playerStore.Settings[Setting.customIsbUptime] === "yes" && (
          <li id="custom-isb-uptime-value">
            <label htmlFor="customIsbUptimeValue" className="settings-left">
              {t("Custom ISB Uptime")} %
            </label>
            <input
              id="customIsbUptimeValue"
              onChange={(e) =>
                settingModifiedHandler(
                  Setting.customIsbUptimeValue,
                  e.target.value
                )
              }
              value={playerStore.Settings[Setting.customIsbUptimeValue]}
              type="number"
              name="customIsbUptimeValue"
              className="settings-right"
            />
          </li>
        )}
        <li>
          <label className="settings-left">
            {t(
              "Concurrent item sims amount (set to 0 to use the default amount)"
            )}
          </label>
          <input
            className="settings-right"
            onChange={(e) =>
              settingModifiedHandler(Setting.maxWebWorkers, e.target.value)
            }
            value={playerStore.Settings[Setting.maxWebWorkers] || 0}
            type="number"
          />
        </li>
      </ul>
    </section>
  );
}
