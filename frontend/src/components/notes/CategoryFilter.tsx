'use client'

import { motion } from 'framer-motion'

interface Category {
  id: string
  name: string
  color: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  return (
    <div className="space-y-1">
      {categories.map(category => (
        <motion.button
          key={category.id}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectCategory(category.id)}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
            transition-colors
            ${selectedCategory === category.id
              ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
        >
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <span>{category.name}</span>
        </motion.button>
      ))}
    </div>
  )
}