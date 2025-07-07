import { supabaseAdmin } from '../config/supabase'
import { Database } from '../config/supabase'
import { aiService } from './ai.service'

type Note = Database['public']['Tables']['notes']['Row']
type CreateNoteInput = Omit<Database['public']['Tables']['notes']['Insert'], 'user_id'>
type UpdateNoteInput = Database['public']['Tables']['notes']['Update']

interface NoteFilters {
  page?: number
  limit?: number
  category?: string
  tags?: string[]
  search?: string
}

export class NotesService {
  async createNote(userId: string, input: CreateNoteInput): Promise<Note> {
    try {
      // AI 분석 실행
      const aiResult = await aiService.categorizeNote(input.content)
      
      // 노트 생성
      const { data, error } = await supabaseAdmin
        .from('notes')
        .insert({
          user_id: userId,
          content: input.content,
          content_type: input.content_type || 'text',
          category: aiResult.category,
          tags: aiResult.tags,
          ai_insights: {
            confidence: aiResult.confidence,
            summary: aiResult.summary,
            processedAt: new Date().toISOString()
          },
          is_archived: false
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to create note:', error)
        throw new Error(`Failed to create note: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in createNote:', error)
      throw error
    }
  }

  async getUserNotes(userId: string, filters: NoteFilters = {}): Promise<Note[]> {
    try {
      const { page = 1, limit = 20, category, search } = filters
      const offset = (page - 1) * limit

      let query = supabaseAdmin
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (category) {
        query = query.eq('category', category)
      }

      if (search) {
        query = query.ilike('content', `%${search}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error('Failed to fetch notes:', error)
        throw new Error(`Failed to fetch notes: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in getUserNotes:', error)
      throw error
    }
  }

  async getNote(noteId: string, userId: string): Promise<Note | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw new Error(`Failed to fetch note: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in getNote:', error)
      throw error
    }
  }

  async updateNote(
    noteId: string, 
    userId: string, 
    updates: UpdateNoteInput
  ): Promise<Note | null> {
    try {
      // 컨텐츠가 업데이트되면 AI 재분석
      let aiUpdates = {}
      if (updates.content) {
        const aiResult = await aiService.categorizeNote(updates.content)
        aiUpdates = {
          category: aiResult.category,
          tags: aiResult.tags,
          ai_insights: {
            confidence: aiResult.confidence,
            summary: aiResult.summary,
            processedAt: new Date().toISOString()
          }
        }
      }

      const { data, error } = await supabaseAdmin
        .from('notes')
        .update({
          ...updates,
          ...aiUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        throw new Error(`Failed to update note: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in updateNote:', error)
      throw error
    }
  }

  async deleteNote(noteId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId)

      if (error) {
        throw new Error(`Failed to delete note: ${error.message}`)
      }

      return true
    } catch (error) {
      console.error('Error in deleteNote:', error)
      throw error
    }
  }

  async archiveNote(noteId: string, userId: string): Promise<Note | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('notes')
        .update({ is_archived: true, updated_at: new Date().toISOString() })
        .eq('id', noteId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        throw new Error(`Failed to archive note: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in archiveNote:', error)
      throw error
    }
  }

  async searchNotes(userId: string, query: string, limit = 10): Promise<Note[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .ilike('content', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(`Failed to search notes: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in searchNotes:', error)
      throw error
    }
  }
}

// Export singleton instance
export const notesService = new NotesService()