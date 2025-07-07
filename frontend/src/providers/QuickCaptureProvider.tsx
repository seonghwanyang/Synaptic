'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { UnifiedQuickCapture } from '@/components/capture/UnifiedQuickCapture'

interface QuickCaptureContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const QuickCaptureContext = createContext<QuickCaptureContextType | undefined>(undefined)

export function QuickCaptureProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + N
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault()
        toggle()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle])

  return (
    <QuickCaptureContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      <UnifiedQuickCapture isOpen={isOpen} onClose={close} />
      {/* Global floating action button */}
      <button
        onClick={open}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-coral-600 text-white shadow-lg hover:bg-coral-700 hover:scale-110 transition-all duration-200 dark:bg-coral-500 dark:hover:bg-coral-600"
        aria-label="Quick Capture"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 4v16m8-8H4"></path>
        </svg>
      </button>
    </QuickCaptureContext.Provider>
  )
}

export function useQuickCaptureModal() {
  const context = useContext(QuickCaptureContext)
  if (!context) {
    throw new Error('useQuickCaptureModal must be used within QuickCaptureProvider')
  }
  return context
}