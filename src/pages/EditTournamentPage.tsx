import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  TournamentForm,
  type TournamentFormData,
} from '@/components/tournament/TournamentForm'
import { AdminGuard } from '@/components/auth/AdminGuard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import { ROUTES } from '@/lib/constants'
import { getTournamentById, updateTournament } from '@/lib/api/tournaments'
import { logAdminAction } from '@/lib/api/admin'
import type { Tournament } from '@/lib/api/tournaments'
import toast from 'react-hot-toast'

export function EditTournamentPage() {
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const navigate = useNavigate()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentData()
    }
  }, [tournamentId])

  const fetchTournamentData = async () => {
    try {
      setLoading(true)
      setError(null)

      const tournamentData = await getTournamentById(tournamentId!)

      if (!tournamentData) {
        setError('Tournament not found')
        return
      }

      setTournament(tournamentData)
    } catch (err) {
      console.error('Error fetching tournament data:', err)
      setError('Failed to load tournament data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: TournamentFormData) => {
    if (!tournament || !tournamentId) return

    try {
      // Update the tournament
      await updateTournament(tournamentId, data)

      // Log the admin action
      await logAdminAction(
        'update',
        'tournaments',
        tournamentId,
        {
          name: tournament.name,
          description: tournament.description,
          start_date: tournament.start_date,
          end_date: tournament.end_date,
          registration_deadline: tournament.registration_deadline,
          max_teams: tournament.max_teams,
          status: tournament.status,
          man_of_tournament: tournament.man_of_tournament,
        },
        data as unknown as Record<string, unknown>
      )

      toast.success('Tournament updated successfully!')
      navigate(ROUTES.TOURNAMENTS)
    } catch (error) {
      console.error('Error updating tournament:', error)
      toast.error('Failed to update tournament')
    }
  }

  const handleCancel = () => {
    navigate(ROUTES.TOURNAMENTS)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <ErrorState
            title="Error Loading Tournament"
            message={error}
            onRetry={fetchTournamentData}
          />
        </div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <ErrorState
            title="Tournament Not Found"
            message="The requested tournament could not be found."
            onRetry={() => navigate(ROUTES.TOURNAMENTS)}
          />
        </div>
      </div>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              onClick={handleCancel}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tournaments
            </Button>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Edit Tournament
            </h1>
            <p className="text-slate-300 text-lg">
              Update tournament details and settings
            </p>
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-600 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-white mb-2">
                {tournament.name}
              </h3>
              <p className="text-slate-300 text-sm">
                Current Status:{' '}
                <span className="text-blue-400 font-medium">
                  {tournament.status}
                </span>
              </p>
            </div>
          </div>

          {/* Tournament Form */}
          <TournamentForm
            tournament={tournament}
            isEditMode={true}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={false}
          />
        </div>
      </div>
    </AdminGuard>
  )
}
