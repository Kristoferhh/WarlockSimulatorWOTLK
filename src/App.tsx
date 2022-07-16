import { Grid } from '@mui/material'
import { useDispatch } from 'react-redux'
import Main from './components/Main'
import Session from './components/Session'
import Sidebar from './components/Sidebar'
import './css/App.css'
import { setGemSelectionTable, setGlyphSelectionTableVisibility } from './redux/UiSlice'
import { InitialGemSelectionTableValue } from './Types'

const linearGradient =
  'linear-gradient(rgba(23, 28, 38, 0.9), rgba(23, 28, 38, 0.9))'
const backgroundImageFileNames = [
  '1230602.jpg',
  '1059909.jpg',
  '23897234.jpg',
  '80134.jpg',
]
const randomImageFileName =
  backgroundImageFileNames[
    Math.floor(Math.random() * backgroundImageFileNames.length)
  ]
const imagePath = `${process.env.PUBLIC_URL}/img/${randomImageFileName}`

export default function App() {
  const dispatch = useDispatch()

  return (
    <Grid
      container
      className='App'
      style={{
        backgroundImage: `${linearGradient}, url(${imagePath})`,
      }}
      onClick={() => {
        dispatch(setGemSelectionTable(InitialGemSelectionTableValue))
        dispatch(setGlyphSelectionTableVisibility(false))
      }}
    >
      <Sidebar />
      <Main />
      <Session />
    </Grid>
  )
}
