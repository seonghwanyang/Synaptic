import { Request } from 'express';
import { User } from '@supabase/supabase-js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Note types
export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category?: string;
  tags: string[];
  metadata?: {
    wordCount?: number;
    createdVia?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

// User profile types
export interface UserProfile {
  id: string;
  user_id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  settings?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    notifications?: boolean;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

// Capture types
export type CaptureType = 'text' | 'voice' | 'image';

export interface CaptureData {
  type: CaptureType;
  content?: string;
  audioUrl?: string;
  imageUrl?: string;
  duration?: number;
  caption?: string;
  tags?: string[];
}

// Filter types
export interface QueryFilters {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}