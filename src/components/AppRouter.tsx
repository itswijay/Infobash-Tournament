import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { HomePage } from '@/pages/HomePage'
import { TournamentsPage } from '@/pages/TournamentsPage'
import { TeamsPage } from '@/pages/TeamsPage'
import { MatchesPage } from '@/pages/MatchesPage'
import { RegisterTeamPage } from '@/pages/RegisterTeamPage'
import { InstructionsPage } from '@/pages/InstructionsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { ROUTES } from '@/lib/constants'

function RootLayout() {
  return (
    <ErrorBoundary>
      <Layout>
        <Outlet />
      </Layout>
    </ErrorBoundary>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: ROUTES.TOURNAMENTS,
        element: <TournamentsPage />,
      },
      {
        path: ROUTES.TEAMS,
        element: <TeamsPage />,
      },
      {
        path: ROUTES.MATCHES,
        element: <MatchesPage />,
      },
      {
        path: ROUTES.REGISTER_TEAM,
        element: <RegisterTeamPage />,
      },
      {
        path: ROUTES.INSTRUCTIONS,
        element: <InstructionsPage />,
      },
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
