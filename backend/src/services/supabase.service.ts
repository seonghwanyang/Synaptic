import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseServiceKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'SUPABASE_SERVICE_KEY is not set. Some features may not work correctly.'
  );
}

// Create Supabase client with service role key for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper functions for common Supabase operations
export async function getUser(userId: string) {
  const { data, error } = await supabase.auth.admin.getUserById(userId);

  if (error) throw error;
  return data.user;
}

export async function createUser(
  email: string,
  password: string,
  metadata?: Record<string, unknown>
) {
  const { data, error } = await supabase.auth.admin.createUser({
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
  const { data, error } = await supabase.auth.admin.updateUserById(
    userId,
    updates
  );

  if (error) throw error;
  return data.user;
}

export async function deleteUser(userId: string) {
  const { data, error } = await supabase.auth.admin.deleteUser(userId);

  if (error) throw error;
  return data;
}
