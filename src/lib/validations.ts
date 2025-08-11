import { z } from 'zod'

// Player validation schema
export const playerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits'),
  role: z.enum(['batsman', 'bowler', 'all-rounder', 'wicket-keeper'], {
    message: 'Please select a player role',
  }),
})

// Team registration validation schema
export const teamRegistrationSchema = z.object({
  name: z
    .string()
    .min(3, 'Team name must be at least 3 characters')
    .max(30, 'Team name must be less than 30 characters')
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      'Team name can only contain letters, numbers, and spaces'
    ),

  captain_name: z.string().min(2, 'Captain name must be at least 2 characters'),
  captain_email: z.string().email('Please enter a valid email address'),
  captain_phone: z.string().min(10, 'Phone number must be at least 10 digits'),

  players: z
    .array(playerSchema)
    .min(11, 'A team must have at least 11 players')
    .max(15, 'A team cannot have more than 15 players')
    .refine((players) => {
      const wicketKeepers = players.filter(
        (p) => p.role === 'wicket-keeper'
      ).length
      return wicketKeepers >= 1 && wicketKeepers <= 2
    }, 'A team must have 1-2 wicket-keepers')
    .refine((players) => {
      const emails = players.map((p) => p.email.toLowerCase())
      return new Set(emails).size === emails.length
    }, 'All player emails must be unique'),

  logo: z
    .instanceof(File, { message: 'Please upload a team logo' })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'Logo must be less than 5MB'
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Logo must be a JPEG, PNG, or WebP image'
    )
    .optional(),
})

// Tournament creation validation schema
export const tournamentSchema = z
  .object({
    name: z
      .string()
      .min(5, 'Tournament name must be at least 5 characters')
      .max(100, 'Tournament name must be less than 100 characters'),

    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be less than 500 characters'),

    start_date: z
      .string()
      .refine(
        (date) => new Date(date) > new Date(),
        'Start date must be in the future'
      ),

    end_date: z.string(),

    max_teams: z
      .number()
      .min(4, 'Tournament must have at least 4 teams')
      .max(32, 'Tournament cannot have more than 32 teams'),

    venue: z
      .string()
      .min(5, 'Venue must be at least 5 characters')
      .max(100, 'Venue must be less than 100 characters'),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: 'End date must be after start date',
    path: ['end_date'],
  })

// Match creation validation schema
export const matchSchema = z
  .object({
    team1_id: z.string().uuid('Please select a valid team'),
    team2_id: z.string().uuid('Please select a valid team'),

    scheduled_at: z
      .string()
      .refine(
        (date) => new Date(date) > new Date(),
        'Match must be scheduled for a future date'
      ),

    venue: z
      .string()
      .min(5, 'Venue must be at least 5 characters')
      .max(100, 'Venue must be less than 100 characters'),
  })
  .refine((data) => data.team1_id !== data.team2_id, {
    message: 'Teams must be different',
    path: ['team2_id'],
  })

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Registration validation schema
export const registrationSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Profile update validation schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .optional(),
  avatar: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      'Avatar must be less than 2MB'
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Avatar must be a JPEG, PNG, or WebP image'
    )
    .optional(),
})

// Score update validation schema
export const scoreUpdateSchema = z.object({
  runs: z
    .number()
    .min(0, 'Runs cannot be negative')
    .max(36, 'Maximum 36 runs per ball'),
  wickets: z
    .number()
    .min(0, 'Wickets cannot be negative')
    .max(10, 'Maximum 10 wickets'),
  overs: z.number().min(0, 'Overs cannot be negative'),
  balls: z
    .number()
    .min(0, 'Balls cannot be negative')
    .max(5, 'Maximum 5 balls per over'),
  extras: z.number().min(0, 'Extras cannot be negative').optional(),
  commentary: z
    .string()
    .max(200, 'Commentary must be less than 200 characters')
    .optional(),
})

// Search validation schema
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query cannot be empty')
    .max(100, 'Search query too long'),
  filters: z
    .object({
      tournament_id: z.string().optional(),
      status: z.string().optional(),
      date_range: z
        .object({
          start: z.string().optional(),
          end: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
})

// Export types
export type PlayerFormData = z.infer<typeof playerSchema>
export type TeamRegistrationFormData = z.infer<typeof teamRegistrationSchema>
export type TournamentFormData = z.infer<typeof tournamentSchema>
export type MatchFormData = z.infer<typeof matchSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RegistrationFormData = z.infer<typeof registrationSchema>
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>
export type ScoreUpdateFormData = z.infer<typeof scoreUpdateSchema>
export type SearchFormData = z.infer<typeof searchSchema>
