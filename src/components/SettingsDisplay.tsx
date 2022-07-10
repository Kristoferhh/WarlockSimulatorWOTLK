import {
  FormControlLabel,
  FormGroup,
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
  textFieldAndSelect: {
    width: '50%',
    margin: '5px 0 5px 0 !important',
  },
  textField: {
    padding: '10px',
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
  label: {
    flexDirection: 'row !important' as 'row',
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
    <>
      <FormGroup row>
        <Select
          size='small'
          className={`${mui.select} ${mui.textFieldAndSelect}`}
          value={playerStore.Settings[Setting.rotationOption]}
          onChange={e =>
            settingModifiedHandler(Setting.rotationOption, e.target.value)
          }
        >
          <MenuItem value='userChooses'>{t('Choose spells myself')}</MenuItem>
          <MenuItem value='simChooses'>
            {t('Simulation chooses spells for me')}
          </MenuItem>
        </Select>
        <Select
          size='small'
          className={`${mui.select} ${mui.textFieldAndSelect}`}
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
        <TextField
          size='small'
          className={`${mui.textField} ${mui.textFieldAndSelect}`}
          type='number'
          label={t('Iterations')}
          variant='outlined'
          value={playerStore.Settings[Setting.iterations]}
          onChange={e =>
            settingModifiedHandler(Setting.iterations, e.target.value)
          }
        />
        <Select
          size='small'
          className={`${mui.select} ${mui.textFieldAndSelect}`}
          value={playerStore.Settings[Setting.fightType]}
          onChange={e =>
            settingModifiedHandler(Setting.fightType, e.target.value)
          }
        >
          <MenuItem value='singleTarget'>{t('Single Target')}</MenuItem>
          <MenuItem value='aoe'>{t('AoE')}</MenuItem>
        </Select>
        <TextField
          size='small'
          className={`${mui.textField} ${mui.textFieldAndSelect}`}
          type='number'
          label={t('Min Fight Length')}
          variant='outlined'
          value={playerStore.Settings[Setting.minFightLength]}
          onChange={e =>
            settingModifiedHandler(Setting.minFightLength, e.target.value)
          }
        />
        <TextField
          size='small'
          className={`${mui.textField} ${mui.textFieldAndSelect}`}
          type='number'
          label={t('Max Fight Length')}
          variant='outlined'
          value={playerStore.Settings[Setting.maxFightLength]}
          onChange={e =>
            settingModifiedHandler(Setting.maxFightLength, e.target.value)
          }
        />
        <TextField
          size='small'
          className={`${mui.textField} ${mui.textFieldAndSelect}`}
          type='number'
          label={t('Target Level')}
          variant='outlined'
          value={playerStore.Settings[Setting.targetLevel]}
          onChange={e =>
            settingModifiedHandler(Setting.targetLevel, e.target.value)
          }
        />
        <TextField
          size='small'
          className={`${mui.textField} ${mui.textFieldAndSelect}`}
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
        <TextField
          size='small'
          className={`${mui.textField} ${mui.textFieldAndSelect}`}
          type='number'
          label={t('Target Fire Resistance')}
          variant='outlined'
          value={playerStore.Settings[Setting.targetFireResistance]}
          onChange={e =>
            settingModifiedHandler(Setting.targetFireResistance, e.target.value)
          }
        />
        {playerStore.Settings[Setting.fightType] === 'aoe' && (
          <TextField
            size='small'
            className={`${mui.textField} ${mui.textFieldAndSelect}`}
            type='number'
            label={t('Enemy Amount')}
            variant='outlined'
            value={playerStore.Settings[Setting.enemyAmount]}
            onChange={e =>
              settingModifiedHandler(Setting.enemyAmount, e.target.value)
            }
          />
        )}
        <Select
          size='small'
          className={`${mui.select} ${mui.textFieldAndSelect}`}
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
        {isPetActive(playerStore.Settings, true, true) && (
          <TextField
            size='small'
            className={`${mui.textField} ${mui.textFieldAndSelect}`}
            type='number'
            label={t('Enemy Armor')}
            variant='outlined'
            value={playerStore.Settings[Setting.enemyArmor]}
            onChange={e =>
              settingModifiedHandler(Setting.enemyArmor, e.target.value)
            }
          />
        )}
        {playerStore.Auras.includes(AuraId.PowerInfusion) && (
          <TextField
            size='small'
            className={`${mui.textField} ${mui.textFieldAndSelect}`}
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
        )}
        {playerStore.Auras.includes(AuraId.Innervate) && (
          <TextField
            size='small'
            className={`${mui.textField} ${mui.textFieldAndSelect}`}
            type='number'
            label={t('Innervate Amount')}
            variant='outlined'
            value={playerStore.Settings[Setting.innervateAmount]}
            onChange={e =>
              settingModifiedHandler(Setting.innervateAmount, e.target.value)
            }
          />
        )}
        {playerStore.Auras.includes(AuraId.FerociousInspiration) && (
          <TextField
            size='small'
            className={`${mui.textField} ${mui.textFieldAndSelect}`}
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
        )}
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          className={mui.label}
          label={t('Show Damage & Aura Tables')}
          control={<Switch size='small' />}
          labelPlacement='start'
          onChange={e => {
            settingModifiedHandler(
              Setting.automaticallyOpenSimDetails,
              (e.target as HTMLInputElement).checked.toString()
            )
          }}
          checked={
            playerStore.Settings[Setting.automaticallyOpenSimDetails] === 'true'
          }
        />
        <FormControlLabel
          className={mui.label}
          label={t('Randomize Instead of Averaging')}
          title={t(
            'Chooses a random value between a minimum and a maximum value instead of taking the average of the two.'
          )}
          control={<Switch size='small' />}
          labelPlacement='start'
          onChange={e => {
            settingModifiedHandler(
              Setting.randomizeValues,
              (e.target as HTMLInputElement).checked.toString()
            )
          }}
          checked={playerStore.Settings[Setting.randomizeValues] === 'true'}
        />
        <FormControlLabel
          className={mui.label}
          label={t('Infinite Player Mana')}
          control={<Switch size='small' />}
          labelPlacement='start'
          onChange={e => {
            settingModifiedHandler(
              Setting.infinitePlayerMana,
              (e.target as HTMLInputElement).checked.toString()
            )
          }}
          checked={playerStore.Settings[Setting.infinitePlayerMana] === 'true'}
        />
        <FormControlLabel
          className={mui.label}
          label={t('Infinite Pet Mana')}
          control={<Switch size='small' />}
          labelPlacement='start'
          onChange={e => {
            settingModifiedHandler(
              Setting.infinitePetMana,
              (e.target as HTMLInputElement).checked.toString()
            )
          }}
          checked={playerStore.Settings[Setting.infinitePetMana] === 'true'}
        />
        {isPetActive(playerStore.Settings, false, false) && (
          <FormControlLabel
            className={mui.label}
            label={t('Aggressive Pet')}
            control={<Switch size='small' />}
            labelPlacement='start'
            onChange={e => {
              settingModifiedHandler(
                Setting.petIsAggressive,
                (e.target as HTMLInputElement).checked.toString()
              )
            }}
            checked={playerStore.Settings[Setting.petIsAggressive] === 'true'}
          />
        )}
        {isPetActive(playerStore.Settings, true, false) && (
          <FormControlLabel
            className={mui.label}
            label={t('Prepop Black Book')}
            control={<Switch size='small' />}
            labelPlacement='start'
            onChange={e => {
              settingModifiedHandler(
                Setting.prepopBlackBook,
                (e.target as HTMLInputElement).checked.toString()
              )
            }}
            checked={playerStore.Settings[Setting.prepopBlackBook] === 'true'}
          />
        )}
        {playerStore.Auras.includes(AuraId.FaerieFire) &&
          isPetActive(playerStore.Settings, true, true) && (
            <FormControlLabel
              className={mui.label}
              label={t('Improved Faerie Fire')}
              control={<Switch size='small' />}
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
          )}
      </FormGroup>
    </>
  )
}
