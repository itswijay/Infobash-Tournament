import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  Edit,
  Plus,
  AlertCircle,
} from 'lucide-react'
import type { Tournament } from '@/lib/api/tournaments'
import type { Match, CreateMatchData, UpdateMatchData } from '@/lib/api/matches'
import type { Team } from '@/lib/api/teams'
import { getTeamsByTournament } from '@/lib/api/teams'
import { localDateTimeToISO } from '@/lib/utils'

interface MatchFormProps {
  match?: Match | null
  tournaments: Tournament[]
  teams?: Team[]
  isEditMode?: boolean
  onSubmit: (data: CreateMatchData | UpdateMatchData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export interface MatchFormData {
  tournament_id: string
  team1_id: string
  team2_id: string
  scheduled_at: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
}

interface MatchFormState {
  tournament_id: string
  team1_id: string
  team2_id: string
  scheduled_at: string
  scheduled_time: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
}

interface MatchFormErrors {
  tournament_id?: string
  team1_id?: string
  team2_id?: string
  scheduled_at?: string
  scheduled_time?: string
  status?: string
}

const MATCH_STATUSES = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const

export function MatchForm({
  match,
  tournaments,
  teams: initialTeams, // Renamed to avoid conflict with state
  isEditMode = false,
  onSubmit,
  onCancel,
  loading = false,
}: MatchFormProps) {
  const [formData, setFormData] = useState<MatchFormState>({
    tournament_id: '',
    team1_id: '',
    team2_id: '',
    scheduled_at: '',
    scheduled_time: '12:00',
    status: 'scheduled',
  })

  const [errors, setErrors] = useState<MatchFormErrors>({})
  const [teams, setTeams] = useState<Team[]>([])
  const [loadingTeams, setLoadingTeams] = useState(false)

  const fetchTeams = useCallback(async (tournamentId: string) => {
    try {
      console.log('Fetching teams for tournament:', tournamentId)
      setLoadingTeams(true)
      const teamsData = await getTeamsByTournament(tournamentId)
      console.log('Teams fetched:', teamsData)
      setTeams(teamsData)
    } catch (error) {
      console.error('Error fetching teams:', error)
      setTeams([])
    } finally {
      setLoadingTeams(false)
    }
  }, [])

  // Initialize teams from prop if in edit mode
  useEffect(() => {
    if (isEditMode && initialTeams && initialTeams.length > 0) {
      console.log('Setting teams from prop:', initialTeams)
      setTeams(initialTeams)
    }
  }, [isEditMode, initialTeams])

  // Initialize form with existing match data if editing
  useEffect(() => {
    if (match && isEditMode) {
      console.log('Initializing form with match data:', match)
      const matchDate = new Date(match.scheduled_at || '')
      const timeString = matchDate.toTimeString().slice(0, 5) // Get HH:MM format

      const initialFormData = {
        tournament_id: match.tournament_id,
        team1_id: match.team1_id,
        team2_id: match.team2_id,
        scheduled_at: matchDate.toLocaleDateString('en-CA'), // Use YYYY-MM-DD format in local timezone
        scheduled_time: timeString,
        status: match.status,
      }

      console.log('Setting form data:', initialFormData)
      setFormData(initialFormData)
    }
  }, [match, isEditMode])

  // Fetch teams when tournament changes (for create mode only)
  useEffect(() => {
    if (formData.tournament_id && !isEditMode) {
      fetchTeams(formData.tournament_id)
    }
  }, [formData.tournament_id, isEditMode, fetchTeams])

  // Smart defaults when tournament changes (for create mode only)
  useEffect(() => {
    if (formData.tournament_id && !isEditMode) {
      const tournament = tournaments.find(
        (t) => t.id === formData.tournament_id
      )
      if (tournament) {
        // Set match date to tournament start date
        setFormData((prev) => ({
          ...prev,
          scheduled_at: tournament.start_date.split('T')[0],
        }))
      }
    }
  }, [formData.tournament_id, tournaments, isEditMode])

  // Real-time validation for team selection
  useEffect(() => {
    if (formData.team1_id && formData.team2_id) {
      if (formData.team1_id === formData.team2_id) {
        setErrors((prev) => ({
          ...prev,
          team2_id: 'Team 2 must be different from Team 1',
        }))
      } else {
        setErrors((prev) => ({
          ...prev,
          team2_id: undefined,
        }))
      }
    }
  }, [formData.team1_id, formData.team2_id])

  const handleInputChange = (field: keyof MatchFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: MatchFormErrors = {}
    const today = new Date()

    // Combine date and time for validation
    const matchDateTime = new Date(
      `${formData.scheduled_at}T${formData.scheduled_time}`
    )

    // Tournament validation
    if (!formData.tournament_id) {
      newErrors.tournament_id = 'Tournament is required'
    }

    // Team validation
    if (!formData.team1_id) {
      newErrors.team1_id = 'Team 1 is required'
    }
    if (!formData.team2_id) {
      newErrors.team2_id = 'Team 2 is required'
    }
    if (
      formData.team1_id &&
      formData.team2_id &&
      formData.team1_id === formData.team2_id
    ) {
      newErrors.team2_id = 'Team 2 must be different from Team 1'
    }

    // Date and time validation
    if (!formData.scheduled_at) {
      newErrors.scheduled_at = 'Match date is required'
    }
    if (!formData.scheduled_time) {
      newErrors.scheduled_time = 'Match time is required'
    }

    if (
      formData.scheduled_at &&
      formData.scheduled_time &&
      matchDateTime <= today
    ) {
      newErrors.scheduled_at = 'Match date and time must be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      // Create submit data without the time field
      const dataToSubmit = {
        tournament_id: formData.tournament_id,
        team1_id: formData.team1_id,
        team2_id: formData.team2_id,
        scheduled_at: localDateTimeToISO(
          formData.scheduled_at,
          formData.scheduled_time
        ),
        status: formData.status,
      }

      await onSubmit(dataToSubmit as CreateMatchData | UpdateMatchData)
    } catch (error) {
      console.error('Error submitting match:', error)
      // Show user-friendly error
      setErrors((prev) => ({
        ...prev,
        scheduled_at: 'Invalid date or time format. Please check your input.',
      }))
    }
  }

  const getSelectedTournament = () => {
    return tournaments.find((t) => t.id === formData.tournament_id)
  }

  // Check if teams are the same for real-time feedback
  const isSameTeam = Boolean(
    formData.team1_id &&
      formData.team2_id &&
      formData.team1_id === formData.team2_id
  )

  return (
    <Card className="border-[var(--border-color)] bg-[var(--card-bg)]">
      <CardHeader>
        <CardTitle className="text-xl text-[var(--text-primary)] flex items-center gap-2">
          {isEditMode ? (
            <Edit className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          {isEditMode ? 'Edit Match' : 'Create New Match'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tournament Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="tournament_id"
              className="text-[var(--text-primary)] flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Tournament *
            </Label>
            <Select
              value={formData.tournament_id}
              onValueChange={(value) =>
                handleInputChange('tournament_id', value)
              }
              disabled={isEditMode}
            >
              <SelectTrigger
                className={errors.tournament_id ? 'border-red-500' : ''}
              >
                <SelectValue
                  placeholder={
                    isEditMode ? 'Tournament (Locked)' : 'Select a tournament'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map((tournament) => (
                  <SelectItem key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tournament_id && (
              <p className="text-sm text-red-400">{errors.tournament_id}</p>
            )}
          </div>

          {/* Teams Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="team1_id"
                className="text-[var(--text-primary)] flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Team 1 *
              </Label>
              <Select
                value={formData.team1_id}
                onValueChange={(value) => handleInputChange('team1_id', value)}
                disabled={!formData.tournament_id || loadingTeams || isEditMode}
              >
                <SelectTrigger
                  className={errors.team1_id ? 'border-red-500' : ''}
                >
                  <SelectValue
                    placeholder={
                      !formData.tournament_id
                        ? 'Select tournament first'
                        : loadingTeams
                        ? 'Loading teams...'
                        : isEditMode
                        ? 'Team 1 (Locked)'
                        : 'Select Team 1'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.team1_id && (
                <p className="text-sm text-red-400">{errors.team1_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="team2_id"
                className="text-[var(--text-primary)] flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Team 2 *
              </Label>
              <Select
                value={formData.team2_id}
                onValueChange={(value) => handleInputChange('team2_id', value)}
                disabled={!formData.tournament_id || loadingTeams || isEditMode}
              >
                <SelectTrigger
                  className={errors.team2_id ? 'border-red-500' : ''}
                >
                  <SelectValue
                    placeholder={
                      !formData.tournament_id
                        ? 'Select tournament first'
                        : loadingTeams
                        ? 'Loading teams...'
                        : isEditMode
                        ? 'Team 2 (Locked)'
                        : 'Select Team 2'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.team2_id && (
                <p className="text-sm text-red-400">{errors.team2_id}</p>
              )}
            </div>
          </div>

          {/* Same Team Warning */}
          {isSameTeam && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">
                ⚠️ <strong>Invalid Selection:</strong> Team 1 and Team 2 cannot
                be the same team. A team cannot play against itself.
              </span>
            </div>
          )}

          {/* Edit Mode Notice */}
          {isEditMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700">
                ℹ️ <strong>Edit Mode:</strong> Tournament and team selection are
                locked to maintain data integrity. You can modify the match
                time, date, and status, but the tournament and teams cannot be
                changed.
              </span>
            </div>
          )}

          {/* Match Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="scheduled_at"
                className="text-[var(--text-primary)] flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Match Date *
              </Label>
              <Input
                id="scheduled_at"
                type="date"
                value={formData.scheduled_at}
                onChange={(e) =>
                  handleInputChange('scheduled_at', e.target.value)
                }
                className={errors.scheduled_at ? 'border-red-500' : ''}
              />
              {errors.scheduled_at && (
                <p className="text-sm text-red-400">{errors.scheduled_at}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="scheduled_time"
                className="text-[var(--text-primary)] flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Match Time *
              </Label>
              <Input
                id="scheduled_time"
                type="time"
                value={formData.scheduled_time}
                onChange={(e) =>
                  handleInputChange('scheduled_time', e.target.value)
                }
                className={errors.scheduled_time ? 'border-red-500' : ''}
              />
              {errors.scheduled_time && (
                <p className="text-sm text-red-400">{errors.scheduled_time}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-[var(--text-primary)]">
              Match Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleInputChange('status', value as MatchFormState['status'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MATCH_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Helper Text */}
          {formData.tournament_id && getSelectedTournament() && (
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
              <div className="text-sm text-[var(--text-secondary)] mb-2">
                Tournament Info
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[var(--text-secondary)]">
                    Start Date:{' '}
                  </span>
                  <span className="text-[var(--text-primary)]">
                    {new Date(
                      getSelectedTournament()!.start_date
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">
                    End Date:{' '}
                  </span>
                  <span className="text-[var(--text-primary)]">
                    {new Date(
                      getSelectedTournament()!.start_date
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Teams Info */}
          {teams.length > 0 && (
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
              <div className="text-sm text-[var(--text-secondary)] mb-2">
                Available Teams ({teams.length})
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {teams.map((team) => (
                  <div key={team.id} className="text-[var(--text-primary)]">
                    {team.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || isSameTeam}
              className="bg-gradient-to-r from-[var(--color-accent-1)] to-[var(--color-accent-2)] hover:from-[var(--color-accent-1)]/90 hover:to-[var(--color-accent-2)]/90 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <>{isEditMode ? 'Update Match' : 'Create Match'}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
