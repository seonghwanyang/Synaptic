import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization of Supabase client
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL is required');
    }

    if (!supabaseServiceKey) {
      throw new Error('SUPABASE_SERVICE_KEY is required');
    }

    // Create Supabase client with service role key for backend operations
    supabaseInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseInstance;
};

// For backward compatibility
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop, receiver) {
    const instance = getSupabase();
    return Reflect.get(instance, prop, receiver);
  },
});

// Helper functions for common Supabase operations
export async function getUser(userId: string) {
  const { data, error } = await getSupabase().auth.admin.getUserById(userId);

  if (error) throw error;
  return data.user;
}

export async function createUser(
  email: string,
  password: string,
  metadata?: Record<string, unknown>
) {
  const { data, error } = await getSupabase().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (error) throw error;
  return data.user;
}

interface UserUpdates {
  email?: string;
  password?: string;
  email_confirm?: boolean;
  phone?: string;
  phone_confirm?: boolean;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  ban_duration?: string;
}

export async function updateUser(userId: string, updates: UserUpdates) {
  const { data, error } = await getSupabase().auth.admin.updateUserById(
    userId,
    updates
  );

  if (error) throw error;
  return data.user;
}

export async function deleteUser(userId: string) {
  const { data, error } = await getSupabase().auth.admin.deleteUser(userId);

  if (error) throw error;
  return data;
}
