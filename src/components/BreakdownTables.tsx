import { nanoid } from "nanoid";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux"
import { getBaseWowheadUrl } from "../Common";
import { AuraGroups } from "../data/AuraGroups";
import { Auras } from "../data/Auras";
import { Gems } from "../data/Gems";
import { Items } from "../data/Items";
import { Spells } from "../data/Spells";
import i18n from "../i18n/config";
import { RootState } from "../redux/Store"

function formatPercentage(num: number) {
  return (Math.round(num * 10000) / 100).toFixed(2);
}

function findSpellByName(name: string): { iconName: string, id: number, wowheadType: 'spell' | 'item' } | undefined {
  const spellObj = Spells.find(e => e.Name === name);
  if (spellObj) {
    return { iconName: spellObj.IconName, id: spellObj.Id, wowheadType: 'spell' }
  }

  const auraObj = Auras.find(e => e.Name === name);
  if (auraObj) {
    return { iconName: auraObj.IconName, id: auraObj.Id, wowheadType: AuraGroups.find(e => e.Heading === auraObj.Group)?.Type || 'spell' }
  }

  const itemObj = Items.find(e => e.Name === name);
  if (itemObj) {
    return { iconName: itemObj.IconName, id: itemObj.Id, wowheadType: 'item' }
  }

  const gemObj = Gems.find(e => e.Name === name);
  if (gemObj) {
    return { iconName: gemObj.IconName, id: gemObj.Id, wowheadType: 'item' }
  }
}

export default function BreakdownTables() {
  const breakdownObj = useSelector((state: RootState) => state.ui.CombatLogBreakdown);
  const { t } = useTranslation();

  return (
    <div id='breakdown-tables-container' style={{ display: breakdownObj.Data.length === 0 ? 'none' : '' }}>
      <section className="breakdown-section" id="damage-breakdown-section" style={{ display: 'inline-block' }}>
        <table className="breakdown-table tablesorter" id="damage-breakdown-table" data-sortlist='[[1,1]]'>
          <thead>
            <tr>
              <th>{t('Name')}</th>
              <th>{t('Damage')}</th>
              <th>{t('Casts')}</th>
              <th>{t('Avg Cast')}</th>
              <th>{t('Crit %')}</th>
              <th>{t('Miss %')}</th>
              <th style={{ display: breakdownObj.SpellDamageDict.Melee ? '' : 'none' }}>{t('Dodge %')}</th>
              <th style={{ display: breakdownObj.SpellDamageDict.Melee ? '' : 'none' }}>{t('Glancing %')}</th>
              <th>{t('Dps')}</th>
            </tr>
          </thead>
          <tbody>
            {
              breakdownObj.Data
                .filter(e => (breakdownObj.SpellDamageDict[e.Name] && breakdownObj.SpellDamageDict[e.Name] > 0))
                .map(spell => {
                  const spellObj = findSpellByName(spell.Name);

                  return (
                    <tr key={nanoid()} className='spell-damage-information'>
                      <td>
                        {
                          spellObj?.iconName && spellObj.iconName.length > 0 &&
                          <img
                            className='breakdown-table-spell-icon'
                            src={`${process.env.PUBLIC_URL}/img/${spellObj?.iconName}.jpg`}
                          />
                        }
                        <a
                          className='breakdown-table-spell-name'
                          target='_blank'
                          rel='noreferrer'
                          href={spellObj && spellObj.id !== 0 ?
                            `${getBaseWowheadUrl(i18n.language)}/${spellObj.wowheadType}=${spellObj.id}` : ''}
                        >{t(spell.Name)}</a>
                      </td>
                      <td>
                        <meter
                          value={breakdownObj.SpellDamageDict[spell.Name] ?
                            (breakdownObj.SpellDamageDict[spell.Name] / breakdownObj.TotalDamageDone) * 100 : '0'}
                          min='0'
                          max='100'
                        ></meter> {breakdownObj.SpellDamageDict[spell.Name] ?
                          formatPercentage(breakdownObj.SpellDamageDict[spell.Name] / breakdownObj.TotalDamageDone) : 0}%
                      </td>
                      <td className='number' title={spell.Casts.toString()}>
                        {
                          spell.Casts / breakdownObj.TotalIterationAmount < 2 ?
                            Math.round((spell.Casts / breakdownObj.TotalIterationAmount) * 10) / 10 :
                            Math.round(spell.Casts / breakdownObj.TotalIterationAmount)
                        }
                      </td>
                      <td className='number'>
                        {
                          breakdownObj.SpellDamageDict[spell.Name] ?
                            Math.round(breakdownObj.SpellDamageDict[spell.Name] / spell.Casts) : 0
                        }
                      </td>
                      <td className='number'>{formatPercentage(spell.Crits / spell.Casts)}</td>
                      <td className='number'>{formatPercentage(spell.Misses / spell.Casts)}</td>
                      {
                        breakdownObj.SpellDamageDict.Melee &&
                        <>
                          <td className='number'>{formatPercentage(spell.Dodges / spell.Casts)}</td>
                          <td className='number'>{formatPercentage(spell.GlancingBlows / spell.Casts)}</td>
                        </>
                      }
                      <td className='number'>
                        {
                          breakdownObj.SpellDamageDict[spell.Name] ?
                            Math.round((breakdownObj.SpellDamageDict[spell.Name] / breakdownObj.TotalSimulationFightLength) * 100) / 100 : 0
                        }
                      </td>
                    </tr>
                  )
                })
            }
          </tbody>
        </table>
      </section>
      <section className="breakdown-section" id="mana-gain-breakdown-section" style={{ display: 'inline-block' }}>
        <table className="breakdown-table tablesorter" id="mana-gain-breakdown-table" data-sortlist='[[1,1]]'>
          <thead>
            <tr>
              <th>{t('Name')}</th>
              <th>{t('% Of Total Gain')}</th>
              <th>{t('Casts')}</th>
              <th>{t('Avg Cast')}</th>
            </tr>
          </thead>
          <tbody>
            {
              breakdownObj.Data
                .filter(e => breakdownObj.SpellManaGainDict[e.Name] && breakdownObj.SpellManaGainDict[e.Name] > 0)
                .map(spell => {
                  const spellObj = findSpellByName(spell.Name);

                  return (
                    <tr key={nanoid()} className='spell-damage-information'>
                      <td>
                        {
                          spellObj?.iconName && spellObj.iconName.length > 0 &&
                          <img
                            className='breakdown-table-spell-icon'
                            src={`${process.env.PUBLIC_URL}/img/${spellObj?.iconName}.jpg`}
                          />
                        }
                        <a
                          className='breakdown-table-spell-name'
                          target='_blank'
                          rel='noreferrer'
                          href={spellObj && spellObj.id !== 0 ?
                            `${getBaseWowheadUrl(i18n.language)}/${spellObj.wowheadType}=${spellObj.id}` : ''}
                        >{t(spell.Name)}</a>
                      </td>
                      <td>
                        <meter
                          value={breakdownObj.SpellManaGainDict[spell.Name] ?
                            (breakdownObj.SpellManaGainDict[spell.Name] / breakdownObj.TotalManaGained) * 100 : '0'}
                          min='0'
                          max='100'
                        ></meter> {breakdownObj.SpellManaGainDict[spell.Name] ?
                          formatPercentage(breakdownObj.SpellManaGainDict[spell.Name] / breakdownObj.TotalManaGained) : 0}%
                      </td>
                      <td className='number'>
                        {
                          (spell.Casts / breakdownObj.TotalIterationAmount) < 2 ?
                            Math.round((spell.Casts / breakdownObj.TotalIterationAmount) * 10) / 10 :
                            Math.round(spell.Casts / breakdownObj.TotalIterationAmount)
                        }
                      </td>
                      <td className='number'>
                        {
                          breakdownObj.SpellManaGainDict[spell.Name] ?
                            Math.round(breakdownObj.SpellManaGainDict[spell.Name] / spell.Casts) : 0
                        }
                      </td>
                    </tr>
                  )
                })
            }
          </tbody>
        </table>
      </section>
      <section className="breakdown-section" id="aura-breakdown-section" style={{ display: 'inline-block' }}>
        <table className="breakdown-table tablesorter" id="aura-breakdown-table" data-sortlist='[[2,1]]'>
          <thead>
            <tr>
              <th>{t('Name')}</th>
              <th>{t('Count')}</th>
              <th>{t('Uptime')}</th>
            </tr>
          </thead>
          <tbody>
            {
              breakdownObj.Data
                .filter(e => e.Uptime > 0)
                .map(spell => {
                  const spellObj = findSpellByName(spell.Name);

                  return (
                    <tr key={nanoid()} className='spell-damage-information'>
                      <td>
                        {
                          spellObj?.iconName && spellObj.iconName.length > 0 &&
                          <img
                            className='breakdown-table-spell-icon'
                            src={`${process.env.PUBLIC_URL}/img/${spellObj?.iconName}.jpg`}
                          />
                        }
                        <a
                          className='breakdown-table-spell-name'
                          target='_blank'
                          rel='noreferrer'
                          href={spellObj && spellObj.id !== 0 ?
                            `${getBaseWowheadUrl(i18n.language)}/${spellObj.wowheadType}=${spellObj.id}` : ''}
                        >{t(spell.Name)}</a>
                      </td>
                      {/*If the aura's count is less than 2 then show 1 decimal place, otherwise just round the value*/}
                      <td className='number'>
                        {
                          (spell.Count / breakdownObj.TotalIterationAmount) < 2 ?
                            Math.round((spell.Count / breakdownObj.TotalIterationAmount) * 10) / 10 :
                            Math.round(spell.Count / breakdownObj.TotalIterationAmount)
                        }
                      </td>
                      <td>
                        <meter
                          value={(spell.Uptime / breakdownObj.TotalSimulationFightLength) * 100}
                          min='0'
                          max='100'
                        ></meter> {formatPercentage(spell.Uptime / breakdownObj.TotalSimulationFightLength)}%
                      </td>
                    </tr>
                  )
                })
            }
          </tbody>
        </table>
      </section>
    </div>
  )
}