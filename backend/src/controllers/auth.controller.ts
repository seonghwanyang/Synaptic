import { Request, Response, NextFunction } from 'express';
import { getUserProfile, updateUserProfile } from '../auth/supabase';
import { AppError } from '../middleware/error';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This would be handled by Supabase Auth on the frontend
    // Backend just validates the session
    res.status(400).json({
      message: 'Login should be performed through the frontend Supabase client'
    });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This would be handled by Supabase Auth on the frontend
    res.status(400).json({
      message: 'Signup should be performed through the frontend Supabase client'
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This would be handled by Supabase Auth on the frontend
    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const userId = req.user.id;
    const profile = await getUserProfile(userId);
    
    res.json({
      success: true,
      data: {
        user: req.user,
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const userId = req.user.id;
    const updates = req.body;
    
    // Validate updates
    const allowedFields = ['full_name', 'username', 'bio', 'avatar_url', 'settings'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);

    if (Object.keys(filteredUpdates).length === 0) {
      throw new AppError('No valid fields to update', 400);
    }

    const updatedProfile = await updateUserProfile(userId, filteredUpdates);
    
    res.json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};