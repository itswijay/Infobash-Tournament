import { supabase } from '@/lib/supabase'
import {
  updateTeamMemberCampusCard,
  updateTeamMemberIndexNumber,
} from './teams'

export interface UserProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  gender: 'male' | 'female'
  batch: string
  index_number: string
  campus_card?: string
  is_completed: boolean
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface CreateProfileData {
  first_name: string
  last_name: string
  gender: 'male' | 'female'
  batch: string
  index_number: string
  campus_card?: string
  avatar_url?: string
}

export interface UpdateProfileData extends Partial<CreateProfileData> {
  // Gender cannot be updated after initial creation
  gender?: never
}

/**
 * Get user profile by user ID
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Profile not found
      return null
    }
    throw new Error(`Failed to fetch user profile: ${error.message}`)
  }

  return data
}

/**
 * Create a new user profile
 */
export async function createUserProfile(
  userId: string,
  profileData: CreateProfileData
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      user_id: userId,
      ...profileData,
      is_completed: true,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create user profile: ${error.message}`)
  }

  // Sync campus_card with team_members table if user is a team captain
  if (profileData.campus_card !== undefined) {
    await updateTeamMemberCampusCard(userId, profileData.campus_card)
  }

  // Sync index_number with team_members table if user is a team captain
  if (profileData.index_number !== undefined) {
    await updateTeamMemberIndexNumber(userId, profileData.index_number)
  }

  return data
}

/**
 * Update an existing user profile
 */
export async function updateUserProfile(
  userId: string,
  profileData: UpdateProfileData
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update user profile: ${error.message}`)
  }

  // Sync campus_card with team_members table if user is a team captain
  if (profileData.campus_card !== undefined) {
    await updateTeamMemberCampusCard(userId, profileData.campus_card)
  }

  // Sync index_number with team_members table if user is a team captain
  if (profileData.index_number !== undefined) {
    await updateTeamMemberIndexNumber(userId, profileData.index_number)
  }

  return data
}

/**
 * Check if a user has a completed profile
 */
export async function hasCompleteProfile(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('is_completed')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Profile not found
      return false
    }
    throw new Error(`Failed to check profile completion: ${error.message}`)
  }

  return data.is_completed === true
}

/**
 * Mark a profile as completed
 */
export async function markProfileAsComplete(userId: string): Promise<void> {
  const { error } = await supabase
    .from('user_profiles')
    .update({
      is_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to mark profile as complete: ${error.message}`)
  }
}
