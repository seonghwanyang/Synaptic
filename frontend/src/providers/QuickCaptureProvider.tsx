'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { QuickCaptureModal } from '@/components/capture/QuickCaptureModal'

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
      <QuickCaptureModal isOpen={isOpen} onClose={close} />
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