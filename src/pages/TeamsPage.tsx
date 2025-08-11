import { PageLoading } from '@/components/shared/LoadingSpinner'

export function TeamsPage() {
  return (
    <div className="container py-8 page-enter">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Teams
          </h1>
          <p className="text-slate-300">View all registered cricket teams</p>
        </div>

        <PageLoading message="Loading teams..." />
      </div>
    </div>
  )
}
