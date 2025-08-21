import { PageLoading } from '@/components/shared/LoadingSpinner'

export function MatchesPage() {
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Matches
          </h1>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-gold opacity-80" />
          <p className="text-[var(--text-secondary)]">
            View all cricket matches and live scores
          </p>
        </div>

        <PageLoading message="Loading matches..." />
      </div>
    </div>
  )
}
