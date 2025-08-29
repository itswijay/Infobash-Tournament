import { supabase } from '@/lib/supabase'

/**
 * Check if the current authenticated user is an admin
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export async function checkUserRole(): Promise<{
  isAdmin: boolean
  role: string | null
}> {
  try {
    const { data: isAdmin, error: adminError } = await supabase.rpc(
      'is_user_admin'
    )
    if (adminError) throw adminError

    const { data: userRole, error: roleError } = await supabase.rpc(
      'get_user_role'
    )
    if (roleError) throw roleError

    return {
      isAdmin: isAdmin || false,
      role: userRole,
    }
  } catch (error) {
    console.error('Error checking user role:', error)
    return {
      isAdmin: false,
      role: null,
    }
  }
}

/**
 * Check if the current user is an admin (simplified version)
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export async function isUserAdmin(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_user_admin')
    if (error) throw error
    return data || false
  } catch (error) {
    console.error('Error checking if user is admin:', error)
    return false
  }
}

/**
 * Log admin action for audit purposes
 * @param action - The action performed (e.g., 'create', 'update', 'delete')
 * @param tableName - The table affected
 * @param recordId - The ID of the record affected (optional)
 * @param oldValues - Previous values before change (optional)
 * @param newValues - New values after change (optional)
 */
export async function logAdminAction(
  action: string,
  tableNameOrDescription: string,
  recordId?: string,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>
): Promise<void> {
  // Handle backward compatibility: if second parameter looks like a description, treat it as such
  const isDescription =
    tableNameOrDescription.includes(' ') || tableNameOrDescription.includes('_')
  const tableName = isDescription ? 'matches' : tableNameOrDescription
  const description = isDescription
    ? tableNameOrDescription
    : `${action} on ${tableName}${recordId ? ` (ID: ${recordId})` : ''}`
  try {
    const { error } = await supabase.from('admin_audit_logs').insert({
      user_id: (await supabase.auth.getUser()).data.user?.id || '',
      action_type: action,
      action_description: description,
      resource_type: tableName,
      resource_id: recordId,
      additional_data: {
        old_values: oldValues,
        new_values: newValues,
        action: action,
        table_name: tableName,
      },
      ip_address: null, 
      user_agent: navigator.userAgent,
    })

    if (error) {
      console.error('Error logging admin action:', error)
    }
  } catch (error) {
    console.error('Error in logAdminAction:', error)
  }
}

/**
 * Get all admin users (admin only)
 * @returns Promise<Array> - List of admin users
 */
export async function getAdminUsers(): Promise<Record<string, unknown>[]> {
  try {
    // First check if current user is admin
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required')
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select(
        `
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `
      )
      .eq('role', 'admin')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching admin users:', error)
    throw error
  }
}

/**
 * Get audit logs (admin only)
 * @param limit - Number of logs to fetch (default: 100)
 * @param offset - Number of logs to skip (default: 0)
 * @returns Promise<Array> - List of audit logs
 */
export async function getAuditLogs(
  limit: number = 100,
  offset: number = 0
): Promise<Record<string, unknown>[]> {
  try {
    // First check if current user is admin
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required')
    }

    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select(
        `
        *,
        admin_user:user_id (
          id,
          email,
          user_metadata
        )
      `
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    throw error
  }
}
