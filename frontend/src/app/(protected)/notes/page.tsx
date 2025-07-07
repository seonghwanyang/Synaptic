'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Grid3x3, List, Search, Filter, Plus } from 'lucide-react'
import { NoteCard } from '@/components/notes/NoteCard'
import { CategoryFilter } from '@/components/notes/CategoryFilter'
import { TagCloud } from '@/components/notes/TagCloud'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuickCaptureModal } from '@/providers/QuickCaptureProvider'

const categories = [
  { id: 'all', name: 'All', color: '#6B7280' },
  { id: 'work', name: 'Work', color: '#FF6B6B' },
  { id: 'personal', name: 'Personal', color: '#008B8B' },
  { id: 'learning', name: 'Learning', color: '#8B5CF6' },
  { id: 'ideas', name: 'Ideas', color: '#F59E0B' },
  { id: 'tasks', name: 'Tasks', color: '#10B981' },
]

// Mock data - replace with real API call
const mockNotes = [
  {
    id: '1',
    content: 'Meeting notes about the new project timeline and deliverables. Need to follow up with the design team.',
    category: 'work',
    tags: ['meeting', 'project', 'design'],
    createdAt: new Date('2025-01-06T10:00:00'),
    aiConfidence: 92,
  },
  {
    id: '2',
    content: 'Interesting article about machine learning applications in healthcare. Could be useful for the AI project.',
    category: 'learning',
    tags: ['AI', 'machine-learning', 'healthcare'],
    createdAt: new Date('2025-01-06T14:30:00'),
    aiConfidence: 88,
  },
  {
    id: '3',
    content: 'Personal goal: Start morning meditation routine. 10 minutes every day before work.',
    category: 'personal',
    tags: ['goals', 'meditation', 'habits'],
    createdAt: new Date('2025-01-07T08:00:00'),
    aiConfidence: 95,
  },
]

export default function NotesPage() {
  const [notes, setNotes] = useState(mockNotes)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const { open: openQuickCapture } = useQuickCaptureModal()

  // Filter notes based on category, search, and tags
  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory
    const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => note.tags.includes(tag))
    
    return matchesCategory && matchesSearch && matchesTags
  })

  // Extract all unique tags
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)))

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">
            Categories
          </h3>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">
            Tags
          </h3>
          <TagCloud
            tags={allTags}
            selectedTags={selectedTags}
            onToggleTag={(tag) => {
              setSelectedTags(prev =>
                prev.includes(tag)
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              )
            }}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-950 border-b z-10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-gray-100' : ''}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-gray-100' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button
              onClick={openQuickCapture}
              className="ml-4 bg-gradient-to-r from-cyan-600 to-rose-600 hover:from-cyan-700 hover:to-rose-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>

        {/* Notes Grid/List */}
        <div className="p-6">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No notes found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NoteCard
                    note={note}
                    categoryColor={categories.find(c => c.id === note.category)?.color || '#6B7280'}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NoteCard
                    note={note}
                    categoryColor={categories.find(c => c.id === note.category)?.color || '#6B7280'}
                    viewMode="list"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}