import { useDispatch, useSelector } from 'react-redux'
import { Auras } from '../data/Auras'
import { RootState } from '../redux/Store'
import { Aura, AuraGroup, AuraId } from '../Types'
import { AuraGroups } from '../data/AuraGroups'
import { setAurasStats, setSelectedAuras } from '../redux/PlayerSlice'
import { nanoid } from 'nanoid'
import { getAurasStats, getBaseWowheadUrl, isPetActive } from '../Common'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n/config'

function disableAurasWithUniqueProperties(aura: Aura, auraObj: AuraId[]): void {
  if (aura.Potion)
    Auras.filter((e) => e.Potion).forEach(
      (x) => (auraObj = auraObj.filter((y) => y !== x.Id))
    )
  if (aura.FoodBuff)
    Auras.filter((e) => e.FoodBuff).forEach(
      (x) => (auraObj = auraObj.filter((y) => y !== x.Id))
    )
  if (aura.WeaponOil)
    Auras.filter((e) => e.WeaponOil).forEach(
      (x) => (auraObj = auraObj.filter((y) => y !== x.Id))
    )
  if (aura.BattleElixir)
    Auras.filter((e) => e.BattleElixir).forEach(
      (x) => (auraObj = auraObj.filter((y) => y !== x.Id))
    )
  if (aura.GuardianElixir)
    Auras.filter((e) => e.GuardianElixir).forEach(
      (x) => (auraObj = auraObj.filter((y) => y !== x.Id))
    )
  if (aura.Alcohol)
    Auras.filter((e) => e.Alcohol).forEach(
      (x) => (auraObj = auraObj.filter((y) => y !== x.Id))
    )
  if (aura.DemonicRune)
    Auras.filter((e) => e.DemonicRune).forEach(
      (x) => (auraObj = auraObj.filter((y) => y !== x.Id))
    )
  if (aura.Drums)
    Auras.filter((e) => e.Drums).forEach(
      (x) => (auraObj = auraObj.filter((y) => y !== x.Id))
    )
}

export default function AuraSelection() {
  const playerState = useSelector((state: RootState) => state.player)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  function auraClickHandler(aura: Aura): void {
    let newAuras = JSON.parse(JSON.stringify(playerState.Auras)) as AuraId[]

    // If the aura is being toggled on and it's a unique buff like potion/food buff
    // then disable all other auras with that unique property as true.
    if (!newAuras.includes(aura.Id)) {
      disableAurasWithUniqueProperties(aura, newAuras)
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
                  auraClickHandler(aura)
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
