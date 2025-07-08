'use client'

import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import Link from 'next/link'

interface NoteCardProps {
  note: {
    id: string
    content: string
    category: string
    tags: string[]
    createdAt: Date
    aiConfidence?: number
  }
  categoryColor: string
  viewMode?: 'grid' | 'list'
}

export function NoteCard({ note, categoryColor, viewMode = 'grid' }: NoteCardProps) {
  const title = note.content.split('\n')[0].substring(0, 50)
  const preview = note.content.length > 150 
    ? note.content.substring(0, 150) + '...' 
    : note.content

  if (viewMode === 'list') {
    return (
      <Link href={`/notes/${note.id}`}>
        <motion.div
          whileHover={{ x: 4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all p-4 cursor-pointer flex items-start gap-4"
        >
          <div 
            className="w-1 h-full self-stretch rounded-full flex-shrink-0"
            style={{ backgroundColor: categoryColor }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {title}
              </h3>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {formatDistanceToNow(note.createdAt, { addSuffix: true, locale: ko })}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
              {preview}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {note.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-500">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link href={`/notes/${note.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all p-6 cursor-pointer h-full"
      >
        <div className="flex items-start justify-between mb-3">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: categoryColor }}
          />
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(note.createdAt, { addSuffix: true, locale: ko })}
          </span>
        </div>
        
        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {preview}
        </p>
        
        <div className="flex items-center gap-2 mt-4">
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs text-gray-500">
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-xs text-gray-400">
              +{note.tags.length - 3}
            </span>
          )}
        </div>

        {note.aiConfidence && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">AI 신뢰도</span>
              <span className="text-cyan-600 font-medium">{note.aiConfidence}%</span>
            </div>
          </div>
        )}
      </motion.div>
    </Link>
  )
}