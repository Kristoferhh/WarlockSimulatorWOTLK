import { useDispatch, useSelector } from 'react-redux'
import { Auras } from '../data/Auras'
import { RootState } from '../redux/Store'
import { Aura, AuraId } from '../Types'
import { AuraGroups } from '../data/AuraGroups'
import { setAurasStats, setSelectedAuras } from '../redux/PlayerSlice'
import { nanoid } from 'nanoid'
import { getAurasStats, getBaseWowheadUrl, isPetActive } from '../Common'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n/config'

function DisableAurasWithUniqueProperties(
  aura: Aura,
  auraIds: AuraId[]
): AuraId[] {
  for (var auraId of auraIds) {
    var auraObj = Auras.find((x) => x.Id === auraId)

    if (
      (auraObj?.Potion && aura.Potion) ||
      (auraObj?.FoodBuff && aura.FoodBuff) ||
      (auraObj?.WeaponOil && aura.WeaponOil) ||
      (auraObj?.BattleElixir && aura.BattleElixir) ||
      (auraObj?.GuardianElixir && aura.GuardianElixir) ||
      (auraObj?.Alcohol && aura.Alcohol) ||
      (auraObj?.DemonicRune && aura.DemonicRune)
    ) {
      auraIds = auraIds.filter((x) => x !== auraObj?.Id)
    }
  }

  return auraIds
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
      newAuras = newAuras.filter((x) => x !== aura.Id)
    }

    dispatch(setSelectedAuras(newAuras))
    dispatch(setAurasStats(getAurasStats(newAuras)))
  }

  return (
    <section id='buffs-and-debuffs-section'>
      {AuraGroups.map((auraGroup) => (
        <div key={nanoid()}>
          <h3 className='buffs-heading'>{t(auraGroup.Heading)}</h3>
          <ul>
            {Auras.filter(
              (aura) =>
                aura.Group === auraGroup.Heading &&
                (!aura.ForPet || isPetActive(playerState.Settings, true, true))
            ).map((aura) => (
              <li
                key={nanoid()}
                id={aura.Id.toString()}
                className='buffs aura'
                data-checked={playerState.Auras.includes(aura.Id)}
                onClick={(e) => {
                  AuraClickHandler(aura)
                  e.preventDefault()
                }}
              >
                <a
                  href={`${getBaseWowheadUrl(i18n.language)}/${
                    auraGroup.Type
                  }=${aura.Id}`}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/img/${aura.IconName}.jpg`}
                    alt={t(aura.Name)}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
