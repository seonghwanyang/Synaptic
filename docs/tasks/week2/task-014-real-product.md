# Task 014: 실제 동작하는 프로덕트 만들기 (백엔드 + DB 연동)

## 🎯 현재 상황
- ✅ Mock 데이터로 UI 완성
- ✅ Quick Capture, 노트 목록, AI 분류 UI 작동
- ❌ 실제 데이터베이스 연동 안됨
- ❌ AI 서비스 연동 안됨
- ❌ 데이터 영구 저장 안됨

## 📋 실제 프로덕트를 위해 필요한 작업들

### 1. Supabase 설정 및 DB 마이그레이션
```bash
# 1. Supabase 로컬 시작
cd database
supabase start

# 2. 마이그레이션 실행
supabase db push

# 3. 타입 생성
supabase gen types typescript --local > ../frontend/src/types/supabase.ts
```

### 2. 백엔드 API 서버 구축
**이미 Task 012에 상세히 정의됨**
- Express 서버
- Supabase 연동
- JWT 인증
- 노트 CRUD API

### 3. OpenAI API 통합
**backend/src/services/ai.service.ts**:
```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export class AIService {
  async categorizeNote(content: string) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `You are a note categorization system. Categorize the note into one of these categories:
        - Work/Business
        - Personal/Life
        - Learning/Growth
        - Ideas/Creative
        - Tasks/Todo
        
        Also extract 3-5 relevant tags and create a one-line summary.
        
        Return JSON format:
        {
          "category": "category_name",
          "confidence": 0.0-1.0,
          "tags": ["tag1", "tag2"],
          "summary": "one line summary"
        }`
      }, {
        role: "user",
        content: content
      }],
      response_format: { type: "json_object" }
    })

    return JSON.parse(completion.choices[0].message.content)
  }

  async findSimilarNotes(embedding: number[], userId: string) {
    // Pinecone 또는 pgvector로 유사 노트 검색
    // 구현 예정
  }
}
```

### 4. 프론트엔드 API 연동
**frontend/src/lib/api/client.ts**:
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// API 클라이언트
class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  async request(endpoint: string, options?: RequestInit) {
    const { data: { session } } = await supabase.auth.getSession()
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session ? `Bearer ${session.access_token}` : '',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // 노트 CRUD
  notes = {
    create: (data: CreateNoteInput) => 
      this.request('/notes', { method: 'POST', body: JSON.stringify(data) }),
    
    getAll: (params?: any) => 
      this.request(`/notes?${new URLSearchParams(params)}`),
    
    getById: (id: string) => 
      this.request(`/notes/${id}`),
    
    update: (id: string, data: any) => 
      this.request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    
    delete: (id: string) => 
      this.request(`/notes/${id}`, { method: 'DELETE' }),
  }
}

export const api = new ApiClient()
```

### 5. 환경 변수 설정
**frontend/.env.local**:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Mock 모드 해제
NEXT_PUBLIC_USE_MOCK=false
```

**backend/.env**:
```env
# Server
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_KEY=your-service-key

# OpenAI
OPENAI_API_KEY=your-openai-key

# JWT
JWT_SECRET=your-jwt-secret
```

## 🎨 디자인 개선 방법

### 1. 디자인 레퍼런스 적용 프로세스

#### Step 1: 디자인 시스템 문서화
**docs/design-system.md** 생성:
```markdown
# Synaptic Design System

## 레퍼런스
- [레퍼런스 이미지/링크]

## 색상 팔레트
- Primary: #FF6B6B (Coral)
- Secondary: #008B8B (Teal)
- [추가 색상들...]

## 타이포그래피
- Heading: Inter 700
- Body: Inter 400
- [폰트 스케일...]

## 컴포넌트 스타일
- 버튼: [스타일 가이드]
- 카드: [스타일 가이드]
- [기타 컴포넌트...]
```

#### Step 2: Tailwind Config 업데이트
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // 레퍼런스 기반 색상
        'brand': {
          50: '#fff5f5',
          500: '#ff6b6b',
          900: '#c92a2a',
        }
      },
      fontFamily: {
        // 레퍼런스 기반 폰트
        'display': ['Cal Sans', 'Inter', 'sans-serif'],
      },
      // 레퍼런스 기반 그림자, 반경 등
    }
  }
}
```

#### Step 3: 컴포넌트별 스타일 적용
```typescript
// 예시: 레퍼런스 기반 노트 카드
const NoteCard = () => (
  <div className="
    bg-white 
    rounded-2xl 
    shadow-[0_4px_20px_rgba(0,0,0,0.08)]
    hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]
    transition-all
    duration-300
    border border-gray-100
    overflow-hidden
  ">
    {/* 레퍼런스 기반 내부 스타일 */}
  </div>
)
```

### 2. 디자인 레퍼런스 전달 방법

#### Claude Code에게 디자인 적용 요청:
```
다음 디자인 레퍼런스를 Synaptic에 적용해주세요:

[이미지 URL 또는 설명]

적용할 요소:
1. 색상 팔레트 추출 및 적용
2. 노트 카드 스타일 개선
3. 버튼 스타일 업데이트
4. 전반적인 spacing과 typography

Tailwind config와 컴포넌트 스타일을 업데이트해주세요.
```

## 📊 작업 우선순위

### Phase 1: 실제 데이터 저장 (1-2일)
1. Supabase 설정
2. 백엔드 API 구축 (Task 012)
3. 프론트엔드 API 연동
4. Mock 모드 해제

### Phase 2: AI 통합 (1일)
1. OpenAI API 키 설정
2. 자동 분류 구현
3. 태그 추출
4. 요약 생성

### Phase 3: 디자인 개선 (1일)
1. 디자인 시스템 정의
2. 컴포넌트 스타일 업데이트
3. 애니메이션 추가
4. 다크모드 지원

### Phase 4: 고급 기능 (2-3일)
1. 벡터 검색 (유사 노트)
2. 3D 네트워크 뷰
3. 실시간 동기화
4. 리마인더 시스템

## 🧪 통합 테스트

1. **회원가입 → 로그인**
2. **Quick Capture로 노트 작성**
3. **AI 자동 분류 확인**
4. **노트 목록에서 확인**
5. **노트 편집/삭제**
6. **로그아웃 → 재로그인 → 데이터 유지 확인**

---
작성일: 2025-01-30
예상 소요시간: 3-5일 (전체)