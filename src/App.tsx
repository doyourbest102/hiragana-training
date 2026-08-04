import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LearningProvider } from './store/LearningContext'
import { HomePage } from './pages/HomePage'
import { StudyPage } from './pages/StudyPage'
import { ProgressPage } from './pages/ProgressPage'
import { GuidePage } from './pages/GuidePage'

export default function App() {
  return (
    <LearningProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LearningProvider>
  )
}
