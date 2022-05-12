import { Grid, Typography } from '@mui/material'
import { nanoid } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/Store'

export default function CombatLog() {
  const uiState = useSelector((state: RootState) => state.ui)

  return (
    <Grid
      id='combat-log'
      style={{ display: uiState.CombatLog.Visible ? '' : 'none' }}
    >
      {uiState.CombatLog.Data.map(entry => (
        <Typography key={nanoid()}>{entry}</Typography>
      ))}
    </Grid>
  )
}
