import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import App from './App.jsx'
import {createTheme, ThemeProvider} from "@mui/material";
import StyledEngineProvider from '@mui/material/StyledEngineProvider';

const darkTheme = createTheme({
    palette: {
        mode: "dark"
    }
})



createRoot(document.getElementById('root')).render(
  <StrictMode>
      <StyledEngineProvider injectFirst>
          <App />
      </StyledEngineProvider>
  </StrictMode>,
)
