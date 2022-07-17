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
import { GetBaseStats, IsPetActive } from '../Common'
import { Races } from '../data/Races'
import {
  modifySettingValue as ModifySettingValue,
  setBaseStats,
} from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import { AuraId, Pet, RaceType, Setting } from '../Types'

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
  const player = useSelector((state: RootState) => state.player)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const mui = useStyles()

  function SettingModifiedHandler(setting: Setting, value: string) {
    dispatch(
      ModifySettingValue({
        Setting: setting,
        Value: value,
      })
    )
  }

  return (
    <>
      <FormGroup row>
        <Select
          size='small'
          className={`${mui.select} ${mui.textFieldAndSelect}`}
          value={player.Settings[Setting.rotationOption]}
          onChange={e =>
            SettingModifiedHandler(Setting.rotationOption, e.target.value)
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
          value={player.Settings[Setting.race]}
          onChange={e => {
            const race = Races.find(race => race.Type === e.target.value)

            SettingModifiedHandler(Setting.race, e.target.value)
            race && dispatch(setBaseStats(GetBaseStats(race.Type)))
          }}
        >
          <MenuItem value={RaceType.Gnome}>{t('Gnome')}</MenuItem>
          <MenuItem value={RaceType.Human}>{t('Human')}</MenuItem>
          <MenuItem value={RaceType.Orc}>{t('Orc')}</MenuItem>
          <MenuItem value={RaceType.Undead}>{t('Undead')}</MenuItem>
          <MenuItem value={RaceType.BloodElf}>{t('Blood Elf')}</MenuItem>
        </Select>
        <TextField
          size='small'
          className={`${mui.textField} ${mui.textFieldAndSelect}`}
          type='number'
          label={t('Iterations')}
          variant='outlined'
          value={player.Settings[Setting.iterations]}
          onChange={e =>
            SettingModifiedHandler(Setting.iterations, e.target.value)
          }
        />
        <Select
          size='small'
          className={`${mui.select} ${mui.textFieldAndSelect}`}
          value={player.Settings[Setting.fightType]}
          onChange={e =>
            SettingModifiedHandler(Setting.fightType, e.target.value)
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
          value={player.Settings[Setting.minFightLength]}
          onChange={e =>
            SettingModifiedHandler(Setting.minFightLength, e.target.value)
          }
        />
        <TextField
          size='small'
          className={`${mui.textField} ${mui.textFieldAndSelect}`}
          type='number'
          label={t('Max Fight Length')}
          variant='outlined'
          value={player.Settings[Setting.maxFightLength]}
          onChange={e =>
            SettingModifiedHandler(Setting.maxFightLength, e.target.value)
          }
        />
        <TextField
          size='small'
          className={`${mui.textField} ${mui.textFieldAndSelect}`}
          type='number'
          label={t('Target Level')}
          variant='outlined'
          value={player.Settings[Setting.targetLevel]}
          onChange={e =>
            SettingModifiedHandler(Setting.targetLevel, e.target.value)
          }
        />
        <TextField
          size='small'
          className={`${mui.textField} ${mui.textFieldAndSelect}`}
          type='number'
          label={t('Target Shadow Resistance')}
          variant='outlined'
          value={player.Settings[Setting.targetShadowResistance]}
          onChange={e =>
            SettingModifiedHandler(
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
          value={player.Settings[Setting.targetFireResistance]}
          onChange={e =>
            SettingModifiedHandler(Setting.targetFireResistance, e.target.value)
          }
        />
        {player.Settings[Setting.fightType] === 'aoe' && (
          <TextField
            size='small'
            className={`${mui.textField} ${mui.textFieldAndSelect}`}
            type='number'
            label={t('Enemy Amount')}
            variant='outlined'
            value={player.Settings[Setting.enemyAmount]}
            onChange={e =>
              SettingModifiedHandler(Setting.enemyAmount, e.target.value)
            }
          />
        )}
        <Select
          size='small'
          className={`${mui.select} ${mui.textFieldAndSelect}`}
          value={player.Settings[Setting.petChoice]}
          onChange={e =>
            SettingModifiedHandler(Setting.petChoice, e.target.value)
          }
        >
          <MenuItem value={Pet.Imp}>{t(Pet.Imp)}</MenuItem>
          <MenuItem value={Pet.Succubus}>{t(Pet.Succubus)}</MenuItem>
          <MenuItem value={Pet.Felhunter}>{t(Pet.Felhunter)}</MenuItem>
          <MenuItem value={Pet.Felguard}>{t(Pet.Felguard)}</MenuItem>
        </Select>
        {IsPetActive(player.Settings, true, true) && (
          <TextField
            size='small'
            className={`${mui.textField} ${mui.textFieldAndSelect}`}
            type='number'
            label={t('Enemy Armor')}
            variant='outlined'
            value={player.Settings[Setting.enemyArmor]}
            onChange={e =>
              SettingModifiedHandler(Setting.enemyArmor, e.target.value)
            }
          />
        )}
        {player.Auras.includes(AuraId.PowerInfusion) && (
          <TextField
            size='small'
            className={`${mui.textField} ${mui.textFieldAndSelect}`}
            type='number'
            label={t('Power Infusion Amount')}
            variant='outlined'
            value={player.Settings[Setting.powerInfusionAmount]}
            onChange={e =>
              SettingModifiedHandler(
                Setting.powerInfusionAmount,
                e.target.value
              )
            }
          />
        )}
        {player.Auras.includes(AuraId.Innervate) && (
          <TextField
            size='small'
            className={`${mui.textField} ${mui.textFieldAndSelect}`}
            type='number'
            label={t('Innervate Amount')}
            variant='outlined'
            value={player.Settings[Setting.innervateAmount]}
            onChange={e =>
              SettingModifiedHandler(Setting.innervateAmount, e.target.value)
            }
          />
        )}
        {player.Auras.includes(AuraId.FerociousInspiration) && (
          <TextField
            size='small'
            className={`${mui.textField} ${mui.textFieldAndSelect}`}
            type='number'
            label={t('Ferocious Inspiration Amount')}
            variant='outlined'
            value={player.Settings[Setting.ferociousInspirationAmount]}
            onChange={e =>
              SettingModifiedHandler(
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
            SettingModifiedHandler(
              Setting.automaticallyOpenSimDetails,
              (e.target as HTMLInputElement).checked.toString()
            )
          }}
          checked={
            player.Settings[Setting.automaticallyOpenSimDetails] === 'true'
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
            SettingModifiedHandler(
              Setting.randomizeValues,
              (e.target as HTMLInputElement).checked.toString()
            )
          }}
          checked={player.Settings[Setting.randomizeValues] === 'true'}
        />
        <FormControlLabel
          className={mui.label}
          label={t('Infinite Player Mana')}
          control={<Switch size='small' />}
          labelPlacement='start'
          onChange={e => {
            SettingModifiedHandler(
              Setting.infinitePlayerMana,
              (e.target as HTMLInputElement).checked.toString()
            )
          }}
          checked={player.Settings[Setting.infinitePlayerMana] === 'true'}
        />
        <FormControlLabel
          className={mui.label}
          label={t('Infinite Pet Mana')}
          control={<Switch size='small' />}
          labelPlacement='start'
          onChange={e => {
            SettingModifiedHandler(
              Setting.infinitePetMana,
              (e.target as HTMLInputElement).checked.toString()
            )
          }}
          checked={player.Settings[Setting.infinitePetMana] === 'true'}
        />
        {IsPetActive(player.Settings, false, false) && (
          <FormControlLabel
            className={mui.label}
            label={t('Aggressive Pet')}
            control={<Switch size='small' />}
            labelPlacement='start'
            onChange={e => {
              SettingModifiedHandler(
                Setting.petIsAggressive,
                (e.target as HTMLInputElement).checked.toString()
              )
            }}
            checked={player.Settings[Setting.petIsAggressive] === 'true'}
          />
        )}
        {IsPetActive(player.Settings, true, false) && (
          <FormControlLabel
            className={mui.label}
            label={t('Prepop Black Book')}
            control={<Switch size='small' />}
            labelPlacement='start'
            onChange={e => {
              SettingModifiedHandler(
                Setting.prepopBlackBook,
                (e.target as HTMLInputElement).checked.toString()
              )
            }}
            checked={player.Settings[Setting.prepopBlackBook] === 'true'}
          />
        )}
        {player.Auras.includes(AuraId.FaerieFire) &&
          IsPetActive(player.Settings, true, true) && (
            <FormControlLabel
              className={mui.label}
              label={t('Improved Faerie Fire')}
              control={<Switch size='small' />}
              labelPlacement='start'
              onChange={e => {
                SettingModifiedHandler(
                  Setting.improvedFaerieFire,
                  (e.target as HTMLInputElement).checked.toString()
                )
              }}
              checked={player.Settings[Setting.improvedFaerieFire] === 'true'}
            />
          )}
      </FormGroup>
    </>
  )
}
