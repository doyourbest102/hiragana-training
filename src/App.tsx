import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LearningProvider } from './store/LearningContext'
import { HomePage } from './pages/HomePage'
import { StudyPage } from './pages/StudyPage'
import { ProgressPage } from './pages/ProgressPage'
import { GuidePage } from './pages/GuidePage'
import { ScriptSelectPage } from './pages/ScriptSelectPage'

export default function App() {
  return (
    <LearningProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/study" element={<ScriptSelectPage />} />
          <Route path="/study/:script" element={<StudyPage />} />
          <Route path="/study/:script/:characterId" element={<StudyPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LearningProvider>
  )
}
