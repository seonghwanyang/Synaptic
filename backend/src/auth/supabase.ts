import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization of Supabase client
let supabaseAdminInstance: SupabaseClient<any> | null = null;

export const getSupabaseAdmin = () => {
  if (!supabaseAdminInstance) {
    // Check environment variables
    if (!process.env.SUPABASE_URL) {
      console.error('SUPABASE_URL is not defined in environment variables');
      throw new Error('SUPABASE_URL is required');
    }

    if (!process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('SUPABASE_SERVICE_KEY is required');
    }

    // Create Supabase admin client for server-side operations
    supabaseAdminInstance = createClient<any>(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return supabaseAdminInstance;
};

// For backward compatibility
export const supabaseAdmin = new Proxy({} as SupabaseClient<any>, {
  get(target, prop, receiver) {
    const admin = getSupabaseAdmin();
    return Reflect.get(admin, prop, receiver);
  },
});

// Create user profile after signup
interface UserMetadata {
  full_name?: string;
  username?: string;
  [key: string]: unknown;
}

export const createUserProfile = async (
  userId: string,
  email: string,
  metadata?: UserMetadata
) => {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: metadata?.full_name,
        username: metadata?.username,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating user profile:', error);
      throw error;
    }

    // Also create user_stats entry
    await getSupabaseAdmin().from('user_stats').insert({
      user_id: userId,
    });

    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in createUserProfile:', error);
    throw error;
  }
};

// Verify JWT token from request
export const verifyToken = async (token: string) => {
  try {
    const {
      data: { user },
      error,
    } = await getSupabaseAdmin().auth.getUser(token);

    if (error || !user) {
      throw new Error('Invalid token');
    }

    return user;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error verifying token:', error);
    throw error;
  }
};

// Get user profile by ID
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updates: any
) => {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating user profile:', error);
    throw error;
  }
};
