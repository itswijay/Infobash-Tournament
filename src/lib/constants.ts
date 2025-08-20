// Application constants

export const APP_NAME = 'InfoBash'
export const APP_DESCRIPTION =
  'Professional cricket tournament management system'

// Routes
export const ROUTES = {
  HOME: '/',
  TOURNAMENTS: '/tournaments',
  TEAMS: '/teams',
  MATCHES: '/matches',
  REGISTER_TEAM: '/register',
  INSTRUCTIONS: '/instructions',
  PROFILE: '/profile',
  PROFILE_COMPLETION: '/profile/complete',
} as const

// Player roles
export const PLAYER_ROLES = {
  BATSMAN: 'batsman',
  BOWLER: 'bowler',
  ALL_ROUNDER: 'all-rounder',
  WICKET_KEEPER: 'wicket-keeper',
} as const

export const PLAYER_ROLE_LABELS = {
  [PLAYER_ROLES.BATSMAN]: 'Batsman',
  [PLAYER_ROLES.BOWLER]: 'Bowler',
  [PLAYER_ROLES.ALL_ROUNDER]: 'All-rounder',
  [PLAYER_ROLES.WICKET_KEEPER]: 'Wicket-keeper',
} as const

// File upload limits
export const FILE_LIMITS = {
  TEAM_LOGO: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
  PROFILE_AVATAR: {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
} as const

// Form constraints
export const FORM_CONSTRAINTS = {
  TEAM: {
    MIN_PLAYERS: 11,
    MAX_PLAYERS: 15,
    MIN_WICKET_KEEPERS: 1,
    MAX_WICKET_KEEPERS: 2,
  },
} as const

// Cricket specific constants
export const CRICKET = {
  BALLS_PER_OVER: 6,
  MAX_WICKETS: 10,
  MAX_OVERS_T20: 20,
  MAX_OVERS_ODI: 50,
} as const

// Theme colors
export const THEME_COLORS = {
  PRIMARY: 'hsl(142.1 76.2% 36.3%)', // Green
  SECONDARY: 'hsl(210 40% 98%)', // Light gray
  ACCENT: 'hsl(142.1 76.2% 36.3%)', // Green
  DESTRUCTIVE: 'hsl(0 84.2% 60.2%)', // Red
  WARNING: 'hsl(38 92% 50%)', // Orange
  SUCCESS: 'hsl(142.1 76.2% 36.3%)', // Green
  INFO: 'hsl(221.2 83.2% 53.3%)', // Blue
} as const

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  FILE_SIZE: 'File size too large. Please select a smaller file.',
  FILE_TYPE: 'Invalid file type. Please select a valid file.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  TEAM_REGISTERED: 'Team registered successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  DATA_SAVED: 'Data saved successfully!',
} as const
