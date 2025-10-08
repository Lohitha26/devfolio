// ============================================
// src/types/index.ts - TypeScript Types
// ============================================

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  profilePicture?: string
}

export interface AuthResponse {
  token: string
  email: string
  firstName: string
  lastName: string
  userId: number
}

export interface Portfolio {
  id: number
  userId: number
  title: string
  bio?: string
  theme?: string
  customDomain?: string
  isPublic: boolean
  sections: PortfolioSection[]
  createdAt: string
  updatedAt: string
}

export interface PortfolioSection {
  id: string
  type: 'about' | 'experience' | 'projects' | 'skills' | 'education'
  title: string
  content: any
  order: number
}

export interface Snippet {
  id: number
  userId: number
  title: string
  code: string
  language: string
  description?: string
  tags: string[]
  isPublic: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: number
  userId: number
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  tags: string[]
  isPublished: boolean
  viewCount: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface InterviewTopic {
  id: number
  userId: number
  name: string
  category?: string
  progress: number
  notes?: string
  resources: string[]
  createdAt: string
  updatedAt: string
}
