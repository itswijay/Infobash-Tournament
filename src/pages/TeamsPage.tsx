import { PageLoading } from '@/components/shared/LoadingSpinner'

export function TeamsPage() {
  return (
    <div className="container py-8 page-enter">
      <div className="space-y-6">
        <div>
          {/* Heading updated for readability (white text, subtle accent bar) */}
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Teams
          </h1>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-gold opacity-80" />
          <p className="text-[var(--text-secondary)]">
            View all registered cricket teams
          </p>
        </div>

        <PageLoading message="Loading teams..." />
      </div>
    </div>
  )
}
