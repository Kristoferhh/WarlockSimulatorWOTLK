import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getBaseWowheadUrl } from '../Common'
import { Races } from '../data/Races'
import { Sets } from '../data/Sets'
import i18n from '../i18n/config'
import { RootState } from '../redux/Store'
import { Setting } from '../Types'
import { SimulationButtons } from './SimulationButtons'
import StatsDisplay from './StatsDisplay'

function setHasActiveBonus(set: [string, number]): boolean {
  const setObj = Sets.find(e => e.Set === set[0])
  if (setObj) {
    return set[1] >= setObj.Bonuses[0]
  }
  return false
}

export default function Sidebar() {
  const playerState = useSelector((state: RootState) => state.player)
  const { t } = useTranslation()
  const race = Races.find(e => e.Race === playerState.Settings[Setting.race])

  return (
    <div id='sidebar'>
      <section id='character-section'>
        <p id='character-race'>
          <span id='race'>{race && t(race.Name)}</span> {t('Warlock')}
        </p>
        <p id='character-level'>
          {t('Level')} <span>70</span>
        </p>
        <StatsDisplay />
        <ul id='sidebar-sets'>
          {Object.entries(playerState.Sets).find(set =>
            setHasActiveBonus(set)
          ) && (
            <li>
              <h3>{t('Set Bonuses')}</h3>
            </li>
          )}
          {Object.entries(playerState.Sets)
            .filter(set => setHasActiveBonus(set))
            .map(set => {
              const setObj = Sets.find(e => e.Set === set[0])

              return (
                <li key={nanoid()} className='sidebar-set-bonus'>
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href={`${getBaseWowheadUrl(i18n.language)}/item-set=${
                      setObj?.Set
                    }`}
                    className={setObj?.Quality}
                  >
                    {t(setObj!.Name)} ({set[1]})
                  </a>
                </li>
              )
            })}
        </ul>

        <div id='sidebar-simulation-selection'>
          <SimulationButtons />
        </div>
      </section>
    </div>
  )
}
