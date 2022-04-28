import { nanoid } from "nanoid";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  getPlayerHitPercent,
  getPlayerHitRating,
  isPetActive,
} from "../Common";
import { RootState } from "../redux/Store";
import { AuraId, Pet, Setting, Stat, StatConstant } from "../Types";

export default function StatsDisplay() {
  const playerState = useSelector((state: RootState) => state.player);
  const { t } = useTranslation();

  function getStamina(): number {
    let stamina = Object.values(playerState.Stats)
      .map((obj) => obj[Stat.Stamina] || 0)
      .reduce((a, b) => a + b);
    let staminaModifier = Object.values(playerState.Stats)
      .map((obj) => obj[Stat.StaminaModifier] || 1)
      .reduce((a, b) => a * b);

    if (playerState.Auras.includes(AuraId.BloodPact)) {
      let bloodPactModifier =
        parseInt(playerState.Settings[Setting.improvedImpSetting]) || 0;

      // If the player is using an imp, the imp is active, and the player
      // has more points in the Improved Imp talent than the improved imp setting then use that instead
      if (
        isPetActive(playerState.Settings, false, false) &&
        playerState.Settings[Setting.petChoice] === Pet.Imp
      ) {
        bloodPactModifier = Math.max(
          bloodPactModifier,
          playerState.Talents["Improved Imp"]
        );
      }

      stamina += 70 * (0.1 * bloodPactModifier);
    }

    return stamina * staminaModifier;
  }

  function getIntellect(): number {
    return (
      Object.values(playerState.Stats)
        .map((obj) => obj[Stat.Intellect] || 0)
        .reduce((a, b) => a + b) *
      Object.values(playerState.Stats)
        .map((obj) => obj[Stat.IntellectModifier] || 1)
        .reduce((a, b) => a * b)
    );
  }

  function getSpellPenetration(): number {
    return Object.values(playerState.Stats)
      .map((obj) => obj[Stat.SpellPenetration] || 0)
      .reduce((a, b) => a + b);
  }

  function getSpirit(): number {
    let spiritModifier = Object.values(playerState.Stats)
      .map((obj) => obj[Stat.SpiritModifier] || 1)
      .reduce((a, b) => a * b);

    return (
      Object.values(playerState.Stats)
        .map((obj) => obj[Stat.Spirit] || 0)
        .reduce((a, b) => a + b) * spiritModifier
    );
  }

  function GetHealth(): number {
    let health =
      Object.values(playerState.Stats)
        .map((obj) => obj[Stat.Health] || 0)
        .reduce((a, b) => a + b) +
      getStamina() * StatConstant.HealthPerStamina;
    let healthModifier = Object.values(playerState.Stats)
      .map((obj) => obj[Stat.HealthModifier] || 0)
      .reduce((a, b) => a * b);

    return health * healthModifier;
  }

  function GetMana(): number {
    let mana =
      Object.values(playerState.Stats)
        .map((obj) => obj[Stat.Mana] || 0)
        .reduce((a, b) => a + b) +
      getIntellect() * StatConstant.ManaPerIntellect;
    let manaModifier = Object.values(playerState.Stats)
      .map((obj) => obj[Stat.ManaModifier] || 0)
      .reduce((a, b) => a * b);

    return mana * manaModifier;
  }

  function getSpellPower(): number {
    let spellPower = Object.values(playerState.Stats)
      .map((obj) => obj[Stat.SpellPower] || 0)
      .reduce((a, b) => a + b);

    return spellPower;
  }

  function getShadowPower(): string {
    const shadowPower = Object.values(playerState.Stats)
      .map((obj) => obj[Stat.ShadowPower] || 0)
      .reduce((a, b) => a + b)
      .toString();

    return `${shadowPower} (${
      parseInt(shadowPower) + Math.round(getSpellPower())
    })`;
  }

  function getFirePower(): string {
    const firePower = Object.values(playerState.Stats)
      .map((obj) => obj[Stat.FirePower] || 0)
      .reduce((a, b) => a + b)
      .toString();

    return `${firePower} (${
      parseInt(firePower) + Math.round(getSpellPower())
    })`;
  }

  function getCrit(): string {
    let critRating = Math.round(
      Object.values(playerState.Stats)
        .map((obj) => obj[Stat.CritRating] || 0)
        .reduce((a, b) => a + b)
    );
    let critPercent =
      Object.values(playerState.Stats)
        .map((obj) => obj[Stat.CritChance] || 0)
        .reduce((a, b) => a + b) +
      Math.round(
        (critRating / StatConstant.CritRatingPerPercent +
          StatConstant.BaseCritChancePercent) *
          100
      ) /
        100 +
      getIntellect() * StatConstant.CritPercentPerIntellect;

    return `${critRating} (${critPercent.toFixed(2)}%)`;
  }

  function getHit(): string {
    let hitRating = getPlayerHitRating(playerState);
    let hitPercent =
      Math.round(getPlayerHitPercent(playerState, hitRating) * 100) / 100;

    return `${hitRating} (${hitPercent.toFixed(2)}%)`;
  }

  function getHaste(): string {
    let hasteRating = Object.values(playerState.Stats)
      .map((obj) => obj[Stat.HasteRating] || 0)
      .reduce((a, b) => a + b);
    let hastePercent =
      Math.round((hasteRating / StatConstant.HasteRatingPerPercent) * 100) /
      100;

    return `${hasteRating} (${hastePercent.toFixed(2)}%)`;
  }

  function getShadowModifier(): string {
    let modifier = Object.values(playerState.Stats)
      .map((obj) => obj[Stat.ShadowModifier] || 1)
      .reduce((a, b) => a * b);

    return `${Math.round(modifier * 100)}%`;
  }

  function getFireModifier(): string {
    let modifier = Object.values(playerState.Stats)
      .map((obj) => obj[Stat.FireModifier] || 1)
      .reduce((a, b) => a * b);

    return `${Math.round(modifier * 100)}%`;
  }

  function getMp5(): number {
    return Object.values(playerState.Stats)
      .map((obj) => obj[Stat.Mp5] || 0)
      .reduce((a, b) => a + b);
  }

  function getEnemyArmor(): number {
    let armor = parseInt(playerState.Settings[Setting.enemyArmor]);

    if (playerState.Auras.includes(AuraId.FaerieFire)) {
      armor -= 610;
    }

    if (
      (playerState.Auras.includes(AuraId.SunderArmor) &&
        playerState.Auras.includes(AuraId.ExposeArmor) &&
        playerState.Settings[Setting.improvedExposeArmor] === "2") ||
      (playerState.Auras.includes(AuraId.ExposeArmor) &&
        !playerState.Auras.includes(AuraId.SunderArmor))
    ) {
      armor -=
        2050 *
        (1 +
          0.25 * parseInt(playerState.Settings[Setting.improvedExposeArmor]));
    } else if (playerState.Auras.includes(AuraId.SunderArmor)) {
      armor -= 520 * 5;
    }

    if (playerState.Auras.includes(AuraId.CurseOfRecklessness)) {
      armor -= 800;
    }

    if (playerState.Auras.includes(AuraId.Annihilator)) {
      armor -= 600;
    }

    return Math.max(0, armor);
  }

  const stats: {
    name: string;
    value: () => string;
    condition?: () => boolean;
  }[] = [
    { name: "Health", value: () => Math.round(GetHealth()).toString() },
    { name: "Mana", value: () => Math.round(GetMana()).toString() },
    { name: "Stamina", value: () => Math.round(getStamina()).toString() },
    { name: "Intellect", value: () => Math.round(getIntellect()).toString() },
    { name: "Spirit", value: () => Math.round(getSpirit()).toString() },
    {
      name: "Spell Power",
      value: () => Math.round(getSpellPower()).toString(),
    },
    { name: "Shadow Power", value: () => getShadowPower() },
    { name: "Fire Power", value: () => getFirePower() },
    { name: "Crit Rating", value: () => getCrit() },
    { name: "Hit Rating", value: () => getHit() },
    { name: "Haste Rating", value: () => getHaste() },
    { name: "Shadow Dmg %", value: () => getShadowModifier() },
    { name: "Fire Dmg %", value: () => getFireModifier() },
    { name: "MP5", value: () => Math.round(getMp5()).toString() },
    {
      name: "Spell Penetration",
      value: () => getSpellPenetration().toString(),
      condition: () => getSpellPenetration() > 0,
    },
    {
      name: "Enemy Armor",
      value: () => Math.round(getEnemyArmor()).toString(),
      condition: () => isPetActive(playerState.Settings, true, true),
    },
  ];

  return (
    <ul className="character-stats">
      {stats
        .filter(
          (stat) => stat.condition === undefined || stat.condition() === true
        )
        .map((stat) => (
          <li key={nanoid()}>
            <p className="character-stat">{t(stat.name)}</p>
            <p className="character-stat-val">{stat.value()}</p>
          </li>
        ))}
    </ul>
  );
}
