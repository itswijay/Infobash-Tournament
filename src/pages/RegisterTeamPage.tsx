import { PageLoading } from '@/components/shared/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, UserPlus } from 'lucide-react'

export function RegisterTeamPage() {
  const { user, loading } = useAuth()

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

        <PageLoading message="Loading registration form..." />
      </div>
    </div>
  )
}
