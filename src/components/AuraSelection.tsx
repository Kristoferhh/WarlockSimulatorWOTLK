import { Grid, Link, List, ListItem, Typography } from '@mui/material'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getAurasStats, getBaseWowheadUrl, isPetActive } from '../Common'
import { AuraGroups } from '../data/AuraGroups'
import { Auras } from '../data/Auras'
import i18n from '../i18n/config'
import { setAurasStats, setSelectedAuras } from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import { Aura, AuraId } from '../Types'

function DisableAurasWithUniqueProperties(
  aura: Aura,
  auraIds: AuraId[]
): AuraId[] {
  for (var auraId of auraIds) {
    var auraObj = Auras.find(x => IsCorrectAura(x))

    if (
      (auraObj?.Potion && aura.Potion) ||
      (auraObj?.FoodBuff && aura.FoodBuff) ||
      (auraObj?.WeaponOil && aura.WeaponOil) ||
      (auraObj?.BattleElixir && aura.BattleElixir) ||
      (auraObj?.GuardianElixir && aura.GuardianElixir) ||
      (auraObj?.Alcohol && aura.Alcohol) ||
      (auraObj?.DemonicRune && aura.DemonicRune) ||
      (auraObj?.AgilityAndStrength && aura.AgilityAndStrength) ||
      (auraObj?.AttackPower && aura.AttackPower) ||
      (auraObj?.AttackPowerPercent && aura.AttackPowerPercent) ||
      (auraObj?.DamagePercent && aura.DamagePercent) ||
      (auraObj?.HastePercent && aura.HastePercent) ||
      (auraObj?.Health && aura.Health) ||
      (auraObj?.Intellect && aura.Intellect) ||
      (auraObj?.Mp5 && aura.Mp5) ||
      (auraObj?.MeleeCrit && aura.MeleeCrit) ||
      (auraObj?.MeleeHaste && aura.MeleeHaste) ||
      (auraObj?.Replenishment && aura.Replenishment) ||
      (auraObj?.SpellCrit && aura.SpellCrit) ||
      (auraObj?.SpellHaste && aura.SpellHaste) ||
      (auraObj?.SpellPower && aura.SpellPower) ||
      (auraObj?.Spirit && aura.Spirit) ||
      (auraObj?.StatPercent && aura.StatPercent) ||
      (auraObj?.ArmorMajor && aura.ArmorMajor) ||
      (auraObj?.ArmorMinor && aura.ArmorMinor) ||
      (auraObj?.AttackPowerReduction && aura.AttackPowerReduction) ||
      (auraObj?.ManaRestore && aura.ManaRestore) ||
      (auraObj?.PhysicalVulnerability && aura.PhysicalVulnerability) ||
      (auraObj?.SpellCritDebuff && aura.SpellCritDebuff) ||
      (auraObj?.SpellDamagePercent && aura.SpellDamagePercent) ||
      (auraObj?.SpellHit && aura.SpellHit)
    ) {
      auraIds = auraIds.filter(x => AuraIsNotCorrect(x))
    }
  }

  return auraIds

  function IsCorrectAura(auraParam: Aura): unknown {
    return auraParam.Id === auraId
  }

  function AuraIsNotCorrect(auraIdParam: AuraId): boolean {
    return auraIdParam !== auraObj?.Id
  }
}

export default function AuraSelection() {
  const playerState = useSelector((state: RootState) => state.player)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  function AuraClickHandler(aura: Aura): void {
    let newAuras = JSON.parse(JSON.stringify(playerState.Auras)) as AuraId[]

    // If the aura is being toggled on and it's a unique buff like potion/food buff
    // then disable all other auras with that unique property as true.
    if (!newAuras.includes(aura.Id)) {
      newAuras = DisableAurasWithUniqueProperties(aura, newAuras)
      newAuras.push(aura.Id)
    } else {
      newAuras = newAuras.filter(x => x !== aura.Id)
    }

    dispatch(setSelectedAuras(newAuras))
    dispatch(setAurasStats(getAurasStats(newAuras)))
  }

  return (
    <>
      {AuraGroups.map(auraGroup => (
        <Grid item key={nanoid()}>
          <Typography style={{ marginLeft: '15px' }}>
            {t(auraGroup.Heading)}
          </Typography>
          <List>
            {Auras.filter(
              aura =>
                aura.Group === auraGroup.Heading &&
                (!aura.ForPet || isPetActive(playerState.Settings, true, true))
            ).map(aura => (
              <ListItem
                key={nanoid()}
                id={aura.Id.toString()}
                className='buffs aura'
                data-checked={playerState.Auras.includes(aura.Id)}
                onClick={e => {
                  AuraClickHandler(aura)
                  e.preventDefault()
                }}
              >
                <Link
                  href={`${getBaseWowheadUrl(i18n.language)}/${
                    auraGroup.Type
                  }=${aura.Id}`}
                >
                  <img
                    width='40px'
                    height='40px'
                    src={`${process.env.PUBLIC_URL}/img/${aura.IconName}.jpg`}
                    alt={t(aura.Name)}
                  />
                </Link>
              </ListItem>
            ))}
          </List>
        </Grid>
      ))}
    </>
  )
}
