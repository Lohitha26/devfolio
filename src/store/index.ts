// ============================================
// src/store/authStore.ts - Zustand Auth Store
// ============================================
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => {
        localStorage.setItem('token', token)
        // Also set cookie for middleware
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
        set({ token, user, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem('token')
        // Also remove cookie
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        set({ token: null, user: null, isAuthenticated: false })
      },
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
)
