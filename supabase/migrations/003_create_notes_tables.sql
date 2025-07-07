-- Notes core tables

-- Create note type enums
CREATE TYPE note_type AS ENUM ('text', 'voice', 'image', 'mixed');
CREATE TYPE note_status AS ENUM ('active', 'archived', 'deleted');

-- Main notes table
CREATE TABLE public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Content
    title TEXT,
    content TEXT NOT NULL,
    content_type note_type DEFAULT 'text',
    content_length INTEGER,
    
    -- AI processing results
    ai_summary TEXT,
    ai_keywords TEXT[],
    ai_category_id UUID,
    ai_confidence DECIMAL(3,2),
    ai_processed_at TIMESTAMPTZ,
    
    -- Vector embedding (1536 dimensions for OpenAI)
    embedding vector(1536),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    attachments JSONB DEFAULT '[]'::jsonb,
    
    -- Status
    status note_status DEFAULT 'active',
    is_pinned BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    
    -- Reminders
    remind_at TIMESTAMPTZ,
    reminded_count INTEGER DEFAULT 0,
    last_reminded_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    archived_at TIMESTAMPTZ,
    
    -- Full text search vector
    tsv tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || content)
    ) STORED
);

-- Categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#FF6B6B',
    icon TEXT DEFAULT 'folder',
    
    -- AI generated flag
    is_ai_generated BOOLEAN DEFAULT FALSE,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    
    -- Statistics
    notes_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, slug)
);

-- Tags table
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, slug)
);

-- Note-tags junction table
CREATE TABLE public.note_tags (
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (note_id, tag_id)
);

-- Note connections table
CREATE TABLE public.note_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    to_note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    
    -- Connection type and strength
    connection_type TEXT DEFAULT 'related',
    strength DECIMAL(3,2) DEFAULT 0.5,
    
    -- AI suggested flag
    is_ai_suggested BOOLEAN DEFAULT FALSE,
    ai_confidence DECIMAL(3,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(from_note_id, to_note_id),
    CHECK (from_note_id != to_note_id)
);

-- Create indexes for notes
CREATE INDEX idx_notes_user_created ON public.notes(user_id, created_at DESC);
CREATE INDEX idx_notes_status ON public.notes(status) WHERE status = 'active';
CREATE INDEX idx_notes_remind_at ON public.notes(remind_at) WHERE remind_at IS NOT NULL;
CREATE INDEX idx_notes_tsv ON public.notes USING gin(tsv);
CREATE INDEX idx_notes_ai_category ON public.notes(ai_category_id);
CREATE INDEX idx_notes_is_pinned ON public.notes(is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX idx_notes_is_favorite ON public.notes(is_favorite) WHERE is_favorite = TRUE;

-- Create indexes for categories
CREATE INDEX idx_categories_user ON public.categories(user_id);
CREATE INDEX idx_categories_parent ON public.categories(parent_id);

-- Create indexes for tags
CREATE INDEX idx_tags_user ON public.tags(user_id);
CREATE INDEX idx_tags_usage ON public.tags(usage_count DESC);

-- Create indexes for connections
CREATE INDEX idx_connections_from ON public.note_connections(from_note_id);
CREATE INDEX idx_connections_to ON public.note_connections(to_note_id);

-- RLS Policies for notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own notes" ON public.notes
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own categories" ON public.categories
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own tags" ON public.tags
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for note_tags
ALTER TABLE public.note_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own note tags" ON public.note_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.notes
            WHERE notes.id = note_tags.note_id
            AND notes.user_id = auth.uid()
        )
    );

-- RLS Policies for note_connections
ALTER TABLE public.note_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own note connections" ON public.note_connections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.notes
            WHERE notes.id IN (from_note_id, to_note_id)
            AND notes.user_id = auth.uid()
        )
    );