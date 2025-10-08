// ============================================
// src/lib/api/snippets.ts - Snippets API
// ============================================
import apiClient from './axios'
import type { Snippet } from '@/types'

export const snippetsApi = {
  getAll: async (): Promise<Snippet[]> => {
    const response = await apiClient.get('/snippets')
    return response.data
  },

  getById: async (id: number): Promise<Snippet> => {
    const response = await apiClient.get(`/snippets/${id}`)
    return response.data
  },

  create: async (data: Partial<Snippet>): Promise<Snippet> => {
    const response = await apiClient.post('/snippets', data)
    return response.data
  },

  update: async (id: number, data: Partial<Snippet>): Promise<Snippet> => {
    const response = await apiClient.put(`/snippets/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/snippets/${id}`)
  },

  search: async (query: string): Promise<Snippet[]> => {
    const response = await apiClient.get(`/snippets/search?q=${query}`)
    return response.data
  },
}
