import { createClient } from '@supabase/supabase-js'
import type { Database } from '@synaptic/types'

// Create Supabase admin client for server-side operations
export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Create user profile after signup
export const createUserProfile = async (userId: string, email: string, metadata?: any) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: metadata?.full_name,
        username: metadata?.username,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user profile:', error)
      throw error
    }

    // Also create user_stats entry
    await supabaseAdmin
      .from('user_stats')
      .insert({
        user_id: userId,
      })

    return data
  } catch (error) {
    console.error('Error in createUserProfile:', error)
    throw error
  }
}

// Verify JWT token from request
export const verifyToken = async (token: string) => {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      throw new Error('Invalid token')
    }
    
    return user
  } catch (error) {
    console.error('Error verifying token:', error)
    throw error
  }
}

// Get user profile by ID
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}