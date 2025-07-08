'use client'

import { useState } from 'react'
import EmptyState from './EmptyState'

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
  category?: string
}

// Mock data
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Project Ideas for 2024',
    content: 'Build an AI-powered second brain app that helps people capture and organize their thoughts...',
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00'),
    tags: ['ideas', 'projects', 'ai'],
    category: 'Work'
  },
  {
    id: '2',
    title: 'Meeting Notes - Product Roadmap',
    content: 'Q1 Goals: Launch MVP, Get 100 beta users, Implement core features including quick capture...',
    createdAt: new Date('2024-01-14T14:30:00'),
    updatedAt: new Date('2024-01-14T15:45:00'),
    tags: ['meeting', 'product', 'planning'],
    category: 'Work'
  },
  {
    id: '3',
    title: 'Book: Atomic Habits',
    content: 'Key takeaways: 1% better every day, Systems > Goals, Environment design is crucial...',
    createdAt: new Date('2024-01-13T09:00:00'),
    updatedAt: new Date('2024-01-13T09:00:00'),
    tags: ['books', 'self-improvement', 'habits'],
    category: 'Personal'
  },
  {
    id: '4',
    title: 'Recipe: Homemade Pizza Dough',
    content: 'Ingredients: 500g flour, 325ml warm water, 7g yeast, 10g salt, 2 tbsp olive oil...',
    createdAt: new Date('2024-01-12T18:00:00'),
    updatedAt: new Date('2024-01-12T18:00:00'),
    tags: ['recipes', 'cooking'],
    category: 'Personal'
  },
]

export default function NotesList() {
  const [notes] = useState<Note[]>(mockNotes)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter and sort notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'date') {
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    } else {
      return a.title.localeCompare(b.title)
    }
  })

  const categories = ['all', 'Work', 'Personal', 'Ideas']

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60))
        return `${minutes} minutes ago`
      }
      return `${hours} hours ago`
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return `${days} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (notes.length === 0 && searchQuery === '' && selectedCategory === 'all') {
    return <EmptyState />
  }

  return (
    <div className="h-full">
      {/* Header with search and controls */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Notes</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-800 dark:text-white"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* View mode toggle */}
            <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-300 dark:border-gray-600">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300' : 'text-gray-600 dark:text-gray-400'}`}
                aria-label="List view"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300' : 'text-gray-600 dark:text-gray-400'}`}
                aria-label="Grid view"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? 'All Notes' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="p-6">
        {sortedNotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No notes found matching your search.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
            {sortedNotes.map(note => (
              <div
                key={note.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{note.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{note.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatDate(note.updatedAt)}</span>
                  {note.category && (
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">{note.category}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}