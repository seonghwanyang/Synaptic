import { supabase } from './supabase.service';

interface NoteFilters {
  page?: number;
  limit?: number;
  category?: string;
  tags?: string[];
  search?: string;
}

interface CreateNoteData {
  userId: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

export async function getUserNotes(userId: string, filters: NoteFilters = {}) {
  const { page = 1, limit = 20, category, tags, search } = filters;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq('category', category);
  }

  if (tags && tags.length > 0) {
    query = query.contains('tags', tags);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getNoteById(id: string, userId: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createNote(noteData: CreateNoteData) {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: noteData.userId,
      title: noteData.title || 'Untitled',
      content: noteData.content,
      category: noteData.category,
      tags: noteData.tags || [],
      metadata: {
        wordCount: noteData.content.split(/\s+/).length,
        createdVia: 'api',
      },
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

interface NoteUpdates {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export async function updateNote(
  id: string,
  userId: string,
  updates: NoteUpdates
) {
  const { data, error } = await supabase
    .from('notes')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function deleteNote(id: string, userId: string) {
  const { data, error } = await supabase
    .from('notes')
    .delete()
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
    .select('id, title, content, created_at')
    .eq('user_id', userId)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function addTagsToNote(
  id: string,
  userId: string,
  newTags: string[]
) {
  // First get the current note
  const note = await getNoteById(id, userId);
  if (!note) return null;

  // Merge tags
  const currentTags = note.tags || [];
  const uniqueTags = [...new Set([...currentTags, ...newTags])];

  // Update note
  return updateNote(id, userId, { tags: uniqueTags });
}

export async function removeTagFromNote(
  id: string,
  userId: string,
  tagToRemove: string
) {
  // First get the current note
  const note = await getNoteById(id, userId);
  if (!note) return null;

  // Filter out the tag
  const currentTags = note.tags || [];
  const updatedTags = currentTags.filter((tag) => tag !== tagToRemove);

  // Update note
  return updateNote(id, userId, { tags: updatedTags });
}
