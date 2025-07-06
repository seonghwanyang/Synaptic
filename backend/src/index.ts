import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth';
import { getUserProfile, updateUserProfile } from './auth/supabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected route example - Get user profile
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.id;
    const profile = await getUserProfile(userId);
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Protected route example - Update user profile
app.patch('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.id;
    const updates = req.body;
    
    // Validate updates here if needed
    const allowedFields = ['full_name', 'username', 'bio', 'avatar_url', 'settings'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);

    const updatedProfile = await updateUserProfile(userId, filteredUpdates);
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});