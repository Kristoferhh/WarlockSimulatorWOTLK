import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import '../node_modules/@fortawesome/fontawesome-free/js/all'
import App from './App'
import './css/index.css'
import './i18n/config'
import { Store } from './redux/Store'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </React.StrictMode>
)
