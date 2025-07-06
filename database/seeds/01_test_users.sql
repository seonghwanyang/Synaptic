-- Test users seed data
-- Note: These users need to be created in Supabase Auth first
-- This seed only creates the profile entries

-- Test user profile (requires auth user to exist)
-- Replace the UUID with actual auth user ID after creating test user
INSERT INTO public.profiles (id, email, username, full_name, bio) VALUES
    ('11111111-1111-1111-1111-111111111111', 'test@synaptic.ai', 'testuser', 'Test User', 'Testing Synaptic features'),
    ('22222222-2222-2222-2222-222222222222', 'demo@synaptic.ai', 'demouser', 'Demo User', 'Demo account for Synaptic')
ON CONFLICT (id) DO NOTHING;

-- Create user stats entries
INSERT INTO public.user_stats (user_id) VALUES
    ('11111111-1111-1111-1111-111111111111'),
    ('22222222-2222-2222-2222-222222222222')
ON CONFLICT (user_id) DO NOTHING;