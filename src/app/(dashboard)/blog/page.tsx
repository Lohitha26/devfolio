'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, PenTool, Users, TrendingUp } from 'lucide-react'

export default function BlogPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <p className="text-gray-600 mt-1">
          Write and publish technical blog posts
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="p-12 text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Blog Feature Coming Soon!</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We're building a powerful blog platform where you can write, publish, 
          and share your technical knowledge with the developer community.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
          <div className="flex items-center gap-2 justify-center">
            <PenTool className="h-5 w-5 text-blue-600" />
            <span className="text-sm">Rich Text Editor</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-sm">Community Sharing</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm">Analytics & Insights</span>
          </div>
        </div>
        <Button disabled>
          Feature in Development
        </Button>
      </Card>
    </div>
  )
}
