'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, Eye, Users } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track your portfolio performance and engagement
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="p-12 text-center">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Analytics Dashboard Coming Soon!</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We're building comprehensive analytics to help you track your portfolio views, 
          snippet usage, and overall engagement metrics.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
          <div className="flex items-center gap-2 justify-center">
            <Eye className="h-5 w-5 text-blue-600" />
            <span className="text-sm">View Tracking</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-sm">User Engagement</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm">Performance Insights</span>
          </div>
        </div>
        <Button disabled>
          Feature in Development
        </Button>
      </Card>
    </div>
  )
}
