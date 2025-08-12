import { PageLoading } from '@/components/shared/LoadingSpinner'

export function RegisterTeamPage() {
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
