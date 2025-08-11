import { PageLoading } from '@/components/shared/LoadingSpinner'

export function RegisterTeamPage() {
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Register Your Team</h1>
          <p className="text-muted-foreground">
            Register your cricket team for upcoming tournaments
          </p>
        </div>

        <PageLoading message="Loading registration form..." />
      </div>
    </div>
  )
}
