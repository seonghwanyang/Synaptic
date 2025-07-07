# Task 015: Synaptic UX 개선 및 핵심 기능 구현

## 🔍 현재 문제점 분석

### 1. 다크모드 지원 불완전
- 랜딩페이지에서 다크모드 토글 없음
- 일관성 없는 테마 적용

### 2. 사용자 경험 문제
- "사용자님" 대신 실제 이름 표시 필요
- Quick Capture 버튼 중복 (상단 버튼 vs 플로팅 버튼)
- 서로 다른 UI를 띄움

### 3. 핵심 기능 미구현
- 텍스트 입력만 가능 (음성, 이미지 미구현)
- AI 분류 기능 미작동
- 실제 저장 안됨

### 4. 대시보드 UX 문제
- 분석/통계가 너무 많은 공간 차지
- 메모 작성이 주요 목적인데 숨겨져 있음
- Quick Capture가 메인이 아님

## 🎯 해결 방안

### 1. 다크모드 완전 지원

**app/layout.tsx 수정**:
```tsx
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* 모든 페이지에서 테마 토글 가능 */}
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 2. 사용자 이름 표시

**components/dashboard/WelcomeHeader.tsx**:
```tsx
import { useUser } from '@/hooks/useUser'

export function WelcomeHeader() {
  const { user } = useUser()
  const hour = new Date().getHours()
  
  const getGreeting = () => {
    if (hour < 12) return '좋은 아침이에요'
    if (hour < 18) return '좋은 오후에요'
    return '좋은 저녁이에요'
  }
  
  // 사용자 이름 추출 (이메일에서 @ 앞부분 또는 프로필 이름)
  const userName = user?.user_metadata?.full_name || 
                   user?.email?.split('@')[0] || 
                   '사용자'
  
  return (
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      {getGreeting()}, {userName}님! 👋
    </h1>
  )
}
```

### 3. Quick Capture 통합 및 기능 구현

**components/quick-capture/UnifiedQuickCapture.tsx**:
```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Camera, Image, Type, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreateNote } from '@/hooks/useNotes'
import { toast } from 'sonner'

type CaptureMode = 'text' | 'voice' | 'image'

export function UnifiedQuickCapture({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const [mode, setMode] = useState<CaptureMode>('text')
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const createNote = useCreateNote()

  // 자동 포커스 (텍스트 모드)
  useEffect(() => {
    if (isOpen && mode === 'text' && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen, mode])

  // 음성 녹음 시작/중지
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
      } catch (error) {
        toast.error('마이크 접근 권한이 필요합니다')
      }
    } else {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    }
  }

  // 이미지 선택
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  // 저장 처리
  const handleSave = async () => {
    setIsProcessing(true)
    
    try {
      let noteContent = ''
      let noteType: 'text' | 'voice' | 'image' = 'text'

      if (mode === 'text') {
        noteContent = content
        noteType = 'text'
      } else if (mode === 'voice' && audioBlob) {
        // 음성을 텍스트로 변환 (Web Speech API 또는 서버 API)
        noteContent = '🎤 음성 메모' // 임시
        noteType = 'voice'
      } else if (mode === 'image' && imageFile) {
        // 이미지 업로드 및 OCR 처리
        noteContent = '📷 이미지 메모' // 임시
        noteType = 'image'
      }

      if (!noteContent) {
        toast.error('내용을 입력해주세요')
        return
      }

      await createNote.mutateAsync({ 
        content: noteContent, 
        type: noteType,
        // 음성/이미지 파일 첨부
        attachments: mode === 'voice' ? [audioBlob] : mode === 'image' ? [imageFile] : undefined
      })
      
      toast.success('노트가 저장되고 AI가 분류했습니다!')
      resetState()
      onClose()
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다')
    } finally {
      setIsProcessing(false)
    }
  }

  const resetState = () => {
    setContent('')
    setAudioBlob(null)
    setImageFile(null)
    setMode('text')
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
            {/* 헤더 */}
            <div className="border-b border-gray-200 dark:border-gray-800 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Quick Capture
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* 모드 선택 탭 */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setMode('text')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    mode === 'text' 
                      ? 'bg-coral-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
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
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
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
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Image className="w-4 h-4" />
                  이미지
                </button>
              </div>
            </div>

            {/* 콘텐츠 영역 */}
            <div className="p-6">
              {/* 텍스트 모드 */}
              {mode === 'text' && (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="무엇이든 적어보세요..."
                  className="w-full min-h-[300px] text-lg bg-transparent border-none outline-none resize-none dark:text-white"
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                      handleSave()
                    }
                  }}
                />
              )}

              {/* 음성 모드 */}
              {mode === 'voice' && (
                <div className="flex flex-col items-center justify-center min-h-[300px] gap-6">
                  <button
                    onClick={toggleRecording}
                    className={`p-8 rounded-full transition-all ${
                      isRecording 
                        ? 'bg-red-500 animate-pulse' 
                        : 'bg-coral-500 hover:bg-coral-600'
                    }`}
                  >
                    <Mic className="w-12 h-12 text-white" />
                  </button>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isRecording ? '녹음 중... 클릭하여 중지' : '클릭하여 녹음 시작'}
                  </p>
                  {audioBlob && (
                    <p className="text-green-600 dark:text-green-400">
                      ✓ 녹음 완료
                    </p>
                  )}
                </div>
              )}

              {/* 이미지 모드 */}
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
                    className="p-8 bg-coral-500 hover:bg-coral-600 rounded-full"
                  >
                    <Camera className="w-12 h-12 text-white" />
                  </button>
                  <p className="text-gray-600 dark:text-gray-400">
                    클릭하여 이미지 선택
                  </p>
                  {imageFile && (
                    <div className="mt-4">
                      <img 
                        src={URL.createObjectURL(imageFile)} 
                        alt="Preview" 
                        className="max-w-full max-h-40 rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 하단 액션 */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {mode === 'text' && (
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      ⌘+Enter
                    </kbd>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-coral-500 hover:bg-coral-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
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
```

### 4. 대시보드 UX 개선 - 메모 중심으로

**app/(protected)/dashboard/page.tsx**:
```tsx
export default function DashboardPage() {
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 메인 CTA - 가장 눈에 띄게 */}
      <div className="bg-gradient-to-br from-coral-500 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <WelcomeHeader />
          <p className="text-lg opacity-90 mt-2 mb-6">
            오늘의 생각을 빠르게 기록해보세요
          </p>
          
          {/* 큰 Quick Capture 버튼 */}
          <button
            onClick={() => setIsQuickCaptureOpen(true)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-lg font-medium transition-all hover:scale-105"
          >
            <div className="p-2 bg-white/20 rounded-lg">
              <Type className="w-6 h-6" />
            </div>
            새 메모 작성
            <kbd className="ml-2 px-2 py-1 bg-white/10 rounded text-sm">
              ⌘+Shift+N
            </kbd>
          </button>
        </div>
      </div>

      {/* 최근 노트 - 바로 아래에 */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 영역 - 노트 목록 */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              최근 노트
            </h2>
            <NotesList />
          </div>
          
          {/* 사이드바 - 간단한 통계 */}
          <div className="space-y-6">
            <QuickStats />
            <RecentTags />
          </div>
        </div>
      </div>

      {/* Quick Capture 모달 */}
      <UnifiedQuickCapture 
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
      />
      
      {/* 플로팅 버튼 제거 - 중복 */}
    </div>
  )
}
```

### 5. AI 분류 기능 구현

**backend/src/services/ai-classification.ts**:
```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function classifyNote(content: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "system",
      content: `당신은 노트 분류 전문가입니다. 
      노트를 다음 카테고리 중 하나로 분류하세요:
      - Work/Business (업무, 회의, 프로젝트)
      - Personal/Life (일상, 개인적인 일)
      - Learning/Growth (학습, 성장, 인사이트)
      - Ideas/Creative (아이디어, 창의적 생각)
      - Tasks/Todo (할 일, 일정)
      
      또한 관련 태그 3-5개를 추출하고 한 줄 요약을 만드세요.`
    }, {
      role: "user",
      content: content
    }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  })

  return JSON.parse(completion.choices[0].message.content || '{}')
}
```

## 📋 구현 순서

1. **다크모드 전역 지원** (30분)
2. **사용자 이름 표시** (30분)
3. **Quick Capture 통합** (2시간)
   - 버튼 통일
   - 음성/이미지 기능 추가
4. **대시보드 UX 개선** (1시간)
   - 메모 중심 레이아웃
   - 통계는 보조로
5. **AI 분류 연동** (1시간)
   - OpenAI API 설정
   - 자동 분류 로직

## 🎯 완료 조건
- [ ] 모든 페이지에서 다크모드 작동
- [ ] 사용자 실명으로 인사
- [ ] Quick Capture 버튼 하나로 통일
- [ ] 텍스트/음성/이미지 모두 지원
- [ ] 메모가 대시보드의 중심
- [ ] AI가 실제로 분류

---
작성일: 2025-01-30
예상 소요시간: 5시간