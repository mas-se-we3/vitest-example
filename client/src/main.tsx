import '@mantine/core/styles.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProviders } from './AppProviders.tsx'
import { CompletedWindow } from './components/windows/CompletedWindow.tsx'
import { PendingWindow } from './components/windows/PendingWindow.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PendingWindow />} />
        <Route path="completed" element={<CompletedWindow />} />
      </Routes>
    </BrowserRouter>
  </AppProviders>,
)
