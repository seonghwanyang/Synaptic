import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth'
import { notesService } from '../services/notes.service'
import { AppError } from '../middleware/error'

export const getNotes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const { page = 1, limit = 20, category, tags, search } = req.query

    const notes = await notesService.getUserNotes(userId, {
      page: Number(page),
      limit: Number(limit),
      category: category as string,
      tags: tags ? (tags as string).split(',') : undefined,
      search: search as string,
    })

    res.json({
      success: true,
      data: notes,
    })
  } catch (error) {
    next(error)
  }
}

export const getNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const note = await notesService.getNote(id, userId)

    if (!note) {
      throw new AppError('Note not found', 404)
    }

    res.json({
      success: true,
      data: note,
    })
  } catch (error) {
    next(error)
  }
}

export const createNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const { content, content_type = 'text' } = req.body

    console.log('Creating note - User:', userId, 'Content type:', content_type, 'Content length:', content?.length)

    if (!content) {
      throw new AppError('Content is required', 400)
    }

    const note = await notesService.createNote(userId, {
      content,
      content_type,
    })

    console.log('Note created successfully:', note.id)
    res.status(201).json({
      success: true,
      data: note,
    })
  } catch (error) {
    console.error('Error in createNote controller:', error)
    next(error)
  }
}

export const updateNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const updates = req.body

    const note = await notesService.updateNote(id, userId, updates)

    if (!note) {
      throw new AppError('Note not found', 404)
    }

    res.json({
      success: true,
      data: note,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const success = await notesService.deleteNote(id, userId)

    if (!success) {
      throw new AppError('Note not found', 404)
    }

    res.json({
      success: true,
      message: 'Note deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const searchNotes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const { q, limit = 10 } = req.query

    if (!q) {
      throw new AppError('Search query is required', 400)
    }

    const results = await notesService.searchNotes(
      userId,
      q as string,
      Number(limit)
    )

    res.json({
      success: true,
      data: results,
    })
  } catch (error) {
    next(error)
  }
}

// Tag 관련 기능은 현재 Notes 테이블의 tags 배열로 처리
export const addTags = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const { tags } = req.body

    if (!Array.isArray(tags)) {
      throw new AppError('Tags must be an array', 400)
    }

    // 현재 노트를 가져와서 태그 추가
    const currentNote = await notesService.getNote(id, userId)
    if (!currentNote) {
      throw new AppError('Note not found', 404)
    }

    const updatedTags = [...new Set([...currentNote.tags, ...tags])]
    const note = await notesService.updateNote(id, userId, { tags: updatedTags })

    res.json({
      success: true,
      data: note,
    })
  } catch (error) {
    next(error)
  }
}

export const removeTag = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const { id, tagId } = req.params

    // 현재 노트를 가져와서 태그 제거
    const currentNote = await notesService.getNote(id, userId)
    if (!currentNote) {
      throw new AppError('Note not found', 404)
    }

    const updatedTags = currentNote.tags.filter(tag => tag !== tagId)
    const note = await notesService.updateNote(id, userId, { tags: updatedTags })

    res.json({
      success: true,
      data: note,
    })
  } catch (error) {
    next(error)
  }
}