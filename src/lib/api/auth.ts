// ============================================
// src/lib/api/auth.ts - Auth API Functions
// ============================================
import apiClient from './axios'
import type { AuthResponse } from '@/types'

export const authApi = {
  register: async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  login: async (data: {
    email: string
    password: string
  }): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },
}
