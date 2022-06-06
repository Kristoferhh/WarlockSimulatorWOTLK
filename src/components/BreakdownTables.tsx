import {
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getBaseWowheadUrl } from '../Common'
import { AuraGroups } from '../data/AuraGroups'
import { Auras } from '../data/Auras'
import { Gems } from '../data/Gems'
import { Items } from '../data/Items'
import { Spells } from '../data/Spells'
import i18n from '../i18n/config'
import { RootState } from '../redux/Store'

function formatPercentage(num: number) {
  return (Math.round(num * 10000) / 100).toFixed(2)
}

function findSpellByName(name: string):
  | {
      iconName: string
      id: number
      wowheadType: 'spell' | 'item'
      Name: string
    }
  | undefined {
  const spellObj = Spells.find(e => e.Name === name)

  if (spellObj) {
    return {
      iconName: spellObj.IconName,
      id: spellObj.Id,
      wowheadType: 'spell',
      Name: spellObj.Name,
    }
  }

  const auraObj = Auras.find(e => e.Name === name)

  if (auraObj) {
    return {
      iconName: auraObj.IconName,
      id: auraObj.Id,
      wowheadType:
        AuraGroups.find(e => e.Heading === auraObj.Group)?.Type || 'spell',
      Name: auraObj.Name,
    }
  }

  const itemObj = Items.find(e => e.Name === name)

  if (itemObj) {
    return {
      iconName: itemObj.IconName,
      id: itemObj.Id,
      wowheadType: 'item',
      Name: itemObj.Name,
    }
  }

  const gemObj = Gems.find(e => e.Name === name)

  if (gemObj) {
    return {
      iconName: gemObj.IconName,
      id: gemObj.Id,
      wowheadType: 'item',
      Name: gemObj.Name,
    }
  }
}

export default function BreakdownTables() {
  const breakdownObj = useSelector(
    (state: RootState) => state.ui.CombatLogBreakdown
  )
  const { t } = useTranslation()

  return (
    <Grid container>
      <Grid
        item
        xs={5}
        className='breakdown-section'
        id='damage-breakdown-section'
        style={{ display: 'inline-block' }}
      >
        <Table
          className='breakdown-table tablesorter'
          id='damage-breakdown-table'
          data-sortlist='[[1,1]]'
        >
          <TableHead>
            <TableRow>
              <TableCell style={{ color: 'white' }}>{t('Name')}</TableCell>
              <TableCell style={{ color: 'white' }}>{t('Damage')}</TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                {t('Casts')}
              </TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                {t('Avg Cast')}
              </TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                {t('Crit %')}
              </TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                {t('Miss %')}
              </TableCell>
              <TableCell
                align='right'
                style={{
                  display: breakdownObj.SpellDamageDict.Melee ? '' : 'none',
                  color: 'white',
                }}
              >
                {t('Dodge %')}
              </TableCell>
              <TableCell
                align='right'
                style={{
                  display: breakdownObj.SpellDamageDict.Melee ? '' : 'none',
                  color: 'white',
                }}
              >
                {t('Glancing %')}
              </TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                {t('Dps')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakdownObj.Data.filter(
              e =>
                breakdownObj.SpellDamageDict[e.name] &&
                breakdownObj.SpellDamageDict[e.name] > 0
            ).map(spell => {
              const spellObj = findSpellByName(spell.name)

              return (
                <TableRow key={nanoid()} className='spell-damage-information'>
                  <TableCell>
                    {spellObj?.iconName && spellObj.iconName.length > 0 && (
                      <img
                        alt={spellObj.Name}
                        className='breakdown-table-spell-icon'
                        src={`${process.env.PUBLIC_URL}/img/${spellObj?.iconName}.jpg`}
                      />
                    )}
                    <Link
                      className='breakdown-table-spell-name'
                      target='_blank'
                      rel='noreferrer'
                      href={
                        spellObj && spellObj.id !== 0
                          ? `${getBaseWowheadUrl(i18n.language)}/${
                              spellObj.wowheadType
                            }=${spellObj.id}`
                          : ''
                      }
                    >
                      {t(spell.name)}
                    </Link>
                  </TableCell>
                  <TableCell style={{ color: 'white' }}>
                    <meter
                      value={
                        breakdownObj.SpellDamageDict[spell.name]
                          ? (breakdownObj.SpellDamageDict[spell.name] /
                              breakdownObj.TotalDamageDone) *
                            100
                          : '0'
                      }
                      min='0'
                      max='100'
                    ></meter>{' '}
                    {breakdownObj.SpellDamageDict[spell.name]
                      ? formatPercentage(
                          breakdownObj.SpellDamageDict[spell.name] /
                            breakdownObj.TotalDamageDone
                        )
                      : 0}
                    %
                  </TableCell>
                  <TableCell
                    style={{ color: 'white' }}
                    className='number'
                    title={spell.casts.toString()}
                  >
                    {spell.casts / breakdownObj.TotalIterationAmount < 2
                      ? Math.round(
                          (spell.casts / breakdownObj.TotalIterationAmount) * 10
                        ) / 10
                      : Math.round(
                          spell.casts / breakdownObj.TotalIterationAmount
                        )}
                  </TableCell>
                  <TableCell style={{ color: 'white' }} className='number'>
                    {breakdownObj.SpellDamageDict[spell.name]
                      ? Math.round(
                          breakdownObj.SpellDamageDict[spell.name] / spell.casts
                        )
                      : 0}
                  </TableCell>
                  <TableCell style={{ color: 'white' }} className='number'>
                    {formatPercentage(spell.crits / spell.casts)}
                  </TableCell>
                  <TableCell style={{ color: 'white' }} className='number'>
                    {formatPercentage(spell.misses / spell.casts)}
                  </TableCell>
                  {breakdownObj.SpellDamageDict.Melee && (
                    <>
                      <TableCell style={{ color: 'white' }} className='number'>
                        {formatPercentage(spell.dodges / spell.casts)}
                      </TableCell>
                      <TableCell style={{ color: 'white' }} className='number'>
                        {formatPercentage(spell.glancingBlows / spell.casts)}
                      </TableCell>
                    </>
                  )}
                  <TableCell style={{ color: 'white' }} className='number'>
                    {breakdownObj.SpellDamageDict[spell.name]
                      ? Math.round(
                          (breakdownObj.SpellDamageDict[spell.name] /
                            breakdownObj.TotalSimulationFightLength) *
                            100
                        ) / 100
                      : 0}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Grid>
      <Grid
        item
        xs={3.5}
        className='breakdown-section'
        id='mana-gain-breakdown-section'
        style={{ display: 'inline-block' }}
      >
        <Table
          className='breakdown-table tablesorter'
          id='mana-gain-breakdown-table'
          data-sortlist='[[1,1]]'
        >
          <TableHead>
            <TableRow>
              <TableCell style={{ color: 'white' }}>{t('Name')}</TableCell>
              <TableCell style={{ color: 'white' }}>
                {t('% Of Total Gain')}
              </TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                {t('Casts')}
              </TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                {t('Avg Cast')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakdownObj.Data.filter(
              e =>
                breakdownObj.SpellManaGainDict[e.name] &&
                breakdownObj.SpellManaGainDict[e.name] > 0
            ).map(spell => {
              const spellObj = findSpellByName(spell.name)

              return (
                <TableRow key={nanoid()} className='spell-damage-information'>
                  <TableCell>
                    {spellObj?.iconName && spellObj.iconName.length > 0 && (
                      <img
                        alt={spellObj.Name}
                        className='breakdown-table-spell-icon'
                        src={`${process.env.PUBLIC_URL}/img/${spellObj?.iconName}.jpg`}
                      />
                    )}
                    <Link
                      className='breakdown-table-spell-name'
                      target='_blank'
                      rel='noreferrer'
                      href={
                        spellObj && spellObj.id !== 0
                          ? `${getBaseWowheadUrl(i18n.language)}/${
                              spellObj.wowheadType
                            }=${spellObj.id}`
                          : ''
                      }
                    >
                      {t(spell.name)}
                    </Link>
                  </TableCell>
                  <TableCell style={{ color: 'white' }}>
                    <meter
                      value={
                        breakdownObj.SpellManaGainDict[spell.name]
                          ? (breakdownObj.SpellManaGainDict[spell.name] /
                              breakdownObj.TotalManaGained) *
                            100
                          : '0'
                      }
                      min='0'
                      max='100'
                    ></meter>{' '}
                    {breakdownObj.SpellManaGainDict[spell.name]
                      ? formatPercentage(
                          breakdownObj.SpellManaGainDict[spell.name] /
                            breakdownObj.TotalManaGained
                        )
                      : 0}
                    %
                  </TableCell>
                  <TableCell style={{ color: 'white' }} className='number'>
                    {spell.casts / breakdownObj.TotalIterationAmount < 2
                      ? Math.round(
                          (spell.casts / breakdownObj.TotalIterationAmount) * 10
                        ) / 10
                      : Math.round(
                          spell.casts / breakdownObj.TotalIterationAmount
                        )}
                  </TableCell>
                  <TableCell style={{ color: 'white' }} className='number'>
                    {breakdownObj.SpellManaGainDict[spell.name]
                      ? Math.round(
                          breakdownObj.SpellManaGainDict[spell.name] /
                            spell.casts
                        )
                      : 0}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Grid>
      <Grid
        item
        xs={3.5}
        className='breakdown-section'
        id='aura-breakdown-section'
        style={{ display: 'inline-block' }}
      >
        <Table
          className='breakdown-table tablesorter'
          id='aura-breakdown-table'
          data-sortlist='[[2,1]]'
        >
          <TableHead>
            <TableRow>
              <TableCell style={{ color: 'white' }}>{t('Name')}</TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                {t('Count')}
              </TableCell>
              <TableCell style={{ color: 'white' }}>{t('Uptime')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakdownObj.Data.filter(e => e.uptime_in_seconds > 0).map(
              spell => {
                const spellObj = findSpellByName(spell.name)

                return (
                  <TableRow key={nanoid()} className='spell-damage-information'>
                    <TableCell>
                      {spellObj?.iconName && spellObj.iconName.length > 0 && (
                        <img
                          alt={spellObj.Name}
                          className='breakdown-table-spell-icon'
                          src={`${process.env.PUBLIC_URL}/img/${spellObj?.iconName}.jpg`}
                        />
                      )}
                      <Link
                        className='breakdown-table-spell-name'
                        target='_blank'
                        rel='noreferrer'
                        href={
                          spellObj && spellObj.id !== 0
                            ? `${getBaseWowheadUrl(i18n.language)}/${
                                spellObj.wowheadType
                              }=${spellObj.id}`
                            : ''
                        }
                      >
                        {t(spell.name)}
                      </Link>
                    </TableCell>
                    {/*If the aura's count is less than 2 then show 1 decimal place, otherwise just round the value*/}
                    <TableCell style={{ color: 'white' }} className='number'>
                      {spell.count / breakdownObj.TotalIterationAmount < 2
                        ? Math.round(
                            (spell.count / breakdownObj.TotalIterationAmount) *
                              10
                          ) / 10
                        : Math.round(
                            spell.count / breakdownObj.TotalIterationAmount
                          )}
                    </TableCell>
                    <TableCell style={{ color: 'white' }}>
                      <meter
                        value={
                          (spell.uptime_in_seconds /
                            breakdownObj.TotalSimulationFightLength) *
                          100
                        }
                        min='0'
                        max='100'
                      ></meter>{' '}
                      {formatPercentage(
                        spell.uptime_in_seconds /
                          breakdownObj.TotalSimulationFightLength
                      )}
                      %
                    </TableCell>
                  </TableRow>
                )
              }
            )}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )
}
