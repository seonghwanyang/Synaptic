-- Search similar notes using vector similarity

-- Function to search for similar notes
CREATE OR REPLACE FUNCTION search_similar_notes(
    query_embedding vector(1536),
    match_count int DEFAULT 5,
    user_id_filter uuid DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    title text,
    content text,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        n.id,
        n.title,
        n.content,
        1 - (n.embedding <=> query_embedding) as similarity
    FROM public.notes n
    WHERE 
        (user_id_filter IS NULL OR n.user_id = user_id_filter)
        AND n.embedding IS NOT NULL
        AND n.status = 'active'
    ORDER BY n.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Function to search notes by text (full text search)
CREATE OR REPLACE FUNCTION search_notes_by_text(
    search_query text,
    user_id_filter uuid,
    limit_count int DEFAULT 20
)
RETURNS TABLE (
    id uuid,
    title text,
    content text,
    rank float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        n.id,
        n.title,
        n.content,
        ts_rank(n.tsv, plainto_tsquery('english', search_query)) as rank
    FROM public.notes n
    WHERE 
        n.user_id = user_id_filter
        AND n.status = 'active'
        AND n.tsv @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC
    LIMIT limit_count;
END;
$$;

-- Function to get note recommendations
CREATE OR REPLACE FUNCTION get_note_recommendations(
    for_note_id uuid,
    limit_count int DEFAULT 5
)
RETURNS TABLE (
    id uuid,
    title text,
    content text,
    similarity float,
    connection_type text
)
LANGUAGE plpgsql
AS $$
DECLARE
    note_embedding vector(1536);
    note_user_id uuid;
BEGIN
    -- Get the embedding and user_id of the source note
    SELECT embedding, user_id INTO note_embedding, note_user_id
    FROM public.notes
    WHERE id = for_note_id;
    
    IF note_embedding IS NULL THEN
        RETURN;
    END IF;
    
    RETURN QUERY
    WITH similar_notes AS (
        SELECT
            n.id,
            n.title,
            n.content,
            1 - (n.embedding <=> note_embedding) as similarity
        FROM public.notes n
        WHERE 
            n.user_id = note_user_id
            AND n.id != for_note_id
            AND n.embedding IS NOT NULL
            AND n.status = 'active'
        ORDER BY n.embedding <=> note_embedding
        LIMIT limit_count * 2
    ),
    existing_connections AS (
        SELECT to_note_id as connected_id
        FROM public.note_connections
        WHERE from_note_id = for_note_id
        UNION
        SELECT from_note_id as connected_id
        FROM public.note_connections
        WHERE to_note_id = for_note_id
    )
    SELECT 
        sn.id,
        sn.title,
        sn.content,
        sn.similarity,
        CASE 
            WHEN ec.connected_id IS NOT NULL THEN 'existing'
            ELSE 'suggested'
        END as connection_type
    FROM similar_notes sn
    LEFT JOIN existing_connections ec ON sn.id = ec.connected_id
    ORDER BY sn.similarity DESC
    LIMIT limit_count;
END;
$$;