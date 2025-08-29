import { useState, useEffect } from 'react'
import {
  getNearestUpcomingTournament,
  getNearestUpcomingTournamentStartTime,
} from '@/lib/api/tournaments'
import type { Tournament } from '@/lib/api/tournaments'

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

      const [tournamentData, startTimeData] = await Promise.all([
        getNearestUpcomingTournament(),
        getNearestUpcomingTournamentStartTime(),
      ])

      setTournament(tournamentData)
      setStartTime(startTimeData)
    } catch (err) {
      console.error('Error fetching nearest tournament:', err)
      setError('Failed to fetch nearest tournament data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    tournament,
    startTime,
    loading,
    error,
    refetch: fetchData,
  }
}
