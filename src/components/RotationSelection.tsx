import { Grid, Link, Typography } from '@mui/material'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { GetBaseWowheadUrl } from '../Common'
import { Spells } from '../data/Spells'
import i18n from '../i18n/config'
import { toggleRotationSpellSelection } from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import { RotationGroup, RotationGroups, Setting } from '../Types'

export default function RotationSelection() {
  const player = useSelector((state: RootState) => state.player)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  return (
    <Grid container>
      {RotationGroups.filter(group => {
        // If the fight type is AOE then only show aoe spells, otherwise if it's single target, show everything but the aoe spells
        return player.Settings[Setting.fightType] === 'aoe'
          ? group.Header === RotationGroup.Aoe
          : group.Header !== RotationGroup.Aoe
      }).map(group => (
        <Grid
          item
          xs={2.4}
          key={nanoid()}
          style={{
            display:
              group.Header !== RotationGroup.Curse &&
              player.Settings[Setting.rotationOption] === 'simChooses'
                ? 'none'
                : '',
          }}
        >
          <fieldset>
            <legend>
              <Typography>{t(group.Header)}</Typography>
            </legend>
            <Grid container justifyContent='center'>
              {Spells.filter(s => s.Group === group.Header).map(spell => (
                <Grid
                  className='rotation-spell'
                  key={nanoid()}
                  data-checked={player.Rotation[group.Header].includes(
                    spell.Id
                  )}
                  onClick={e => {
                    dispatch(toggleRotationSpellSelection(spell))
                    e.preventDefault()
                  }}
                >
                  <Link
                    href={`${GetBaseWowheadUrl(i18n.language)}/spell=${
                      spell.Id
                    }`}
                  >
                    <img
                      width={35}
                      height={35}
                      src={`${process.env.PUBLIC_URL}/img/${spell.IconName}.jpg`}
                      alt={t(spell.Name)}
                    />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </fieldset>
        </Grid>
      ))}
    </Grid>
  )
}
