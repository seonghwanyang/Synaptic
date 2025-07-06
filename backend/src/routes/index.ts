import { Router } from 'express';
import authRoutes from './auth.routes';
import notesRoutes from './notes.routes';
import captureRoutes from './capture.routes';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/notes', notesRoutes);
router.use('/capture', captureRoutes);

// Default route
router.get('/', (req, res) => {
  res.json({
    message: 'Synaptic API v1.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      notes: '/api/notes',
      capture: '/api/capture'
    }
  });
});

export default router;