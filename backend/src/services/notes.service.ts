import { supabase } from './supabase.service';
import { aiService } from './ai.service';

interface NoteFilters {
  page?: number;
  limit?: number;
  category?: string;
  tags?: string[];
  search?: string;
}

interface CreateNoteData {
  userId: string;
  title?: string;
  content: string;
  type?: 'text' | 'voice' | 'image' | 'mixed';
}

interface NoteUpdates {
  title?: string;
  content?: string;
  ai_category_id?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  is_pinned?: boolean;
  is_favorite?: boolean;
}

export async function getUserNotes(userId: string, filters: NoteFilters = {}) {
  const { page = 1, limit = 20, category, tags, search } = filters;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('notes')
    .select(
      `
      *,
      category:categories!ai_category_id(id, name, color),
      tags:note_tags(tag:tags(id, name))
    `
    )
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    // Find category ID by name
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', userId)
      .eq('slug', category)
      .single();

    if (categoryData) {
      query = query.eq('ai_category_id', categoryData.id);
    }
  }

  if (tags && tags.length > 0) {
    // Complex tag filtering would require a different approach
    // For now, we'll filter in memory after fetching
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Post-process for tag filtering if needed
  let filteredData = data || [];
  if (tags && tags.length > 0) {
    filteredData = filteredData.filter((note) => {
      const noteTags = note.tags?.map((t: any) => t.tag.name) || [];
      return tags.some((tag) => noteTags.includes(tag));
    });
  }

  return filteredData;
}

export async function getNoteById(id: string, userId: string) {
  const { data, error } = await supabase
    .from('notes')
    .select(
      `
      *,
      category:categories!ai_category_id(id, name, color),
      tags:note_tags(tag:tags(id, name)),
      connections:note_connections!from_note_id(
        to_note:notes!to_note_id(id, title, ai_summary),
        strength
      )
    `
    )
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createNote(noteData: CreateNoteData) {
  // First, get AI categorization
  const aiResult = await aiService.categorizeNote(noteData.content);

  // Find or create category
  let categoryId = null;
  if (aiResult.category) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', noteData.userId)
      .eq('slug', aiResult.category)
      .single();

    if (category) {
      categoryId = category.id;
    } else {
      // Create new category
      const { data: newCategory } = await supabase
        .from('categories')
        .insert({
          user_id: noteData.userId,
          name:
            aiResult.category.charAt(0).toUpperCase() +
            aiResult.category.slice(1),
          slug: aiResult.category,
          is_ai_generated: true,
        })
        .select()
        .single();

      if (newCategory) {
        categoryId = newCategory.id;
      }
    }
  }

  // Generate embedding
  const embeddingResult = await aiService.generateEmbedding(noteData.content);

  // Create the note
  const { data: note, error } = await supabase
    .from('notes')
    .insert({
      user_id: noteData.userId,
      title: noteData.title || aiResult.summary || 'Untitled',
      content: noteData.content,
      content_type: noteData.type || 'text',
      content_length: noteData.content.length,
      ai_summary: aiResult.summary,
      ai_keywords: aiResult.tags,
      ai_category_id: categoryId,
      ai_confidence: aiResult.confidence,
      ai_processed_at: new Date().toISOString(),
      embedding: embeddingResult.embedding,
      metadata: {
        wordCount: noteData.content.split(/\s+/).length,
        createdVia: 'api',
      },
    })
    .select()
    .single();

  if (error) throw error;

  // Create tags
  if (note && aiResult.tags.length > 0) {
    await createOrUpdateTags(noteData.userId, note.id, aiResult.tags);
  }

  return note;
}

export async function updateNote(
  id: string,
  userId: string,
  updates: NoteUpdates
) {
  const updateData: any = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  // If content is updated, regenerate AI analysis
  if (updates.content) {
    const aiResult = await aiService.categorizeNote(updates.content);
    const embeddingResult = await aiService.generateEmbedding(updates.content);

    updateData.ai_summary = aiResult.summary;
    updateData.ai_keywords = aiResult.tags;
    updateData.ai_confidence = aiResult.confidence;
    updateData.embedding = embeddingResult.embedding;
    updateData.ai_processed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('notes')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function deleteNote(id: string, userId: string) {
  // Soft delete
  const { data, error } = await supabase
    .from('notes')
    .update({
      status: 'deleted',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function searchNotes(
  userId: string,
  query: string,
  limit: number = 10
) {
  const { data, error } = await supabase
    .from('notes')
    .select('id, title, content, ai_summary, created_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .textSearch('tsv', query)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

async function createOrUpdateTags(
  userId: string,
  noteId: string,
  tagNames: string[]
) {
  for (const tagName of tagNames) {
    const slug = tagName.toLowerCase().replace(/\s+/g, '-');

    // Find or create tag
    let { data: tag } = await supabase
      .from('tags')
      .select('id')
      .eq('user_id', userId)
      .eq('slug', slug)
      .single();

    if (!tag) {
      const { data: newTag } = await supabase
        .from('tags')
        .insert({
          user_id: userId,
          name: tagName,
          slug: slug,
        })
        .select()
        .single();

      tag = newTag;
    }

    if (tag) {
      // Create note-tag relationship
      await supabase
        .from('note_tags')
        .insert({
          note_id: noteId,
          tag_id: tag.id,
        })
        .onConflict('note_id,tag_id')
        .ignore();

      // Update tag usage count
      await supabase
        .from('tags')
        .update({ usage_count: supabase.raw('usage_count + 1') })
        .eq('id', tag.id);
    }
  }
}

export async function findRelatedNotes(noteId: string, userId: string) {
  // Get the note with its embedding
  const { data: note } = await supabase
    .from('notes')
    .select('embedding')
    .eq('id', noteId)
    .eq('user_id', userId)
    .single();

  if (!note || !note.embedding) return [];

  // This would typically use pgvector's <-> operator for similarity search
  // For now, return empty array
  // TODO: Implement vector similarity search
  return [];
}

export async function addTagsToNote(
  noteId: string,
  userId: string,
  tagNames: string[]
) {
  // Verify note belongs to user
  const { data: note } = await supabase
    .from('notes')
    .select('id')
    .eq('id', noteId)
    .eq('user_id', userId)
    .single();

  if (!note) return null;

  await createOrUpdateTags(userId, noteId, tagNames);

  // Return updated note
  return getNoteById(noteId, userId);
}

export async function removeTagFromNote(
  noteId: string,
  userId: string,
  tagId: string
) {
  // Verify note belongs to user
  const { data: note } = await supabase
    .from('notes')
    .select('id')
    .eq('id', noteId)
    .eq('user_id', userId)
    .single();

  if (!note) return null;

  // Remove the note-tag relationship
  await supabase
    .from('note_tags')
    .delete()
    .eq('note_id', noteId)
    .eq('tag_id', tagId);

  // Update tag usage count
  await supabase
    .from('tags')
    .update({ usage_count: supabase.raw('usage_count - 1') })
    .eq('id', tagId);

  // Return updated note
  return getNoteById(noteId, userId);
}
