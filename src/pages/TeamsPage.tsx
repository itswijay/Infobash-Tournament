import { useState, useEffect } from 'react'
import { PageLoading } from '@/components/shared/LoadingSpinner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Trophy, Calendar, Crown } from 'lucide-react'
import { getAllTeams } from '@/lib/api/teams'
import toast from 'react-hot-toast'

interface Team {
  id: string
  name: string
  logo_url?: string
  captain_id: string
  tournament_id: string
  created_at: string
  updated_at: string
  captain?: {
    first_name: string
    last_name: string
    batch: string
  }
}

export function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true)
        const teamsData = await getAllTeams()
        setTeams(teamsData || [])
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load teams'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  // Get team initials for logo fallback
  const getTeamInitials = (teamName: string) => {
    return (
      teamName
        .split(' ')
        .map((word) => word[0]?.toUpperCase())
        .join('')
        .slice(0, 2) || 'TM'
    )
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="container py-8 page-enter">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Teams
            </h1>
            <div className="mt-2 h-1 w-16 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)]">
              View all registered cricket teams
            </p>
          </div>
          <PageLoading message="Loading teams..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8 page-enter">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Teams
            </h1>
            <div className="mt-2 h-1 w-16 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)]">
              View all registered cricket teams
            </p>
          </div>
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-2">Error loading teams</div>
            <p className="text-[var(--text-secondary)]">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 page-enter">
      <div className="space-y-8">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Teams
              </h1>
              <div className="mt-2 h-1 w-16 rounded-full bg-gradient-gold opacity-80" />
              <p className="text-[var(--text-secondary)]">
                View all registered cricket teams
              </p>
            </div>

            {/* Tournament Overview - Top Right */}
            {teams.length > 0 && (
              <div className="text-center sm:text-right">
                <div className="flex items-center justify-center sm:justify-end space-x-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-[var(--color-accent-1)]">
                      {teams.length}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      Teams
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-[var(--color-accent-1)]">
                      {teams.length * 10}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      Players
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-[var(--color-secondary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              No Teams Registered Yet
            </h3>
            <p className="text-[var(--text-secondary)]">
              Be the first to register your team for the tournament!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {teams.map((team) => (
              <Card
                key={team.id}
                className="bg-card-bg border-card-border hover:border-[var(--color-secondary)]/50 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] group"
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    {/* Team Logo */}
                    <div className="flex-shrink-0 flex justify-center sm:justify-start">
                      {team.logo_url ? (
                        <img
                          src={team.logo_url}
                          alt={`${team.name} logo`}
                          className="h-12 w-12 rounded-full object-cover border-3 border-[var(--color-secondary)]/20 group-hover:border-[var(--color-secondary)]/40 transition-all duration-200"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center border-3 border-[var(--color-secondary)]/20 group-hover:border-[var(--color-secondary)]/40 transition-all duration-200">
                          <span className="text-lg font-bold text-[var(--color-secondary)]">
                            {getTeamInitials(team.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Team Info - Middle Section */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2 sm:mb-1">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--color-secondary)] transition-colors duration-200 truncate">
                          {team.name}
                        </h3>
                        <Badge className="bg-[var(--color-secondary)] text-[var(--brand-bg)] hover:bg-[var(--color-secondary)]/90 text-xs self-center sm:self-auto">
                          <Trophy className="h-3 w-3 mr-1" />
                          Ready
                        </Badge>
                      </div>

                      {/* Captain Information */}
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <Crown className="h-3 w-3 text-[var(--color-secondary)]" />
                          <span className="text-[var(--text-secondary)]">
                            Captain:
                          </span>
                          {team.captain ? (
                            <span className="font-semibold text-[var(--text-primary)]">
                              {team.captain.first_name} {team.captain.last_name}
                            </span>
                          ) : (
                            <span className="text-[var(--text-secondary)] italic">
                              Unavailable
                            </span>
                          )}
                        </div>

                        {team.captain && (
                          <div className="flex items-center justify-center sm:justify-start space-x-2">
                            <span className="text-[var(--text-secondary)]">
                              Batch:
                            </span>
                            <span className="font-medium text-[var(--text-primary)]">
                              {team.captain.batch}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Team Stats - Right Side */}
                    <div className="flex items-center justify-center sm:justify-end space-x-4 text-sm">
                      <div className="text-center">
                        <div className="flex items-center space-x-1 mb-1">
                          <Users className="h-3 w-3 text-[var(--color-accent-1)]" />
                          <span className="text-[var(--text-secondary)] text-xs">
                            Members
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          10
                        </Badge>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center space-x-1 mb-1">
                          <Calendar className="h-3 w-3 text-[var(--color-accent-1)]" />
                          <span className="text-[var(--text-secondary)] text-xs">
                            Date
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {formatDate(team.created_at)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
