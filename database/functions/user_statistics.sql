-- User statistics functions

-- Function to update user statistics
CREATE OR REPLACE FUNCTION update_user_statistics(user_id_input uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    today_count int;
    week_count int;
    month_count int;
    total_count int;
    active_hour int;
BEGIN
    -- Count notes created today
    SELECT COUNT(*) INTO today_count
    FROM public.notes
    WHERE user_id = user_id_input
        AND DATE(created_at) = CURRENT_DATE
        AND status = 'active';
    
    -- Count notes created this week
    SELECT COUNT(*) INTO week_count
    FROM public.notes
    WHERE user_id = user_id_input
        AND created_at >= date_trunc('week', CURRENT_DATE)
        AND status = 'active';
    
    -- Count notes created this month
    SELECT COUNT(*) INTO month_count
    FROM public.notes
    WHERE user_id = user_id_input
        AND created_at >= date_trunc('month', CURRENT_DATE)
        AND status = 'active';
    
    -- Get total notes count
    SELECT COUNT(*) INTO total_count
    FROM public.notes
    WHERE user_id = user_id_input
        AND status = 'active';
    
    -- Find most active hour
    SELECT EXTRACT(hour FROM created_at)::int INTO active_hour
    FROM public.notes
    WHERE user_id = user_id_input
        AND status = 'active'
    GROUP BY EXTRACT(hour FROM created_at)
    ORDER BY COUNT(*) DESC
    LIMIT 1;
    
    -- Update user_stats table
    INSERT INTO public.user_stats (
        user_id,
        notes_created_today,
        notes_created_week,
        notes_created_month,
        most_active_hour,
        last_note_at
    ) VALUES (
        user_id_input,
        today_count,
        week_count,
        month_count,
        active_hour,
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        notes_created_today = EXCLUDED.notes_created_today,
        notes_created_week = EXCLUDED.notes_created_week,
        notes_created_month = EXCLUDED.notes_created_month,
        most_active_hour = EXCLUDED.most_active_hour,
        last_note_at = EXCLUDED.last_note_at,
        updated_at = NOW();
    
    -- Update profile total_notes
    UPDATE public.profiles
    SET total_notes = total_count
    WHERE id = user_id_input;
END;
$$;

-- Function to calculate user streak
CREATE OR REPLACE FUNCTION calculate_user_streak(user_id_input uuid)
RETURNS int
LANGUAGE plpgsql
AS $$
DECLARE
    streak int := 0;
    check_date date := CURRENT_DATE;
    has_note boolean;
BEGIN
    LOOP
        -- Check if user has created any note on check_date
        SELECT EXISTS(
            SELECT 1 FROM public.notes
            WHERE user_id = user_id_input
                AND DATE(created_at) = check_date
                AND status = 'active'
        ) INTO has_note;
        
        IF NOT has_note THEN
            -- If this is today and no notes, streak is 0
            IF check_date = CURRENT_DATE THEN
                RETURN 0;
            ELSE
                -- Otherwise, return the streak count
                RETURN streak;
            END IF;
        END IF;
        
        -- Increment streak and go to previous day
        streak := streak + 1;
        check_date := check_date - INTERVAL '1 day';
        
        -- Limit check to 365 days
        IF streak >= 365 THEN
            RETURN streak;
        END IF;
    END LOOP;
END;
$$;

-- Trigger to update statistics when a note is created
CREATE OR REPLACE FUNCTION trigger_update_user_stats_on_note()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user statistics
    PERFORM update_user_statistics(NEW.user_id);
    
    -- Update streak
    UPDATE public.user_stats
    SET streak_days = calculate_user_streak(NEW.user_id)
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for note creation
CREATE TRIGGER update_user_stats_on_note_insert
    AFTER INSERT ON public.notes
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_user_stats_on_note();