import {
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getBaseStats, isPetActive } from '../Common'
import { Races } from '../data/Races'
import { modifySettingValue, setBaseStats } from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import { AuraId, Pet, Race, Setting } from '../Types'

const useStyles = makeStyles(() => ({
  textField: {
    '& label, div': {
      color: 'white',
    },
    '& div fieldset': {
      'border-color': 'white',
    },
  },
  select: {
    color: 'white !important' as 'white',
    '& svg': {
      color: 'white',
    },
    '& fieldset': {
      'border-color': 'white',
    },
  },
}))

export default function SettingsDisplay() {
  const playerStore = useSelector((state: RootState) => state.player)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const mui = useStyles()

  function settingModifiedHandler(setting: Setting, value: string) {
    dispatch(
      modifySettingValue({
        setting: setting,
        value: value,
      })
    )
  }

  return (
    <section id='sim-settings'>
      <fieldset>
        <legend>{t('Rotation Options')}</legend>
        <input
          id='sim-chooses-option'
          onChange={e =>
            settingModifiedHandler(Setting.rotationOption, e.target.value)
          }
          type='radio'
          name='rotationOption'
          value='simChooses'
          checked={
            playerStore.Settings[Setting.rotationOption] === 'simChooses'
          }
        />
        <label htmlFor='sim-chooses-option'>
          {t('Simulation chooses spells for me')}
        </label>
        <br />
        <input
          id='user-chooses-option'
          onChange={e =>
            settingModifiedHandler(Setting.rotationOption, e.target.value)
          }
          type='radio'
          name='rotationOption'
          value='userChooses'
          checked={
            playerStore.Settings[Setting.rotationOption] === 'userChooses'
          }
        />
        <label htmlFor='user-chooses-option'>{t('Choose spells myself')}</label>
      </fieldset>
      <ul>
        <li>
          <Select
            className={mui.select}
            value={playerStore.Settings[Setting.race]}
            onChange={e => {
              const race = Races.find(race => race.Race === e.target.value)

              settingModifiedHandler(Setting.race, e.target.value)
              race && dispatch(setBaseStats(getBaseStats(race.Race)))
            }}
          >
            <MenuItem value={Race.Gnome}>{t('Gnome')}</MenuItem>
            <MenuItem value={Race.Human}>{t('Human')}</MenuItem>
            <MenuItem value={Race.Orc}>{t('Orc')}</MenuItem>
            <MenuItem value={Race.Undead}>{t('Undead')}</MenuItem>
            <MenuItem value={Race.BloodElf}>{t('Blood Elf')}</MenuItem>
          </Select>
        </li>
        <li>
          <TextField
            className={mui.textField}
            type='number'
            label={t('Iterations')}
            variant='outlined'
            value={playerStore.Settings[Setting.iterations]}
            onChange={e =>
              settingModifiedHandler(Setting.iterations, e.target.value)
            }
          />
        </li>
        <li>
          <TextField
            className={mui.textField}
            type='number'
            label={t('Min Fight Length')}
            variant='outlined'
            value={playerStore.Settings[Setting.minFightLength]}
            onChange={e =>
              settingModifiedHandler(Setting.minFightLength, e.target.value)
            }
          />
        </li>
        <li>
          <TextField
            className={mui.textField}
            type='number'
            label={t('Max Fight Length')}
            variant='outlined'
            value={playerStore.Settings[Setting.maxFightLength]}
            onChange={e =>
              settingModifiedHandler(Setting.maxFightLength, e.target.value)
            }
          />
        </li>
        <li>
          <TextField
            className={mui.textField}
            type='number'
            label={t('Target Level')}
            variant='outlined'
            value={playerStore.Settings[Setting.targetLevel]}
            onChange={e =>
              settingModifiedHandler(Setting.targetLevel, e.target.value)
            }
          />
        </li>
        <li>
          <TextField
            className={mui.textField}
            type='number'
            label={t('Target Shadow Resistance')}
            variant='outlined'
            value={playerStore.Settings[Setting.targetShadowResistance]}
            onChange={e =>
              settingModifiedHandler(
                Setting.targetShadowResistance,
                e.target.value
              )
            }
          />
        </li>
        <li>
          <TextField
            className={mui.textField}
            type='number'
            label={t('Target Fire Resistance')}
            variant='outlined'
            value={playerStore.Settings[Setting.targetFireResistance]}
            onChange={e =>
              settingModifiedHandler(
                Setting.targetFireResistance,
                e.target.value
              )
            }
          />
        </li>
        <li>
          <Select
            className={mui.select}
            value={playerStore.Settings[Setting.fightType]}
            onChange={e =>
              settingModifiedHandler(Setting.fightType, e.target.value)
            }
          >
            <MenuItem value='singleTarget'>{t('Single Target')}</MenuItem>
            <MenuItem value='aoe'>{t('AoE')}</MenuItem>
          </Select>
        </li>
        {playerStore.Settings[Setting.fightType] === 'aoe' && (
          <li
            id='enemy-amount'
            title="Including the target you're casting Seed of Corruption on"
          >
            <TextField
              className={mui.textField}
              type='number'
              label={t('Enemy Amount')}
              variant='outlined'
              value={playerStore.Settings[Setting.enemyAmount]}
              onChange={e =>
                settingModifiedHandler(Setting.enemyAmount, e.target.value)
              }
            />
          </li>
        )}
        <li id='automatically-open-sim-details'>
          <FormControlLabel
            label={t('Show Damage & Aura Tables')}
            control={<Switch />}
            labelPlacement='start'
            onChange={e => {
              settingModifiedHandler(
                Setting.automaticallyOpenSimDetails,
                (e.target as HTMLInputElement).checked.toString()
              )
            }}
            checked={
              playerStore.Settings[Setting.automaticallyOpenSimDetails] ===
              'true'
            }
          />
        </li>
        <li
          id='randomizeValues'
          title={t(
            'Chooses a random value between a minimum and a maximum value instead of taking the average of the two.'
          )}
        >
          <FormControlLabel
            label={t('Randomize Instead of Averaging')}
            control={<Switch />}
            labelPlacement='start'
            onChange={e => {
              settingModifiedHandler(
                Setting.randomizeValues,
                (e.target as HTMLInputElement).checked.toString()
              )
            }}
            checked={playerStore.Settings[Setting.randomizeValues] === 'true'}
          />
        </li>
        <li id='infinitePlayerMana'>
          <FormControlLabel
            label={t('Infinite Player Mana')}
            control={<Switch />}
            labelPlacement='start'
            onChange={e => {
              settingModifiedHandler(
                Setting.infinitePlayerMana,
                (e.target as HTMLInputElement).checked.toString()
              )
            }}
            checked={
              playerStore.Settings[Setting.infinitePlayerMana] === 'true'
            }
          />
        </li>
        <li id='infinitePetMana'>
          <FormControlLabel
            label={t('Infinite Pet Mana')}
            control={<Switch />}
            labelPlacement='start'
            onChange={e => {
              settingModifiedHandler(
                Setting.infinitePetMana,
                (e.target as HTMLInputElement).checked.toString()
              )
            }}
            checked={playerStore.Settings[Setting.infinitePetMana] === 'true'}
          />
        </li>
        <li id='petChoice'>
          <Select
            className={mui.select}
            value={playerStore.Settings[Setting.petChoice]}
            onChange={e =>
              settingModifiedHandler(Setting.petChoice, e.target.value)
            }
          >
            <MenuItem value={Pet.Imp}>{t('Imp')}</MenuItem>
            <MenuItem value={Pet.Succubus}>{t('Succubus')}</MenuItem>
            <MenuItem value={Pet.Felhunter}>{t('Felhunter')}</MenuItem>
            <MenuItem value={Pet.Felguard}>{t('Felguard')}</MenuItem>
          </Select>
        </li>
        {isPetActive(playerStore.Settings, false, false) && (
          <li id='petMode'>
            <FormControlLabel
              label={t('Aggressive Pet')}
              control={<Switch />}
              labelPlacement='start'
              onChange={e => {
                settingModifiedHandler(
                  Setting.petIsAggressive,
                  (e.target as HTMLInputElement).checked.toString()
                )
              }}
              checked={playerStore.Settings[Setting.petIsAggressive] === 'true'}
            />
          </li>
        )}
        {isPetActive(playerStore.Settings, true, false) && (
          <li id='prepopBlackBook'>
            <FormControlLabel
              label={t('Prepop Black Book')}
              control={<Switch />}
              labelPlacement='start'
              onChange={e => {
                settingModifiedHandler(
                  Setting.prepopBlackBook,
                  (e.target as HTMLInputElement).checked.toString()
                )
              }}
              checked={playerStore.Settings[Setting.prepopBlackBook] === 'true'}
            />
          </li>
        )}
        {isPetActive(playerStore.Settings, true, true) &&
          playerStore.Settings[Setting.petChoice] === Pet.Succubus && (
            <li id='lashOfPainUsage'>
              <FormControlLabel
                label={t('Only use Lash of Pain when ISB is not up')}
                control={<Switch />}
                labelPlacement='start'
                onChange={e => {
                  settingModifiedHandler(
                    Setting.OnlyLashOfPainWhenIsbIsNotUp,
                    (e.target as HTMLInputElement).checked.toString()
                  )
                }}
                checked={
                  playerStore.Settings[Setting.OnlyLashOfPainWhenIsbIsNotUp] ===
                  'true'
                }
              />
            </li>
          )}
        {isPetActive(playerStore.Settings, true, true) && (
          <li id='enemyArmor'>
            <TextField
              className={mui.textField}
              type='number'
              label={t('Enemy Armor')}
              variant='outlined'
              value={playerStore.Settings[Setting.enemyArmor]}
              onChange={e =>
                settingModifiedHandler(Setting.enemyArmor, e.target.value)
              }
            />
          </li>
        )}
        {playerStore.Auras.includes(AuraId.PowerInfusion) && (
          <li id='powerInfusionAmount'>
            <TextField
              className={mui.textField}
              type='number'
              label={t('Power Infusion Amount')}
              variant='outlined'
              value={playerStore.Settings[Setting.powerInfusionAmount]}
              onChange={e =>
                settingModifiedHandler(
                  Setting.powerInfusionAmount,
                  e.target.value
                )
              }
            />
          </li>
        )}
        {playerStore.Auras.includes(AuraId.Innervate) && (
          <li id='innervateAmount'>
            <TextField
              className={mui.textField}
              type='number'
              label={t('Innervate Amount')}
              variant='outlined'
              value={playerStore.Settings[Setting.innervateAmount]}
              onChange={e =>
                settingModifiedHandler(Setting.innervateAmount, e.target.value)
              }
            />
          </li>
        )}
        {playerStore.Auras.includes(AuraId.FerociousInspiration) && (
          <li id='ferociousInspirationAmount'>
            <TextField
              className={mui.textField}
              type='number'
              label={t('Ferocious Inspiration Amount')}
              variant='outlined'
              value={playerStore.Settings[Setting.ferociousInspirationAmount]}
              onChange={e =>
                settingModifiedHandler(
                  Setting.ferociousInspirationAmount,
                  e.target.value
                )
              }
            />
          </li>
        )}
        {playerStore.Auras.includes(AuraId.FaerieFire) &&
          isPetActive(playerStore.Settings, true, true) && (
            <li id='improvedFaerieFire'>
              <FormControlLabel
                label={t('Improved Faerie Fire')}
                control={<Switch />}
                labelPlacement='start'
                onChange={e => {
                  settingModifiedHandler(
                    Setting.improvedFaerieFire,
                    (e.target as HTMLInputElement).checked.toString()
                  )
                }}
                checked={
                  playerStore.Settings[Setting.improvedFaerieFire] === 'true'
                }
              />
            </li>
          )}
        {playerStore.Auras.includes(AuraId.ExposeArmor) &&
          isPetActive(playerStore.Settings, true, true) && (
            <li id='improvedExposeArmor'>
              <label className='settings-left' htmlFor='improvedExposeArmor'>
                {t('Improved Expose Armor')}?
              </label>
              <select
                className='settings-right'
                name='improvedExposeArmor'
                onChange={e =>
                  settingModifiedHandler(
                    Setting.improvedExposeArmor,
                    e.target.value
                  )
                }
                value={playerStore.Settings[Setting.improvedExposeArmor]}
              >
                <option value='0'>{t('No')}</option>
                <option value='1'>1/2</option>
                <option value='2'>2/2</option>
              </select>
            </li>
          )}
        {playerStore.Auras.includes(AuraId.ExposeWeakness) &&
          isPetActive(playerStore.Settings, true, true) && (
            <div>
              <li id='survivalHunterAgility'>
                <TextField
                  className={mui.textField}
                  type='number'
                  label={t('Survival Hunter Agility')}
                  variant='outlined'
                  value={playerStore.Settings[Setting.customIsbUptimeValue]}
                  onChange={e =>
                    settingModifiedHandler(
                      Setting.customIsbUptimeValue,
                      e.target.value
                    )
                  }
                />
              </li>
              <li id='exposeWeaknessUptime'>
                <TextField
                  className={mui.textField}
                  type='number'
                  label={`${t('Expose Weakness Uptime')} %`}
                  variant='outlined'
                  value={playerStore.Settings[Setting.exposeWeaknessUptime]}
                  onChange={e =>
                    settingModifiedHandler(
                      Setting.exposeWeaknessUptime,
                      e.target.value
                    )
                  }
                />
              </li>
            </div>
          )}
        <li id='customIsbUptime'>
          <FormControlLabel
            label={t('Use Custom ISB Uptime')}
            control={<Switch />}
            labelPlacement='start'
            onChange={e => {
              settingModifiedHandler(
                Setting.customIsbUptime,
                (e.target as HTMLInputElement).checked.toString()
              )
            }}
            checked={playerStore.Settings[Setting.customIsbUptime] === 'true'}
          />
        </li>
        {playerStore.Settings[Setting.customIsbUptime] === 'yes' && (
          <li id='custom-isb-uptime-value'>
            <TextField
              className={mui.textField}
              type='number'
              label={`${t('Custom ISB Uptime')} %`}
              variant='outlined'
              value={playerStore.Settings[Setting.customIsbUptimeValue]}
              onChange={e =>
                settingModifiedHandler(
                  Setting.customIsbUptimeValue,
                  e.target.value
                )
              }
            />
          </li>
        )}
      </ul>
    </section>
  )
}
