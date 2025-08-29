import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { ProfileGuard } from '@/components/auth/ProfileGuard'
import { HomePage } from '@/pages/HomePage'
import { TournamentsPage } from '@/pages/TournamentsPage'
import { CreateTournamentPage } from '@/pages/CreateTournamentPage'
import { EditTournamentPage } from '@/pages/EditTournamentPage'
import { TeamsPage } from '@/pages/TeamsPage'
import { MatchesPage } from '@/pages/MatchesPage'
import { CreateMatchPage } from '@/pages/CreateMatchPage'
import EditMatchPage from '@/pages/EditMatchPage'
import { EditMatchResultPage } from '@/pages/EditMatchResultPage'
import { RegisterTeamPage } from '@/pages/RegisterTeamPage'
import { InstructionsPage } from '@/pages/InstructionsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { ProfileCompletionPage } from '@/pages/ProfileCompletionPage'
import TournamentResultsPage from '@/pages/TournamentResultsPage'
import { ROUTES } from '@/lib/constants'

function RootLayout() {
  return (
    <ErrorBoundary>
      <Layout>
        <ProfileGuard>
          <Outlet />
        </ProfileGuard>
      </Layout>
    </ErrorBoundary>
  )
}

// Special layout for profile completion page (no ProfileGuard)
function ProfileCompletionLayout() {
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
        path: ROUTES.CREATE_TOURNAMENT,
        element: <CreateTournamentPage />,
      },
      {
        path: '/tournaments/:tournamentId/edit',
        element: <EditTournamentPage />,
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
        path: ROUTES.CREATE_MATCH,
        element: <CreateMatchPage />,
      },
      {
        path: '/matches/:matchId/edit',
        element: <EditMatchPage />,
      },
      {
        path: '/matches/:matchId/edit-result',
        element: <EditMatchResultPage />,
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
      {
        path: ROUTES.TOURNAMENT_RESULTS,
        element: <TournamentResultsPage />,
      },
    ],
  },
  {
    path: ROUTES.PROFILE_COMPLETION,
    element: <ProfileCompletionLayout />,
    children: [
      {
        index: true,
        element: <ProfileCompletionPage />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
