import { useDispatch } from 'react-redux'
import packageJson from '../../package.json'
import { setGemSelectionTable } from '../redux/UiSlice'
import { InitialGemSelectionTableValue } from '../Types'
import AuraSelection from './AuraSelection'
import BreakdownTables from './BreakdownTables'
import CombatLog from './CombatLog'
import DpsHistogram from './DpsHistogram'
import EquippedItemsDisplay from './EquippedItemsDisplay'
import GemSelection from './GemSelection'
import ImportExport from './ImportExport'
import ItemSelection from './ItemSelection'
import LanguageSelection from './LanguageSelection'
import ProfilesAndSources from './ProfilesAndSources'
import RotationSelection from './RotationSelection'
import SettingsDisplay from './SettingsDisplay'
import StatWeights from './StatWeights'
import TalentTrees from './TalentTrees'

export default function Main() {
  const dispatch = useDispatch()

  return (
    <div
      id='main'
      onClick={() =>
        dispatch(setGemSelectionTable(InitialGemSelectionTableValue))
      }
    >
      <div id='header'>
        <LanguageSelection />
        <p style={{ marginRight: 'auto' }}>
          Please report bugs in the #sim-bug-report channel on the Warlock
          Classic discord.{' '}
          <a
            target='_blank'
            rel='noreferrer'
            href='https://discord.gg/5MX6j7nk7s'
          >
            Click here to join
          </a>
          .
        </p>
        <p id='sim-version-number'>v{packageJson.version}</p>
      </div>
      <div id='container-1'>
        <AuraSelection />
        <RotationSelection />
        <SettingsDisplay />
        <TalentTrees />
        <StatWeights />
        <BreakdownTables />
      </div>
      <div id='container-2'>
        <EquippedItemsDisplay />
        <CombatLog />
        <DpsHistogram />
        <ImportExport />
        <GemSelection />
        <ProfilesAndSources />
        <ItemSelection />
      </div>
    </div>
  )
}
