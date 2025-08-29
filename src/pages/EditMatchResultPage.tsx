import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AdminGuard } from '@/components/auth/AdminGuard'
import { MatchResultForm } from '@/components/match/MatchResultForm'
import { getMatchById, updateMatchResults, type Match } from '@/lib/api/matches'
import { getAllTeams, type Team } from '@/lib/api/teams'
import { logAdminAction } from '@/lib/api/admin'
import { ROUTES } from '@/lib/constants'
import { PageLoading } from '@/components/shared/LoadingSpinner'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export function EditMatchResultPage() {
  const { matchId } = useParams<{ matchId: string }>()
  const [match, setMatch] = useState<Match | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (matchId) {
      fetchData()
    }
  }, [matchId])

  const fetchData = async () => {
    try {
      setInitialLoading(true)
      const [matchData, teamsData] = await Promise.all([
        getMatchById(matchId!),
        getAllTeams(),
      ])

      if (matchData) {
        setMatch(matchData)
      } else {
        toast.error('Match not found')
        navigate(ROUTES.MATCHES)
        return
      }

      setTeams(teamsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load match data')
      navigate(ROUTES.MATCHES)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (data: {
    team1_score: string
    team2_score: string
    winner_id: string | null
    match_details: Record<string, unknown> | null
  }) => {
    if (!matchId) return

    try {
      setLoading(true)

      // Update the match results
      await updateMatchResults(matchId, data)

      // Log admin action
      await logAdminAction(
        'update_match_results',
        `Updated results for match ${matchId}: ${data.team1_score} vs ${data.team2_score}`
      )

      toast.success('Match results updated successfully!')

      // Navigate back to matches page
      navigate(ROUTES.MATCHES)
    } catch (error) {
      console.error('Error updating match results:', error)
      toast.error('Failed to update match results')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(ROUTES.MATCHES)
  }

  if (initialLoading) {
    return (
      <div className="container py-8">
        <PageLoading message="Loading match data..." />
      </div>
    )
  }

  if (!match) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="text-red-400 text-lg mb-2">Match not found</div>
          <Button onClick={handleCancel} variant="outline">
            Back to Matches
          </Button>
        </div>
      </div>
    )
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
              Edit Match Results
            </h1>
            <div className="mt-2 h-1 w-20 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)]">
              Update match scores, winner, and details
            </p>
          </div>

          {/* Match Result Form */}
          <MatchResultForm
            match={match}
            teams={teams}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </AdminGuard>
  )
}
