import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);
router.patch('/profile', authMiddleware, authController.updateProfile);

export default router;