import { Drawer, Grid, Link, List, ListItem, Typography } from '@mui/material'
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
    <Drawer id='sidebar' variant='persistent' open={true}>
      <Typography align='center'>{`${race && t(race.Name)} ${t(
        'Warlock'
      )}`}</Typography>
      <Typography align='center'>{`${t('Level')} 70`}</Typography>
      <StatsDisplay />
      <List id='sidebar-sets'>
        {Object.entries(playerState.Sets).find(set =>
          setHasActiveBonus(set)
        ) && (
          <ListItem>
            <Typography variant='h6'>{t('Set Bonuses')}</Typography>
          </ListItem>
        )}
        {Object.entries(playerState.Sets)
          .filter(set => setHasActiveBonus(set))
          .map(set => {
            const setObj = Sets.find(e => e.Set === set[0])

            return (
              <ListItem key={nanoid()} className='sidebar-set-bonus'>
                <Link
                  target='_blank'
                  rel='noreferrer'
                  href={`${getBaseWowheadUrl(i18n.language)}/item-set=${
                    setObj?.Set
                  }`}
                  className={setObj?.Quality}
                  underline='none'
                >
                  <Typography>
                    {t(setObj!.Name)} ({set[1]})
                  </Typography>
                </Link>
              </ListItem>
            )
          })}
      </List>

      <Grid id='sidebar-simulation-selection'>
        <SimulationButtons />
      </Grid>
    </Drawer>
  )
}
