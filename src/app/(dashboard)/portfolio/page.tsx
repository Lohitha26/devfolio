'use client'

import { useAuthStore } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Code, FileText, BookOpen, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function PortfolioPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}! 👋</h1>
        <p className="text-gray-600 mt-1">
          Here's your DevFolio dashboard overview
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Snippets</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">snippets saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">posts published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Topics</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">topics tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Code Snippets
            </CardTitle>
            <CardDescription>
              Save and organize your code snippets with syntax highlighting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/snippets">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Manage Snippets
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Interview Prep
            </CardTitle>
            <CardDescription>
              Track your interview preparation progress and practice problems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/interview-prep">
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Start Preparing
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Blog Posts
            </CardTitle>
            <CardDescription>
              Write and publish technical blog posts to share your knowledge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/blog">
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Write Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Getting Started</CardTitle>
          <CardDescription>
            Complete these steps to make the most of your DevFolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">1</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">Create your first code snippet</p>
              <p className="text-sm text-gray-600">Start organizing your code with our snippet manager</p>
            </div>
            <Link href="/snippets">
              <Button size="sm">Go to Snippets</Button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">2</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">Set up your portfolio</p>
              <p className="text-sm text-gray-600">Customize your developer portfolio</p>
            </div>
            <Button size="sm" variant="outline" disabled>
              Coming Soon
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">3</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">Start interview preparation</p>
              <p className="text-sm text-gray-600">Track your progress on coding problems</p>
            </div>
            <Link href="/interview-prep">
              <Button size="sm" variant="outline">
                Start Prep
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
