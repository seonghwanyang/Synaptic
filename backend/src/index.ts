import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (result.error) {
  console.error('Error loading .env file:', result.error);
}

// Debug: Log environment variables
// eslint-disable-next-line no-console
console.log('Environment variables loaded:');
// eslint-disable-next-line no-console
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
// eslint-disable-next-line no-console
console.log('PORT:', process.env.PORT);

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { errorHandler } from './middleware/error';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
