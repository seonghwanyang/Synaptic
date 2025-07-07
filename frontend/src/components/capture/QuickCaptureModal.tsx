'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mic, Image as ImageIcon, Sparkles } from 'lucide-react'
import { useQuickCapture } from '@/hooks/capture/useQuickCapture'
import { toast } from 'sonner'

interface QuickCaptureModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickCaptureModal({ isOpen, onClose }: QuickCaptureModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { saveCapture } = useQuickCapture()

  // Auto-focus when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  // Auto-save with debounce
  useEffect(() => {
    if (!content.trim()) return

    const timer = setTimeout(async () => {
      setIsSaving(true)
      try {
        await saveCapture({
          type: 'text',
          data: { content }
        })
        toast.success('자동 저장됨', { duration: 1000 })
      } catch (error) {
        console.error('Auto-save error:', error)
      } finally {
        setIsSaving(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [content, saveCapture])

  // Handle Cmd+Enter to save and close
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSaveAndClose()
    }
  }

  const handleSaveAndClose = async () => {
    if (!content.trim()) {
      onClose()
      return
    }

    setIsSaving(true)
    try {
      await saveCapture({
        type: 'text',
        data: { content }
      })
      toast.success('저장되었습니다!')
      setContent('')
      onClose()
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다')
    } finally {
      setIsSaving(false)
    }
  }

  const handleVoiceCapture = () => {
    setIsRecording(!isRecording)
    toast.info(isRecording ? '녹음 중지' : '녹음 시작')
    // TODO: Implement voice recording
  }

  const handleImageCapture = () => {
    // TODO: Implement image upload
    toast.info('이미지 업로드 기능 준비 중')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-[10%] max-w-4xl mx-auto bg-gradient-to-br from-cyan-50 via-white to-rose-50 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-600" />
                <span className="text-sm text-gray-600">
                  AI가 자동으로 분류합니다
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="무엇이든 적어보세요..."
                className="w-full min-h-[300px] text-2xl bg-transparent border-none outline-none placeholder-gray-400 resize-none"
              />

              {/* Actions */}
              <div className="flex items-center justify-between mt-8">
                <div className="flex gap-3">
                  <button
                    onClick={handleVoiceCapture}
                    className={`p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all ${
                      isRecording ? 'bg-red-50 shadow-red-200' : ''
                    }`}
                  >
                    <Mic className={`w-6 h-6 ${
                      isRecording ? 'text-red-500' : 'text-cyan-600'
                    }`} />
                  </button>
                  <button
                    onClick={handleImageCapture}
                    className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <ImageIcon className="w-6 h-6 text-rose-600" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {isSaving && (
                    <span className="text-sm text-gray-500 animate-pulse">
                      저장 중...
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    Cmd+Enter로 저장
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}