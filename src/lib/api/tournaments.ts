import { supabase } from '@/lib/supabase'

export interface Tournament {
  id: string
  name: string
  description: string | null
  start_date: string
  end_date: string
  registration_deadline: string
  max_teams: number
  status: string
  created_at: string
  updated_at: string
}

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
    console.error('Error in getTournamentById:', error)
    throw new Error('Failed to fetch tournament')
  }
}
