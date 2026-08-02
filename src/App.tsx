import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LearningProvider } from './store/LearningContext'
import { HomePage } from './pages/HomePage'
import { StudyPage } from './pages/StudyPage'
import { TestPage } from './pages/TestPage'
import { TestResultPage } from './pages/TestResultPage'
import { ProgressPage } from './pages/ProgressPage'
import { WeakPage } from './pages/WeakPage'

export default function App() {
  return (
    <LearningProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/test/result" element={<TestResultPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/weak" element={<WeakPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LearningProvider>
  )
}
