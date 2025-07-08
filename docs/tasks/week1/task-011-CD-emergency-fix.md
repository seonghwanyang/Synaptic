# Task 011-CD: 긴급 - CSS/JS 로드 및 라우팅 문제 통합 해결

## 🚨 현재 심각한 문제들
1. **Tailwind CSS가 전혀 작동하지 않음** (페이지가 1990년대 스타일)
2. **JavaScript가 로드되지 않음**
3. **랜딩페이지에서 대시보드로 진입 불가**
4. **로그인/회원가입 후 리다이렉션 미작동**

## 🎯 우선순위 작업

### Part 1: CSS/JS 문제 해결 (최우선!)

#### 1. PostCSS 설정 확인/생성
**frontend/postcss.config.js** 생성 (없다면):
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### 2. 개발 서버 완전 재시작
```bash
# 1. 모든 프로세스 종료 (Ctrl+C)

# 2. 캐시 삭제
cd frontend
rm -rf .next
rm -rf node_modules/.cache

# 3. 의존성 재설치
pnpm install

# 4. 개발 서버 재시작
pnpm dev
```

#### 3. Next.js 설정 파일 확인
**frontend/next.config.js** 생성 (없다면):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

#### 4. 테스트 페이지로 확인
**frontend/src/app/test/page.tsx** 생성:
```tsx
export default function TestPage() {
  return (
    <div className="p-8 bg-blue-500 text-white">
      <h1 className="text-4xl font-bold">Tailwind Test</h1>
      <button 
        className="mt-4 px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100"
        onClick={() => alert('JavaScript works!')}
      >
        Click to test JS
      </button>
    </div>
  )
}
```

http://localhost:3000/test 접속해서 확인:
- 파란 배경이 보여야 함
- 버튼 클릭 시 alert 떠야 함

### Part 2: 라우팅 구조 정리 (CSS 해결 후)

#### 1. 중복 폴더 정리
```bash
# 중복 제거 - (protected) 구조로 통일
cd frontend/src/app
rm -rf dashboard  # 단독 dashboard 폴더 삭제
rm -rf login      # 단독 login 폴더 삭제  
rm -rf signup     # 단독 signup 폴더 삭제
```

최종 구조:
```
frontend/src/app/
├── (auth)/
│   ├── login/
│   └── signup/
├── (protected)/
│   ├── dashboard/
│   ├── notes/
│   └── settings/
└── page.tsx (랜딩페이지)
```

#### 2. 인증 미들웨어 설정
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

  // 보호된 경로에 미인증 사용자 접근 차단
  if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 인증된 사용자가 로그인/회원가입 접근 시 대시보드로
  if (user && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup']
}
```

#### 3. 로그인/회원가입 리다이렉션 추가
**frontend/src/app/(auth)/login/page.tsx** 수정:
```tsx
'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Login successful!')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ... rest of component
}
```

**frontend/src/app/(auth)/signup/page.tsx**도 동일하게 수정

#### 4. Protected Layout 인증 체크
**frontend/src/app/(protected)/layout.tsx** 수정:
```tsx
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Sidebar from '@/components/layout/Sidebar'

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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
```

#### 5. 랜딩페이지 버튼 수정
**frontend/src/app/page.tsx**에서 Get Started 버튼:
```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="...">
      <Link href="/signup">
        <Button size="lg" className="bg-coral-500 hover:bg-coral-600">
          Get Started
        </Button>
      </Link>
      <Link href="/login">
        <Button size="lg" variant="outline">
          Sign In
        </Button>
      </Link>
    </div>
  )
}
```

## 📋 통합 체크리스트

### CSS/JS 수정:
- [ ] postcss.config.js 파일 생성
- [ ] next.config.js 파일 확인
- [ ] .next 폴더 삭제
- [ ] pnpm install 재실행
- [ ] /test 페이지에서 스타일 확인

### 라우팅 수정:
- [ ] 중복 폴더 삭제
- [ ] middleware.ts 생성
- [ ] 로그인/회원가입 리다이렉트 추가
- [ ] Protected layout 인증 체크
- [ ] 랜딩페이지 버튼 경로 수정

## 🧪 전체 테스트 시나리오

1. **CSS/JS 테스트**
   - /test 페이지 접속
   - 파란 배경 확인
   - 버튼 클릭 시 alert 확인

2. **인증 플로우 테스트**
   - 랜딩페이지 → Get Started → /signup
   - 회원가입 완료 → /dashboard 자동 이동
   - 로그아웃 → /dashboard 접근 시 /login으로

3. **스타일 적용 확인**
   - shadcn/ui 버튼 스타일
   - 다크모드 토글
   - 반응형 레이아웃

## 🚑 문제 해결 팁

### PostCSS 에러 시:
```bash
# postcss 관련 패키지 재설치
cd frontend
pnpm add -D postcss autoprefixer
```

### Tailwind 미작동 시:
```bash
# Tailwind 재설치
pnpm add -D tailwindcss@latest
```

### 빌드 에러 시:
```bash
# 로그 확인
pnpm build
# 에러 메시지 확인 후 해결
```

## 🎯 완료 조건
1. **페이지에 CSS가 적용되어 보기 좋음**
2. **JavaScript 인터랙션이 작동함**
3. **로그인/회원가입 후 대시보드 진입 가능**
4. **미인증 사용자는 대시보드 접근 불가**

---
작성일: 2025-01-30
우선순위: 🔴🔴🔴 최우선 (CSS 없이는 작업 불가)