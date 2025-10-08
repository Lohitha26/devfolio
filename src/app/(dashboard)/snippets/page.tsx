'use client'

import { useState, useEffect, useMemo, useCallback, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Search, Copy, Trash2, Edit, Eye, Code as CodeIcon, Filter } from 'lucide-react'
import { useDebounce, useClipboard, usePagination, useToggle } from '@/hooks'
import { snippetsApi } from '@/lib/api/snippets'
import type { Snippet } from '@/types'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'csharp', 'go', 
  'rust', 'ruby', 'php', 'html', 'css', 'sql', 'bash'
]

export default function SnippetsPage() {
  // ============================================
  // STATE MANAGEMENT - useState
  // ============================================
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // ============================================
  // CUSTOM HOOKS
  // ============================================
  const debouncedSearch = useDebounce(searchQuery, 300)
  const { isCopied, copyToClipboard } = useClipboard()
  const { value: isDialogOpen, setTrue: openDialog, setFalse: closeDialog } = useToggle(false)

  // ============================================
  // useTransition - Non-blocking updates
  // ============================================
  const [isPending, startTransition] = useTransition()

  // ============================================
  // useEffect - Data fetching
  // ============================================
  useEffect(() => {
    fetchSnippets()
  }, [])

  const fetchSnippets = async () => {
    try {
      setIsLoading(true)
      const data = await snippetsApi.getAll()
      setSnippets(data)
    } catch (error) {
      toast.error('Failed to load snippets')
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================
  // useMemo - Filtered and sorted snippets
  // ============================================
  const filteredSnippets = useMemo(() => {
    let filtered = snippets

    // Filter by search query
    if (debouncedSearch) {
      filtered = filtered.filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          snippet.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          snippet.code.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    // Filter by language
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter((snippet) => snippet.language === selectedLanguage)
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((snippet) =>
        selectedTags.some((tag) => snippet.tags.includes(tag))
      )
    }

    return filtered
  }, [snippets, debouncedSearch, selectedLanguage, selectedTags])

  // ============================================
  // usePagination - Custom hook
  // ============================================
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  } = usePagination(filteredSnippets, 9)

  // ============================================
  // useCallback - Memoized functions
  // ============================================
  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Are you sure you want to delete this snippet?')) return

    try {
      await snippetsApi.delete(id)
      setSnippets((prev) => prev.filter((s) => s.id !== id))
      toast.success('Snippet deleted')
    } catch (error) {
      toast.error('Failed to delete snippet')
    }
  }, [])

  const handleCopy = useCallback((code: string) => {
    copyToClipboard(code)
    toast.success('Code copied to clipboard!')
  }, [copyToClipboard])

  const handleSearch = useCallback((value: string) => {
    startTransition(() => {
      setSearchQuery(value)
    })
  }, [])

  // Get all unique tags from snippets
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    snippets.forEach((snippet) => {
      snippet.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }, [snippets])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Code Snippets</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize your code snippets
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => open ? openDialog() : closeDialog()}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Snippet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Snippet</DialogTitle>
            </DialogHeader>
            <SnippetForm
              onSuccess={() => {
                fetchSnippets()
                closeDialog()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
            {isPending && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              </div>
            )}
          </div>

          {/* Language Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Language</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode */}
            <div>
              <Label>View</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div>
              <Label>Filter by Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedTags((prev) =>
                        prev.includes(tag)
                          ? prev.filter((t) => t !== tag)
                          : [...prev, tag]
                      )
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {paginatedItems.length} of {filteredSnippets.length} snippets
      </div>

      {/* Snippets Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : paginatedItems.length === 0 ? (
        <Card className="p-12 text-center">
          <CodeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No snippets found</p>
          <Button className="mt-4" onClick={openDialog}>
            Create your first snippet
          </Button>
        </Card>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }
        >
          {paginatedItems.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onDelete={handleDelete}
              onCopy={handleCopy}
              onUpdate={fetchSnippets}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={prevPage}
            disabled={!hasPrevPage}
          >
            Previous
          </Button>
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={nextPage}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

// ============================================
// SnippetCard Component
// ============================================
function SnippetCard({
  snippet,
  onDelete,
  onCopy,
  onUpdate,
  viewMode,
}: {
  snippet: Snippet
  onDelete: (id: number) => void
  onCopy: (code: string) => void
  onUpdate: () => void
  viewMode: 'grid' | 'list'
}) {
  const { value: isExpanded, toggle: toggleExpanded } = useToggle(false)
  const { value: isEditDialogOpen, setTrue: openEdit, setFalse: closeEdit } = useToggle(false)

  return (
    <Card className={viewMode === 'list' ? 'flex' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{snippet.title}</CardTitle>
            <CardDescription className="mt-1">
              {snippet.description || 'No description'}
            </CardDescription>
          </div>
          <Badge variant="secondary">{snippet.language}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative">
          <SyntaxHighlighter
            language={snippet.language}
            style={vscDarkPlus}
            customStyle={{
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              maxHeight: isExpanded ? 'none' : '150px',
              overflow: 'hidden',
            }}
          >
            {snippet.code}
          </SyntaxHighlighter>
          {!isExpanded && snippet.code.length > 200 && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent flex items-end justify-center pb-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleExpanded}
              >
                Show More
              </Button>
            </div>
          )}
        </div>

        {/* Tags */}
        {snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {snippet.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {snippet.viewCount} views
          </span>
          <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onCopy(snippet.code)}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => open ? openEdit() : closeEdit()}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Snippet</DialogTitle>
            </DialogHeader>
            <SnippetForm
              snippet={snippet}
              onSuccess={() => {
                onUpdate()
                closeEdit()
              }}
            />
          </DialogContent>
        </Dialog>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(snippet.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

// ============================================
// SnippetForm Component
// ============================================
function SnippetForm({
  snippet,
  onSuccess,
}: {
  snippet?: Snippet
  onSuccess: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: snippet?.title || '',
    code: snippet?.code || '',
    language: snippet?.language || 'javascript',
    description: snippet?.description || '',
    tags: snippet?.tags.join(', ') || '',
    isPublic: snippet?.isPublic || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      }

      if (snippet) {
        await snippetsApi.update(snippet.id, data)
        toast.success('Snippet updated')
      } else {
        await snippetsApi.create(data)
        toast.success('Snippet created')
      }
      onSuccess()
    } catch (error) {
      toast.error('Failed to save snippet')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="My awesome snippet"
          required
        />
      </div>

      <div>
        <Label htmlFor="language">Language</Label>
        <Select
          value={formData.language}
          onValueChange={(value) => setFormData({ ...formData, language: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="code">Code</Label>
        <Textarea
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          placeholder="Paste your code here..."
          className="font-mono text-sm min-h-[300px]"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What does this code do?"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="react, hooks, custom-hook"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="isPublic" className="cursor-pointer">
          Make this snippet public
        </Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : snippet ? 'Update' : 'Create'} Snippet
        </Button>
      </div>
    </form>
  )
}
