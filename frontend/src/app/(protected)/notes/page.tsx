'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, List, Search, Plus } from 'lucide-react';
import { NoteCard } from '@/components/notes/NoteCard';
import { CategoryFilter } from '@/components/notes/CategoryFilter';
import { TagCloud } from '@/components/notes/TagCloud';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuickCaptureModal } from '@/providers/QuickCaptureProvider';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';

const categories = [
  { id: 'all', name: 'All', color: '#6B7280' },
  { id: 'work', name: 'Work', color: '#FF6B6B' },
  { id: 'personal', name: 'Personal', color: '#008B8B' },
  { id: 'learning', name: 'Learning', color: '#8B5CF6' },
  { id: 'ideas', name: 'Ideas', color: '#F59E0B' },
  { id: 'tasks', name: 'Tasks', color: '#10B981' },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { open: openQuickCapture } = useQuickCaptureModal();

  // Fetch notes on mount and when filters change
  useEffect(() => {
    fetchNotes();
  }, [selectedCategory, searchQuery, selectedTags]);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (selectedTags.length > 0) params.tags = selectedTags;

      const response = await api.notes.getAll(params);

      // Transform the API response to match our component expectations
      const transformedNotes = response.data.map((note: any) => ({
        id: note.id,
        content: note.content,
        category: note.category?.slug || note.ai_category_id || 'personal',
        tags: note.tags?.map((t: any) => t.tag.name) || note.ai_keywords || [],
        createdAt: new Date(note.created_at),
        aiConfidence: note.ai_confidence
          ? Math.round(note.ai_confidence * 100)
          : 85,
        title: note.title,
        summary: note.ai_summary,
      }));

      setNotes(transformedNotes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter notes on the client side (for immediate feedback)
  const filteredNotes = notes;

  // Extract all unique tags
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags)));

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
              setSelectedTags((prev) =>
                prev.includes(tag)
                  ? prev.filter((t) => t !== tag)
                  : [...prev, tag]
              );
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
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
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
                    categoryColor={
                      categories.find((c) => c.id === note.category)?.color ||
                      '#6B7280'
                    }
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
                    categoryColor={
                      categories.find((c) => c.id === note.category)?.color ||
                      '#6B7280'
                    }
                    viewMode="list"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
