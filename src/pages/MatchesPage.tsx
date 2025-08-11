import { PageLoading } from '@/components/shared/LoadingSpinner'

export function MatchesPage() {
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Matches</h1>
          <p className="text-muted-foreground">
            View all cricket matches and live scores
          </p>
        </div>

        <PageLoading message="Loading matches..." />
      </div>
    </div>
  )
}
