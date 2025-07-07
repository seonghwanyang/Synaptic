# Task 017: 프로덕션 레벨 인증 시스템 통합

## 🎯 목표
Frontend(Supabase Auth)와 Backend(Express)의 인증 시스템을 프로덕션 환경에서 안정적으로 작동하도록 완전히 통합합니다.

## 🏗️ 아키텍처 설계

### 현재 문제
```
[Frontend]                    [Backend]
Supabase Auth      ≠         JWT 독립 시스템
    ↓                             ↓
Supabase Token              자체 JWT Token
    ↓                             ↓
         🚫 서로 이해 못함 🚫
```

### 목표 아키텍처
```
[Frontend]                    [Backend]
Supabase Auth      →         Supabase 검증
    ↓                             ↓
Supabase Token    ────→    Token 검증 (같은 시스템)
    ↓                             ↓
         ✅ 완벽한 통합 ✅
```

## 📋 구현 작업

### 1. Backend Supabase 통합

#### 1-1. 패키지 설치
```bash
cd backend
pnpm add @supabase/supabase-js
```

#### 1-2. Supabase 클라이언트 설정
**backend/src/config/supabase.ts**:
```typescript
import { createClient } from '@supabase/supabase-js'

// 서비스 역할 클라이언트 (백엔드 전용)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// 타입 정의
export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string
          user_id: string
          content: string
          content_type: string
          category: string | null
          ai_confidence: number | null
          tags: string[]
          summary: string | null
          embedding_id: string | null
          created_at: string
          updated_at: string
          is_archived: boolean
        }
        Insert: Omit<Database['public']['Tables']['notes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['notes']['Insert']>
      }
      // 다른 테이블들...
    }
  }
}
```

#### 1-3. 인증 미들웨어 재구현
**backend/src/middleware/auth.ts**:
```typescript
import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '@/config/supabase'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    user_metadata?: any
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header required',
        code: 'NO_AUTH_HEADER'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        error: 'Token required',
        code: 'NO_TOKEN'
      })
    }

    // Supabase로 토큰 검증
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      console.error('Token verification failed:', error)
      return res.status(401).json({
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      })
    }

    // 사용자 정보를 요청 객체에 추가
    req.user = {
      id: user.id,
      email: user.email!,
      user_metadata: user.user_metadata
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({
      error: 'Authentication error',
      code: 'AUTH_ERROR'
    })
  }
}

// 선택적 인증 (인증되지 않아도 통과)
export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader) {
    return next()
  }

  // 토큰이 있으면 검증 시도
  await authenticate(req, res, next)
}
```

### 2. Backend 서비스 레이어 수정

#### 2-1. Notes Service Supabase 통합
**backend/src/services/notes.service.ts**:
```typescript
import { supabaseAdmin } from '@/config/supabase'
import { Database } from '@/config/supabase'

type Note = Database['public']['Tables']['notes']['Row']
type CreateNoteInput = Database['public']['Tables']['notes']['Insert']

export class NotesService {
  async createNote(userId: string, input: CreateNoteInput): Promise<Note> {
    const { data, error } = await supabaseAdmin
      .from('notes')
      .insert({
        ...input,
        user_id: userId
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create note: ${error.message}`)
    }

    return data
  }

  async getUserNotes(userId: string, limit = 50): Promise<Note[]> {
    const { data, error } = await supabaseAdmin
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`)
    }

    return data || []
  }

  async getNote(noteId: string, userId: string): Promise<Note | null> {
    const { data, error } = await supabaseAdmin
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new Error(`Failed to fetch note: ${error.message}`)
    }

    return data
  }

  async updateNote(
    noteId: string, 
    userId: string, 
    updates: Partial<CreateNoteInput>
  ): Promise<Note | null> {
    const { data, error } = await supabaseAdmin
      .from('notes')
      .update(updates)
      .eq('id', noteId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Failed to update note: ${error.message}`)
    }

    return data
  }

  async deleteNote(noteId: string, userId: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Failed to delete note: ${error.message}`)
    }

    return true
  }
}
```

#### 2-2. 컨트롤러 수정
**backend/src/controllers/notes.controller.ts**:
```typescript
import { Response } from 'express'
import { AuthRequest } from '@/middleware/auth'
import { NotesService } from '@/services/notes.service'
import { AIService } from '@/services/ai.service'

export class NotesController {
  private notesService: NotesService
  private aiService: AIService

  constructor() {
    this.notesService = new NotesService()
    this.aiService = new AIService()
  }

  async createNote(req: AuthRequest, res: Response) {
    try {
      const { content, content_type = 'text', attachments } = req.body
      const userId = req.user!.id

      // 1. AI 분류 실행
      const aiAnalysis = await this.aiService.analyzeNote(content)

      // 2. 노트 저장
      const note = await this.notesService.createNote(userId, {
        user_id: userId,
        content,
        content_type,
        category: aiAnalysis.category,
        ai_confidence: aiAnalysis.confidence,
        tags: aiAnalysis.tags,
        summary: aiAnalysis.summary,
        is_archived: false
      })

      res.status(201).json({
        success: true,
        data: note
      })
    } catch (error) {
      console.error('Create note error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to create note'
      })
    }
  }

  async getNotes(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id
      const limit = parseInt(req.query.limit as string) || 50

      const notes = await this.notesService.getUserNotes(userId, limit)

      res.json({
        success: true,
        data: notes
      })
    } catch (error) {
      console.error('Get notes error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notes'
      })
    }
  }
}
```

### 3. Frontend 인증 헤더 확인

#### 3-1. API 클라이언트 수정
**frontend/src/lib/api/client.ts**:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  async request(endpoint: string, options?: RequestInit) {
    try {
      // 현재 세션 가져오기
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        throw new Error('Failed to get session')
      }

      if (!session) {
        // 세션이 없으면 로그인 페이지로
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        throw new Error('No active session')
      }

      // API 요청
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          ...options?.headers,
        },
      })

      // 401 에러 처리
      if (response.status === 401) {
        // 세션 새로고침 시도
        const { data: { session: newSession } } = await supabase.auth.refreshSession()
        
        if (!newSession) {
          // 새로고침 실패 - 로그인 필요
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          throw new Error('Session expired')
        }

        // 새 토큰으로 재시도
        return this.request(endpoint, options)
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `API Error: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // API 메서드들
  notes = {
    create: (data: any) => 
      this.request('/notes', { 
        method: 'POST', 
        body: JSON.stringify(data) 
      }),
    
    getAll: (params?: any) => 
      this.request(`/notes${params ? '?' + new URLSearchParams(params) : ''}`),
    
    getById: (id: string) => 
      this.request(`/notes/${id}`),
    
    update: (id: string, data: any) => 
      this.request(`/notes/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(data) 
      }),
    
    delete: (id: string) => 
      this.request(`/notes/${id}`, { 
        method: 'DELETE' 
      }),
  }
}

export const api = new ApiClient()
```

### 4. 환경 변수 설정

#### 4-1. Backend 환경 변수
**backend/.env**:
```env
# Server
PORT=5000
NODE_ENV=development

# Supabase (같은 프로젝트)
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-key

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000
```

#### 4-2. Frontend 환경 변수
**frontend/.env.local**:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Mock 모드 비활성화 (프로덕션)
NEXT_PUBLIC_USE_MOCK=false
```

### 5. 데이터베이스 마이그레이션

#### 5-1. Notes 테이블 생성
**database/migrations/002_create_notes_table.sql**:
```sql
-- Notes 테이블
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'text',
  category VARCHAR(100),
  ai_confidence DECIMAL(3,2),
  tags TEXT[] DEFAULT '{}',
  summary TEXT,
  embedding_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_archived BOOLEAN DEFAULT FALSE
);

-- 인덱스
CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_created_at ON public.notes(created_at DESC);
CREATE INDEX idx_notes_category ON public.notes(category);

-- RLS (Row Level Security)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 정책: 사용자는 자신의 노트만 볼 수 있음
CREATE POLICY "Users can view own notes" ON public.notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notes" ON public.notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON public.notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON public.notes
  FOR DELETE USING (auth.uid() = user_id);

-- Updated_at 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 5-2. 마이그레이션 실행
```bash
cd database
supabase db push
```

## 🧪 통합 테스트 시나리오

### 1. 로그인 플로우
```typescript
// 1. 사용자가 로그인
await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// 2. 세션 확인
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

// 3. API 호출 테스트
const response = await api.notes.create({
  content: 'Test note',
  content_type: 'text'
})
console.log('Created note:', response)
```

### 2. 에러 처리 테스트
- 토큰 없이 API 호출 → 401 에러
- 잘못된 토큰으로 호출 → 401 에러
- 토큰 만료 → 자동 새로고침
- 새로고침 실패 → 로그인 페이지로

### 3. 성능 테스트
- 동시 요청 처리
- 토큰 검증 속도
- 데이터베이스 쿼리 최적화

## 📋 체크리스트

### Backend
- [ ] Supabase 패키지 설치
- [ ] 인증 미들웨어 구현
- [ ] 서비스 레이어 Supabase 통합
- [ ] 컨트롤러 수정
- [ ] 환경 변수 설정
- [ ] CORS 설정 확인

### Frontend
- [ ] API 클라이언트 수정
- [ ] 세션 관리 로직
- [ ] 에러 처리
- [ ] 토큰 새로고침
- [ ] Mock 모드 제거

### Database
- [ ] Notes 테이블 생성
- [ ] RLS 정책 설정
- [ ] 인덱스 최적화
- [ ] 트리거 설정

## 🎯 완료 조건
1. 사용자가 로그인하면 Supabase 세션 생성
2. Frontend에서 API 호출 시 Supabase 토큰 사용
3. Backend에서 Supabase 토큰 검증 성공
4. 노트 CRUD 작업 정상 작동
5. 401 에러 없이 인증된 요청 처리
6. 프로덕션 환경에서 안정적 작동

---
작성일: 2025-01-30
예상 소요시간: 2-3시간
우선순위: 🔴🔴🔴 (핵심 기능 블로킹)