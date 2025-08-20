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

// Export types
export type PlayerFormData = z.infer<typeof playerSchema>
export type TeamRegistrationFormData = z.infer<typeof teamRegistrationSchema>
