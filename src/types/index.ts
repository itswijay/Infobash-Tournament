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
  players?: Player[]
  captain?: Player
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
  team?: Team
}

export interface Match {
  id: string
  tournament_id: string
  team1_id: string
  team2_id: string
  scheduled_at: string
  venue?: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  winner_id?: string
  created_at: string
  updated_at: string
  team1?: Team
  team2?: Team
  winner?: Team
  score?: MatchScore
}

export interface MatchScore {
  id: string
  match_id: string
  team_id: string
  runs: number
  wickets: number
  overs: number
  balls: number
  extras: number
  created_at: string
  updated_at: string
  team?: Team
}

export interface LiveScore {
  match_id: string
  current_over: number
  current_ball: number
  team1_score: {
    runs: number
    wickets: number
    overs: number
  }
  team2_score: {
    runs: number
    wickets: number
    overs: number
  }
  current_batting_team: string
  last_ball_commentary?: string
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

export interface TournamentForm {
  name: string
  description: string
  start_date: string
  end_date: string
  max_teams: number
  venue: string
}

export interface MatchForm {
  team1_id: string
  team2_id: string
  scheduled_at: string
  venue: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// Store types
export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface TournamentState {
  tournaments: Tournament[]
  currentTournament: Tournament | null
  isLoading: boolean
  error: string | null
}

export interface TeamState {
  teams: Team[]
  currentTeam: Team | null
  isLoading: boolean
  error: string | null
}

export interface MatchState {
  matches: Match[]
  liveMatches: Map<string, LiveScore>
  currentMatch: Match | null
  isLoading: boolean
  error: string | null
}
