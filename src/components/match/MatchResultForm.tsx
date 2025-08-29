import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trophy, FileText } from 'lucide-react'
import type { Match } from '@/lib/api/matches'
import type { Team } from '@/lib/api/teams'

interface MatchResultFormProps {
  match: Match
  teams: Team[]
  onSubmit: (data: {
    team1_score: string
    team2_score: string
    winner_id: string | null
    match_details: Record<string, unknown> | null
  }) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

interface MatchResultFormState {
  team1_score: string
  team2_score: string
  winner_id: string
  match_details: string
}

export function MatchResultForm({
  match,
  teams,
  onSubmit,
  onCancel,
  loading = false,
}: MatchResultFormProps) {
  const [formData, setFormData] = useState<MatchResultFormState>({
    team1_score: '',
    team2_score: '',
    winner_id: '',
    match_details: '',
  })

  const [errors, setErrors] = useState<Partial<MatchResultFormState>>({})

  // Initialize form with existing match data if available
  useEffect(() => {
    if (match) {
      setFormData({
        team1_score: match.team1_score || '',
        team2_score: match.team2_score || '',
        winner_id: match.winner_id || '',
        match_details: match.match_details
          ? JSON.stringify(match.match_details, null, 2)
          : '',
      })
    }
  }, [match])

  const handleInputChange = (
    field: keyof MatchResultFormState,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<MatchResultFormState> = {}

    // Score validation
    if (!formData.team1_score.trim()) {
      newErrors.team1_score = 'Team 1 score is required'
    }
    if (!formData.team2_score.trim()) {
      newErrors.team2_score = 'Team 2 score is required'
    }

    // Winner validation
    if (!formData.winner_id) {
      newErrors.winner_id = 'Winner must be selected'
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
      // Parse match details if provided
      let parsedMatchDetails: Record<string, unknown> | null = null
      if (formData.match_details.trim()) {
        try {
          parsedMatchDetails = JSON.parse(formData.match_details)
        } catch {
          setErrors((prev) => ({
            ...prev,
            match_details: 'Invalid JSON format',
          }))
          return
        }
      }

      await onSubmit({
        team1_score: formData.team1_score.trim(),
        team2_score: formData.team2_score.trim(),
        winner_id: formData.winner_id || null,
        match_details: parsedMatchDetails,
      })
    } catch (error) {
      console.error('Error submitting match result:', error)
    }
  }

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId)
    return team?.name || 'Unknown Team'
  }

  const getTeam1 = () => teams.find((t) => t.id === match.team1_id)
  const getTeam2 = () => teams.find((t) => t.id === match.team2_id)

  return (
    <Card className="border-[var(--border)] bg-[var(--card)]">
      <CardHeader>
        <CardTitle className="text-xl text-[var(--foreground)] flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Match Result: {getTeam1()?.name} vs {getTeam2()?.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Match Info */}
          <div className="bg-[var(--muted)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-sm text-[var(--muted-foreground)] mb-2">
              Match Information
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--muted-foreground)]">
                  Tournament:{' '}
                </span>
                <span className="text-[var(--foreground)]">
                  Tournament Name
                </span>
              </div>
              <div>
                <span className="text-[var(--muted-foreground)]">Date: </span>
                <span className="text-[var(--foreground)]">
                  {match.scheduled_at
                    ? new Date(match.scheduled_at).toLocaleDateString()
                    : 'TBD'}
                </span>
              </div>
            </div>
          </div>

          {/* Team Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-[var(--foreground)] mb-2">
                  {getTeamName(match.team1_id)}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="team1_score"
                    className="text-[var(--muted-foreground)]"
                  >
                    Score (e.g., 85/8)
                  </Label>
                  <Input
                    id="team1_score"
                    type="text"
                    value={formData.team1_score}
                    onChange={(e) =>
                      handleInputChange('team1_score', e.target.value)
                    }
                    placeholder="e.g., 85/8"
                    className={errors.team1_score ? 'border-red-500' : ''}
                  />
                  {errors.team1_score && (
                    <p className="text-sm text-red-400">{errors.team1_score}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-[var(--foreground)] mb-2">
                  {getTeamName(match.team2_id)}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="team2_score"
                    className="text-[var(--muted-foreground)]"
                  >
                    Score (e.g., 85/8)
                  </Label>
                  <Input
                    id="team2_score"
                    type="text"
                    value={formData.team2_score}
                    onChange={(e) =>
                      handleInputChange('team2_score', e.target.value)
                    }
                    placeholder="e.g., 85/8"
                    className={errors.team2_score ? 'border-red-500' : ''}
                  />
                  {errors.team2_score && (
                    <p className="text-sm text-red-400">{errors.team2_score}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Winner Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="winner_id"
              className="text-[var(--foreground)] flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Winner *
            </Label>
            <Select
              value={formData.winner_id}
              onValueChange={(value) => handleInputChange('winner_id', value)}
            >
              <SelectTrigger
                className={errors.winner_id ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Select the winning team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={match.team1_id}>
                  {getTeamName(match.team1_id)}
                </SelectItem>
                <SelectItem value={match.team2_id}>
                  {getTeamName(match.team2_id)}
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.winner_id && (
              <p className="text-sm text-red-400">{errors.winner_id}</p>
            )}
          </div>

          {/* Match Details */}
          <div className="space-y-2">
            <Label
              htmlFor="match_details"
              className="text-[var(--foreground)] flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Match Details (Optional)
            </Label>
            <Textarea
              id="match_details"
              value={formData.match_details}
              onChange={(e) =>
                handleInputChange('match_details', e.target.value)
              }
              placeholder="Enter match highlights, key moments, or additional notes (JSON format)"
              rows={4}
              className={errors.match_details ? 'border-red-500' : ''}
            />
            {errors.match_details && (
              <p className="text-sm text-red-400">{errors.match_details}</p>
            )}
            <p className="text-xs text-[var(--muted-foreground)]">
              You can enter JSON format for structured data, or plain text for
              simple notes.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] border-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                'Save Match Result'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
