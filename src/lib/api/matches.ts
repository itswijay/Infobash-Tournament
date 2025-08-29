import { supabase } from '@/lib/supabase'

export interface Match {
  id: string
  tournament_id: string
  team1_id: string
  team2_id: string
  scheduled_at: string | null
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  team1_score: string | null
  team2_score: string | null
  winner_id: string | null
  match_details: Record<string, unknown> | null
  created_at: string | null
  updated_at: string | null
}

export interface CreateMatchData {
  tournament_id: string
  team1_id: string
  team2_id: string
  scheduled_at: string
  status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
}

export type UpdateMatchData = Partial<CreateMatchData> & {
  team1_score?: string | null
  team2_score?: string | null
  winner_id?: string | null
  match_details?: Record<string, unknown> | null
}

// Get all matches for a tournament
export async function getMatchesByTournament(
  tournamentId: string
): Promise<Match[]> {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching matches:', error)

      if (error.code === '42703') {
        console.warn(
          'Matches table has different column structure than expected'
        )
        return []
      }

      throw new Error('Failed to fetch matches')
    }

    return data || []
  } catch (error) {
    console.error('Error in getMatchesByTournament:', error)
    return []
  }
}

// Get a single match by ID
export async function getMatchById(id: string): Promise<Match | null> {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching match:', error)
      throw new Error('Failed to fetch match')
    }

    return data
  } catch (error) {
    console.error('Error in getMatchById:', error)
    throw new Error('Failed to fetch match')
  }
}

// Create a new match
export async function createMatch(matchData: CreateMatchData): Promise<Match> {
  try {
    const formattedData = {
      ...matchData,
      status: matchData.status || 'scheduled',
    }

    const { data, error } = await supabase
      .from('matches')
      .insert(formattedData)
      .select()
      .single()

    if (error) {
      console.error('Error creating match:', error)
      throw new Error('Failed to create match')
    }

    return data
  } catch (error) {
    console.error('Error in createMatch:', error)
    throw new Error('Failed to create match')
  }
}

// Update an existing match
export async function updateMatch(
  id: string,
  matchData: UpdateMatchData
): Promise<Match> {
  try {
    const formattedData: Record<string, unknown> = { ...matchData }

    const { data, error } = await supabase
      .from('matches')
      .update(formattedData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating match:', error)
      throw new Error('Failed to update match')
    }

    return data
  } catch (error) {
    console.error('Error in updateMatch:', error)
    throw new Error('Failed to update match')
  }
}

// Update match results (scores, winner, details)
export async function updateMatchResults(
  id: string,
  resultData: {
    team1_score: string
    team2_score: string
    winner_id: string | null
    match_details?: Record<string, unknown> | null
  }
): Promise<Match> {
  try {
    const formattedData = {
      ...resultData,
      status: 'completed' as const, // Mark match as completed
    }

    const { data, error } = await supabase
      .from('matches')
      .update(formattedData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating match results:', error)
      throw new Error('Failed to update match results')
    }

    return data
  } catch (error) {
    console.error('Error in updateMatchResults:', error)
    throw new Error('Failed to update match results')
  }
}

// Delete a match
export async function deleteMatch(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('matches').delete().eq('id', id)

    if (error) {
      console.error('Error deleting match:', error)
      throw new Error('Failed to delete match')
    }
  } catch (error) {
    console.error('Error in deleteMatch:', error)
    throw new Error('Failed to delete match')
  }
}

// Get all matches (admin only)
export async function getAllMatches(): Promise<Match[]> {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching all matches:', error)

      // If it's a column error, the table might have different structure
      if (error.code === '42703') {
        console.warn(
          'Matches table has different column structure than expected'
        )
        return []
      }

      throw new Error('Failed to fetch matches')
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllMatches:', error)
    return []
  }
}

// Get upcoming scheduled matches with team and tournament details
export async function getUpcomingMatches(limit: number = 3): Promise<
  Array<
    Match & {
      team1_name: string
      team2_name: string
      tournament_name: string
      venue: string
    }
  >
> {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(
        `
        *,
        team1:team1_id(name),
        team2:team2_id(name),
        tournament:tournament_id(name)
      `
      )
      .eq('status', 'scheduled')
      .order('scheduled_at', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error fetching upcoming matches:', error)
      return []
    }

    // Transform the data to flatten the nested objects
    return (data || []).map((match) => ({
      ...match,
      team1_name: match.team1?.name || 'Unknown Team',
      team2_name: match.team2?.name || 'Unknown Team',
      tournament_name: match.tournament?.name || 'Unknown Tournament',
      venue: 'Hunduwa Ground', // Default venue for now
    }))
  } catch (error) {
    console.error('Error in getUpcomingMatches:', error)
    return []
  }
}
