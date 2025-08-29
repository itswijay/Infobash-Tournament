import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Calendar, Clock, Trophy, Users, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import { AdminGuard } from '@/components/auth/AdminGuard'
import { useAuth } from '@/hooks/useAuth'
import { getMatchById, updateMatch } from '@/lib/api/matches'
import { getAllTournaments } from '@/lib/api/tournaments'
import { getAllTeams } from '@/lib/api/teams'
import { logAdminAction } from '@/lib/api/admin'
import { ROUTES } from '@/lib/constants'
import type { Match } from '@/lib/api/matches'
import type { Tournament } from '@/lib/api/tournaments'
import type { Team } from '@/lib/api/teams'

export default function EditMatchPage() {
  const { matchId } = useParams<{ matchId: string }>()
  const navigate = useNavigate()
  // Admin status is handled by AdminGuard component
  useAuth()

  const [match, setMatch] = useState<Match | null>(null)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state for editable fields only
  const [scheduledAt, setScheduledAt] = useState<string>('')
  const [status, setStatus] = useState<
    'scheduled' | 'live' | 'completed' | 'cancelled'
  >('scheduled')

  useEffect(() => {
    if (matchId) {
      fetchMatchData()
    }
  }, [matchId])

  const fetchMatchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [matchData, tournamentsData, teamsData] = await Promise.all([
        getMatchById(matchId!),
        getAllTournaments(),
        getAllTeams(),
      ])

      if (!matchData) {
        setError('Match not found')
        return
      }

      setMatch(matchData)
      setTournaments(tournamentsData)
      setTeams(teamsData)

      // Set form state from match data
      if (matchData.scheduled_at) {
        // Convert ISO string to local datetime-local format
        const date = new Date(matchData.scheduled_at)
        const localDateTime = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16)
        setScheduledAt(localDateTime)
      }
      setStatus(matchData.status)
    } catch (err) {
      console.error('Error fetching match data:', err)
      setError('Failed to load match data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!match || !matchId) return

    try {
      setSaving(true)

      // Convert local datetime to ISO string
      const isoDateTime = scheduledAt
        ? new Date(scheduledAt).toISOString()
        : null

      const updateData = {
        scheduled_at: isoDateTime || undefined,
        status,
      }

      await updateMatch(matchId, updateData)

      // Log admin action
      await logAdminAction(
        'update_match',
        'matches',
        matchId,
        {
          scheduled_at: match.scheduled_at,
          status: match.status,
        },
        updateData
      )

      toast.success('Match updated successfully')
      navigate(ROUTES.MATCHES)
    } catch (err) {
      console.error('Error updating match:', err)
      toast.error('Failed to update match. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate(ROUTES.MATCHES)
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Error Loading Match"
          message={error}
          onRetry={fetchMatchData}
        />
      </div>
    )
  }

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Match Not Found"
          message="The requested match could not be found."
          onRetry={() => navigate(ROUTES.MATCHES)}
        />
      </div>
    )
  }

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                  Edit Match
                </h1>
                <p className="text-[var(--muted-foreground)]">
                  Update match schedule and status
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Match Information Card */}
          <Card className="mb-6 border-[var(--border)] bg-[var(--card)]">
            <CardHeader>
              <CardTitle className="text-[var(--foreground)] flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Match Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tournament */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[var(--muted-foreground)] text-sm font-medium">
                    Tournament
                  </Label>
                  <div className="flex items-center gap-2 mt-1 p-3 bg-[var(--muted)] border border-[var(--border)] rounded-md">
                    <CalendarDays className="w-4 h-4 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--foreground)]">
                      {getTournamentName(match.tournament_id)}
                    </span>
                  </div>
                </div>

                {/* Match Status */}
                <div>
                  <Label className="text-[var(--muted-foreground)] text-sm font-medium">
                    Current Status
                  </Label>
                  <div className="mt-1">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        match.status
                      )}`}
                    >
                      {getStatusText(match.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Teams */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[var(--muted-foreground)] text-sm font-medium">
                    Team 1
                  </Label>
                  <div className="flex items-center gap-2 mt-1 p-3 bg-[var(--muted)] border border-[var(--border)] rounded-md">
                    <Users className="w-4 h-4 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--foreground)]">
                      {getTeamName(match.team1_id)}
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-[var(--muted-foreground)] text-sm font-medium">
                    Team 2
                  </Label>
                  <div className="flex items-center gap-2 mt-1 p-3 bg-[var(--muted)] border border-[var(--border)] rounded-md">
                    <Users className="w-4 h-4 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--foreground)]">
                      {getTeamName(match.team2_id)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Scores (if any) */}
              {(match.team1_score || match.team2_score) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[var(--muted-foreground)] text-sm font-medium">
                      Team 1 Score
                    </Label>
                    <div className="mt-1 p-3 bg-[var(--muted)] border border-[var(--border)] rounded-md">
                      <span className="text-[var(--foreground)] font-medium">
                        {match.team1_score || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[var(--muted-foreground)] text-sm font-medium">
                      Team 2 Score
                    </Label>
                    <div className="mt-1 p-3 bg-[var(--muted)] border border-[var(--border)] rounded-md">
                      <span className="text-[var(--foreground)] font-medium">
                        {match.team2_score || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Form */}
          <Card className="border-[var(--border)] bg-[var(--card)]">
            <CardHeader>
              <CardTitle className="text-[var(--foreground)]">
                Edit Match Schedule & Status
              </CardTitle>
              <p className="text-[var(--muted-foreground)] text-sm">
                You can only modify the scheduled date/time and status. Other
                fields are locked.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Scheduled Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="scheduledAt"
                      className="text-[var(--foreground)] font-semibold text-base"
                    >
                      Scheduled Date & Time
                      <span className="text-[var(--primary)] ml-1">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                      <Input
                        id="scheduledAt"
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="pl-10 border-2 border-[var(--primary)] bg-[var(--input)] text-[var(--foreground)] hover:border-[var(--primary)]/80 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-200 min-h-[44px]"
                        required
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <Label
                      htmlFor="status"
                      className="text-[var(--foreground)] font-semibold text-base"
                    >
                      Match Status
                      <span className="text-[var(--primary)] ml-1">*</span>
                    </Label>
                    <Select
                      value={status}
                      onValueChange={(
                        value: 'scheduled' | 'live' | 'completed' | 'cancelled'
                      ) => setStatus(value)}
                    >
                      <SelectTrigger className="mt-1 border-2 border-[var(--primary)] bg-[var(--input)] text-[var(--foreground)] hover:border-[var(--primary)]/80 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-200 min-h-[44px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--popover)] border-2 border-[var(--primary)] shadow-lg">
                        <SelectItem
                          value="scheduled"
                          className="bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 cursor-pointer text-gray-800 border-b border-gray-300 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            Scheduled
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="live"
                          className="bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 cursor-pointer text-gray-800 border-b border-gray-300 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Live
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="completed"
                          className="bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 cursor-pointer text-gray-800 border-b border-gray-300 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            Completed
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="cancelled"
                          className="bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 cursor-pointer text-gray-800 border-b border-gray-300 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            Cancelled
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-slate-300 text-slate-300 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-700 transition-all duration-200 px-6 py-2 font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 hover:border-blue-700 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 px-6 py-2 font-medium shadow-md hover:shadow-lg"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Update Match
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  )
}
