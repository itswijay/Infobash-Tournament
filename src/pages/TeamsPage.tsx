import { useState, useEffect } from 'react'
import { PageLoading } from '@/components/shared/LoadingSpinner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Users,
  Trophy,
  Calendar,
  Crown,
  ChevronDown,
  ChevronUp,
  Trash2,
} from 'lucide-react'
import { getAllTeams, getTeamMembers, deleteTeam } from '@/lib/api/teams'
import type { Team as ApiTeam } from '@/lib/api/teams'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

interface TeamWithCaptain extends ApiTeam {
  captain?: {
    first_name: string
    last_name: string
    batch: string
    campus_card?: string
  }
}

import type { TeamMember } from '@/lib/api/teams'

// Use the API TeamMember interface directly
type TeamMemberWithExtra = TeamMember

export function TeamsPage() {
  const { isAdmin } = useAuth()
  const [teams, setTeams] = useState<TeamWithCaptain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set())
  const [closingTeams, setClosingTeams] = useState<Set<string>>(new Set())
  const [teamMembers, setTeamMembers] = useState<
    Record<string, TeamMemberWithExtra[]>
  >({})
  const [loadingMembers, setLoadingMembers] = useState<Set<string>>(new Set())
  const [deletingTeams, setDeletingTeams] = useState<Set<string>>(new Set())

  // Add custom CSS animation
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
          max-height: 0;
        }
        to {
          opacity: 1;
          transform: translateY(0);
          max-height: 500px;
        }
      }
      
      @keyframes slideUp {
        from {
          opacity: 1;
          transform: translateY(0);
          max-height: 500px;
        }
        to {
          opacity: 0;
          transform: translateY(-20px);
          max-height: 0;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true)
        const teamsData = await getAllTeams()
        setTeams((teamsData || []) as TeamWithCaptain[])
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

  const toggleTeamExpansion = async (teamId: string) => {
    if (expandedTeams.has(teamId)) {
      // Start closing animation
      setClosingTeams((prev) => new Set(prev).add(teamId))

      // Wait for animation to complete, then remove from expanded
      setTimeout(() => {
        setExpandedTeams((prev) => {
          const newSet = new Set(prev)
          newSet.delete(teamId)
          return newSet
        })
        setClosingTeams((prev) => {
          const newSet = new Set(prev)
          newSet.delete(teamId)
          return newSet
        })
      }, 500) // Same duration as the animation (600ms)
    } else {
      // Expand team
      setExpandedTeams((prev) => new Set(prev).add(teamId))

      // Fetch team members if not already loaded
      if (!teamMembers[teamId]) {
        try {
          setLoadingMembers((prev) => new Set(prev).add(teamId))
          const members = await getTeamMembers(teamId)
          setTeamMembers((prev) => ({
            ...prev,
            [teamId]: members as TeamMemberWithExtra[],
          }))
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to load team members'
          toast.error(errorMessage)
        } finally {
          setLoadingMembers((prev) => {
            const newSet = new Set(prev)
            newSet.delete(teamId)
            return newSet
          })
        }
      }
    }
  }

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

  // Get member display name
  const getMemberDisplayName = (member: TeamMemberWithExtra) => {
    return member.campus_card || `${member.first_name} ${member.last_name}`
  }

  // Delete team function (admin only)
  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!isAdmin) {
      toast.error('Unauthorized: Admin access required')
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the team "${teamName}"? This action cannot be undone and will remove all team members.`
    )

    if (!confirmed) return

    try {
      setDeletingTeams((prev) => new Set(prev).add(teamId))

      await deleteTeam(teamId)

      // Remove team from local state
      setTeams((prev) => prev.filter((team) => team.id !== teamId))

      // Clean up related state
      setExpandedTeams((prev) => {
        const newSet = new Set(prev)
        newSet.delete(teamId)
        return newSet
      })
      setClosingTeams((prev) => {
        const newSet = new Set(prev)
        newSet.delete(teamId)
        return newSet
      })
      setTeamMembers((prev) => {
        const newMembers = { ...prev }
        delete newMembers[teamId]
        return newMembers
      })

      toast.success(`Team "${teamName}" has been deleted successfully`)
    } catch (err) {
      console.error('Error deleting team:', err)
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete team'
      toast.error(`Failed to delete team: ${errorMessage}`)
    } finally {
      setDeletingTeams((prev) => {
        const newSet = new Set(prev)
        newSet.delete(teamId)
        return newSet
      })
    }
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                  Teams
                </h1>
                {isAdmin && (
                  <Badge className="bg-red-600 text-white text-xs">
                    Admin Mode
                  </Badge>
                )}
              </div>
              <div className="mt-2 h-1 w-16 rounded-full bg-gradient-gold opacity-80" />
              <p className="text-[var(--text-secondary)]">
                View all registered cricket teams
                {isAdmin && (
                  <span className="text-red-400 font-medium">
                    {' '}
                    • Admin controls enabled
                  </span>
                )}
              </p>
            </div>

            {/* Tournament Overview - Centered on mobile, right-aligned on desktop */}
            {teams.length > 0 && (
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end space-x-6">
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-[var(--color-accent-1)]">
                      {teams.length}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      Teams
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-[var(--color-accent-1)]">
                      {teams.length * 10}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
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
              <div key={team.id} className="space-y-0">
                <Card className="bg-card-bg border-card-border hover:border-[var(--color-secondary)]/50 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] group cursor-pointer relative">
                  <CardContent className="p-3 md:p-4">
                    {/* Admin Delete Button */}
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTeam(team.id, team.name)
                        }}
                        disabled={deletingTeams.has(team.id)}
                      >
                        {deletingTeams.has(team.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    <div
                      className="flex items-center space-x-3 md:space-x-4 cursor-pointer"
                      onClick={() => toggleTeamExpansion(team.id)}
                    >
                      {/* Team Logo */}
                      <div className="flex-shrink-0">
                        {team.logo_url ? (
                          <img
                            src={team.logo_url}
                            alt={`${team.name} logo`}
                            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 md:border-3 border-[var(--color-secondary)]/20 group-hover:border-[var(--color-secondary)]/40 transition-all duration-200"
                          />
                        ) : (
                          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center border-2 md:border-3 border-[var(--color-secondary)]/20 group-hover:border-[var(--color-secondary)]/40 transition-all duration-200">
                            <span className="text-sm md:text-lg font-bold text-[var(--color-secondary)]">
                              {getTeamInitials(team.name)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Team Info - Left Side */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 md:space-x-3 mb-1">
                          <h3 className="text-base md:text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--color-secondary)] transition-colors duration-200 truncate">
                            {team.name}
                          </h3>
                          <Badge className="bg-[var(--color-secondary)] text-[var(--brand-bg)] hover:bg-[var(--color-secondary)]/90 text-xs">
                            <Trophy className="h-3 w-3 mr-1" />
                            Ready
                          </Badge>
                        </div>

                        {/* Captain Information */}
                        <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm">
                          <div className="flex items-center space-x-1 md:space-x-2">
                            <Crown className="h-3 w-3 text-[var(--color-secondary)]" />
                            <span className="text-[var(--text-secondary)]">
                              Captain:
                            </span>
                            <span className="font-semibold text-[var(--text-primary)] truncate">
                              {team.captain
                                ? team.captain.campus_card
                                  ? team.captain.campus_card
                                  : `${team.captain.first_name} ${team.captain.last_name}`
                                : 'Unavailable'}
                            </span>
                          </div>

                          {team.captain && (
                            <div className="flex items-center space-x-1 md:space-x-2">
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

                      {/* Team Stats - Right Side - Hidden on mobile */}
                      <div className="hidden md:flex items-center space-x-4 text-sm">
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

                      {/* Expand/Collapse Icon */}
                      <div className="flex-shrink-0">
                        {expandedTeams.has(team.id) ? (
                          <ChevronUp className="h-5 w-5 text-[var(--color-secondary)] transition-transform duration-200" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-[var(--color-secondary)] transition-transform duration-200" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Expanded Members Section */}
                {(expandedTeams.has(team.id) || closingTeams.has(team.id)) && (
                  <div
                    className="overflow-hidden"
                    style={{
                      animation: closingTeams.has(team.id)
                        ? 'slideUp 500ms ease-out forwards'
                        : 'slideDown 500ms ease-out forwards',
                    }}
                  >
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg mx-2 border-t-0 rounded-t-none">
                      <div className="p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Users className="h-4 w-4 text-[var(--color-secondary)]" />
                          <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                            Team Members
                          </h4>
                        </div>

                        {loadingMembers.has(team.id) ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-secondary)]"></div>
                          </div>
                        ) : teamMembers[team.id] ? (
                          <div className="space-y-2">
                            {teamMembers[team.id]
                              .sort((a, b) => {
                                // Captain first, then others
                                if (a.is_captain && !b.is_captain) return -1
                                if (!a.is_captain && b.is_captain) return 1
                                return 0
                              })
                              .map((member) => (
                                <div
                                  key={member.id}
                                  className="flex items-center justify-between p-2 rounded-lg bg-[var(--brand-bg)]/5 border border-[var(--card-border)]/50 hover:bg-[var(--brand-bg)]/10 transition-colors duration-200"
                                >
                                  <div className="flex items-center space-x-2">
                                    {member.is_captain && (
                                      <Crown className="h-3 w-3 text-[var(--color-secondary)]" />
                                    )}
                                    <span className="text-sm text-[var(--text-primary)] font-medium">
                                      {getMemberDisplayName(member)}
                                    </span>
                                  </div>
                                  {member.is_captain && (
                                    <Badge className="bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] text-xs">
                                      Captain
                                    </Badge>
                                  )}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-[var(--text-secondary)] text-sm">
                            No members found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
