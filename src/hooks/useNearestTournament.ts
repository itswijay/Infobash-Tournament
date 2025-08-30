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
  refreshStatus: () => Promise<void>
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
  }, []) // Only run once on mount

  // Separate effect for countdown monitoring
  useEffect(() => {
    if (!tournament || !startTime) return

    // Check if tournament is in countdown phase
    const now = new Date().getTime()
    const targetTime = startTime.getTime()

    if (targetTime <= now) return // Countdown already finished

    // Set up interval to check when countdown finishes
    const interval = setInterval(() => {
      const currentTime = new Date().getTime()
      if (currentTime >= targetTime) {
        // Countdown finished, refresh data
        fetchData()
      }
    }, 1000) // Check every second for countdown completion

    return () => clearInterval(interval)
  }, [tournament?.id, startTime?.getTime()]) // Only depend on tournament ID and start time value

  return {
    tournament,
    startTime,
    loading,
    error,
    refetch: fetchData,
    // Add manual refresh for status updates
    refreshStatus: async () => {
      try {
        // Only update statuses, don't change loading state
        await updateTournamentStatuses()
        // Then refresh tournament data
        await fetchData()
      } catch (err) {
        console.error('Error refreshing status:', err)
      }
    },
  }
}
