'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, CheckCircle, Target } from 'lucide-react'

export default function InterviewPrepPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Interview Preparation</h1>
        <p className="text-gray-600 mt-1">
          Track your coding interview preparation progress
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="p-12 text-center">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Coming Soon!</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We're building an amazing interview preparation tracker with coding problems, 
          progress tracking, and study resources.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
          <div className="flex items-center gap-2 justify-center">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm">Problem Tracking</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Clock className="h-5 w-5 text-green-600" />
            <span className="text-sm">Time Management</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <CheckCircle className="h-5 w-5 text-purple-600" />
            <span className="text-sm">Progress Analytics</span>
          </div>
        </div>
        <Button disabled>
          Feature in Development
        </Button>
      </Card>
    </div>
  )
}
