import {
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { GetBaseWowheadUrl } from '../Common'
import { AuraGroups } from '../data/AuraGroups'
import { Auras } from '../data/Auras'
import { Gems } from '../data/Gems'
import { Glyphs } from '../data/Glyphs'
import { Items } from '../data/Items'
import { Spells } from '../data/Spells'
import { Talents } from '../data/Talents'
import i18n from '../i18n/config'
import { RootState } from '../redux/Store'
import { TalentStore } from '../Types'

function formatPercentage(num: number) {
  return (Math.round(num * 10000) / 100).toFixed(2)
}

function findSpellByName(
  name: string,
  playerTalents: TalentStore
):
  | {
      IconName: string
      Id: number
      WowheadType: 'spell' | 'item'
      Name: string
    }
  | undefined {
  const spellObj = Spells.find(e => e.Name === name)

  if (spellObj) {
    return {
      IconName: spellObj.IconName,
      Id: spellObj.Id,
      WowheadType: 'spell',
      Name: spellObj.Name,
    }
  }

  const auraObj = Auras.find(e => e.Name === name)

  if (auraObj) {
    return {
      IconName: auraObj.IconName,
      Id: auraObj.Id,
      WowheadType:
        AuraGroups.find(e => e.Heading === auraObj.Group)?.Type || 'spell',
      Name: auraObj.Name,
    }
  }

  const itemObj = Items.find(e => e.Name === name)

  if (itemObj) {
    return {
      IconName: itemObj.IconName,
      Id: itemObj.Id,
      WowheadType: 'item',
      Name: itemObj.Name,
    }
  }

  const gemObj = Gems.find(e => e.Name === name)

  if (gemObj) {
    return {
      IconName: gemObj.IconName,
      Id: gemObj.Id,
      WowheadType: 'item',
      Name: gemObj.Name,
    }
  }

  for (const talentTree of Talents) {
    for (const row of talentTree.Rows) {
      for (const talent of row) {
        if (talent.Name === name) {
          const pointsInTalent = playerTalents[talent.Name] || 0

          return {
            IconName: talent.IconName!,
            Id: talent.RankIds![Math.max(0, pointsInTalent - 1)],
            WowheadType: 'spell',
            Name: talent.Name,
          }
        }
      }
    }
  }

  const glyphObj = Glyphs.find(x => x.Name === name)

  if (glyphObj) {
    return {
      IconName: glyphObj.IconName,
      Id: glyphObj.Id,
      WowheadType: 'spell',
      Name: glyphObj.Name,
    }
  }
}

export default function BreakdownTables() {
  const breakdownObj = useSelector(
    (state: RootState) => state.ui.CombatLogBreakdown
  )
  const talents = useSelector((state: RootState) => state.player.Talents)
  const { t } = useTranslation()

  return (
    <Grid container>
      <Grid
        item
        xs
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
                <Typography noWrap variant='inherit'>
                  {t('Casts')}
                </Typography>
              </TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                <Typography noWrap variant='inherit'>
                  {t('Avg Cast')}
                </Typography>
              </TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                <Typography noWrap variant='inherit'>
                  {t('Crit')}
                </Typography>
              </TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                <Typography noWrap variant='inherit'>
                  {t('Miss')}
                </Typography>
              </TableCell>
              <TableCell
                align='right'
                style={{
                  display: breakdownObj.SpellDamageDict.Melee ? '' : 'none',
                  color: 'white',
                }}
              >
                <Typography noWrap variant='inherit'>
                  {t('Dodge')}
                </Typography>
              </TableCell>
              <TableCell
                align='right'
                style={{
                  display: breakdownObj.SpellDamageDict.Melee ? '' : 'none',
                  color: 'white',
                }}
              >
                <Typography noWrap variant='inherit'>
                  {t('Glancing')}
                </Typography>
              </TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                <Typography noWrap variant='inherit'>
                  {t('Dps')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakdownObj.Data.filter(
              e =>
                breakdownObj.SpellDamageDict[e.name] &&
                breakdownObj.SpellDamageDict[e.name] > 0
            ).map(spell => {
              const spellObj = findSpellByName(spell.name, talents)

              return (
                <TableRow key={nanoid()} className='spell-damage-information'>
                  <TableCell>
                    <Grid container>
                      {spellObj?.IconName && spellObj.IconName.length > 0 && (
                        <img
                          alt={spellObj.Name}
                          className='breakdown-table-spell-icon'
                          src={`${process.env.PUBLIC_URL}/img/${spellObj?.IconName}.jpg`}
                        />
                      )}
                      <Link
                        className='breakdown-table-spell-name'
                        target='_blank'
                        rel='noreferrer'
                        href={
                          spellObj && spellObj.Id !== 0
                            ? `${GetBaseWowheadUrl(i18n.language)}/${
                                spellObj.WowheadType
                              }=${spellObj.Id}`
                            : ''
                        }
                      >
                        <Typography noWrap variant='inherit'>
                          {t(spell.name)}
                        </Typography>
                      </Link>
                    </Grid>
                  </TableCell>
                  <TableCell style={{ color: 'white' }}>
                    <Grid container>
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
                      ></meter>
                      <Typography
                        noWrap
                        variant='inherit'
                        style={{ marginLeft: '5px' }}
                      >
                        {breakdownObj.SpellDamageDict[spell.name]
                          ? formatPercentage(
                              breakdownObj.SpellDamageDict[spell.name] /
                                breakdownObj.TotalDamageDone
                            )
                          : 0}
                        %
                      </Typography>
                    </Grid>
                  </TableCell>
                  <TableCell
                    style={{ color: 'white' }}
                    className='number'
                    title={spell.casts.toString()}
                  >
                    <Typography noWrap variant='inherit'>
                      {spell.casts / breakdownObj.TotalIterationAmount < 2
                        ? Math.round(
                            (spell.casts / breakdownObj.TotalIterationAmount) *
                              10
                          ) / 10
                        : Math.round(
                            spell.casts / breakdownObj.TotalIterationAmount
                          )}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ color: 'white' }} className='number'>
                    <Typography noWrap variant='inherit'>
                      {breakdownObj.SpellDamageDict[spell.name]
                        ? Math.round(
                            breakdownObj.SpellDamageDict[spell.name] /
                              spell.casts
                          )
                        : 0}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ color: 'white' }} className='number'>
                    <Typography noWrap variant='inherit'>
                      {`${formatPercentage(spell.crits / spell.casts)}%`}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ color: 'white' }} className='number'>
                    <Typography noWrap variant='inherit'>{`${formatPercentage(
                      spell.misses / spell.casts
                    )}%`}</Typography>
                  </TableCell>
                  {breakdownObj.SpellDamageDict.Melee && (
                    <>
                      <TableCell style={{ color: 'white' }} className='number'>
                        <Typography
                          noWrap
                          variant='inherit'
                        >{`${formatPercentage(
                          spell.dodges / spell.casts
                        )}%`}</Typography>
                      </TableCell>
                      <TableCell style={{ color: 'white' }} className='number'>
                        <Typography
                          noWrap
                          variant='inherit'
                        >{`${formatPercentage(
                          spell.glancingBlows / spell.casts
                        )}%`}</Typography>
                      </TableCell>
                    </>
                  )}
                  <TableCell style={{ color: 'white' }} className='number'>
                    <Typography noWrap variant='inherit'>
                      {breakdownObj.SpellDamageDict[spell.name]
                        ? Math.round(
                            (breakdownObj.SpellDamageDict[spell.name] /
                              breakdownObj.TotalSimulationFightLength) *
                              100
                          ) / 100
                        : 0}
                    </Typography>
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
        style={{ display: 'inline-block', maxWidth: '550px' }}
      >
        <Table
          className='breakdown-table tablesorter'
          id='mana-gain-breakdown-table'
          data-sortlist='[[1,1]]'
        >
          <TableHead>
            <TableRow>
              <TableCell style={{ color: 'white' }}>
                <Typography noWrap variant='inherit'>
                  {t('Name')}
                </Typography>
              </TableCell>
              <TableCell style={{ color: 'white' }}>
                <Typography noWrap variant='inherit'>
                  {t('% Of Total Gain')}
                </Typography>
              </TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                <Typography noWrap variant='inherit'>
                  {t('Casts')}
                </Typography>
              </TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                <Typography noWrap variant='inherit'>
                  {t('Avg Cast')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakdownObj.Data.filter(
              e =>
                breakdownObj.SpellManaGainDict[e.name] &&
                breakdownObj.SpellManaGainDict[e.name] > 0
            ).map(spell => {
              const spellObj = findSpellByName(spell.name, talents)

              return (
                <TableRow key={nanoid()} className='spell-damage-information'>
                  <TableCell>
                    <Grid container>
                      {spellObj?.IconName && spellObj.IconName.length > 0 && (
                        <img
                          alt={spellObj.Name}
                          className='breakdown-table-spell-icon'
                          src={`${process.env.PUBLIC_URL}/img/${spellObj?.IconName}.jpg`}
                        />
                      )}
                      <Link
                        className='breakdown-table-spell-name'
                        target='_blank'
                        rel='noreferrer'
                        href={
                          spellObj && spellObj.Id !== 0
                            ? `${GetBaseWowheadUrl(i18n.language)}/${
                                spellObj.WowheadType
                              }=${spellObj.Id}`
                            : ''
                        }
                      >
                        <Typography noWrap variant='inherit'>
                          {t(spell.name)}
                        </Typography>
                      </Link>
                    </Grid>
                  </TableCell>
                  <TableCell style={{ color: 'white' }}>
                    <Grid container>
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
                      ></meter>
                      <Typography
                        noWrap
                        variant='inherit'
                        style={{ marginLeft: '5px' }}
                      >
                        {breakdownObj.SpellManaGainDict[spell.name]
                          ? formatPercentage(
                              breakdownObj.SpellManaGainDict[spell.name] /
                                breakdownObj.TotalManaGained
                            )
                          : 0}
                        %
                      </Typography>
                    </Grid>
                  </TableCell>
                  <TableCell style={{ color: 'white' }} className='number'>
                    <Typography noWrap variant='inherit'>
                      {spell.casts / breakdownObj.TotalIterationAmount < 2
                        ? Math.round(
                            (spell.casts / breakdownObj.TotalIterationAmount) *
                              10
                          ) / 10
                        : Math.round(
                            spell.casts / breakdownObj.TotalIterationAmount
                          )}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ color: 'white' }} className='number'>
                    <Typography noWrap variant='inherit'>
                      {breakdownObj.SpellManaGainDict[spell.name]
                        ? Math.round(
                            breakdownObj.SpellManaGainDict[spell.name] /
                              spell.casts
                          )
                        : 0}
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Grid>
      <Grid
        item
        xs={3}
        className='breakdown-section'
        id='aura-breakdown-section'
        style={{ display: 'inline-block', maxWidth: '500px' }}
      >
        <Table
          className='breakdown-table tablesorter'
          id='aura-breakdown-table'
          data-sortlist='[[2,1]]'
        >
          <TableHead>
            <TableRow>
              <TableCell style={{ color: 'white' }}>
                <Typography noWrap variant='inherit'>
                  {t('Name')}
                </Typography>
              </TableCell>
              <TableCell align='right' style={{ color: 'white' }}>
                <Typography noWrap variant='inherit'>
                  {t('Count')}
                </Typography>
              </TableCell>
              <TableCell style={{ color: 'white' }}>
                <Typography noWrap variant='inherit'>
                  {t('Uptime')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakdownObj.Data.filter(e => e.uptime_in_seconds > 0).map(
              spell => {
                const spellObj = findSpellByName(spell.name, talents)

                return (
                  <TableRow key={nanoid()} className='spell-damage-information'>
                    <TableCell>
                      <Grid container>
                        {spellObj?.IconName && spellObj.IconName.length > 0 && (
                          <img
                            alt={spellObj.Name}
                            className='breakdown-table-spell-icon'
                            src={`${process.env.PUBLIC_URL}/img/${spellObj?.IconName}.jpg`}
                          />
                        )}
                        <Link
                          className='breakdown-table-spell-name'
                          target='_blank'
                          rel='noreferrer'
                          href={
                            spellObj && spellObj.Id !== 0
                              ? `${GetBaseWowheadUrl(i18n.language)}/${
                                  spellObj.WowheadType
                                }=${spellObj.Id}`
                              : ''
                          }
                        >
                          <Typography noWrap variant='inherit'>
                            {t(spell.name)}
                          </Typography>
                        </Link>
                      </Grid>
                    </TableCell>
                    {/*If the aura's count is less than 2 then show 1 decimal place, otherwise just round the value*/}
                    <TableCell style={{ color: 'white' }} className='number'>
                      <Typography noWrap variant='inherit'>
                        {spell.count / breakdownObj.TotalIterationAmount < 2
                          ? Math.round(
                              (spell.count /
                                breakdownObj.TotalIterationAmount) *
                                10
                            ) / 10
                          : Math.round(
                              spell.count / breakdownObj.TotalIterationAmount
                            )}
                      </Typography>
                    </TableCell>
                    <TableCell style={{ color: 'white' }}>
                      <Grid container>
                        <meter
                          value={
                            (spell.uptime_in_seconds /
                              breakdownObj.TotalSimulationFightLength) *
                            100
                          }
                          min='0'
                          max='100'
                        ></meter>
                        <Typography
                          noWrap
                          variant='inherit'
                          style={{ marginLeft: '5px' }}
                        >
                          {formatPercentage(
                            spell.uptime_in_seconds /
                              breakdownObj.TotalSimulationFightLength
                          )}
                          %
                        </Typography>
                      </Grid>
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
