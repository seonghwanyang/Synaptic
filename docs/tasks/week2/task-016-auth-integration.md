# Task 016: 인증 시스템 통합 - Frontend와 Backend 연결

## 🚨 현재 문제
- Frontend: Supabase Auth 사용
- Backend: 독립적인 JWT 시스템
- 결과: 401 Unauthorized (토큰 불일치)

## 🔧 해결 방법: 3가지 옵션

### Option 1: Backend를 Supabase와 통합 (권장) ✅

#### 1. Backend에서 Supabase 토큰 검증
**backend/src/middleware/auth.ts**:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export const authenticate = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Supabase 토큰 검증
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // 요청에 사용자 정보 추가
    req.user = user
    req.userId = user.id
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}
```

#### 2. Frontend API 클라이언트 수정
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
    // Supabase 세션 가져오기
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login'
      throw new Error('No active session')
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        ...options?.headers,
      },
    })

    if (response.status === 401) {
      // 토큰 만료 시 세션 새로고침
      await supabase.auth.refreshSession()
      // 재시도 또는 로그인 페이지로
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }
}
```

### Option 2: Backend만 사용 (Supabase 제거)

이 방법은 권장하지 않음 - 이미 구축된 Supabase 인증을 버리는 것은 비효율적

### Option 3: Supabase Edge Functions 사용

Backend 대신 Supabase Edge Functions로 API 구축
- 인증이 자동으로 처리됨
- 하지만 기존 Express 구조 변경 필요

## 🚀 즉시 적용할 수 있는 Quick Fix

### 임시 해결책: Mock 모드로 전환
**frontend/.env.local**:
```env
# 임시로 Mock 모드 활성화
NEXT_PUBLIC_USE_MOCK=true
```

### 또는 인증 없이 테스트 (개발용)
**backend/src/routes/notes.ts**:
```typescript
// 개발 중에만 임시로 인증 제거
router.post('/', /* authenticate 제거 */, notesController.createNote)
```

## 📋 완전한 해결 순서

### Step 1: Backend 수정
1. Supabase 패키지 설치
   ```bash
   cd backend
   npm install @supabase/supabase-js
   ```

2. 인증 미들웨어 수정 (위 코드 참조)

3. 환경 변수 추가
   ```env
   SUPABASE_URL=http://localhost:54321
   SUPABASE_SERVICE_KEY=your-service-key
   ```

### Step 2: Frontend 확인
1. 세션 존재 확인
2. 토큰 형식 확인
3. API 호출 시 토큰 포함 확인

### Step 3: 통합 테스트
1. 로그인
2. Quick Capture 열기
3. 메모 작성
4. 저장 → 성공!

## 🎯 근본적인 해결

### 전체 아키텍처 정리:
```
User → Frontend (Next.js) → Supabase Auth
         ↓
      API Calls → Backend (Express) → Supabase 토큰 검증
         ↓                               ↓
      Notes API ←─────────────────── Database
```

### 핵심 포인트:
1. **Frontend와 Backend가 같은 인증 시스템 사용**
2. **Supabase를 Single Source of Truth로**
3. **토큰 형식 통일**

## 🔥 당장 해결하려면

```bash
# 1. Backend에서 임시로 인증 비활성화
cd backend
# routes/notes.ts에서 authenticate 미들웨어 주석 처리

# 2. 또는 Frontend에서 Mock 모드 사용
cd frontend
# .env.local에서 NEXT_PUBLIC_USE_MOCK=true

# 3. 서버 재시작
npm run dev
```

이렇게 하면 일단 작동은 합니다. 그 후에 인증 시스템을 제대로 통합하세요.

---
작성일: 2025-01-30
긴급도: 🔴🔴🔴 (핵심 기능 블로킹)