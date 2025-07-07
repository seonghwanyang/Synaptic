'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Camera, Image, Type, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { api } from '@/lib/api/client'

type CaptureMode = 'text' | 'voice' | 'image'

interface UnifiedQuickCaptureProps {
  isOpen: boolean
  onClose: () => void
}

export function UnifiedQuickCapture({ isOpen, onClose }: UnifiedQuickCaptureProps) {
  const [mode, setMode] = useState<CaptureMode>('text')
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto focus on text mode
  useEffect(() => {
    if (isOpen && mode === 'text' && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen, mode])

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setContent('')
        setAudioBlob(null)
        setImageFile(null)
        setMode('text')
        setIsRecording(false)
      }, 200)
    }
  }, [isOpen])

  // Voice recording toggle
  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        const chunks: Blob[] = []

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' })
          setAudioBlob(blob)
          stream.getTracks().forEach(track => track.stop())
        }

        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start()
        setIsRecording(true)
        toast.info('녹음을 시작합니다')
      } catch (error) {
        console.error('Microphone access error:', error)
        toast.error('마이크 접근 권한이 필요합니다')
      }
    } else {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      toast.info('녹음을 중지했습니다')
    }
  }

  // Image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('이미지 크기는 10MB 이하여야 합니다')
        return
      }
      setImageFile(file)
    }
  }

  // Save handler
  const handleSave = async () => {
    setIsProcessing(true)
    
    try {
      let noteContent = ''
      let noteType: 'text' | 'voice' | 'image' = 'text'

      if (mode === 'text') {
        if (!content.trim()) {
          toast.error('내용을 입력해주세요')
          setIsProcessing(false)
          return
        }
        noteContent = content
        noteType = 'text'
      } else if (mode === 'voice' && audioBlob) {
        // For now, just create a placeholder
        // TODO: Implement actual voice transcription
        noteContent = '🎤 음성 메모가 저장되었습니다'
        noteType = 'voice'
      } else if (mode === 'image' && imageFile) {
        // For now, just create a placeholder
        // TODO: Implement actual image upload and OCR
        noteContent = `📷 이미지 메모: ${imageFile.name}`
        noteType = 'image'
      } else {
        toast.error('캡처할 내용이 없습니다')
        setIsProcessing(false)
        return
      }

      // Create note via API
      await api.notes.create({
        content: noteContent,
        content_type: noteType
      })
      
      toast.success('메모가 저장되었습니다!')
      onClose()
    } catch (error) {
      console.error('Save error:', error)
      toast.error('저장 중 오류가 발생했습니다')
    } finally {
      setIsProcessing(false)
    }
  }

  // Keyboard shortcut for save
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-800 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Quick Capture
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              {/* Mode selector */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setMode('text')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    mode === 'text' 
                      ? 'bg-coral-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  텍스트
                </button>
                <button
                  onClick={() => setMode('voice')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    mode === 'voice' 
                      ? 'bg-coral-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  음성
                </button>
                <button
                  onClick={() => setMode('image')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    mode === 'image' 
                      ? 'bg-coral-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Image className="w-4 h-4" />
                  이미지
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6">
              {/* Text mode */}
              {mode === 'text' && (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="무엇이든 적어보세요..."
                  className="w-full min-h-[300px] p-4 text-lg bg-transparent border-none outline-none resize-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  onKeyDown={handleKeyDown}
                />
              )}

              {/* Voice mode */}
              {mode === 'voice' && (
                <div className="flex flex-col items-center justify-center min-h-[300px] gap-6">
                  <button
                    onClick={toggleRecording}
                    className={`p-8 rounded-full transition-all transform hover:scale-105 ${
                      isRecording 
                        ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                        : 'bg-coral-500 hover:bg-coral-600 shadow-lg'
                    }`}
                  >
                    <Mic className="w-12 h-12 text-white" />
                  </button>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isRecording ? '녹음 중... 클릭하여 중지' : '클릭하여 녹음 시작'}
                  </p>
                  {audioBlob && (
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      ✓ 녹음 완료
                    </p>
                  )}
                </div>
              )}

              {/* Image mode */}
              {mode === 'image' && (
                <div className="flex flex-col items-center justify-center min-h-[300px] gap-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-8 bg-coral-500 hover:bg-coral-600 rounded-full shadow-lg transition-all transform hover:scale-105"
                  >
                    <Camera className="w-12 h-12 text-white" />
                  </button>
                  <p className="text-gray-600 dark:text-gray-400">
                    클릭하여 이미지 선택
                  </p>
                  {imageFile && (
                    <div className="mt-4 text-center">
                      <img 
                        src={URL.createObjectURL(imageFile)} 
                        alt="Preview" 
                        className="max-w-full max-h-40 rounded-lg shadow-md mx-auto"
                      />
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {imageFile.name}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {mode === 'text' && (
                    <span className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                        ⌘+Enter
                      </kbd>
                      저장
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-coral-500 hover:bg-coral-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2 transition-all transform hover:scale-105 disabled:hover:scale-100"
                >
                  {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                  저장하고 AI 분류
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}