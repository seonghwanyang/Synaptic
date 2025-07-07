import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization
let supabaseAdminInstance: SupabaseClient | null = null

export const getSupabaseAdmin = () => {
  if (!supabaseAdminInstance) {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL is required')
    }

    if (!supabaseServiceKey) {
      throw new Error('SUPABASE_SERVICE_KEY is required')
    }

    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return supabaseAdminInstance
}

// Export as singleton
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(target, prop, receiver) {
    const instance = getSupabaseAdmin()
    return Reflect.get(instance, prop, receiver)
  }
})

// 타입 정의
export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string
          user_id: string
          content: string
          content_type: string
          category: string | null
          ai_insights: any
          metadata: any
          tags: string[]
          is_archived: boolean
          is_pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['notes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['notes']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      user_stats: {
        Row: {
          user_id: string
          total_notes: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_stats']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_stats']['Insert']>
      }
    }
  }
}