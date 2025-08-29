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
          registration_deadline: string
          status:
            | 'upcoming'
            | 'registration_open'
            | 'registration_closed'
            | 'ongoing'
            | 'completed'
          max_teams: number
          man_of_tournament: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          start_date: string
          end_date: string
          registration_deadline: string
          status?:
            | 'upcoming'
            | 'registration_open'
            | 'registration_closed'
            | 'ongoing'
            | 'completed'
          max_teams: number
          man_of_tournament?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string
          registration_deadline?: string
          status?:
            | 'upcoming'
            | 'registration_open'
            | 'registration_closed'
            | 'ongoing'
            | 'completed'
          max_teams?: number
          man_of_tournament?: string | null
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
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string | null
          joined_at: string | null
          first_name: string
          last_name: string
          gender: string
          campus_card: string | null
          batch: string
          is_captain: boolean
        }
        Insert: {
          id?: string
          team_id: string
          user_id?: string | null
          joined_at?: string | null
          first_name: string
          last_name: string
          gender: string
          campus_card?: string | null
          batch: string
          is_captain?: boolean
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string | null
          joined_at?: string | null
          first_name?: string
          last_name?: string
          gender?: string
          campus_card?: string | null
          batch?: string
          is_captain?: boolean
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
          scheduled_at: string | null
          status: 'scheduled' | 'live' | 'completed' | 'cancelled'
          team1_score: string | null
          team2_score: string | null
          winner_id: string | null
          match_details: any | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          tournament_id: string
          team1_id: string
          team2_id: string
          scheduled_at?: string | null
          status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
          team1_score?: string | null
          team2_score?: string | null
          winner_id?: string | null
          match_details?: any | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          tournament_id?: string
          team1_id?: string
          team2_id?: string
          scheduled_at?: string | null
          status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
          team1_score?: string | null
          team2_score?: string | null
          winner_id?: string | null
          match_details?: any | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      match_results: {
        Row: {
          id: string
          match_id: string
          team1_batting_score: string
          team2_batting_score: string
          highlights: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_id: string
          team1_batting_score: string
          team2_batting_score: string
          highlights?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          team1_batting_score?: string
          team2_batting_score?: string
          highlights?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      admin_audit_logs: {
        Row: {
          id: string
          user_id: string
          action_type: string
          action_description: string
          resource_type: string | null
          resource_id: string | null
          additional_data: any | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action_type: string
          action_description: string
          resource_type?: string | null
          resource_id?: string | null
          additional_data?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action_type?: string
          action_description?: string
          resource_type?: string | null
          resource_id?: string | null
          additional_data?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Functions: {
      is_user_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      get_user_role: {
        Args: Record<string, never>
        Returns: string | null
      }
    }
  }
}
