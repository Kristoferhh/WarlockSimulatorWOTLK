import {
  Grid,
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
    <>
      <Grid
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
              <TableCell>{t('Name')}</TableCell>
              <TableCell>{t('Damage')}</TableCell>
              <TableCell>{t('Casts')}</TableCell>
              <TableCell>{t('Avg Cast')}</TableCell>
              <TableCell>{t('Crit %')}</TableCell>
              <TableCell>{t('Miss %')}</TableCell>
              <TableCell
                style={{
                  display: breakdownObj.SpellDamageDict.Melee ? '' : 'none',
                }}
              >
                {t('Dodge %')}
              </TableCell>
              <TableCell
                style={{
                  display: breakdownObj.SpellDamageDict.Melee ? '' : 'none',
                }}
              >
                {t('Glancing %')}
              </TableCell>
              <TableCell>{t('Dps')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakdownObj.Data.filter(
              e =>
                breakdownObj.SpellDamageDict[e.Name] &&
                breakdownObj.SpellDamageDict[e.Name] > 0
            ).map(spell => {
              const spellObj = findSpellByName(spell.Name)

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
                    <a
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
                      {t(spell.Name)}
                    </a>
                  </TableCell>
                  <TableCell>
                    <meter
                      value={
                        breakdownObj.SpellDamageDict[spell.Name]
                          ? (breakdownObj.SpellDamageDict[spell.Name] /
                              breakdownObj.TotalDamageDone) *
                            100
                          : '0'
                      }
                      min='0'
                      max='100'
                    ></meter>{' '}
                    {breakdownObj.SpellDamageDict[spell.Name]
                      ? formatPercentage(
                          breakdownObj.SpellDamageDict[spell.Name] /
                            breakdownObj.TotalDamageDone
                        )
                      : 0}
                    %
                  </TableCell>
                  <TableCell className='number' title={spell.Casts.toString()}>
                    {spell.Casts / breakdownObj.TotalIterationAmount < 2
                      ? Math.round(
                          (spell.Casts / breakdownObj.TotalIterationAmount) * 10
                        ) / 10
                      : Math.round(
                          spell.Casts / breakdownObj.TotalIterationAmount
                        )}
                  </TableCell>
                  <TableCell className='number'>
                    {breakdownObj.SpellDamageDict[spell.Name]
                      ? Math.round(
                          breakdownObj.SpellDamageDict[spell.Name] / spell.Casts
                        )
                      : 0}
                  </TableCell>
                  <TableCell className='number'>
                    {formatPercentage(spell.Crits / spell.Casts)}
                  </TableCell>
                  <TableCell className='number'>
                    {formatPercentage(spell.Misses / spell.Casts)}
                  </TableCell>
                  {breakdownObj.SpellDamageDict.Melee && (
                    <>
                      <TableCell className='number'>
                        {formatPercentage(spell.Dodges / spell.Casts)}
                      </TableCell>
                      <TableCell className='number'>
                        {formatPercentage(spell.GlancingBlows / spell.Casts)}
                      </TableCell>
                    </>
                  )}
                  <TableCell className='number'>
                    {breakdownObj.SpellDamageDict[spell.Name]
                      ? Math.round(
                          (breakdownObj.SpellDamageDict[spell.Name] /
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
              <TableCell>{t('Name')}</TableCell>
              <TableCell>{t('% Of Total Gain')}</TableCell>
              <TableCell>{t('Casts')}</TableCell>
              <TableCell>{t('Avg Cast')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakdownObj.Data.filter(
              e =>
                breakdownObj.SpellManaGainDict[e.Name] &&
                breakdownObj.SpellManaGainDict[e.Name] > 0
            ).map(spell => {
              const spellObj = findSpellByName(spell.Name)

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
                    <a
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
                      {t(spell.Name)}
                    </a>
                  </TableCell>
                  <TableCell>
                    <meter
                      value={
                        breakdownObj.SpellManaGainDict[spell.Name]
                          ? (breakdownObj.SpellManaGainDict[spell.Name] /
                              breakdownObj.TotalManaGained) *
                            100
                          : '0'
                      }
                      min='0'
                      max='100'
                    ></meter>{' '}
                    {breakdownObj.SpellManaGainDict[spell.Name]
                      ? formatPercentage(
                          breakdownObj.SpellManaGainDict[spell.Name] /
                            breakdownObj.TotalManaGained
                        )
                      : 0}
                    %
                  </TableCell>
                  <TableCell className='number'>
                    {spell.Casts / breakdownObj.TotalIterationAmount < 2
                      ? Math.round(
                          (spell.Casts / breakdownObj.TotalIterationAmount) * 10
                        ) / 10
                      : Math.round(
                          spell.Casts / breakdownObj.TotalIterationAmount
                        )}
                  </TableCell>
                  <TableCell className='number'>
                    {breakdownObj.SpellManaGainDict[spell.Name]
                      ? Math.round(
                          breakdownObj.SpellManaGainDict[spell.Name] /
                            spell.Casts
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
              <TableCell>{t('Name')}</TableCell>
              <TableCell>{t('Count')}</TableCell>
              <TableCell>{t('Uptime')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakdownObj.Data.filter(e => e.Uptime > 0).map(spell => {
              const spellObj = findSpellByName(spell.Name)

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
                    <a
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
                      {t(spell.Name)}
                    </a>
                  </TableCell>
                  {/*If the aura's count is less than 2 then show 1 decimal place, otherwise just round the value*/}
                  <TableCell className='number'>
                    {spell.Count / breakdownObj.TotalIterationAmount < 2
                      ? Math.round(
                          (spell.Count / breakdownObj.TotalIterationAmount) * 10
                        ) / 10
                      : Math.round(
                          spell.Count / breakdownObj.TotalIterationAmount
                        )}
                  </TableCell>
                  <TableCell>
                    <meter
                      value={
                        (spell.Uptime /
                          breakdownObj.TotalSimulationFightLength) *
                        100
                      }
                      min='0'
                      max='100'
                    ></meter>{' '}
                    {formatPercentage(
                      spell.Uptime / breakdownObj.TotalSimulationFightLength
                    )}
                    %
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Grid>
    </>
  )
}
