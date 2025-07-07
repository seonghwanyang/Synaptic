-- Additional indexes for performance optimization
-- Note: Many indexes are already created in previous migrations with their tables
-- This file contains vector search specific indexes and additional optimization

-- Vector search index for notes embedding
-- Using ivfflat for approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS idx_notes_embedding ON public.notes 
    USING ivfflat (embedding vector_cosine_ops) 
    WITH (lists = 100)
    WHERE embedding IS NOT NULL;

-- Vector search index for cluster centroids
CREATE INDEX IF NOT EXISTS idx_clusters_centroid ON public.note_clusters
    USING ivfflat (centroid vector_cosine_ops)
    WITH (lists = 50)
    WHERE centroid IS NOT NULL;

-- Additional composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_notes_user_status_created ON public.notes(user_id, status, created_at DESC)
    WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_notes_user_favorite ON public.notes(user_id, created_at DESC)
    WHERE is_favorite = TRUE;

CREATE INDEX IF NOT EXISTS idx_notes_user_pinned ON public.notes(user_id, created_at DESC)
    WHERE is_pinned = TRUE;

-- Index for AI processing queue optimization
CREATE INDEX IF NOT EXISTS idx_ai_queue_pending_priority ON public.ai_processing_queue(priority DESC, created_at)
    WHERE status = 'pending';

-- Index for unprocessed notes
CREATE INDEX IF NOT EXISTS idx_notes_unprocessed ON public.notes(user_id, created_at)
    WHERE ai_processed_at IS NULL AND status = 'active';

-- Index for reminder queries
-- Note: Removed NOW() from WHERE clause as it must be immutable for indexes
CREATE INDEX IF NOT EXISTS idx_notes_upcoming_reminders ON public.notes(remind_at)
    WHERE remind_at IS NOT NULL AND status = 'active';

-- Statistics update function for categories
CREATE OR REPLACE FUNCTION update_category_notes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.categories
        SET notes_count = notes_count + 1
        WHERE id = NEW.ai_category_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.categories
        SET notes_count = notes_count - 1
        WHERE id = OLD.ai_category_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.ai_category_id IS DISTINCT FROM NEW.ai_category_id THEN
            UPDATE public.categories
            SET notes_count = notes_count - 1
            WHERE id = OLD.ai_category_id;
            
            UPDATE public.categories
            SET notes_count = notes_count + 1
            WHERE id = NEW.ai_category_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for category notes count
CREATE TRIGGER update_category_count
    AFTER INSERT OR UPDATE OR DELETE ON public.notes
    FOR EACH ROW EXECUTE FUNCTION update_category_notes_count();

-- Statistics update function for tags
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.tags
        SET usage_count = usage_count + 1
        WHERE id = NEW.tag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.tags
        SET usage_count = usage_count - 1
        WHERE id = OLD.tag_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for tag usage count
CREATE TRIGGER update_tag_count
    AFTER INSERT OR DELETE ON public.note_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();