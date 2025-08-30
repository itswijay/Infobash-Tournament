import React, { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Crown, Shield, X, Save, Users, UserPlus } from 'lucide-react'
import type { TeamMemberInput } from '@/lib/api/teams'
import type { User } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

type TeamRegistrationFormProps = {
  user: User
  captainProfile: {
    first_name: string
    last_name: string
    gender: 'male' | 'female'
    campus_card?: string
    batch: string
  } | null
  onSubmit: (data: {
    teamName: string
    logoFile: File | null | undefined
    members: TeamMemberInput[]
  }) => Promise<void>
  loading?: boolean
  isEditMode?: boolean
  existingTeam?: {
    id: string
    name: string
    logo_url?: string
    captain_id: string
    tournament_id: string
    created_at: string
    updated_at: string
  }
  existingMembers?: Array<{
    id: string
    team_id: string
    first_name: string
    last_name: string
    gender: 'male' | 'female'
    campus_card?: string
    batch: string
    is_captain: boolean
    user_id?: string
    created_at: string
    updated_at: string
  }>
}

// Single member input component
type MemberInputProps = {
  member: TeamMemberInput
  onChange: (field: keyof TeamMemberInput, value: string) => void
  disabled?: boolean
}

const MemberInput: React.FC<MemberInputProps> = ({
  member,
  onChange,
  disabled,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-[var(--text-primary)]">
          First Name<span className="text-red-500">*</span>
        </Label>
        <Input
          value={member.first_name}
          onChange={(e) => onChange('first_name', e.target.value)}
          className="bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--text-primary)]"
          placeholder="Enter first name"
          required
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[var(--text-primary)]">
          Last Name<span className="text-red-500">*</span>
        </Label>
        <Input
          value={member.last_name}
          onChange={(e) => onChange('last_name', e.target.value)}
          className="bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--text-primary)]"
          placeholder="Enter last name"
          required
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[var(--text-primary)]">
          Gender<span className="text-red-500">*</span>
        </Label>
        <Select
          value={member.gender}
          onValueChange={(value) => onChange('gender', value)}
          disabled={disabled}
        >
          <SelectTrigger className="bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--text-primary)] focus:border-[var(--color-accent-1)] focus:ring-[var(--color-accent-1)]/50 hover:bg-[var(--color-secondary)]/30 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] transition-all duration-200 data-[state=open]:bg-[var(--color-secondary)]/20 data-[state=open]:border-[var(--color-secondary)]">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--text-primary)]">
            <SelectItem
              value="male"
              className="hover:bg-[var(--color-secondary)]/20 focus:bg-[var(--color-secondary)]/20 focus:text-[var(--text-primary)] data-[state=checked]:bg-[var(--color-secondary)]/30 data-[state=checked]:text-[var(--color-secondary)] transition-colors duration-200"
            >
              Male
            </SelectItem>
            <SelectItem
              value="female"
              className="hover:bg-[var(--color-secondary)]/20 focus:bg-[var(--color-secondary)]/20 focus:text-[var(--text-primary)] data-[state=checked]:bg-[var(--color-secondary)]/30 data-[state=checked]:text-[var(--color-secondary)] transition-colors duration-200"
            >
              Female
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-[var(--text-primary)]">
          Batch<span className="text-red-500">*</span>
        </Label>
        <Input
          value={member.batch}
          onChange={(e) => onChange('batch', e.target.value)}
          className="bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--text-primary)]"
          placeholder="e.g., 23/24"
          required
          disabled={disabled}
        />
      </div>
      <div className="md:col-span-2 space-y-2">
        <Label className="text-[var(--text-primary)]">
          Campus Card (Optional)
        </Label>
        <Input
          value={member.campus_card || ''}
          onChange={(e) => onChange('campus_card', e.target.value)}
          className="bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--text-primary)]"
          placeholder="Enter campus card number"
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export function TeamRegistrationForm({
  user,
  captainProfile,
  onSubmit,
  loading,
  isEditMode = false,
  existingTeam,
  existingMembers,
}: TeamRegistrationFormProps) {
  const [teamName, setTeamName] = useState(existingTeam?.name || '')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(
    existingTeam?.logo_url || null
  )
  const [logoRemoved, setLogoRemoved] = useState(false)
  const [members, setMembers] = useState<TeamMemberInput[]>(() => {
    if (isEditMode && existingMembers) {
      return existingMembers.map((member) => ({
        first_name: member.first_name,
        last_name: member.last_name,
        gender: member.gender,
        campus_card: member.campus_card,
        batch: member.batch,
        is_captain: member.is_captain,
        user_id: member.user_id,
      }))
    }

    return [
      {
        first_name: captainProfile?.first_name || '',
        last_name: captainProfile?.last_name || '',
        gender: captainProfile?.gender || 'male',
        campus_card: captainProfile?.campus_card || '',
        batch: captainProfile?.batch || '',
        is_captain: true,
        user_id: user?.id,
      },
    ]
  })
  const [newMember, setNewMember] = useState<TeamMemberInput>({
    first_name: '',
    last_name: '',
    gender: 'male',
    campus_card: '',
    batch: '',
    is_captain: false,
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Reset logo states when entering edit mode
  useEffect(() => {
    if (isEditMode && existingTeam) {
      setLogoPreview(existingTeam.logo_url || null)
      setLogoFile(null)
      setLogoRemoved(false)
    }
  }, [isEditMode, existingTeam])

  // Logo preview handler
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
      setLogoRemoved(false) // New logo uploaded
    }
  }

  // Remove logo handler
  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    setLogoRemoved(true) // Logo explicitly removed
    // Reset the file input
    const fileInput = document.getElementById('team-logo') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  // Add member handler
  const handleAddMember = () => {
    setFormError(null)
    if (
      !newMember.first_name.trim() ||
      !newMember.last_name.trim() ||
      !newMember.batch.trim()
    ) {
      toast.error('All member fields except campus card are required.')
      return
    }
    if (members.length >= 10) {
      toast.error('You cannot add more than 10 members.')
      return
    }
    // Gender constraint
    const boys =
      members.filter((m) => m.gender === 'male').length +
      (newMember.gender === 'male' ? 1 : 0)
    const girls =
      members.filter((m) => m.gender === 'female').length +
      (newMember.gender === 'female' ? 1 : 0)
    if (boys > 7) {
      toast.error('You can only add up to 7 males.')
      return
    }
    if (girls > 3) {
      toast.error('You can only add up to 3 females.')
      return
    }
    setMembers([...members, { ...newMember }])
    setNewMember({
      first_name: '',
      last_name: '',
      gender: 'male',
      campus_card: '',
      batch: '',
      is_captain: false,
    })
  }

  // Remove member handler (not for captain)
  const handleRemoveMember = (idx: number) => {
    if (idx === 0) return // captain cannot be removed
    setMembers(members.filter((_, i) => i !== idx))
  }

  // Fallback logo initials
  const getInitials = () => {
    return teamName
      .split(' ')
      .map((w) => w[0]?.toUpperCase())
      .join('')
      .slice(0, 2)
  }

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!teamName.trim()) {
      toast.error('Team name is required.')
      return
    }
    if (members.length !== 10) {
      toast.error('You must add exactly 10 members.')
      return
    }
    const boys = members.filter((m) => m.gender === 'male').length
    const girls = members.filter((m) => m.gender === 'female').length
    if (boys !== 7 || girls !== 3) {
      toast.error('Team must have exactly 7 males and 3 females.')
      return
    }
    if (
      members.some(
        (m) => !m.first_name.trim() || !m.last_name.trim() || !m.batch.trim()
      )
    ) {
      toast.error('All member fields except campus card are required.')
      return
    }
    setSubmitting(true)
    try {
      // Determine logo handling based on state
      let finalLogoFile: File | null | undefined = null
      if (logoFile) {
        // New logo uploaded
        finalLogoFile = logoFile
      } else if (logoRemoved) {
        // Logo was explicitly removed
        finalLogoFile = null
      } else {
        // No logo change in edit mode
        finalLogoFile = undefined
      }

      await onSubmit({ teamName, logoFile: finalLogoFile, members })
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.'
      setFormError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="bg-card-bg border-card-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-[var(--text-primary)]">
          <Users className="h-5 w-5" />
          <span>{isEditMode ? 'Edit Team' : 'Team Registration Form'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="team-name" className="text-[var(--text-primary)]">
              Team Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="team-name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--text-primary)]"
              placeholder="Enter your team name"
              required
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label htmlFor="team-logo" className="text-[var(--text-primary)]">
              Team Logo (Optional)
            </Label>
            <div className="flex items-center gap-4 mt-2">
              <Avatar className="h-16 w-16">
                {logoPreview ? (
                  <AvatarImage
                    src={logoPreview}
                    alt="Logo preview"
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-[var(--color-secondary)] text-[var(--brand-bg)] font-semibold text-xl">
                    {getInitials() || 'TM'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 space-y-2">
                <Input
                  id="team-logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="bg-[var(--brand-bg)] border-[var(--brand-border)] text-[var(--text-primary)]"
                />
                {(logoPreview || logoFile) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveLogo}
                    className="text-xs h-8 px-2 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove Logo
                  </Button>
                )}
                {logoRemoved && !logoPreview && !logoFile && (
                  <p className="text-xs text-orange-600">
                    Logo will be removed when you update the team
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Add Member Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label className="text-[var(--text-primary)]">
                Add Team Member <span className="text-red-500">*</span>
              </Label>
              <Badge variant="secondary" className="text-xs">
                {members.length}/10
              </Badge>
            </div>
            <div className="rounded-lg border border-[var(--brand-border)] p-6 bg-[var(--brand-bg)]">
              <MemberInput
                member={newMember}
                onChange={(field, value) =>
                  setNewMember((m) => ({ ...m, [field]: value }))
                }
                disabled={members.length >= 10}
              />
              <Button
                type="button"
                className="mt-4 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent-1)] hover:from-[var(--color-secondary)]/90 hover:to-[var(--color-accent-1)]/90 text-[var(--brand-bg)] font-semibold transition-all duration-200 hover:scale-[1.02]"
                onClick={handleAddMember}
                disabled={members.length >= 10}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              Exactly 10 members required. 7 males and 3 females. You (the
              captain) will add all team members during registration.
            </div>
          </div>

          {/* Preview Members */}
          <div className="space-y-4">
            <Label className="text-[var(--text-primary)]">
              Team Members Preview
            </Label>
            <div className="grid gap-3">
              {members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-[var(--brand-border)] px-4 py-3 bg-[var(--brand-bg)]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center">
                      {member.is_captain ? (
                        <Crown className="h-4 w-4 text-[var(--color-secondary)]" />
                      ) : (
                        <Shield className="h-4 w-4 text-[var(--color-secondary)]" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {member.first_name} {member.last_name}
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)]">
                        <span className="capitalize">{member.gender}</span>
                        <span>|</span>
                        <span>Batch: {member.batch}</span>
                        {member.campus_card && (
                          <>
                            <span>|</span>
                            <span className="font-semibold text-[13px]">
                              {member.campus_card}
                            </span>
                          </>
                        )}
                        {member.is_captain && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              Captain
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {idx !== 0 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 px-2 border-[var(--color-accent-1)] text-[var(--color-accent-1)] hover:bg-[var(--color-accent-1)]/10"
                      onClick={() => handleRemoveMember(idx)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {formError && (
            <div className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3">
              {formError}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent-1)] hover:from-[var(--color-secondary)]/90 hover:to-[var(--color-accent-1)]/90 text-[var(--brand-bg)] font-semibold py-3 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={submitting || loading}
          >
            {submitting || loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--brand-bg)] border-t-transparent mr-2" />
                {isEditMode ? 'Updating Team...' : 'Registering Team...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? 'Update Team' : 'Register Team'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
