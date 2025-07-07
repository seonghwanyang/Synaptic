import { createClient } from '@supabase/supabase-js';
import type { Database } from '@synaptic/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// API client for backend services
class ApiClient {
  private baseURL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  async request(endpoint: string, options?: RequestInit) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: session ? `Bearer ${session.access_token}` : '',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Notes API
  notes = {
    create: (data: {
      title?: string;
      content: string;
      type?: 'text' | 'voice' | 'image' | 'mixed';
    }) =>
      this.request('/notes', { method: 'POST', body: JSON.stringify(data) }),

    getAll: (params?: {
      page?: number;
      limit?: number;
      category?: string;
      tags?: string[];
      search?: string;
    }) =>
      this.request(
        `/notes?${new URLSearchParams(
          params
            ? {
                ...(params.page && { page: params.page.toString() }),
                ...(params.limit && { limit: params.limit.toString() }),
                ...(params.category && { category: params.category }),
                ...(params.tags && { tags: params.tags.join(',') }),
                ...(params.search && { search: params.search }),
              }
            : {}
        )}`
      ),

    getById: (id: string) => this.request(`/notes/${id}`),

    update: (id: string, data: any) =>
      this.request(`/notes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) => this.request(`/notes/${id}`, { method: 'DELETE' }),

    search: (query: string, limit?: number) =>
      this.request(
        `/notes/search?q=${encodeURIComponent(query)}${limit ? `&limit=${limit}` : ''}`
      ),

    addTags: (id: string, tags: string[]) =>
      this.request(`/notes/${id}/tags`, {
        method: 'POST',
        body: JSON.stringify({ tags }),
      }),

    removeTag: (id: string, tagId: string) =>
      this.request(`/notes/${id}/tags/${tagId}`, { method: 'DELETE' }),
  };

  // Capture API
  capture = {
    quickSave: (data: { type: 'text' | 'voice' | 'image'; data: any }) =>
      this.request('/capture/quick', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };
}

export const api = new ApiClient();
