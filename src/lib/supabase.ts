import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Types for our database
export type Database = {
  public: {
    Tables: {
      tournaments: {
        Row: {
          id: string
          name: string
          description: string | null
          start_date: string
          end_date: string
          status: 'upcoming' | 'ongoing' | 'completed'
          max_teams: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          start_date: string
          end_date: string
          status?: 'upcoming' | 'ongoing' | 'completed'
          max_teams: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string
          status?: 'upcoming' | 'ongoing' | 'completed'
          max_teams?: number
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          captain_id: string
          tournament_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          captain_id: string
          tournament_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          captain_id?: string
          tournament_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      players: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper'
          team_id: string | null
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper'
          team_id?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          role?: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper'
          team_id?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          tournament_id: string
          team1_id: string
          team2_id: string
          scheduled_at: string
          venue: string | null
          status: 'scheduled' | 'live' | 'completed' | 'cancelled'
          winner_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tournament_id: string
          team1_id: string
          team2_id: string
          scheduled_at: string
          venue?: string | null
          status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
          winner_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tournament_id?: string
          team1_id?: string
          team2_id?: string
          scheduled_at?: string
          venue?: string | null
          status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
          winner_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
