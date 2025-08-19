import React, { useState, ChangeEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Avatar } from '@/components/ui/avatar'
import type { TeamMemberInput } from '@/lib/api/teams'

type TeamRegistrationFormProps = {
  user: any
  captainProfile: any
  onSubmit: (data: any) => void
  loading?: boolean
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
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>
          First Name<span className="text-red-500">*</span>
        </Label>
        <Input
          value={member.first_name}
          onChange={(e) => onChange('first_name', e.target.value)}
          className="bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)]"
          required
          disabled={disabled}
        />
      </div>
      <div>
        <Label>
          Last Name<span className="text-red-500">*</span>
        </Label>
        <Input
          value={member.last_name}
          onChange={(e) => onChange('last_name', e.target.value)}
          className="bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)]"
          required
          disabled={disabled}
        />
      </div>
      <div>
        <Label>
          Gender<span className="text-red-500">*</span>
        </Label>
        <select
          value={member.gender}
          onChange={(e) => onChange('gender', e.target.value)}
          className="w-full rounded-md border px-2 py-1 bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)]"
          required
          disabled={disabled}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div>
        <Label>
          Batch<span className="text-red-500">*</span>
        </Label>
        <Input
          value={member.batch}
          onChange={(e) => onChange('batch', e.target.value)}
          className="bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)]"
          required
          disabled={disabled}
        />
      </div>
      <div className="col-span-2">
        <Label>Campus Card (optional)</Label>
        <Input
          value={member.campus_card || ''}
          onChange={(e) => onChange('campus_card', e.target.value)}
          className="bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)]"
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
}: TeamRegistrationFormProps) {
  const [teamName, setTeamName] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [members, setMembers] = useState<TeamMemberInput[]>([
    {
      first_name: captainProfile?.first_name || '',
      last_name: captainProfile?.last_name || '',
      gender: captainProfile?.gender || 'male',
      campus_card: captainProfile?.campus_card || '',
      batch: captainProfile?.batch || '',
      is_captain: true,
      user_id: user?.id,
    },
  ])
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

  // Logo preview handler
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
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
      setFormError('All member fields except campus card are required.')
      return
    }
    if (members.length >= 10) {
      setFormError('You cannot add more than 10 members.')
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
      setFormError('You can only add up to 7 males.')
      return
    }
    if (girls > 3) {
      setFormError('You can only add up to 3 females.')
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
      setFormError('Team name is required.')
      return
    }
    if (members.length !== 10) {
      setFormError('You must add exactly 10 members.')
      return
    }
    const boys = members.filter((m) => m.gender === 'male').length
    const girls = members.filter((m) => m.gender === 'female').length
    if (boys !== 7 || girls !== 3) {
      setFormError('Team must have exactly 7 males and 3 females.')
      return
    }
    if (
      members.some(
        (m) => !m.first_name.trim() || !m.last_name.trim() || !m.batch.trim()
      )
    ) {
      setFormError('All member fields except campus card are required.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({ teamName, logoFile, members })
    } catch (err: any) {
      setFormError(err?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto bg-card-bg border-card-border">
      <CardHeader>
        <CardTitle className="text-2xl text-[var(--text-primary)]">
          Team Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div>
            <Label htmlFor="team-name" className="text-[var(--text-primary)]">
              Team Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="team-name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="mt-1 bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)]"
              required
            />
          </div>

          {/* Logo Upload */}
          <div>
            <Label htmlFor="team-logo" className="text-[var(--text-primary)]">
              Team Logo (optional)
            </Label>
            <div className="flex items-center gap-4 mt-2">
              <Avatar className="h-14 w-14 text-2xl bg-[var(--color-accent-1)]/10">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="object-cover h-full w-full rounded-full"
                  />
                ) : (
                  <span className="font-bold text-[var(--color-accent-1)]">
                    {getInitials()}
                  </span>
                )}
              </Avatar>
              <Input
                id="team-logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)]"
              />
            </div>
          </div>

          {/* Add Member Section */}
          <div>
            <Label className="text-[var(--text-primary)]">
              Add Team Member <span className="text-red-500">*</span>
            </Label>
            <div className="rounded-lg border border-[var(--input-border)] p-4 bg-[var(--input-bg)] mt-2">
              <MemberInput
                member={newMember}
                onChange={(field, value) =>
                  setNewMember((m) => ({ ...m, [field]: value }))
                }
                disabled={members.length >= 10}
              />
              <Button
                type="button"
                className="mt-4 bg-[var(--color-accent-1)] text-white hover:bg-[var(--color-accent-2)]"
                onClick={handleAddMember}
                disabled={members.length >= 10}
              >
                Add Member
              </Button>
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-2">
              Exactly 10 members required. 7 males and 3 females. Captain is the
              one who fills this form.
            </div>
          </div>

          {/* Preview Members */}
          <div>
            <Label className="text-[var(--text-primary)]">
              Team Members Preview
            </Label>
            <div className="grid grid-cols-1 gap-3 mt-2">
              {members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded border border-[var(--input-border)] px-4 py-2 bg-[var(--input-bg)]"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {member.first_name} {member.last_name}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {member.gender === 'male' ? 'Male' : 'Female'} | Batch:{' '}
                      {member.batch}
                    </span>
                    {member.is_captain && (
                      <span className="text-xs text-[var(--color-accent-1)] font-semibold">
                        (Captain - you)
                      </span>
                    )}
                  </div>
                  {idx !== 0 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleRemoveMember(idx)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {formError && (
            <div className="text-red-500 text-sm text-center">{formError}</div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-[var(--color-accent-1)] text-white hover:bg-[var(--color-accent-2)]"
            disabled={submitting || loading}
          >
            {submitting || loading ? 'Submitting...' : 'Register Team'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
