import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as notesController from '../controllers/notes.controller';

const router = Router();

// All notes routes require authentication
router.use(authMiddleware);

// CRUD operations
router.get('/', notesController.getNotes);
router.get('/:id', notesController.getNote);
router.post('/', notesController.createNote);
router.patch('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

// Additional operations
router.get('/search', notesController.searchNotes);
router.post('/:id/tags', notesController.addTags);
router.delete('/:id/tags/:tagId', notesController.removeTag);

export default router;