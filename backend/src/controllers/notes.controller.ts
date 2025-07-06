import { Request, Response, NextFunction } from 'express';
import * as notesService from '../services/notes.service';
import { AppError } from '../middleware/error';

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20, category, tags, search } = req.query;
    
    const notes = await notesService.getUserNotes(userId, {
      page: Number(page),
      limit: Number(limit),
      category: category as string,
      tags: tags ? (tags as string).split(',') : undefined,
      search: search as string
    });
    
    res.json({
      success: true,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

export const getNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    
    const note = await notesService.getNoteById(id, userId);
    
    if (!note) {
      throw new AppError('Note not found', 404);
    }
    
    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { title, content, category, tags } = req.body;
    
    if (!content) {
      throw new AppError('Content is required', 400);
    }
    
    const note = await notesService.createNote({
      userId,
      title: title || '',
      content,
      category,
      tags
    });
    
    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const updates = req.body;
    
    const note = await notesService.updateNote(id, userId, updates);
    
    if (!note) {
      throw new AppError('Note not found', 404);
    }
    
    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    
    const deleted = await notesService.deleteNote(id, userId);
    
    if (!deleted) {
      throw new AppError('Note not found', 404);
    }
    
    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const searchNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      throw new AppError('Search query is required', 400);
    }
    
    const results = await notesService.searchNotes(userId, q as string, Number(limit));
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

export const addTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { tags } = req.body;
    
    if (!Array.isArray(tags)) {
      throw new AppError('Tags must be an array', 400);
    }
    
    const note = await notesService.addTagsToNote(id, userId, tags);
    
    if (!note) {
      throw new AppError('Note not found', 404);
    }
    
    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

export const removeTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id, tagId } = req.params;
    
    const note = await notesService.removeTagFromNote(id, userId, tagId);
    
    if (!note) {
      throw new AppError('Note not found', 404);
    }
    
    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};