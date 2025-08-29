import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageLoading } from '@/components/shared/LoadingSpinner'
import { AdminGuard } from '@/components/auth/AdminGuard'
import { useAuth } from '@/hooks/useAuth'
import { getAllMatches, deleteMatch, type Match } from '@/lib/api/matches'
import { getAllTournaments, type Tournament } from '@/lib/api/tournaments'
import { getAllTeams, type Team } from '@/lib/api/teams'
import { logAdminAction } from '@/lib/api/admin'
import { ROUTES } from '@/lib/constants'
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
} from 'lucide-react'
import toast from 'react-hot-toast'

export function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [matchesData, tournamentsData, teamsData] = await Promise.all([
        getAllMatches(),
        getAllTournaments(),
        getAllTeams(),
      ])
      setMatches(matchesData)
      setTournaments(tournamentsData)
      setTeams(teamsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      // Only set error for critical failures, not for empty data
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        setError('Failed to load data. Please try again later.')
      } else {
        // For other errors (like empty tables), just log and continue
        console.warn('Some data may be empty:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMatch = () => {
    navigate(ROUTES.CREATE_MATCH)
  }

  const handleEditMatch = (matchId: string) => {
    navigate(`${ROUTES.MATCHES}/${matchId}/edit`)
  }

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return

    try {
      setDeletingId(matchId)
      await deleteMatch(matchId)

      // Log admin action
      await logAdminAction('delete_match', `Deleted match ${matchId}`)

      // Update local state
      setMatches((prev) => prev.filter((match) => match.id !== matchId))

      toast.success('Match deleted successfully')
    } catch {
      console.error('Error deleting match')
      toast.error('Failed to delete match')
    } finally {
      setDeletingId(null)
    }
  }

  const getTournamentName = (tournamentId: string) => {
    const tournament = tournaments.find((t) => t.id === tournamentId)
    return tournament?.name || 'Unknown Tournament'
  }

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId)
    return team?.name || 'Unknown Team'
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'live':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'Scheduled'
      case 'live':
        return 'Live'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return 'Invalid Date'
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return 'Invalid Time'
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Matches
            </h1>
            <div className="mt-2 h-1 w-20 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)]">
              Manage and view all cricket matches
            </p>
          </div>
          <PageLoading message="Loading matches..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Matches
            </h1>
            <div className="mt-2 h-1 w-20 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)]">
              Manage and view all cricket matches
            </p>
          </div>
          <div className="text-center py-12">
            <div className="text-red-400 text-lg mb-2">
              Error loading matches
            </div>
            <div className="text-[var(--text-secondary)]">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AdminGuard>
      <div className="container py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Matches
              </h1>
              <div className="mt-2 h-1 w-20 rounded-full bg-gradient-gold opacity-80" />
              <p className="text-[var(--text-secondary)]">
                Manage and view all cricket matches
              </p>
            </div>

            {/* Admin Create Button */}
            {isAdmin && (
              <Button
                onClick={handleCreateMatch}
                className="bg-gradient-to-r from-[var(--color-accent-1)] to-[var(--color-accent-2)] hover:from-[var(--color-accent-1)]/90 hover:to-[var(--color-accent-2)]/90 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Match
              </Button>
            )}
          </div>

          {/* Matches List */}
          <div className="space-y-4">
            {matches.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
                <div className="text-[var(--text-secondary)] text-lg mb-2">
                  No matches found
                </div>
                <div className="text-[var(--text-secondary)]">
                  {isAdmin
                    ? 'Create the first match to get started'
                    : 'Matches will appear here once they are created'}
                </div>
              </div>
            ) : (
              matches.map((match) => (
                <Card
                  key={match.id}
                  className="border-[var(--border-color)] bg-[var(--card-bg)]"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-[var(--text-primary)]">
                        {getTournamentName(match.tournament_id)}
                      </CardTitle>
                      <Badge className={getStatusColor(match.status)}>
                        {getStatusText(match.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex flex-col items-center text-center">
                        <Users className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-secondary)] mb-2" />
                        <div className="text-[9px] md:text-xs text-[var(--text-secondary)] mb-1 leading-tight">
                          Teams
                        </div>
                        <div className="text-xs md:text-sm text-[var(--text-primary)] font-medium">
                          {getTeamName(match.team1_id)} vs{' '}
                          {getTeamName(match.team2_id)}
                        </div>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-secondary)] mb-2" />
                        <div className="text-[9px] md:text-xs text-[var(--text-secondary)] mb-1 leading-tight">
                          Date
                        </div>
                        <div className="text-xs md:text-sm text-[var(--text-primary)] font-medium">
                          {formatDate(match.scheduled_at || '')}
                        </div>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <Clock className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-secondary)] mb-2" />
                        <div className="text-[9px] md:text-xs text-[var(--text-secondary)] mb-1 leading-tight">
                          Time
                        </div>
                        <div className="text-xs md:text-sm text-[var(--text-primary)] font-medium">
                          {formatTime(match.scheduled_at || '')}
                        </div>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-secondary)] mb-2" />
                        <div className="text-[9px] md:text-xs text-[var(--text-secondary)] mb-1 leading-tight">
                          Status
                        </div>
                        <div className="text-xs md:text-sm text-[var(--text-primary)] font-medium">
                          {getStatusText(match.status)}
                        </div>
                      </div>
                    </div>

                    {/* Match Results (if completed) */}
                    {match.status === 'completed' &&
                      (match.team1_score || match.team2_score) && (
                        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 mb-4">
                          <div className="text-sm text-[var(--text-secondary)] mb-2">
                            Match Results
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <div className="text-xs text-[var(--text-secondary)]">
                                Team 1
                              </div>
                              <div className="text-lg font-semibold text-[var(--text-primary)]">
                                {match.team1_score || 'N/A'}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-[var(--text-secondary)]">
                                Team 2
                              </div>
                              <div className="text-lg font-semibold text-[var(--text-primary)]">
                                {match.team2_score || 'N/A'}
                              </div>
                            </div>
                          </div>
                          {match.match_details && (
                            <div className="mt-3 text-sm text-[var(--text-secondary)] text-center">
                              {typeof match.match_details === 'string'
                                ? match.match_details
                                : JSON.stringify(match.match_details)}
                            </div>
                          )}
                        </div>
                      )}

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMatch(match.id)}
                          className="border-gray-400 text-gray-200 hover:bg-gray-700 hover:border-gray-300 hover:text-white transition-all duration-200"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>

                        {/* Add Results Button for matches without results */}
                        {(!match.team1_score || !match.team2_score) &&
                          match.status !== 'cancelled' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `${ROUTES.MATCHES}/${match.id}/edit-result`
                                )
                              }
                              className="border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-500/70 hover:text-green-300 transition-all duration-200"
                            >
                              <Trophy className="w-4 h-4 mr-2" />
                              Add Results
                            </Button>
                          )}

                        {/* Edit Results Button for completed matches */}
                        {match.team1_score &&
                          match.team2_score &&
                          match.status === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `${ROUTES.MATCHES}/${match.id}/edit-result`
                                )
                              }
                              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/70 hover:text-blue-300 transition-all duration-200"
                            >
                              <Trophy className="w-4 h-4 mr-2" />
                              Edit Results
                            </Button>
                          )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMatch(match.id)}
                          disabled={deletingId === match.id}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500/70 hover:text-red-300 transition-all duration-200"
                        >
                          {deletingId === match.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                          )}
                          Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
