import { StyledEngineProvider } from '@mui/material'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import './i18n/config'
import { Store } from './redux/Store'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <Provider store={Store}>
        <App />
      </Provider>
    </StyledEngineProvider>
  </React.StrictMode>
)
