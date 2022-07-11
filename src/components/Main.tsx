import { Grid, Link, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import packageJson from '../../package.json'
import { RootState } from '../redux/Store'
import {
  setGemSelectionTable,
  setGlyphSelectionTableVisibility,
} from '../redux/UiSlice'
import { InitialGemSelectionTableValue } from '../Types'
import AuraSelection from './AuraSelection'
import BreakdownTables from './BreakdownTables'
import CombatLog from './CombatLog'
import DpsHistogram from './DpsHistogram'
import EquippedItemsDisplay from './EquippedItemsDisplay'
import GemSelection from './GemSelection'
import GlyphSelection from './GlyphSelection'
import GlyphTable from './GlyphTable'
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
  const uiState = useSelector((state: RootState) => state.ui)

  return (
    <Grid
      id='main'
      onClick={() => {
        dispatch(setGemSelectionTable(InitialGemSelectionTableValue))
        dispatch(setGlyphSelectionTableVisibility(false))
      }}
    >
      <Grid id='header'>
        <LanguageSelection />
        <Typography style={{ marginRight: 'auto' }}>
          This sim is still in beta so results might not be 100% accurate.
          Please report bugs by creating a GitHub issue{' '}
          <Link
            target='_blank'
            rel='noreferrer'
            href='https://github.com/Kristoferhh/WarlockSimulatorWOTLK/issues/new'
            underline='always'
            style={{ textDecorationColor: 'white' }}
          >
            here
          </Link>
          .
        </Typography>
        <Typography id='sim-version-number'>v{packageJson.version}</Typography>
      </Grid>
      <Grid container id='container-1'>
        {uiState.StatWeights.Visible && (
          <Grid item style={{ width: '200px' }}>
            <StatWeights />
          </Grid>
        )}
        <Grid item xs>
          <AuraSelection />
          <RotationSelection />
          <GlyphSelection />
          <GlyphTable />
        </Grid>
        <Grid item xs={3}>
          <SettingsDisplay />
        </Grid>
        <Grid item style={{ width: '618px' }}>
          <TalentTrees />
        </Grid>
        {uiState.CombatLogBreakdown.Data.length > 0 && (
          <Grid item xs={12}>
            <BreakdownTables />
          </Grid>
        )}
      </Grid>
      <Grid container id='container-2'>
        <EquippedItemsDisplay />
        <CombatLog />
        <DpsHistogram />
        <ImportExport />
        <GemSelection />
        <ProfilesAndSources />
        <ItemSelection />
      </Grid>
    </Grid>
  )
}
