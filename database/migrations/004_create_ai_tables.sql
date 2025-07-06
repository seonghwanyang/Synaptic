-- AI related tables

-- AI insights table
CREATE TABLE public.ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Insight content
    type TEXT NOT NULL CHECK (type IN ('pattern', 'suggestion', 'summary', 'reminder')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    
    -- Related notes
    related_note_ids UUID[],
    
    -- Priority and status
    priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
    is_read BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    
    -- Actionable suggestions
    actions JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
);

-- AI processing queue table
CREATE TABLE public.ai_processing_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    
    -- Process type
    process_type TEXT NOT NULL CHECK (
        process_type IN ('categorize', 'embed', 'connect', 'summarize', 'extract_keywords')
    ),
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (
        status IN ('pending', 'processing', 'completed', 'failed')
    ),
    priority INTEGER DEFAULT 5,
    
    -- Processing info
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note clusters (topic groups)
CREATE TABLE public.note_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    summary TEXT,
    keywords TEXT[],
    
    -- Cluster centroid vector
    centroid vector(1536),
    
    -- Statistics
    notes_count INTEGER DEFAULT 0,
    avg_similarity DECIMAL(3,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cluster-notes junction table
CREATE TABLE public.cluster_notes (
    cluster_id UUID REFERENCES public.note_clusters(id) ON DELETE CASCADE,
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
    similarity_score DECIMAL(3,2),
    PRIMARY KEY (cluster_id, note_id)
);

-- AI chat history
CREATE TABLE public.ai_chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note_id UUID REFERENCES public.notes(id) ON DELETE SET NULL,
    
    -- Chat content
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    
    -- Model info
    model TEXT,
    tokens_used INTEGER,
    
    -- Context
    context_note_ids UUID[],
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI model usage tracking
CREATE TABLE public.ai_usage_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Usage period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Token counts
    total_tokens INTEGER DEFAULT 0,
    embedding_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    
    -- Request counts
    total_requests INTEGER DEFAULT 0,
    embedding_requests INTEGER DEFAULT 0,
    completion_requests INTEGER DEFAULT 0,
    
    -- Cost tracking (in cents)
    estimated_cost INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, period_start, period_end)
);

-- Create indexes for AI tables
CREATE INDEX idx_ai_insights_user_unread ON public.ai_insights(user_id, created_at DESC) 
    WHERE is_read = FALSE AND is_dismissed = FALSE;
CREATE INDEX idx_ai_insights_expires ON public.ai_insights(expires_at) 
    WHERE expires_at IS NOT NULL;

CREATE INDEX idx_ai_queue_status ON public.ai_processing_queue(status, priority DESC) 
    WHERE status IN ('pending', 'processing');
CREATE INDEX idx_ai_queue_note ON public.ai_processing_queue(note_id);

CREATE INDEX idx_clusters_user ON public.note_clusters(user_id);
CREATE INDEX idx_cluster_notes_note ON public.cluster_notes(note_id);

CREATE INDEX idx_ai_chat_user ON public.ai_chat_history(user_id, created_at DESC);
CREATE INDEX idx_ai_chat_note ON public.ai_chat_history(note_id);

CREATE INDEX idx_ai_usage_user_period ON public.ai_usage_stats(user_id, period_start DESC);

-- RLS Policies for AI tables
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI insights" ON public.ai_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own AI insights" ON public.ai_insights
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS for AI processing queue
ALTER TABLE public.ai_processing_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI queue items" ON public.ai_processing_queue
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.notes
            WHERE notes.id = ai_processing_queue.note_id
            AND notes.user_id = auth.uid()
        )
    );

-- RLS for note clusters
ALTER TABLE public.note_clusters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own clusters" ON public.note_clusters
    FOR ALL USING (auth.uid() = user_id);

-- RLS for cluster notes
ALTER TABLE public.cluster_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cluster notes" ON public.cluster_notes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.note_clusters
            WHERE note_clusters.id = cluster_notes.cluster_id
            AND note_clusters.user_id = auth.uid()
        )
    );

-- RLS for AI chat history
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own chat history" ON public.ai_chat_history
    FOR ALL USING (auth.uid() = user_id);

-- RLS for AI usage stats
ALTER TABLE public.ai_usage_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage stats" ON public.ai_usage_stats
    FOR SELECT USING (auth.uid() = user_id);