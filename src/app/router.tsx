import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { BootGate } from '../components/system/BootGate'
import { RequireAdmin } from '../components/system/RequireAdmin'
import { RequireAuth } from '../components/system/RequireAuth'
import { AdminPage } from '../pages/AdminPage'
import { ExperimentsPage } from '../pages/ExperimentsPage'
import { ExperimentDetailsPage } from '../pages/ExperimentDetailsPage'
import { HomePage } from '../pages/HomePage'
import { LectureDetailsPage } from '../pages/LectureDetailsPage'
import { LecturesPage } from '../pages/LecturesPage'
import { LoginPage } from '../pages/LoginPage'
import { ProfilePage } from '../pages/ProfilePage'
import { QuizHubPage } from '../pages/QuizHubPage'
import { QuizTakePage } from '../pages/QuizTakePage'
import { SignupPage } from '../pages/SignupPage'

export const router = createBrowserRouter([
  {
    element: (
      <BootGate>
        <AppLayout />
      </BootGate>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: '/home', element: <HomePage /> },
          { path: '/lectures', element: <LecturesPage /> },
          { path: '/lectures/:lectureId', element: <LectureDetailsPage /> },
          { path: '/quiz', element: <QuizHubPage /> },
          { path: '/quiz/:quizId', element: <QuizTakePage /> },
          { path: '/experiments', element: <ExperimentsPage /> },
          { path: '/experiments/:experimentId', element: <ExperimentDetailsPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
      {
        element: <RequireAdmin />,
        children: [{ path: '/admin', element: <AdminPage /> }],
      },
      { path: '*', element: <Navigate to="/home" replace /> },
    ],
  },
])

