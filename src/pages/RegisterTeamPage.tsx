import { PageLoading } from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Lock,
  Users,
  Trophy,
  Shield,
  CheckCircle2,
  Edit,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { getUserTeam } from '@/lib/api/teams'
import { supabase } from '@/lib/supabase'
import { TeamRegistrationForm } from '@/components/team/TeamRegistrationForm'
import { Button } from '@/components/ui/button'
import type { TeamMemberInput } from '@/lib/api/teams'

interface Team {
  id: string
  name: string
  logo_url?: string
  captain_id: string
  tournament_id: string
  created_at: string
  updated_at: string
}

interface CaptainProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  gender: 'male' | 'female'
  batch: string
  campus_card?: string
  is_completed: boolean
  avatar_url?: string
  created_at: string
  updated_at: string
}

interface TeamMember {
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
}

export function RegisterTeamPage() {
  const { user, loading } = useAuth()

  const [team, setTeam] = useState<Team | null>(null)
  const [teamLoading, setTeamLoading] = useState(false)
  const [captainProfile, setCaptainProfile] = useState<CaptainProfile | null>(
    null
  )
  const [profileLoading, setProfileLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    if (user) {
      setTeamLoading(true)
      setProfileLoading(true)
      Promise.all([
        getUserTeam(user.id),
        supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
      ])
        .then(([teamData, { data: profile }]) => {
          setTeam(teamData)
          setCaptainProfile(profile)

          // If team exists, fetch team members
          if (teamData) {
            fetchTeamMembers(teamData.id)
          }
        })
        .finally(() => {
          setTeamLoading(false)
          setProfileLoading(false)
        })
    }
  }, [user])

  const fetchTeamMembers = async (teamId: string) => {
    try {
      const { data: members, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('is_captain', { ascending: false })

      if (error) throw error
      setTeamMembers(members || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
    }
  }

  const handleEditTeam = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleUpdateTeam = async (data: {
    teamName: string
    logoFile: File | null
    members: TeamMemberInput[]
  }) => {
    try {
      // Update team details
      const { error: teamError } = await supabase
        .from('teams')
        .update({
          name: data.teamName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', team!.id)

      if (teamError) throw teamError

      // Update team logo if provided
      if (data.logoFile) {
        const logoUrl = await import('@/lib/api/teams').then((m) =>
          m.uploadTeamLogo(data.logoFile!, data.teamName)
        )

        await supabase
          .from('teams')
          .update({ logo_url: logoUrl })
          .eq('id', team!.id)
      }

      // Delete existing team members
      await supabase.from('team_members').delete().eq('team_id', team!.id)

      // Insert updated team members
      const membersWithTeam = data.members.map((m) => ({
        ...m,
        team_id: team!.id,
      }))
      const { error: membersError } = await supabase
        .from('team_members')
        .insert(membersWithTeam)

      if (membersError) throw membersError

      // Refresh team data
      const updatedTeam = await getUserTeam(user!.id)
      setTeam(updatedTeam)
      await fetchTeamMembers(team!.id)

      setIsEditing(false)
      alert('Team updated successfully!')
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to update team. Please try again.'
      alert(errorMessage)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Register Your Team
            </h1>
            <div className="mt-2 h-1 w-28 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)] mt-2">
              Register your cricket team for upcoming tournaments
            </p>
          </div>
          <PageLoading message="Loading..." />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Register your Team for INFOBASH v4.0
          </h1>
          <div className="mt-2 h-1 w-32 rounded-full bg-gradient-gold opacity-80 mx-auto" />
          <p className="text-[var(--text-secondary)] mt-2">
            Join the tournament and showcase your cricket skills
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Info Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <div className="h-16 w-16 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center mx-auto">
                  <Trophy className="h-8 w-8 text-[var(--color-secondary)]" />
                </div>
              </div>
              <CardTitle className="text-[var(--text-primary)]">
                Tournament Ready
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-[var(--text-secondary)] text-sm">
                Professional cricket tournament management with live updates and
                comprehensive tracking.
              </p>
            </CardContent>
          </Card>

          {/* Sign In Card */}
          <Card className="bg-card-bg border-card-border md:col-span-2">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <div className="h-16 w-16 rounded-full bg-[var(--color-accent-1)]/10 flex items-center justify-center mx-auto">
                  <Lock className="h-8 w-8 text-[var(--color-accent-1)]" />
                </div>
              </div>
              <CardTitle className="text-xl text-[var(--text-primary)]">
                Sign In Required
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-[var(--text-secondary)]">
                You need to sign in with your Google account before you can
                register your team for tournaments.
              </p>

              <div className="space-y-4">
                <GoogleLoginButton
                  variant="modern"
                  size="lg"
                  className="w-full"
                >
                  Sign In to Register Team
                </GoogleLoginButton>

                <p className="text-sm text-[var(--text-secondary)]">
                  Sign in securely with Google to access team registration and
                  tournament features.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show loading while checking if user already registered a team
  if (teamLoading || profileLoading) {
    return (
      <div className="container py-8">
        <PageLoading message="Loading registration form..." />
      </div>
    )
  }

  // If already registered, show info (can add edit option later)
  if (team && !isEditing) {
    return (
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Team Already Registered
          </h1>
          <div className="mt-2 h-1 w-28 rounded-full bg-gradient-gold opacity-80" />
          <p className="text-[var(--text-secondary)] mt-2">
            Your team has been successfully registered for the tournament
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {team.logo_url ? (
                  <img
                    src={team.logo_url}
                    alt={`${team.name} logo`}
                    className="h-24 w-24 rounded-full object-cover mx-auto border-4 border-[var(--color-secondary)]/20"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center mx-auto border-4 border-[var(--color-secondary)]/20">
                    <Users className="h-16 w-16 text-[var(--color-secondary)]" />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl text-[var(--text-primary)] mb-2">
                {team.name}
              </CardTitle>
              <div className="flex items-center justify-center space-x-2 text-[var(--text-secondary)]">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">
                  Team Successfully Registered!
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Section */}
              <div className="border-t border-[var(--brand-border)]"></div>

              {/* Success Message */}
              <div className="text-center py-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-[var(--text-primary)] font-medium mb-1">
                  Welcome to InfoBash v4.0!
                </p>
                <p className="text-[var(--text-secondary)] text-sm">
                  Your team "{team.name}" is now registered and ready to
                  participate in the tournament.
                </p>
              </div>

              {/* Action Button */}
              <div >
                <Button
                  onClick={handleEditTeam}
                  className="w-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent-1)] hover:from-[var(--color-secondary)]/90 hover:to-[var(--color-accent-1)]/90 text-[var(--brand-bg)] font-semibold py-3 transition-all duration-200 hover:scale-[1.02]"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Team Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show edit form
  if (team && isEditing) {
    return (
      <div className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Edit Team
            </h1>
            <div className="mt-2 h-1 w-28 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)] mt-2">
              Update your team information and members
            </p>
          </div>
          <Button
            onClick={handleCancelEdit}
            variant="outline"
            className="border-[var(--color-accent-1)] text-[var(--color-accent-1)] hover:bg-[var(--color-accent-1)]/10"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel Edit
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Info Card */}
          <Card className="bg-card-bg border-card-border">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <div className="h-16 w-16 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center mx-auto">
                  <Edit className="h-8 w-8 text-[var(--color-secondary)]" />
                </div>
              </div>
              <CardTitle className="text-[var(--text-primary)]">
                Edit Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Users className="h-4 w-4 text-[var(--color-secondary)]" />
                <span className="text-[var(--text-secondary)]">
                  Update team details
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="h-4 w-4 text-[var(--color-secondary)]" />
                <span className="text-[var(--text-secondary)]">
                  Modify members
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Trophy className="h-4 w-4 text-[var(--color-secondary)]" />
                <span className="text-[var(--text-secondary)]">
                  Change logo
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <div className="md:col-span-2">
            <TeamRegistrationForm
              captainProfile={captainProfile}
              user={user!}
              onSubmit={handleUpdateTeam}
              loading={false}
              isEditMode={true}
              existingTeam={team}
              existingMembers={teamMembers}
            />
          </div>
        </div>
      </div>
    )
  }

  // Show registration form
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Register Your Team
        </h1>
        <div className="mt-2 h-1 w-28 rounded-full bg-gradient-gold opacity-80" />
        <p className="text-[var(--text-secondary)] mt-2">
          Register your cricket team for upcoming tournaments
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Info Card */}
        <Card className="bg-card-bg border-card-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <div className="h-16 w-16 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-[var(--color-secondary)]" />
              </div>
            </div>
            <CardTitle className="text-[var(--text-primary)]">
              Team Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <Users className="h-4 w-4 text-[var(--color-secondary)]" />
              <span className="text-[var(--text-secondary)]">
                Exactly 10 members
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="h-4 w-4 text-[var(--color-secondary)]" />
              <span className="text-[var(--text-secondary)]">
                7 males, 3 females
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Trophy className="h-4 w-4 text-[var(--color-secondary)]" />
              <span className="text-[var(--text-secondary)]">
                Captain included
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <div className="md:col-span-2">
          <TeamRegistrationForm
            captainProfile={captainProfile}
            user={user!}
            onSubmit={async ({ teamName, logoFile, members }) => {
              try {
                // 1. Get current tournament
                const tournament = await import('@/lib/api/teams')
                  .then((m) => m.getCurrentTournament())
                  .catch(() => null)
                if (!tournament) throw new Error('No active tournament found.')

                // 2. Upload logo if provided
                let logoUrl: string | undefined = undefined
                if (logoFile) {
                  logoUrl = await import('@/lib/api/teams').then((m) =>
                    m.uploadTeamLogo(logoFile, teamName)
                  )
                }

                // 3. Register team and members
                await import('@/lib/api/teams').then((m) =>
                  m.registerTeam({
                    teamName,
                    logoUrl,
                    members,
                    captainId: user!.id,
                    tournamentId: tournament.id,
                  })
                )

                // Registration complete, reload page
                window.location.reload()
              } catch (err: unknown) {
                const errorMessage =
                  err instanceof Error
                    ? err.message
                    : 'Registration failed. Please try again.'
                alert(errorMessage)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
