import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LearningProvider } from './store/LearningContext'
import { HomePage } from './pages/HomePage'
import { StudyPage } from './pages/StudyPage'
import { ProgressPage } from './pages/ProgressPage'
import { GuidePage } from './pages/GuidePage'
import { CharacterListPage } from './pages/CharacterListPage'
import { ScriptSelectPage } from './pages/ScriptSelectPage'
import { UsefulInfoPage } from './pages/UsefulInfoPage'
import { DakutenPage } from './pages/DakutenPage'

export default function App() {
  return (
    <LearningProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/study" element={<ScriptSelectPage />} />
          <Route path="/study/:script" element={<CharacterListPage />} />
          <Route
            path="/study/:script/single/:characterId"
            element={<StudyPage single />}
          />
          <Route path="/study/:script/:characterId" element={<StudyPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/useful-info" element={<UsefulInfoPage />} />
          <Route path="/useful-info/dakuten" element={<DakutenPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LearningProvider>
  )
}
