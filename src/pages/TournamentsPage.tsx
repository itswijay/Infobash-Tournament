import { PageLoading } from '@/components/shared/LoadingSpinner'

export function TournamentsPage() {
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Tournaments
          </h1>
          <div className="mt-2 h-1 w-20 rounded-full bg-gradient-gold opacity-80" />
          <p className="text-[var(--text-secondary)]">
            Manage and view all cricket tournaments
          </p>
        </div>

        <PageLoading message="Loading tournaments..." />
      </div>
    </div>
  )
}
