import { supabase } from '../supabase'

// Fetch the current (active) tournament
export async function getCurrentTournament() {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('status', 'registration_open')
    .order('registration_deadline', { ascending: true })
    .limit(1)
    .single()
  if (error) throw error
  return data
}

// Check if the user already registered a team (as captain)
export async function getUserTeam(userId: string) {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('captain_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

// Upload team logo to Supabase Storage (team-assets bucket)
export async function uploadTeamLogo(
  file: File,
  teamName: string
): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const filePath = `${teamName
    .replace(/\s+/g, '_')
    .toLowerCase()}_${Date.now()}.${fileExt}`
  const { error } = await supabase.storage
    .from('team-assets')
    .upload(filePath, file, { upsert: true })
  if (error) throw error
  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('team-assets')
    .getPublicUrl(filePath)
  return publicUrlData.publicUrl
}

// Register a team and its members
export async function registerTeam({
  teamName,
  logoUrl,
  members,
  captainId,
  tournamentId,
}: {
  teamName: string
  logoUrl?: string
  members: Array<TeamMemberInput>
  captainId: string
  tournamentId: string
}) {
  // Insert team
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({
      name: teamName,
      logo_url: logoUrl,
      captain_id: captainId,
      tournament_id: tournamentId,
    })
    .select()
    .single()
  if (teamError) throw teamError

  // Insert team members
  const membersWithTeam = members.map((m) => ({ ...m, team_id: team.id }))
  const { error: membersError } = await supabase
    .from('team_members')
    .insert(membersWithTeam)
  if (membersError) throw membersError

  return team
}

// Edit team info (name, logo) and members (replace all)
export async function editTeam({
  teamId,
  teamName,
  logoUrl,
  members,
}: {
  teamId: string
  teamName: string
  logoUrl?: string
  members: Array<TeamMemberInput>
}) {
  // Update team info
  const { error: teamError } = await supabase
    .from('teams')
    .update({ name: teamName, logo_url: logoUrl })
    .eq('id', teamId)
  if (teamError) throw teamError

  // Delete existing members
  const { error: delError } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
  if (delError) throw delError

  // Insert new members
  const membersWithTeam = members.map((m) => ({ ...m, team_id: teamId }))
  const { error: membersError } = await supabase
    .from('team_members')
    .insert(membersWithTeam)
  if (membersError) throw membersError
}

// Send confirmation email to captain (using Supabase Edge Function or 3rd party API)
export async function sendConfirmationEmail({
  email,
  teamName,
}: {
  email: string
  teamName: string
}) {
  // Example: call a Supabase Edge Function (must be implemented in Supabase dashboard)
  const response = await fetch('/functions/v1/send-confirmation-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, teamName }),
  })
  if (!response.ok) {
    throw new Error('Failed to send confirmation email')
  }
  return await response.json()
}

// Types
export type TeamMemberInput = {
  first_name: string
  last_name: string
  gender: 'male' | 'female'
  campus_card?: string
  batch: string
  is_captain: boolean
  user_id?: string
}

/**
 * Update a team member's campus_card field
 * This is used to sync campus_card between user_profiles and team_members tables
 */
export async function updateTeamMemberCampusCard(
  userId: string,
  campusCard: string | undefined
): Promise<void> {
  const { error } = await supabase
    .from('team_members')
    .update({ campus_card: campusCard })
    .eq('user_id', userId)

  if (error) {
    console.warn(
      `Failed to update team member campus_card for user ${userId}:`,
      error
    )
    // Don't throw error as this is a sync operation and shouldn't break profile updates
  }
}

export interface Team {
  id: string
  name: string
  captain_id: string
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  name: string
  email: string
  phone: string
  role: 'captain' | 'member'
  created_at: string
  updated_at: string
}

// Get all teams
export async function getAllTeams(): Promise<Team[]> {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching teams:', error)
      throw new Error('Failed to fetch teams')
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllTeams:', error)
    throw new Error('Failed to fetch teams')
  }
}

// Get teams by tournament (teams that have registered for a specific tournament)
export async function getTeamsByTournament(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _tournamentId: string
): Promise<Team[]> {
  try {
    // This would need a tournament_registrations table or similar
    // For now, we'll return all teams as a placeholder
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching teams:', error)
      throw new Error('Failed to fetch teams')
    }

    return data || []
  } catch (error) {
    console.error('Error in getTeamsByTournament:', error)
    throw new Error('Failed to fetch teams')
  }
}

// Get team by ID
export async function getTeamById(id: string): Promise<Team | null> {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching team:', error)
      throw new Error('Failed to fetch team')
    }

    return data
  } catch (error) {
    console.error('Error in getTeamById:', error)
    throw new Error('Failed to fetch team')
  }
}

// Get team members
export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching team members:', error)
      throw new Error('Failed to fetch team members')
    }

    return data || []
  } catch (error) {
    console.error('Error in getTeamMembers:', error)
    throw new Error('Failed to fetch team members')
  }
}
