import { PageLoading } from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getUserTeam } from '@/lib/api/teams'
import { supabase } from '@/lib/supabase'
import { TeamRegistrationForm } from '@/components/team/TeamRegistrationForm'

export function RegisterTeamPage() {
  const { user, loading } = useAuth()

  const [team, setTeam] = useState<any>(null)
  const [teamLoading, setTeamLoading] = useState(false)
  const [captainProfile, setCaptainProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(false)

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
        })
        .finally(() => {
          setTeamLoading(false)
          setProfileLoading(false)
        })
    }
  }, [user])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Register Your Team
            </h1>
            <div className="mt-2 h-1 w-28 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)]">
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
      <div className="container py-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-2xl font-bold text-[var(--text-primary)]">
              Register your Team for INFOBASH v4.0
            </h1>
            <div className="mt-2 lg:mb-12 h-1 w-32 rounded-full bg-gradient-gold opacity-80 mx-auto" />
          </div>

          <Card className="max-w-lg mx-auto bg-card-bg border-card-border">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-[var(--color-accent-1)]/10 flex items-center justify-center">
                <Lock className="h-8 w-8 text-[var(--color-accent-1)]" />
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
  if (team) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              You have already registered a team
            </h1>
            <div className="mt-2 h-1 w-28 rounded-full bg-gradient-gold opacity-80" />
            <p className="text-[var(--text-secondary)]">
              Team Name: <span className="font-semibold">{team.name}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show registration form
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Register Your Team
          </h1>
          <div className="mt-2 h-1 w-28 rounded-full bg-gradient-gold opacity-80" />
          <p className="text-[var(--text-secondary)]">
            Register your cricket team for upcoming tournaments
          </p>
        </div>
        <TeamRegistrationForm
          captainProfile={captainProfile}
          user={user}
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
              const team = await import('@/lib/api/teams').then((m) =>
                m.registerTeam({
                  teamName,
                  logoUrl,
                  members,
                  captainId: user.id,
                  tournamentId: tournament.id,
                })
              )

              // Registration complete, reload page
              window.location.reload()
            } catch (err: any) {
              alert(err.message || 'Registration failed. Please try again.')
            }
          }}
        />
      </div>
    </div>
  )
}
