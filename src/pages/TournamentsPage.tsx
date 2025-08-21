import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Clock } from 'lucide-react'
import { PageLoading } from '@/components/shared/LoadingSpinner'
import { getAllTournaments } from '@/lib/api/tournaments'
import type { Tournament } from '@/lib/api/tournaments'
import toast from 'react-hot-toast'

export function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'ongoing':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Tournaments
            </h1>
            <div className="mt-2 h-1 w-20 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)]">
              Manage and view all cricket tournaments
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
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Tournaments
            </h1>
            <div className="mt-2 h-1 w-20 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)]">
              Manage and view all cricket tournaments
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
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Tournaments
          </h1>
          <div className="mt-2 h-1 w-20 rounded-full bg-gradient-gold opacity-80" />
          <p className="text-[var(--text-secondary)]">
            Manage and view all cricket tournaments
          </p>
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
                    <Badge
                      variant="outline"
                      className={`border ${getStatusColor(
                        tournament.status
                      )} text-xs md:text-sm px-2 md:px-3 py-1 md:py-2`}
                    >
                      {getStatusText(tournament.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 p-4 md:p-6">
                  <div className="grid grid-cols-4 gap-2 md:gap-8">
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
                        {formatDate(tournament.registration_deadline)}
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
