'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Code, Rocket, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            DevFolio
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Your ultimate developer companion for portfolio management, code snippets, and interview preparation
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Rocket className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Portfolio Builder</h3>
            <p className="text-gray-600">
              Create stunning portfolios with drag-and-drop sections, custom themes, and real-time preview
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Code Snippet Manager</h3>
            <p className="text-gray-600">
              Organize, search, and share your code snippets with syntax highlighting and tagging
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Interview Prep Tracker</h3>
            <p className="text-gray-600">
              Track your interview preparation progress, practice problems, and study resources
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
