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

// get tournaments by status
export async function getTournamentsByStatus(
  status: Tournament['status']
): Promise<Tournament[]> {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('status', status)
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Error fetching tournaments by status:', error)
      throw new Error('Failed to fetch tournaments by status')
    }

    return data || []
  } catch (error) {
    console.error('Error in getTournamentsByStatus:', error)
    throw new Error('Failed to fetch tournaments by status')
  }
}

// get the active tournament (ongoing, registration_open, registration_closed, or upcoming)
export async function getActiveTournament(): Promise<Tournament | null> {
  try {
    // First try to get ongoing tournament
    const { data: ongoingData, error: ongoingError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('status', 'ongoing')
      .order('start_date', { ascending: true })
      .limit(1)
      .single()

    if (ongoingData) {
      return ongoingData
    }

    if (ongoingError && ongoingError.code !== 'PGRST116') {
      console.error('Error fetching ongoing tournament:', ongoingError)
      throw new Error('Failed to fetch ongoing tournament')
    }

    // If no ongoing, try registration_open
    const { data: regOpenData, error: regOpenError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('status', 'registration_open')
      .order('start_date', { ascending: true })
      .limit(1)
      .single()

    if (regOpenData) {
      return regOpenData
    }

    if (regOpenError && regOpenError.code !== 'PGRST116') {
      console.error(
        'Error fetching registration open tournament:',
        regOpenError
      )
      throw new Error('Failed to fetch registration open tournament')
    }

    // If no registration_open, try registration_closed
    const { data: regClosedData, error: regClosedError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('status', 'registration_closed')
      .order('start_date', { ascending: true })
      .limit(1)
      .single()

    if (regClosedData) {
      return regClosedData
    }

    if (regClosedError && regClosedError.code !== 'PGRST116') {
      console.error(
        'Error fetching registration closed tournament:',
        regClosedError
      )
      throw new Error('Failed to fetch registration closed tournament')
    }

    // If no registration_closed, try upcoming
    const { data: upcomingData, error: upcomingError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('status', 'upcoming')
      .order('start_date', { ascending: true })
      .limit(1)
      .single()

    if (upcomingData) {
      return upcomingData
    }

    if (upcomingError && upcomingError.code !== 'PGRST116') {
      console.error('Error fetching upcoming tournament:', upcomingError)
      throw new Error('Failed to fetch upcoming tournament')
    }

    // No active tournaments found
    return null
  } catch (error) {
    console.error('Error in getActiveTournament:', error)
    throw new Error('Failed to fetch active tournament')
  }
}

// New function to automatically update tournament statuses based on current time
export async function updateTournamentStatuses(): Promise<void> {
  try {
    const now = new Date().toISOString()

    // Update registration_open to registration_closed when deadline passes
    const { error: regClosedError } = await supabase
      .from('tournaments')
      .update({ status: 'registration_closed' })
      .eq('status', 'registration_open')
      .lt('registration_deadline', now)

    if (regClosedError) {
      console.error(
        'Error updating registration_open to registration_closed:',
        regClosedError
      )
    }

    // Update registration_closed to ongoing when start_date arrives
    const { error: ongoingError } = await supabase
      .from('tournaments')
      .update({ status: 'ongoing' })
      .eq('status', 'registration_closed')
      .lte('start_date', now)

    if (ongoingError) {
      console.error(
        'Error updating registration_closed to ongoing:',
        ongoingError
      )
    }

    // Update ongoing to completed when end_date passes
    const { error: completedError } = await supabase
      .from('tournaments')
      .update({ status: 'completed' })
      .eq('status', 'ongoing')
      .lt('end_date', now)

    if (completedError) {
      console.error('Error updating ongoing to completed:', completedError)
    }

    // Update upcoming to registration_open when registration_deadline is approaching (optional - you can remove this if you want manual control)
    // This is optional - you might want to manually control when registration opens
    // const { error: regOpenError } = await supabase
    //   .from('tournaments')
    //   .update({ status: 'registration_open' })
    //   .eq('status', 'upcoming')
    //   .lte('registration_deadline', now)

    // if (regOpenError) {
    //   console.error('Error updating upcoming to registration_open:', regOpenError)
    // }
  } catch (error) {
    console.error('Error in updateTournamentStatuses:', error)
    throw new Error('Failed to update tournament statuses')
  }
}

// get tournament countdown target (always start_date)
export function getTournamentCountdownTarget(tournament: Tournament): Date {
  return new Date(tournament.start_date)
}

// check if tournament is in countdown phase
export function isTournamentInCountdownPhase(tournament: Tournament): boolean {
  const startDate = new Date(tournament.start_date)
  return startDate > new Date()
}
