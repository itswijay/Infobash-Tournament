import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AdminGuard } from '@/components/auth/AdminGuard'
import { MatchForm } from '@/components/match/MatchForm'
import { getAllTournaments, type Tournament } from '@/lib/api/tournaments'
import {
  createMatch,
  type CreateMatchData,
  type UpdateMatchData,
} from '@/lib/api/matches'
import { logAdminAction } from '@/lib/api/admin'
import { ROUTES } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export function CreateMatchPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      const tournamentsData = await getAllTournaments()
      setTournaments(tournamentsData)
    } catch (error) {
      console.error('Error fetching tournaments:', error)
      toast.error('Failed to load tournaments')
    }
  }

  const handleSubmit = async (data: CreateMatchData | UpdateMatchData) => {
    try {
      setLoading(true)

      // Create the match
      const newMatch = await createMatch(data as CreateMatchData)

      // Log admin action
      await logAdminAction(
        'create_match',
        `Created match ${newMatch.id} between teams ${data.team1_id} and ${data.team2_id}`
      )

      toast.success('Match created successfully!')

      // Navigate back to matches page
      navigate(ROUTES.MATCHES)
    } catch (error) {
      console.error('Error creating match:', error)
      toast.error('Failed to create match')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(ROUTES.MATCHES)
  }

  return (
    <AdminGuard>
      <div className="container py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Matches
            </Button>
          </div>

          {/* Page Title */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Create New Match
            </h1>
            <div className="mt-2 h-1 w-20 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)]">
              Schedule a new cricket match between two teams
            </p>
          </div>

          {/* Match Form */}
          <MatchForm
            tournaments={tournaments}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </AdminGuard>
  )
}
