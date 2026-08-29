import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/be-vietnam-pro/latin-400.css'
import '@fontsource/be-vietnam-pro/vietnamese-400.css'
import '@fontsource/be-vietnam-pro/latin-700.css'
import '@fontsource/be-vietnam-pro/vietnamese-700.css'
import '@fontsource/be-vietnam-pro/latin-800.css'
import '@fontsource/be-vietnam-pro/vietnamese-800.css'
import '@fontsource/lora/latin-400.css'
import '@fontsource/lora/vietnamese-400.css'
import '@fontsource/lora/latin-400-italic.css'
import '@fontsource/lora/vietnamese-400-italic.css'
import '@fontsource/lora/latin-600-italic.css'
import '@fontsource/lora/vietnamese-600-italic.css'
import '@fontsource/lora/latin-700-italic.css'
import '@fontsource/lora/vietnamese-700-italic.css'
import LoveLetterPage from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoveLetterPage />
  </StrictMode>,
)
