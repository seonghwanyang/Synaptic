# Task 013-A: Synaptic 핵심 페이지 구현 (Mock 데이터 버전)

## 🎯 목표
백엔드 API 개발과 병행하여 프론트엔드 페이지를 Mock 데이터로 먼저 구현합니다.

## 📌 접근 전략
1. **Mock 데이터와 실제 API를 쉽게 전환할 수 있는 구조**
2. **API가 완성되면 최소한의 수정으로 연동**

## 🔧 Mock 데이터 설정

### 1. Mock 데이터 저장소
**frontend/src/lib/mock/notes.ts**:
```typescript
// Mock 노트 데이터
export const mockNotes = [
  {
    id: '1',
    userId: 'user-123',
    content: '오늘 회의에서 나온 아이디어: 사용자 온보딩 개선 필요. 첫 사용자가 Quick Capture를 바로 사용할 수 있도록 튜토리얼 추가하면 좋을 것 같다.',
    contentType: 'text',
    category: 'Work/Business',
    aiConfidence: 0.92,
    tags: ['회의', '온보딩', 'UX'],
    summary: '온보딩 개선을 위한 튜토리얼 추가 아이디어',
    createdAt: new Date('2025-01-30T10:00:00'),
    updatedAt: new Date('2025-01-30T10:00:00'),
  },
  {
    id: '2',
    userId: 'user-123',
    content: 'React 19의 새로운 기능들을 공부해야 함. Server Components와 Actions가 특히 흥미로워 보인다.',
    contentType: 'text',
    category: 'Learning/Growth',
    aiConfidence: 0.88,
    tags: ['React', '공부', '프론트엔드'],
    summary: 'React 19 새 기능 학습 계획',
    createdAt: new Date('2025-01-29T15:30:00'),
    updatedAt: new Date('2025-01-29T15:30:00'),
  },
  // ... 더 많은 mock 데이터
]

// Mock 카테고리 통계
export const mockStats = {
  totalNotes: 42,
  weeklyIdeas: 12,
  completedTasks: 8,
  connections: 23,
  categories: {
    'Work/Business': 15,
    'Personal/Life': 8,
    'Learning/Growth': 10,
    'Ideas/Creative': 6,
    'Tasks/Todo': 3,
  }
}
```

### 2. API 서비스 래퍼
**frontend/src/lib/api/notes.ts**:
```typescript
// 환경 변수로 Mock 모드 전환
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export const notesApi = {
  async getAll(filters?: NoteFilters) {
    if (USE_MOCK) {
      // Mock 데이터 반환
      return Promise.resolve({
        data: mockNotes.filter(note => {
          if (filters?.category && note.category !== filters.category) return false
          if (filters?.search && !note.content.includes(filters.search)) return false
          return true
        }),
        total: mockNotes.length
      })
    }
    
    // 실제 API 호출
    const response = await fetch('/api/notes', {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    return response.json()
  },

  async create(content: string, type: 'text' | 'voice' | 'image' = 'text') {
    if (USE_MOCK) {
      // Mock AI 분류
      const mockCategories = ['Work/Business', 'Learning/Growth', 'Ideas/Creative']
      const category = mockCategories[Math.floor(Math.random() * mockCategories.length)]
      
      const newNote = {
        id: Date.now().toString(),
        content,
        contentType: type,
        category,
        aiConfidence: Math.random() * 0.3 + 0.7, // 0.7 ~ 1.0
        tags: ['자동태그1', '자동태그2'],
        summary: content.substring(0, 50) + '...',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      mockNotes.unshift(newNote)
      
      // AI 처리 시뮬레이션 (2초 딜레이)
      return new Promise(resolve => {
        setTimeout(() => resolve(newNote), 2000)
      })
    }
    
    // 실제 API 호출
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}` 
      },
      body: JSON.stringify({ content, type })
    })
    return response.json()
  }
}
```

### 3. React Query 설정
**frontend/src/hooks/useNotes.ts**:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notesApi } from '@/lib/api/notes'

export function useNotes(filters?: NoteFilters) {
  return useQuery({
    queryKey: ['notes', filters],
    queryFn: () => notesApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5분
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ content, type }: CreateNoteInput) => 
      notesApi.create(content, type),
    onSuccess: () => {
      // 노트 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}
```

## 📱 페이지 구현 (Mock 데이터 사용)

### 1. Quick Capture 컴포넌트
**frontend/src/components/quick-capture/QuickCapture.tsx**:
```typescript
'use client'

import { useState, useRef, useEffect } from 'react'
import { useCreateNote } from '@/hooks/useNotes'
import { Mic, Image, Sparkles, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export function QuickCapture({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const [content, setContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const createNote = useCreateNote()

  // 자동 포커스
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  // 자동 저장 (1초 디바운스)
  useEffect(() => {
    if (!content) return
    
    const timer = setTimeout(() => {
      handleSave()
    }, 1000)

    return () => clearTimeout(timer)
  }, [content])

  const handleSave = async () => {
    if (!content.trim()) return
    
    setIsProcessing(true)
    try {
      await createNote.mutateAsync({ content, type: 'text' })
      toast.success('노트가 저장되고 AI가 분류했습니다!')
      setContent('')
      onClose()
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다')
    } finally {
      setIsProcessing(false)
    }
  }

  // Cmd+Enter로 저장
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
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
            className="w-full max-w-4xl bg-gradient-to-br from-coral-50 to-teal-50 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* 헤더 */}
            <div className="flex justify-between items-center p-6 pb-0">
              <h2 className="text-2xl font-semibold text-gray-800">
                Quick Capture
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 입력 영역 */}
            <div className="p-6">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="무엇이든 적어보세요..."
                className="w-full min-h-[300px] text-xl bg-transparent border-none outline-none resize-none placeholder-gray-400"
              />

              {/* 하단 도구 */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-3">
                  <button className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                    <Mic className="w-5 h-5 text-coral-500" />
                  </button>
                  <button className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                    <Image className="w-5 h-5 text-teal-600" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {isProcessing ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="animate-spin">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      AI가 분류 중...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Sparkles className="w-4 h-4" />
                      AI가 자동으로 분류합니다
                    </div>
                  )}
                  
                  <kbd className="px-3 py-1 bg-white rounded-md text-xs font-mono">
                    ⌘+Enter
                  </kbd>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### 2. 전역 단축키 설정
**frontend/src/hooks/useGlobalShortcuts.ts**:
```typescript
import { useEffect } from 'react'

export function useGlobalShortcuts(onQuickCapture: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + N
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault()
        onQuickCapture()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onQuickCapture])
}
```

## 🔄 API 연동 준비

### 환경 변수 설정
**frontend/.env.local**:
```env
# Mock 모드 (개발 중에는 true)
NEXT_PUBLIC_USE_MOCK=true

# API 준비되면 false로 변경
# NEXT_PUBLIC_USE_MOCK=false
# NEXT_PUBLIC_API_URL=http://localhost:5000
```

### API 연동 시 변경사항
1. `.env.local`에서 `NEXT_PUBLIC_USE_MOCK=false`로 변경
2. 백엔드 서버 실행 확인
3. 인증 토큰 처리 추가
4. 에러 핸들링 강화

## 📋 체크리스트
- [ ] Mock 데이터 구조 생성
- [ ] API 서비스 래퍼 구현 (Mock/Real 전환 가능)
- [ ] Quick Capture 컴포넌트
- [ ] 노트 목록 페이지
- [ ] 노트 상세 페이지
- [ ] 전역 단축키 설정
- [ ] AI 처리 시뮬레이션 (2초 딜레이)

## 🎯 장점
1. **백엔드 개발과 동시 진행 가능**
2. **UI/UX를 먼저 확인하고 개선 가능**
3. **API 완성 시 쉽게 전환**
4. **Mock 데이터로 데모 가능**

---
작성일: 2025-01-30
예상 소요시간: 3-4시간