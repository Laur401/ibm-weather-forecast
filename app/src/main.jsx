import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import StyledEngineProvider from '@mui/material/StyledEngineProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <StyledEngineProvider injectFirst>
          <App />
      </StyledEngineProvider>
  </StrictMode>,
)
