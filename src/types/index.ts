// Core types for the cricket tournament application

export interface Tournament {
  id: string
  name: string
  description?: string
  start_date: string
  end_date: string
  status: 'upcoming' | 'ongoing' | 'completed'
  max_teams: number
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  logo_url?: string
  captain_id: string
  tournament_id: string
  created_at: string
  updated_at: string
}

export interface Player {
  id: string
  name: string
  email: string
  phone?: string
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper'
  team_id?: string
  user_id?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  role: 'player' | 'admin' | 'organizer'
  created_at: string
  updated_at: string
}

// Form types
export interface TeamRegistrationForm {
  name: string
  captain_name: string
  captain_email: string
  captain_phone: string
  players: {
    name: string
    email: string
    phone: string
    role: Player['role']
  }[]
  logo?: File
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}
