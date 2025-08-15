// Application constants

export const APP_NAME = 'InfoBash'
export const APP_DESCRIPTION =
  'Professional cricket tournament management system'

// Routes
export const ROUTES = {
  HOME: '/',
  TOURNAMENTS: '/tournaments',
  TOURNAMENT_DETAIL: '/tournaments/:id',
  TEAMS: '/teams',
  TEAM_DETAIL: '/teams/:id',
  MATCHES: '/matches',
  MATCH_DETAIL: '/matches/:id',
  REGISTER_TEAM: '/register',
  INSTRUCTIONS: '/instructions',
  PROFILE: '/profile',
  ADMIN: '/admin',
  LOGIN: '/login',
  SIGNUP: '/signup',
} as const

// API endpoints
export const API_ENDPOINTS = {
  TOURNAMENTS: '/tournaments',
  TEAMS: '/teams',
  PLAYERS: '/players',
  MATCHES: '/matches',
  SCORES: '/scores',
  USERS: '/users',
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

// Tournament status
export const TOURNAMENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
} as const

export const TOURNAMENT_STATUS_LABELS = {
  [TOURNAMENT_STATUS.UPCOMING]: 'Upcoming',
  [TOURNAMENT_STATUS.ONGOING]: 'Ongoing',
  [TOURNAMENT_STATUS.COMPLETED]: 'Completed',
} as const

// Match status
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const MATCH_STATUS_LABELS = {
  [MATCH_STATUS.SCHEDULED]: 'Scheduled',
  [MATCH_STATUS.LIVE]: 'Live',
  [MATCH_STATUS.COMPLETED]: 'Completed',
  [MATCH_STATUS.CANCELLED]: 'Cancelled',
} as const

// User roles
export const USER_ROLES = {
  PLAYER: 'player',
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
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

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const

// Form constraints
export const FORM_CONSTRAINTS = {
  TEAM: {
    MIN_PLAYERS: 11,
    MAX_PLAYERS: 15,
    MIN_WICKET_KEEPERS: 1,
    MAX_WICKET_KEEPERS: 2,
  },
  TOURNAMENT: {
    MIN_TEAMS: 4,
    MAX_TEAMS: 32,
  },
  PLAYER: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
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

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'infobash_user_preferences',
  AUTH_TOKEN: 'infobash_auth_token',
  THEME: 'infobash_theme',
  LANGUAGE: 'infobash_language',
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
  TOURNAMENT_CREATED: 'Tournament created successfully!',
  MATCH_CREATED: 'Match created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  DATA_SAVED: 'Data saved successfully!',
} as const

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy at h:mm a',
  INPUT: 'yyyy-MM-dd',
  INPUT_WITH_TIME: "yyyy-MM-dd'T'HH:mm",
} as const
