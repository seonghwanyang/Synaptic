# Task 011-C: 라우팅 및 인증 연결 문제 해결

## 🚨 현재 문제점
1. 랜딩페이지에서 대시보드로 진입 불가
2. 로그인/회원가입 후 리다이렉션 미작동
3. `/dashboard` 경로가 404 (실제 경로는 `/(protected)/dashboard`)

## 🎯 목표
인증 플로우와 라우팅을 연결하여 실제로 대시보드에 접근할 수 있도록 수정

## 작업 내용

### 1. 라우팅 구조 정리
현재 구조 문제:
- `/dashboard` 폴더와 `/(protected)/dashboard` 폴더가 중복
- 어느 것이 실제로 사용되는지 불명확

**해결책**:
```bash
# 중복 제거
frontend/src/app/
├── (auth)/
│   ├── login/
│   └── signup/
├── (protected)/
│   ├── dashboard/
│   ├── notes/
│   └── settings/
└── page.tsx (랜딩페이지)

# /dashboard, /login, /signup 폴더 삭제 필요
```

### 2. 인증 미들웨어 설정
**frontend/src/middleware.ts** 생성:
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 보호된 경로에 미인증 사용자가 접근하면 로그인으로 리다이렉트
  if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 인증된 사용자가 로그인/회원가입 페이지 접근하면 대시보드로 리다이렉트
  if (user && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup']
}
```

### 3. 랜딩페이지 버튼 수정
**frontend/src/app/page.tsx**에서:
```tsx
// 기존
<Link href="/signup">
  <Button size="lg">Get Started</Button>
</Link>

// 수정 (인증 상태 확인)
const { data: { user } } = await supabase.auth.getUser()

<Link href={user ? "/dashboard" : "/signup"}>
  <Button size="lg">
    {user ? "Go to Dashboard" : "Get Started"}
  </Button>
</Link>
```

### 4. 로그인/회원가입 성공 후 리다이렉트
**frontend/src/app/(auth)/login/page.tsx**:
```tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    toast.error(error.message)
  } else {
    toast.success('Login successful!')
    router.push('/dashboard') // 리다이렉트 추가
    router.refresh() // 캐시 새로고침
  }
}
```

**frontend/src/app/(auth)/signup/page.tsx**도 동일하게 수정

### 5. Protected Layout 인증 체크
**frontend/src/app/(protected)/layout.tsx**:
```tsx
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
```

### 6. 테스트 계정 생성 (개발용)
Supabase 로컬에서 테스트 계정 생성:
```sql
-- Supabase Studio에서 실행
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('test@example.com', crypt('test1234', gen_salt('bf')), now());
```

또는 회원가입 페이지에서 직접 가입

## 📋 체크리스트
- [ ] 중복 폴더 정리
- [ ] middleware.ts 생성
- [ ] 랜딩페이지 버튼 수정
- [ ] 로그인/회원가입 리다이렉트
- [ ] Protected layout 인증 체크
- [ ] 테스트 계정으로 로그인 확인

## 🧪 테스트 시나리오
1. 랜딩페이지 → Get Started 클릭 → 회원가입 페이지
2. 회원가입 완료 → 자동으로 대시보드 이동
3. 로그아웃 → 대시보드 접근 시 로그인 페이지로
4. 로그인 → 대시보드 표시

## 🎯 완료 조건
- 로그인하지 않은 사용자는 대시보드 접근 불가
- 로그인한 사용자는 대시보드 접근 가능
- 인증 플로우가 자연스럽게 작동

---
작성일: 2025-01-30
우선순위: 🔴 긴급 (대시보드 접근이 안 되면 다른 작업 진행 불가)