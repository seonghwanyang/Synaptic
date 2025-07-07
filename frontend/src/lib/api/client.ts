import { createClient } from '@/lib/supabase/client'

export const supabase = createClient()

// API client for backend services
class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  async request(endpoint: string, options?: RequestInit): Promise<any> {
    try {
      // 현재 세션 가져오기
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        throw new Error('Failed to get session')
      }

      // 세션이 없으면 로그인 페이지로
      if (!session) {
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
        throw new Error('No active session')
      }

      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('API Request:', {
          endpoint,
          hasSession: true,
          token: 'Bearer ' + session.access_token.substring(0, 20) + '...'
        })
      }

      // API 요청
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          ...options?.headers,
        },
      })

      // 401 에러 처리 - 토큰 새로고침
      if (response.status === 401) {
        console.log('Token expired, attempting refresh...')
        
        // 세션 새로고침 시도
        const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession()
        
        if (refreshError || !newSession) {
          console.error('Session refresh failed:', refreshError)
          // 새로고침 실패 - 로그인 필요
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          throw new Error('Session expired')
        }

        // 새 토큰으로 재시도
        console.log('Retrying with new token...')
        return this.request(endpoint, options)
      }

      // 기타 에러 처리
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: {
            message: response.statusText,
            code: 'UNKNOWN_ERROR'
          }
        }))
        
        console.error('API Error:', {
          endpoint,
          status: response.status,
          error: errorData
        })
        
        // Extract error message from nested structure
        const errorMessage = errorData.error?.message || errorData.message || response.statusText
        throw new Error(errorMessage)
      }

      return response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Notes API
  notes = {
    create: (data: {
      content: string
      content_type?: 'text' | 'voice' | 'image' | 'mixed'
    }) =>
      this.request('/notes', { 
        method: 'POST', 
        body: JSON.stringify(data) 
      }),

    getAll: (params?: {
      page?: number
      limit?: number
      category?: string
      tags?: string[]
      search?: string
    }) => {
      const queryParams = new URLSearchParams()
      
      if (params) {
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.limit) queryParams.append('limit', params.limit.toString())
        if (params.category) queryParams.append('category', params.category)
        if (params.tags && params.tags.length > 0) queryParams.append('tags', params.tags.join(','))
        if (params.search) queryParams.append('search', params.search)
      }
      
      return this.request(`/notes${queryParams.toString() ? '?' + queryParams.toString() : ''}`)
    },

    getById: (id: string) => 
      this.request(`/notes/${id}`),

    update: (id: string, data: any) =>
      this.request(`/notes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) => 
      this.request(`/notes/${id}`, { 
        method: 'DELETE' 
      }),

    search: (query: string, limit?: number) => {
      const params = new URLSearchParams({ q: query })
      if (limit) params.append('limit', limit.toString())
      
      return this.request(`/notes/search?${params.toString()}`)
    },

    addTags: (id: string, tags: string[]) =>
      this.request(`/notes/${id}/tags`, {
        method: 'POST',
        body: JSON.stringify({ tags }),
      }),

    removeTag: (id: string, tagId: string) =>
      this.request(`/notes/${id}/tags/${tagId}`, { 
        method: 'DELETE' 
      }),
  }

  // Capture API
  capture = {
    quickSave: (data: {
      type: 'text' | 'voice' | 'image';
      data: {
        content?: string;
        fileUrl?: string;
        metadata?: Record<string, any>;
      };
    }) =>
      this.request('/capture/quick', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
  }
}

export const api = new ApiClient()

// Supabase auth state listener for automatic token refresh
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed successfully')
    } else if (event === 'SIGNED_OUT') {
      // Clear any cached data
      console.log('User signed out')
    }
  })
}