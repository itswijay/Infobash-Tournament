import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Clock, Plus, Edit, Trash2 } from 'lucide-react'
import { PageLoading } from '@/components/shared/LoadingSpinner'
import { getAllTournaments, deleteTournament } from '@/lib/api/tournaments'
import type { Tournament } from '@/lib/api/tournaments'
import { useAuth } from '@/hooks/useAuth'
import { logAdminAction } from '@/lib/api/admin'
import { ROUTES } from '@/lib/constants'
import toast from 'react-hot-toast'

export function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true)
        const data = await getAllTournaments()
        setTournaments(data)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch tournaments'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchTournaments()
  }, [])

  const handleDeleteTournament = async (
    tournamentId: string,
    tournamentName: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete "${tournamentName}"? This action cannot be undone.`
      )
    ) {
      return
    }

    try {
      setDeletingId(tournamentId)

      // Delete the tournament
      await deleteTournament(tournamentId)

      // Log the admin action
      await logAdminAction(
        'delete',
        'tournaments',
        tournamentId,
        { name: tournamentName },
        undefined
      )

      // Remove from local state
      setTournaments((prev) => prev.filter((t) => t.id !== tournamentId))

      toast.success(`Tournament "${tournamentName}" deleted successfully`)
    } catch (error) {
      console.error('Error deleting tournament:', error)
      toast.error('Failed to delete tournament')
    } finally {
      setDeletingId(null)
    }
  }

  const handleCreateTournament = () => {
    navigate(ROUTES.CREATE_TOURNAMENT)
  }

  const handleEditTournament = (tournamentId: string) => {
    navigate(`${ROUTES.TOURNAMENTS}/${tournamentId}/edit`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    try {
      // The dateString is stored as UTC but represents local time
      // We need to parse it and display it as local time
      const date = new Date(dateString)

      // Get the local time components from the UTC date
      const year = date.getUTCFullYear()
      const month = date.getUTCMonth()
      const day = date.getUTCDate()
      const hours = date.getUTCHours()
      const minutes = date.getUTCMinutes()

      // Create a new date object in local timezone with these values
      const localDate = new Date(year, month, day, hours, minutes)

      // Format it in local time
      return localDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid Date'
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)

      const hours = date.getUTCHours()
      const minutes = date.getUTCMinutes()

      const localDate = new Date(2000, 0, 1, hours, minutes)

      // Format it in local time
      return localDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    } catch (error) {
      console.error('Error formatting time:', error)
      return 'Invalid Time'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'registration_open':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'registration_closed':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'ongoing':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'registration_open':
        return 'Registration Open'
      case 'registration_closed':
        return 'Registration Closed'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Tournaments
              </h1>
              {isAdmin && (
                <Badge className="bg-red-600 text-white text-xs">
                  Admin Mode
                </Badge>
              )}
            </div>
            <div className="mt-2 h-1 w-20 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)]">
              Manage and view all cricket tournaments
              {isAdmin && (
                <span className="text-red-400 font-medium">
                  {' '}
                  • Admin controls enabled
                </span>
              )}
            </p>
          </div>
          <PageLoading message="Loading tournaments..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Tournaments
              </h1>
              {isAdmin && (
                <Badge className="bg-red-600 text-white text-xs">
                  Admin Mode
                </Badge>
              )}
            </div>
            <div className="mt-2 h-1 w-20 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)]">
              Manage and view all cricket tournaments
              {isAdmin && (
                <span className="text-red-400 font-medium">
                  {' '}
                  • Admin controls enabled
                </span>
              )}
            </p>
          </div>
          <div className="text-center py-12">
            <div className="text-red-400 text-lg mb-2">
              Error loading tournaments
            </div>
            <div className="text-[var(--text-secondary)]">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Tournaments
              </h1>
              {isAdmin && (
                <Badge className="bg-red-600 text-white text-xs">
                  Admin Mode
                </Badge>
              )}
            </div>
            <div className="mt-2 h-1 w-20 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)]">
              Manage and view all cricket tournaments
              {isAdmin && (
                <span className="text-red-400 font-medium">
                  {' '}
                  • Admin controls enabled
                </span>
              )}
            </p>
          </div>

          {/* Admin Create Button */}
          {isAdmin && (
            <Button
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              onClick={handleCreateTournament}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Tournament
            </Button>
          )}
        </div>

        {tournaments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-[var(--text-secondary)] text-lg mb-2">
              No tournaments found
            </div>
            <div className="text-[var(--text-secondary)]">
              Check back later for upcoming tournaments
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {tournaments.map((tournament) => (
              <Card
                key={tournament.id}
                className="bg-card-bg border-card-border hover:border-[var(--color-accent-1)]/50 transition-all duration-200 hover:scale-[1.02]"
              >
                <CardHeader className="px-4 pt-4 pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base md:text-lg lg:text-xl text-[var(--text-primary)] mb-2">
                        {tournament.name}
                      </CardTitle>
                      {tournament.description && (
                        <p className="text-[var(--text-secondary)] text-xs md:text-sm">
                          {tournament.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`border ${getStatusColor(
                          tournament.status
                        )} text-xs md:text-sm px-2 md:px-3 py-1 md:py-2`}
                      >
                        {getStatusText(tournament.status)}
                      </Badge>

                      {/* Admin Action Buttons */}
                      {isAdmin && (
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                            onClick={() => handleEditTournament(tournament.id)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 border-red-600 text-red-400 hover:bg-red-700 hover:text-white"
                            onClick={() =>
                              handleDeleteTournament(
                                tournament.id,
                                tournament.name
                              )
                            }
                            disabled={deletingId === tournament.id}
                          >
                            {deletingId === tournament.id ? (
                              <Trash2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 p-4 md:p-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
                    <div className="flex flex-col items-center text-center">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-secondary)] mb-2" />
                      <div className="text-[9px] md:text-xs text-[var(--text-secondary)] mb-1 leading-tight">
                        Start Date
                      </div>
                      <div className="text-xs md:text-sm text-[var(--text-primary)] font-medium">
                        {formatDate(tournament.start_date)}
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-secondary)] mb-2" />
                      <div className="text-[9px] md:text-xs text-[var(--text-secondary)] mb-1 leading-tight">
                        Start Time
                      </div>
                      <div className="text-xs md:text-sm text-[var(--text-primary)] font-medium">
                        {formatTime(tournament.start_date)}
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-secondary)] mb-2" />
                      <div className="text-[9px] md:text-xs text-[var(--text-secondary)] mb-1 leading-tight">
                        End Date
                      </div>
                      <div className="text-xs md:text-sm text-[var(--text-primary)] font-medium">
                        {formatDate(tournament.end_date)}
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-secondary)] mb-2" />
                      <div className="text-[9px] md:text-xs text-[var(--text-secondary)] mb-1 leading-tight">
                        Registration Deadline
                      </div>
                      <div className="text-xs md:text-sm text-[var(--text-primary)] font-medium">
                        {formatDateTime(tournament.registration_deadline)}
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-secondary)] mb-2" />
                      <div className="text-[9px] md:text-xs text-[var(--text-secondary)] mb-1 leading-tight">
                        Max Teams
                      </div>
                      <div className="text-xs md:text-sm text-[var(--text-primary)] font-medium">
                        {tournament.max_teams}
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
