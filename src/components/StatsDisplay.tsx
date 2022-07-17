import { List, ListItem, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { GetPlayerHitPercent, GetPlayerHitRating, IsPetActive } from '../Common'
import { RootState } from '../redux/Store'
import { AuraId, Pet, Setting, Stat, StatConstant } from '../Types'

const useStyles = makeStyles({
  stat: {
    lineHeight: '0.7 !important',
  },
})

export default function StatsDisplay() {
  const player = useSelector((state: RootState) => state.player)
  const { t } = useTranslation()
  const mui = useStyles()

  function GetStamina(): number {
    let stamina = Object.values(player.Stats)
      .map(obj => obj[Stat.Stamina] || 0)
      .reduce((a, b) => a + b)
    let staminaModifier = Object.values(player.Stats)
      .map(obj => obj[Stat.StaminaModifier] || 1)
      .reduce((a, b) => a * b)

    if (
      player.Auras.includes(AuraId.BloodPact) &&
      IsPetActive(player.Settings, false, false) &&
      player.Settings[Setting.petChoice] === Pet.Imp
    ) {
      stamina += 70 * (0.1 * player.Talents['Improved Imp'] || 0)
    }

    return stamina * staminaModifier
  }

  function GetIntellect(): number {
    return (
      Object.values(player.Stats)
        .map(obj => obj[Stat.Intellect] || 0)
        .reduce((a, b) => a + b) *
      Object.values(player.Stats)
        .map(obj => obj[Stat.IntellectModifier] || 1)
        .reduce((a, b) => a * b)
    )
  }

  function GetSpellPenetration(): number {
    return Object.values(player.Stats)
      .map(obj => obj[Stat.SpellPenetration] || 0)
      .reduce((a, b) => a + b)
  }

  function GetSpirit(): number {
    let spiritModifier = Object.values(player.Stats)
      .map(obj => obj[Stat.SpiritModifier] || 1)
      .reduce((a, b) => a * b)

    return (
      Object.values(player.Stats)
        .map(obj => obj[Stat.Spirit] || 0)
        .reduce((a, b) => a + b) * spiritModifier
    )
  }

  function GetHealth(): number {
    let health =
      Object.values(player.Stats)
        .map(obj => obj[Stat.Health] || 0)
        .reduce((a, b) => a + b) +
      GetStamina() * StatConstant.HealthPerStamina
    let healthModifier = Object.values(player.Stats)
      .map(obj => obj[Stat.HealthModifier] || 0)
      .reduce((a, b) => a * b)

    return health * healthModifier
  }

  function GetMana(): number {
    let mana =
      Object.values(player.Stats)
        .map(obj => obj[Stat.Mana] || 0)
        .reduce((a, b) => a + b) +
      GetIntellect() * StatConstant.ManaPerIntellect
    let manaModifier = Object.values(player.Stats)
      .map(obj => obj[Stat.ManaModifier] || 0)
      .reduce((a, b) => a * b)

    return mana * manaModifier
  }

  function GetSpellPower(): number {
    let spellPower = Object.values(player.Stats)
      .map(obj => obj[Stat.SpellPower] || 0)
      .reduce((a, b) => a + b)

    return spellPower
  }

  function GetShadowPower(): string {
    const shadowPower = Object.values(player.Stats)
      .map(obj => obj[Stat.ShadowPower] || 0)
      .reduce((a, b) => a + b)
      .toString()

    return `${shadowPower} (${
      parseInt(shadowPower) + Math.round(GetSpellPower())
    })`
  }

  function GetFirePower(): string {
    const firePower = Object.values(player.Stats)
      .map(obj => obj[Stat.FirePower] || 0)
      .reduce((a, b) => a + b)
      .toString()

    return `${firePower} (${parseInt(firePower) + Math.round(GetSpellPower())})`
  }

  function GetCrit(): string {
    let critRating = Math.round(
      Object.values(player.Stats)
        .map(obj => obj[Stat.CritRating] || 0)
        .reduce((a, b) => a + b)
    )
    let critPercent =
      Object.values(player.Stats)
        .map(obj => obj[Stat.CritChance] || 0)
        .reduce((a, b) => a + b) +
      Math.round(
        (critRating / StatConstant.CritRatingPerPercent +
          StatConstant.BaseCritChancePercent) *
          100
      ) /
        100 +
      GetIntellect() * StatConstant.CritPercentPerIntellect

    return `${critRating} (${critPercent.toFixed(2)}%)`
  }

  function GetHit(): string {
    let hitRating = GetPlayerHitRating(player)
    let hitPercent =
      Math.round(GetPlayerHitPercent(player, hitRating) * 100) / 100

    return `${hitRating} (${hitPercent.toFixed(2)}%)`
  }

  function GetHaste(): string {
    let hasteRating = Object.values(player.Stats)
      .map(obj => obj[Stat.HasteRating] || 0)
      .reduce((a, b) => a + b)
    let hastePercent =
      Math.round((hasteRating / StatConstant.HasteRatingPerPercent) * 100) / 100

    return `${hasteRating} (${hastePercent.toFixed(2)}%)`
  }

  function GetShadowModifier(): string {
    let modifier = Object.values(player.Stats)
      .map(obj => obj[Stat.ShadowModifier] || 1)
      .reduce((a, b) => a * b)

    return `${Math.round(modifier * 100)}%`
  }

  function GetFireModifier(): string {
    let modifier = Object.values(player.Stats)
      .map(obj => obj[Stat.FireModifier] || 1)
      .reduce((a, b) => a * b)

    return `${Math.round(modifier * 100)}%`
  }

  function GetMp5(): number {
    return Object.values(player.Stats)
      .map(obj => obj[Stat.Mp5] || 0)
      .reduce((a, b) => a + b)
  }

  function GetEnemyArmor(): number {
    let armor = parseInt(player.Settings[Setting.enemyArmor])

    if (player.Auras.includes(AuraId.FaerieFire)) {
      armor -= 610
    }

    if (
      player.Auras.includes(AuraId.SunderArmor) ||
      player.Auras.includes(AuraId.ExposeArmor)
    ) {
      // TODO it reduces armor by 20%
      armor -= 2050
    }

    if (player.Auras.includes(AuraId.CurseOfRecklessness)) {
      armor -= 800
    }

    if (player.Auras.includes(AuraId.Annihilator)) {
      armor -= 600
    }

    return Math.max(0, armor)
  }

  const stats: {
    name: string
    value: () => string
    condition?: () => boolean
  }[] = [
    { name: 'Health', value: () => Math.round(GetHealth()).toString() },
    { name: 'Mana', value: () => Math.round(GetMana()).toString() },
    { name: 'Stamina', value: () => Math.round(GetStamina()).toString() },
    { name: 'Intellect', value: () => Math.round(GetIntellect()).toString() },
    { name: 'Spirit', value: () => Math.round(GetSpirit()).toString() },
    {
      name: 'Spell Power',
      value: () => Math.round(GetSpellPower()).toString(),
    },
    { name: 'Shadow Power', value: () => GetShadowPower() },
    { name: 'Fire Power', value: () => GetFirePower() },
    { name: 'Crit Rating', value: () => GetCrit() },
    { name: 'Hit Rating', value: () => GetHit() },
    { name: 'Haste Rating', value: () => GetHaste() },
    { name: 'Shadow Dmg %', value: () => GetShadowModifier() },
    { name: 'Fire Dmg %', value: () => GetFireModifier() },
    { name: 'MP5', value: () => Math.round(GetMp5()).toString() },
    {
      name: 'Spell Penetration',
      value: () => GetSpellPenetration().toString(),
      condition: () => GetSpellPenetration() > 0,
    },
    {
      name: 'Enemy Armor',
      value: () => Math.round(GetEnemyArmor()).toString(),
      condition: () => IsPetActive(player.Settings, true, true),
    },
  ]

  return (
    <List>
      {stats
        .filter(
          stat => stat.condition === undefined || stat.condition() === true
        )
        .map(stat => (
          <ListItem
            style={{
              justifyContent: 'space-between',
            }}
            key={nanoid()}
          >
            <Typography className={mui.stat}>{t(stat.name)}</Typography>
            <Typography className={mui.stat}>{stat.value()}</Typography>
          </ListItem>
        ))}
    </List>
  )
}
