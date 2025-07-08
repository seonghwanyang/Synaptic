export * from './database';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content?: string;
  tags: string[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Capture {
  id: string;
  userId: string;
  content: string;
  type: 'text' | 'voice' | 'image';
  metadata: Record<string, any>;
  processed: boolean;
  noteId?: string;
  createdAt: Date;
}

export interface AIInteraction {
  id: string;
  userId: string;
  noteId?: string;
  prompt: string;
  response: string;
  model: string;
  tokensUsed?: number;
  createdAt: Date;
}
