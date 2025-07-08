import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as captureController from '../controllers/capture.controller';

const router = Router();

// All capture routes require authentication
router.use(authMiddleware);

// Quick capture endpoint
router.post('/quick', captureController.quickCapture);

// Different capture types
router.post('/text', captureController.captureText);
router.post('/voice', captureController.captureVoice);
router.post('/image', captureController.captureImage);

// Process queued captures
router.post('/process-queue', captureController.processQueue);

export default router;
