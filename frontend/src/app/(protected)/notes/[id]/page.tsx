'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Brain, 
  Edit3, 
  Save, 
  Share2, 
  Clock, 
  Trash2,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { toast } from 'sonner'

// Mock data - replace with real API call
const mockNote = {
  id: '1',
  content: `Meeting notes about the new project timeline and deliverables.

Key points discussed:
- Project kickoff scheduled for next Monday
- Design phase: 2 weeks
- Development phase: 6 weeks
- Testing and deployment: 2 weeks

Need to follow up with the design team about the initial mockups.`,
  category: 'work',
  tags: ['meeting', 'project', 'design', 'timeline'],
  createdAt: new Date('2025-01-06T10:00:00'),
  updatedAt: new Date('2025-01-06T10:00:00'),
  aiConfidence: 92,
  aiSummary: 'Project planning meeting notes with timeline breakdown and action items for design team follow-up.',
  relatedNotes: [
    { id: '2', title: 'Design System Guidelines', similarity: 0.85 },
    { id: '3', title: 'Q1 Project Roadmap', similarity: 0.78 },
  ]
}

const categoryColors = {
  work: '#FF6B6B',
  personal: '#008B8B',
  learning: '#8B5CF6',
  ideas: '#F59E0B',
  tasks: '#10B981',
}

export default function NoteDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [note, setNote] = useState(mockNote)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(note.content)

  const handleSave = async () => {
    try {
      // TODO: API call to save note
      setNote({ ...note, content: editedContent, updatedAt: new Date() })
      setIsEditing(false)
      toast.success('노트가 저장되었습니다')
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다')
    }
  }

  const handleDelete = async () => {
    if (confirm('정말로 이 노트를 삭제하시겠습니까?')) {
      try {
        // TODO: API call to delete note
        toast.success('노트가 삭제되었습니다')
        router.push('/notes')
      } catch (error) {
        toast.error('삭제 중 오류가 발생했습니다')
      }
    }
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    toast.info('공유 기능 준비 중입니다')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-950 border-b z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/notes')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>
                {formatDistanceToNow(note.updatedAt, { addSuffix: true, locale: ko })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditedContent(note.content)
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-gradient-to-r from-cyan-600 to-rose-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8"
            >
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full min-h-[400px] text-lg bg-transparent border-none outline-none resize-none"
                  autoFocus
                />
              ) : (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans">{note.content}</pre>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                {note.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Related Notes */}
            {note.relatedNotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-600" />
                  관련 노트
                </h3>
                <div className="space-y-2">
                  {note.relatedNotes.map(related => (
                    <button
                      key={related.id}
                      onClick={() => router.push(`/notes/${related.id}`)}
                      className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{related.title}</span>
                        <span className="text-sm text-gray-500">
                          {Math.round(related.similarity * 100)}% 유사도
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* AI Insights Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-cyan-50 to-rose-50 dark:from-cyan-900/20 dark:to-rose-900/20 p-6 rounded-xl sticky top-24"
            >
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Brain className="w-5 h-5" />
                AI 인사이트
              </h3>
              
              <div className="space-y-4">
                {/* Category */}
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">카테고리</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      className="text-white"
                      style={{ backgroundColor: categoryColors[note.category as keyof typeof categoryColors] }}
                    >
                      {note.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      신뢰도 {note.aiConfidence}%
                    </span>
                  </div>
                </div>
                
                {/* Summary */}
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">요약</span>
                  <p className="mt-1 text-gray-800 dark:text-gray-200">
                    {note.aiSummary}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="pt-4 border-t space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => toast.info('리마인더 기능 준비 중')}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    리마인더 설정
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}