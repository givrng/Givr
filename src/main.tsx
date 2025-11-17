import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter} from 'react-router-dom'
import { IndexPage } from '.'


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <IndexPage/>
     </BrowserRouter>
  </StrictMode>,
)
