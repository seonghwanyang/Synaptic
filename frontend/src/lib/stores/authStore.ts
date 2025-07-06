import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (isLoading: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => 
        set({ 
          user, 
          isAuthenticated: !!user 
        }),

      setSession: (session) => 
        set({ 
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session 
        }),

      setLoading: (isLoading) => 
        set({ isLoading }),

      reset: () => 
        set({ 
          user: null, 
          session: null, 
          isAuthenticated: false,
          isLoading: false 
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)