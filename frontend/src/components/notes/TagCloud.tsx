'use client'

import { motion } from 'framer-motion'

interface TagCloudProps {
  tags: string[]
  selectedTags: string[]
  onToggleTag: (tag: string) => void
}

export function TagCloud({ tags, selectedTags, onToggleTag }: TagCloudProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => {
        const isSelected = selectedTags.includes(tag)
        
        return (
          <motion.button
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleTag(tag)}
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-colors
              ${isSelected
                ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            #{tag}
          </motion.button>
        )
      })}
    </div>
  )
}