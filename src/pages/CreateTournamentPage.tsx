import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  TournamentForm,
  type TournamentFormData,
} from '@/components/tournament/TournamentForm'
import { AdminGuard } from '@/components/auth/AdminGuard'
import { ROUTES } from '@/lib/constants'
import { createTournament } from '@/lib/api/tournaments'
import { logAdminAction } from '@/lib/api/admin'
import toast from 'react-hot-toast'

export function CreateTournamentPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: TournamentFormData) => {
    setLoading(true)

    try {
      // Create the tournament
      const newTournament = await createTournament(data)

      // Log the admin action
      await logAdminAction(
        'create',
        'tournaments',
        newTournament.id,
        undefined,
        data as unknown as Record<string, unknown>
      )

      toast.success('Tournament created successfully!')
      navigate(ROUTES.TOURNAMENTS)
    } catch (error) {
      console.error('Error creating tournament:', error)
      toast.error('Failed to create tournament')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(ROUTES.TOURNAMENTS)
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              onClick={handleCancel}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tournaments
            </Button>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Create New Tournament
            </h1>
            <p className="text-slate-300 text-lg">
              Set up a new cricket tournament with all the details
            </p>
          </div>

          {/* Tournament Form */}
          <TournamentForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </AdminGuard>
  )
}
