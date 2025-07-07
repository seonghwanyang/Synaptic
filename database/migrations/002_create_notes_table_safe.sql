-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    content_type VARCHAR(20) DEFAULT 'text' CHECK (content_type IN ('text', 'voice', 'image', 'mixed')),
    category VARCHAR(100),
    ai_insights JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_archived BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes (IF NOT EXISTS is not supported for indexes, so we check first)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notes_user_id') THEN
        CREATE INDEX idx_notes_user_id ON notes(user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notes_category') THEN
        CREATE INDEX idx_notes_category ON notes(category);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notes_created_at') THEN
        CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notes_is_archived') THEN
        CREATE INDEX idx_notes_is_archived ON notes(is_archived);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notes_is_pinned') THEN
        CREATE INDEX idx_notes_is_pinned ON notes(is_pinned);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notes_tags') THEN
        CREATE INDEX idx_notes_tags ON notes USING GIN(tags);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notes_content_search') THEN
        CREATE INDEX idx_notes_content_search ON notes USING GIN(to_tsvector('english', content));
    END IF;
END $$;

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, name)
);

-- Create note_tags junction table
CREATE TABLE IF NOT EXISTS note_tags (
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    PRIMARY KEY (note_id, tag_id)
);

-- Create or replace updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON notes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DO $$ 
BEGIN
    -- Drop existing policies for notes
    DROP POLICY IF EXISTS "Users can view their own notes" ON notes;
    DROP POLICY IF EXISTS "Users can create their own notes" ON notes;
    DROP POLICY IF EXISTS "Users can update their own notes" ON notes;
    DROP POLICY IF EXISTS "Users can delete their own notes" ON notes;
    
    -- Drop existing policies for tags
    DROP POLICY IF EXISTS "Users can view their own tags" ON tags;
    DROP POLICY IF EXISTS "Users can create their own tags" ON tags;
    DROP POLICY IF EXISTS "Users can update their own tags" ON tags;
    DROP POLICY IF EXISTS "Users can delete their own tags" ON tags;
    
    -- Drop existing policies for note_tags
    DROP POLICY IF EXISTS "Users can view their own note_tags" ON note_tags;
    DROP POLICY IF EXISTS "Users can create their own note_tags" ON note_tags;
    DROP POLICY IF EXISTS "Users can delete their own note_tags" ON note_tags;
END $$;

-- Create RLS policies for notes
CREATE POLICY "Users can view their own notes" 
    ON notes FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" 
    ON notes FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
    ON notes FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
    ON notes FOR DELETE 
    USING (auth.uid() = user_id);

-- Create RLS policies for tags
CREATE POLICY "Users can view their own tags" 
    ON tags FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tags" 
    ON tags FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags" 
    ON tags FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags" 
    ON tags FOR DELETE 
    USING (auth.uid() = user_id);

-- Create RLS policies for note_tags
CREATE POLICY "Users can view their own note_tags" 
    ON note_tags FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = note_tags.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own note_tags" 
    ON note_tags FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = note_tags.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own note_tags" 
    ON note_tags FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = note_tags.note_id 
            AND notes.user_id = auth.uid()
        )
    );

-- Create or replace view for notes statistics
CREATE OR REPLACE VIEW notes_stats AS
SELECT 
    user_id,
    COUNT(*) as total_notes,
    COUNT(CASE WHEN is_archived = false THEN 1 END) as active_notes,
    COUNT(CASE WHEN is_archived = true THEN 1 END) as archived_notes,
    COUNT(DISTINCT category) as categories_count,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as notes_this_week,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as notes_this_month
FROM notes
GROUP BY user_id;

-- Grant permissions
GRANT ALL ON notes TO authenticated;
GRANT ALL ON tags TO authenticated;
GRANT ALL ON note_tags TO authenticated;
GRANT SELECT ON notes_stats TO authenticated;

-- Create or replace full-text search function
CREATE OR REPLACE FUNCTION search_notes(
    search_query TEXT,
    user_uuid UUID,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    category VARCHAR,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.content,
        n.category,
        n.tags,
        n.created_at,
        ts_rank(to_tsvector('english', n.content), plainto_tsquery('english', search_query)) as rank
    FROM notes n
    WHERE 
        n.user_id = user_uuid
        AND n.is_archived = false
        AND to_tsvector('english', n.content) @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC, n.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;