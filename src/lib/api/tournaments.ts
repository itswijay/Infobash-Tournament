import { supabase } from '@/lib/supabase'
import { localDateTimeStringToISO } from '@/lib/utils'

export interface Tournament {
  id: string
  name: string
  description: string | null
  start_date: string
  end_date: string
  registration_deadline: string
  max_teams: number
  status:
    | 'upcoming'
    | 'registration_open'
    | 'registration_closed'
    | 'ongoing'
    | 'completed'
  man_of_tournament: string | null
  created_at: string
  updated_at: string
}

export interface CreateTournamentData {
  name: string
  description: string
  start_date: string
  end_date: string
  registration_deadline: string
  max_teams: number
  status:
    | 'upcoming'
    | 'registration_open'
    | 'registration_closed'
    | 'ongoing'
    | 'completed'
  man_of_tournament: string | null
}

export type UpdateTournamentData = Partial<CreateTournamentData>

export async function getAllTournaments(): Promise<Tournament[]> {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tournaments:', error)
      throw new Error('Failed to fetch tournaments')
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllTournaments:', error)
    throw new Error('Failed to fetch tournaments')
  }
}

export async function getTournamentById(
  id: string
): Promise<Tournament | null> {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching tournament:', error)
      throw new Error('Failed to fetch tournament')
    }

    return data
  } catch (error) {
    console.error('Error in getTournamentsById:', error)
    throw new Error('Failed to fetch tournament')
  }
}

export async function createTournament(
  tournamentData: CreateTournamentData
): Promise<Tournament> {
  try {
    // Convert date strings to ISO format for database while preserving local timezone
    const formattedData = {
      ...tournamentData,
      start_date: new Date(tournamentData.start_date).toISOString(),
      end_date: new Date(tournamentData.end_date).toISOString(),
      // Convert local datetime to ISO while preserving local time
      registration_deadline: localDateTimeStringToISO(
        tournamentData.registration_deadline
      ),
    }

    const { data, error } = await supabase
      .from('tournaments')
      .insert(formattedData)
      .select()
      .single()

    if (error) {
      console.error('Error creating tournament:', error)
      throw new Error('Failed to create tournament')
    }

    return data
  } catch (error) {
    console.error('Error in createTournament:', error)
    throw new Error('Failed to create tournament')
  }
}

export async function updateTournament(
  id: string,
  tournamentData: UpdateTournamentData
): Promise<Tournament> {
  try {
    // Convert date strings to ISO format if they exist
    const formattedData: Record<string, unknown> = { ...tournamentData }

    if (tournamentData.start_date) {
      formattedData.start_date = new Date(
        tournamentData.start_date
      ).toISOString()
    }
    if (tournamentData.end_date) {
      formattedData.end_date = new Date(tournamentData.end_date).toISOString()
    }
    if (tournamentData.registration_deadline) {
      // Convert local datetime to ISO while preserving local time
      formattedData.registration_deadline = localDateTimeStringToISO(
        tournamentData.registration_deadline
      )
    }

    const { data, error } = await supabase
      .from('tournaments')
      .update(formattedData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating tournament:', error)
      throw new Error('Failed to update tournament')
    }

    return data
  } catch (error) {
    console.error('Error in updateTournament:', error)
    throw new Error('Failed to update tournament')
  }
}

export async function getNearestUpcomingTournament(): Promise<Tournament | null> {
  try {
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .in('status', ['upcoming', 'registration_open', 'registration_closed'])
      .gte('start_date', now)
      .order('start_date', { ascending: true })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - no upcoming tournaments
        return null
      }
      console.error('Error fetching nearest upcoming tournament:', error)
      throw new Error('Failed to fetch nearest upcoming tournament')
    }

    return data
  } catch (error) {
    console.error('Error in getNearestUpcomingTournament:', error)
    throw new Error('Failed to fetch nearest upcoming tournament')
  }
}

export async function getNearestUpcomingTournamentStartTime(): Promise<Date | null> {
  try {
    const tournament = await getNearestUpcomingTournament()
    return tournament ? new Date(tournament.start_date) : null
  } catch (error) {
    console.error(
      'Error getting nearest upcoming tournament start time:',
      error
    )
    return null
  }
}

export async function deleteTournament(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('tournaments').delete().eq('id', id)

    if (error) {
      console.error('Error deleting tournament:', error)
      throw new Error('Failed to delete tournament')
    }
  } catch (error) {
    console.error('Error in deleteTournament:', error)
    throw new Error('Failed to delete tournament')
  }
}
