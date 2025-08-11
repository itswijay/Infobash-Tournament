import { PageLoading } from '@/components/shared/LoadingSpinner'

export function TeamsPage() {
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">
            View all registered cricket teams
          </p>
        </div>

        <PageLoading message="Loading teams..." />
      </div>
    </div>
  )
}
