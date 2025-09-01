import React, { useState, useEffect } from 'react'
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
import { Calendar, Users, Clock } from 'lucide-react'
import type { Tournament } from '@/lib/api/tournaments'
import toast from 'react-hot-toast'

interface TournamentFormProps {
  tournament?: Tournament | null
  isEditMode?: boolean
  onSubmit: (data: TournamentFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export interface TournamentFormData {
  name: string
  description: string
  start_date: string
  end_date: string
  registration_deadline: string
  max_teams: number
  status:
    | 'upcoming'
    | 'registration_open'
    | 'registration_closed'
    | 'ongoing'
    | 'completed'
  man_of_tournament: string | null
}

interface TournamentFormState {
  name: string
  description: string
  start_date: string
  start_time: string
  end_date: string
  end_time: string
  registration_deadline_date: string
  registration_deadline_time: string
  max_teams: string
  status:
    | 'upcoming'
    | 'registration_open'
    | 'registration_closed'
    | 'ongoing'
    | 'completed'
  man_of_tournament: string
}

const TOURNAMENT_STATUSES = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'registration_open', label: 'Registration Open' },
  { value: 'registration_closed', label: 'Registration Closed' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
] as const

export function TournamentForm({
  tournament,
  isEditMode = false,
  onSubmit,
  onCancel,
  loading = false,
}: TournamentFormProps) {
  const [formData, setFormData] = useState<TournamentFormState>({
    name: '',
    description: '',
    start_date: '',
    start_time: '00:00',
    end_date: '',
    end_time: '23:59',
    registration_deadline_date: '',
    registration_deadline_time: '00:00',
    max_teams: '16',
    status: 'upcoming',
    man_of_tournament: '',
  })

  const [errors, setErrors] = useState<Partial<TournamentFormState>>({})

  // Initialize form with existing tournament data if editing
  useEffect(() => {
    if (tournament && isEditMode) {
      // Extract date and time directly from the datetime string without conversion
      const startDateTime = tournament.start_date
      const endDateTime = tournament.end_date
      const registrationDateTime = tournament.registration_deadline

      setFormData({
        name: tournament.name,
        description: tournament.description || '',
        start_date: startDateTime.split('T')[0],
        start_time: startDateTime.split('T')[1]?.substring(0, 5) || '00:00',
        end_date: endDateTime.split('T')[0],
        end_time: endDateTime.split('T')[1]?.substring(0, 5) || '23:59',
        registration_deadline_date: registrationDateTime.split('T')[0],
        registration_deadline_time:
          registrationDateTime.split('T')[1]?.substring(0, 5) || '00:00',
        max_teams: tournament.max_teams.toString(),
        status: tournament.status,
        man_of_tournament: tournament.man_of_tournament || '',
      })
    }
  }, [tournament, isEditMode])

  // Smart defaults when start date changes
  useEffect(() => {
    if (formData.start_date && !isEditMode) {
      // Set end date to same as start date
      setFormData((prev) => ({ ...prev, end_date: formData.start_date }))

      // Set registration deadline to same date as start date, time 12:00 AM
      setFormData((prev) => ({
        ...prev,
        registration_deadline_date: formData.start_date,
        registration_deadline_time: '00:00',
      }))
    }
  }, [formData.start_date, isEditMode])

  const validateForm = (): boolean => {
    const newErrors: Partial<TournamentFormState> = {}
    const today = new Date()
    const todayString = today.toISOString().split('T')[0] // YYYY-MM-DD format

    // Create datetime strings for comparison (no Date objects to avoid timezone issues)
    const startDateTimeString = `${formData.start_date}T${formData.start_time}:00`
    const endDateTimeString = `${formData.end_date}T${formData.end_time}:00`
    const registrationDeadlineString = `${formData.registration_deadline_date}T${formData.registration_deadline_time}:00`
    const maxTeams = parseInt(formData.max_teams)

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Tournament name is required'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Tournament name must be at least 3 characters'
    }

    // Date and time validations
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required'
    } else if (!formData.start_time) {
      newErrors.start_time = 'Start time is required'
    } else if (!isEditMode && formData.start_date <= todayString) {
      newErrors.start_date = 'Start date must be in the future'
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required'
    } else if (!formData.end_time) {
      newErrors.end_time = 'End time is required'
    } else if (endDateTimeString < startDateTimeString) {
      newErrors.end_date =
        'End date and time must be on or after start date and time'
    }

    if (!formData.registration_deadline_date) {
      newErrors.registration_deadline_date =
        'Registration deadline date is required'
    } else if (!formData.registration_deadline_time) {
      newErrors.registration_deadline_time =
        'Registration deadline time is required'
    } else if (registrationDeadlineString >= startDateTimeString) {
      newErrors.registration_deadline_date =
        'Registration deadline must be before tournament start date and time'
    } else if (
      !isEditMode &&
      formData.registration_deadline_date <= todayString
    ) {
      newErrors.registration_deadline_date =
        'Registration deadline must be in the future'
    }

    // Max teams validation
    if (maxTeams < 2) {
      newErrors.max_teams = 'Minimum 2 teams required'
    } else if (maxTeams > 32) {
      newErrors.max_teams = 'Maximum 32 teams allowed'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      // Format: YYYY-MM-DDTHH:mm:ss (local time, no timezone)
      const startDateTime = `${formData.start_date}T${formData.start_time}:00`
      const endDateTime = `${formData.end_date}T${formData.end_time}:00`
      const registrationDeadline = `${formData.registration_deadline_date}T${formData.registration_deadline_time}:00`

      // Convert form data to the expected format
      const submitData: TournamentFormData = {
        name: formData.name,
        description: formData.description,
        start_date: startDateTime,
        end_date: endDateTime,
        registration_deadline: registrationDeadline,
        max_teams: parseInt(formData.max_teams),
        status: formData.status,
        man_of_tournament: formData.man_of_tournament || null,
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error('Error submitting tournament:', error)
      toast.error('Failed to save tournament')
    }
  }

  const handleInputChange = (
    field: keyof TournamentFormState,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-[var(--text-primary)]">
          {isEditMode ? 'Edit Tournament' : 'Create New Tournament'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tournament Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[var(--text-primary)]">
              Tournament Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter tournament name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[var(--text-primary)]">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter tournament description"
              rows={3}
            />
          </div>

          {/* Start Date and Time */}
          <div className="space-y-2">
            <Label
              htmlFor="start_date"
              className="text-[var(--text-primary)] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Start Date & Time *
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label
                  htmlFor="start_date"
                  className="text-xs text-[var(--text-secondary)]"
                >
                  Date
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    handleInputChange('start_date', e.target.value)
                  }
                  className={errors.start_date ? 'border-red-500' : ''}
                />
                {errors.start_date && (
                  <p className="text-red-500 text-sm">{errors.start_date}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="start_time"
                  className="text-xs text-[var(--text-secondary)]"
                >
                  Time
                </Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) =>
                    handleInputChange('start_time', e.target.value)
                  }
                  className={errors.start_time ? 'border-red-500' : ''}
                />
                {errors.start_time && (
                  <p className="text-red-500 text-sm">{errors.start_time}</p>
                )}
              </div>
            </div>
          </div>

          {/* End Date and Time */}
          <div className="space-y-2">
            <Label
              htmlFor="end_date"
              className="text-[var(--text-primary)] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              End Date & Time *
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label
                  htmlFor="end_date"
                  className="text-xs text-[var(--text-secondary)]"
                >
                  Date
                </Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    handleInputChange('end_date', e.target.value)
                  }
                  className={errors.end_date ? 'border-red-500' : ''}
                />
                {errors.end_date && (
                  <p className="text-red-500 text-sm">{errors.end_date}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="end_time"
                  className="text-xs text-[var(--text-secondary)]"
                >
                  Time
                </Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) =>
                    handleInputChange('end_time', e.target.value)
                  }
                  className={errors.end_time ? 'border-red-500' : ''}
                />
                {errors.end_time && (
                  <p className="text-red-500 text-sm">{errors.end_time}</p>
                )}
              </div>
            </div>
            {formData.start_date &&
              formData.end_date === formData.start_date && (
                <p className="text-[var(--text-secondary)] text-xs">
                  ✓ Automatically set to same date as start date
                </p>
              )}
          </div>

          {/* Registration Deadline Row */}
          <div className="space-y-2">
            <Label
              htmlFor="registration_deadline_date"
              className="text-[var(--text-primary)] flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Registration Deadline *
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label
                  htmlFor="registration_deadline_date"
                  className="text-xs text-[var(--text-secondary)]"
                >
                  Date
                </Label>
                <Input
                  id="registration_deadline_date"
                  type="date"
                  value={formData.registration_deadline_date}
                  onChange={(e) =>
                    handleInputChange(
                      'registration_deadline_date',
                      e.target.value
                    )
                  }
                  className={
                    errors.registration_deadline_date ? 'border-red-500' : ''
                  }
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="registration_deadline_time"
                  className="text-xs text-[var(--text-secondary)]"
                >
                  Time
                </Label>
                <Input
                  id="registration_deadline_time"
                  type="time"
                  value={formData.registration_deadline_time}
                  onChange={(e) =>
                    handleInputChange(
                      'registration_deadline_time',
                      e.target.value
                    )
                  }
                  className={
                    errors.registration_deadline_time ? 'border-red-500' : ''
                  }
                />
              </div>
            </div>
            {errors.registration_deadline_date && (
              <p className="text-red-500 text-sm">
                {errors.registration_deadline_date}
              </p>
            )}
            {errors.registration_deadline_time && (
              <p className="text-red-500 text-sm">
                {errors.registration_deadline_time}
              </p>
            )}
            <p className="text-[var(--text-secondary)] text-xs">
              Teams must register before this date and time
            </p>
            {formData.start_date &&
              formData.registration_deadline_date === formData.start_date && (
                <p className="text-[var(--text-secondary)] text-xs">
                  ✓ Automatically set to same date as start date (12:00 AM)
                </p>
              )}
          </div>

          {/* Max Teams and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Max Teams */}
            <div className="space-y-2">
              <Label
                htmlFor="max_teams"
                className="text-[var(--text-primary)] flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Maximum Teams *
              </Label>
              <Input
                id="max_teams"
                type="number"
                min="2"
                max="32"
                value={formData.max_teams}
                onChange={(e) => handleInputChange('max_teams', e.target.value)}
                className={errors.max_teams ? 'border-red-500' : ''}
              />
              {errors.max_teams && (
                <p className="text-red-500 text-sm">{errors.max_teams}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[var(--text-primary)]">
                Status *
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleInputChange(
                    'status',
                    value as TournamentFormState['status']
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {TOURNAMENT_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Man of Tournament */}
          <div className="space-y-2">
            <Label
              htmlFor="man_of_tournament"
              className="text-[var(--text-primary)]"
            >
              Man of Tournament
            </Label>
            <Input
              id="man_of_tournament"
              value={formData.man_of_tournament}
              onChange={(e) =>
                handleInputChange('man_of_tournament', e.target.value)
              }
              placeholder="Enter player name (optional)"
            />
            <p className="text-[var(--text-secondary)] text-sm">
              Leave empty if not yet determined
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              {loading
                ? 'Saving...'
                : isEditMode
                ? 'Update Tournament'
                : 'Create Tournament'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
