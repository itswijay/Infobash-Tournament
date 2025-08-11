import { PageLoading } from '@/components/shared/LoadingSpinner'

export function TournamentsPage() {
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tournaments</h1>
          <p className="text-muted-foreground">
            Manage and view all cricket tournaments
          </p>
        </div>

        <PageLoading message="Loading tournaments..." />
      </div>
    </div>
  )
}
