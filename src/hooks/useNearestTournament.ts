import { useState, useEffect } from 'react'
import {
  getNearestUpcomingTournament,
  updateTournamentStatuses,
  getTournamentCountdownTarget,
} from '@/lib/api/tournaments'
import type { Tournament } from '@/lib/api/tournaments'
import toast from 'react-hot-toast'

interface UseNearestTournamentReturn {
  tournament: Tournament | null
  startTime: Date | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useNearestTournament(): UseNearestTournamentReturn {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // First update tournament statuses automatically
      await updateTournamentStatuses()

      // Then get the active tournament
      const tournamentData = await getNearestUpcomingTournament()

      if (tournamentData) {
        setTournament(tournamentData)
        // Always use start_date for countdown as requested
        setStartTime(getTournamentCountdownTarget(tournamentData))
      } else {
        setTournament(null)
        setStartTime(null)
        toast('No active tournaments found at the moment.', { icon: 'ℹ️' })
      }
    } catch (err) {
      console.error('Error fetching active tournament:', err)
      setError('Failed to fetch tournament data. Please check back later.')
      toast.error('Failed to fetch tournament data. Please check back later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchData()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  return {
    tournament,
    startTime,
    loading,
    error,
    refetch: fetchData,
  }
}
