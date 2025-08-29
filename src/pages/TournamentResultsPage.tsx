import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageLoading } from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { getAllTournaments, type Tournament } from '@/lib/api/tournaments'
import { getAllMatches, type Match } from '@/lib/api/matches'
import { getAllTeams, type Team } from '@/lib/api/teams'
import { ROUTES } from '@/lib/constants'
import {
  Trophy,
  Target,
  TrendingUp,
  Award,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface TeamStanding {
  team: Team
  matchesPlayed: number
  wins: number
  losses: number
  points: number
  netRunRate: number
}

export default function TournamentResultsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tournamentsData, matchesData, teamsData] = await Promise.all([
        getAllTournaments(),
        getAllMatches(),
        getAllTeams(),
      ])

      setTournaments(tournamentsData)
      setMatches(matchesData)
      setTeams(teamsData)

      // Set first tournament as default selection
      if (tournamentsData.length > 0) {
        setSelectedTournament(tournamentsData[0])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load tournament data')
    } finally {
      setLoading(false)
    }
  }

  const getTournamentMatches = (tournamentId: string) => {
    return matches.filter((match) => match.tournament_id === tournamentId)
  }

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId)
    return team?.name || 'Unknown Team'
  }

  const calculateTeamStandings = (tournamentId: string): TeamStanding[] => {
    const tournamentMatches = getTournamentMatches(tournamentId)
    const tournamentTeams = teams.filter((team) =>
      tournamentMatches.some(
        (match) => match.team1_id === team.id || match.team2_id === team.id
      )
    )

    const standings: TeamStanding[] = tournamentTeams.map((team) => {
      const teamMatches = tournamentMatches.filter(
        (match) => match.team1_id === team.id || match.team2_id === team.id
      )

      let wins = 0
      let losses = 0

      teamMatches.forEach((match) => {
        if (match.status === 'completed' && match.winner_id) {
          if (match.winner_id === team.id) {
            wins++
          } else {
            losses++
          }
        }
      })

      const matchesPlayed = wins + losses
      const points = wins * 2 // 2 points for win, 0 for loss

      return {
        team,
        matchesPlayed,
        wins,
        losses,
        points,
        netRunRate: 0, // Placeholder for future NRR calculation
      }
    })

    // Sort by points (descending), then by wins (descending)
    return standings.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points
      }
      return b.wins - a.wins
    })
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <PageLoading message="Loading tournament results..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="text-red-400 text-lg mb-2">Error loading results</div>
          <div className="text-[var(--text-secondary)]">{error}</div>
        </div>
      </div>
    )
  }

  if (tournaments.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
          <div className="text-[var(--text-secondary)] text-lg mb-2">
            No tournaments found
          </div>
          <div className="text-[var(--text-secondary)]">
            {isAdmin
              ? 'Create a tournament to get started'
              : 'Tournaments will appear here once they are created'}
          </div>
        </div>
      </div>
    )
  }

  const standings = selectedTournament
    ? calculateTeamStandings(selectedTournament.id)
    : []
  const tournamentMatches = selectedTournament
    ? getTournamentMatches(selectedTournament.id)
    : []

  return (
    <div className="container py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Tournament Results
          </h1>
          <div className="mt-2 h-1 w-20 rounded-full bg-gradient-gold opacity-80" />
          <p className="text-[var(--text-secondary)]">
            View tournament standings, match results, and team performance
          </p>
        </div>

        {/* Tournament Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--text-primary)]">
            Select Tournament
          </label>
          <select
            value={selectedTournament?.id || ''}
            onChange={(e) => {
              const tournament = tournaments.find(
                (t) => t.id === e.target.value
              )
              setSelectedTournament(tournament || null)
            }}
            className="w-full md:w-64 px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-1)]"
          >
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
              </option>
            ))}
          </select>
        </div>

        {selectedTournament && (
          <>
            {/* Tournament Info */}
            <Card className="border-[var(--border-color)] bg-[var(--card-bg)]">
              <CardHeader>
                <CardTitle className="text-xl text-[var(--text-primary)] flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  {selectedTournament.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-[var(--text-secondary)]">
                      Status:{' '}
                    </span>
                    <Badge
                      className={getStatusColor(selectedTournament.status)}
                    >
                      {getStatusText(selectedTournament.status)}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">
                      Start Date:{' '}
                    </span>
                    <span className="text-[var(--text-primary)]">
                      {formatDate(selectedTournament.start_date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">
                      End Date:{' '}
                    </span>
                    <span className="text-[var(--text-primary)]">
                      {formatDate(selectedTournament.end_date)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Standings */}
            <Card className="border-[var(--border-color)] bg-[var(--card-bg)]">
              <CardHeader>
                <CardTitle className="text-xl text-[var(--text-primary)] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Team Standings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {standings.length === 0 ? (
                  <div className="text-center py-8 text-[var(--text-secondary)]">
                    No teams have played matches yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--border-color)]">
                          <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium">
                            Position
                          </th>
                          <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium">
                            Team
                          </th>
                          <th className="text-center py-3 px-4 text-[var(--text-secondary)] font-medium">
                            P
                          </th>
                          <th className="text-center py-3 px-4 text-[var(--text-secondary)] font-medium">
                            W
                          </th>
                          <th className="text-center py-3 px-4 text-[var(--text-secondary)] font-medium">
                            L
                          </th>
                          <th className="text-center py-3 px-4 text-[var(--text-secondary)] font-medium">
                            Pts
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.map((standing, index) => (
                          <tr
                            key={standing.team.id}
                            className="border-b border-[var(--border-color)] hover:bg-[var(--hover-bg)]"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {index < 3 && (
                                  <Award
                                    className={`w-4 h-4 ${
                                      index === 0
                                        ? 'text-yellow-500'
                                        : index === 1
                                        ? 'text-gray-400'
                                        : 'text-amber-600'
                                    }`}
                                  />
                                )}
                                <span className="text-[var(--text-primary)] font-medium">
                                  {index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-[var(--text-primary)] font-medium">
                                {standing.team.name}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-[var(--text-primary)]">
                              {standing.matchesPlayed}
                            </td>
                            <td className="py-3 px-4 text-center text-[var(--text-primary)]">
                              {standing.wins}
                            </td>
                            <td className="py-3 px-4 text-center text-[var(--text-primary)]">
                              {standing.losses}
                            </td>
                            <td className="py-3 px-4 text-center text-[var(--text-primary)] font-semibold">
                              {standing.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Match Results */}
            <Card className="border-[var(--border-color)] bg-[var(--card-bg)]">
              <CardHeader>
                <CardTitle className="text-xl text-[var(--text-primary)] flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Match Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tournamentMatches.length === 0 ? (
                  <div className="text-center py-8 text-[var(--text-secondary)]">
                    No matches scheduled for this tournament
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tournamentMatches.map((match) => (
                      <div
                        key={match.id}
                        className="border border-[var(--border-color)] rounded-lg p-4 hover:bg-[var(--hover-bg)]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(match.status)}>
                              {getStatusText(match.status)}
                            </Badge>
                            <span className="text-sm text-[var(--text-secondary)]">
                              {formatDate(match.scheduled_at)}
                            </span>
                          </div>
                          {isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `${ROUTES.MATCHES}/${match.id}/edit-result`
                                )
                              }
                              className="border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                            >
                              <Target className="w-4 h-4 mr-2" />
                              {match.status === 'completed'
                                ? 'Edit Results'
                                : 'Add Results'}
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-sm text-[var(--text-secondary)] mb-1">
                              Team 1
                            </div>
                            <div className="text-lg font-semibold text-[var(--text-primary)]">
                              {getTeamName(match.team1_id)}
                            </div>
                            {match.team1_score && (
                              <div className="text-sm text-[var(--text-accent)] font-medium">
                                {match.team1_score}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-center">
                            <div className="text-2xl font-bold text-[var(--text-secondary)]">
                              VS
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-[var(--text-secondary)] mb-1">
                              Team 2
                            </div>
                            <div className="text-lg font-semibold text-[var(--text-primary)]">
                              {getTeamName(match.team2_id)}
                            </div>
                            {match.team2_score && (
                              <div className="text-sm text-[var(--text-accent)] font-medium">
                                {match.team2_score}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Winner Display */}
                        {match.winner_id && (
                          <div className="mt-3 text-center">
                            <div className="text-sm text-[var(--text-secondary)]">
                              Winner
                            </div>
                            <div className="text-lg font-semibold text-[var(--color-accent-1)]">
                              {getTeamName(match.winner_id)}
                            </div>
                          </div>
                        )}

                        {/* Match Details */}
                        {match.match_details && (
                          <div className="mt-3 p-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg">
                            <div className="text-sm text-[var(--text-secondary)] mb-1">
                              Match Details
                            </div>
                            <div className="text-sm text-[var(--text-primary)]">
                              {typeof match.match_details === 'string'
                                ? match.match_details
                                : JSON.stringify(match.match_details, null, 2)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
