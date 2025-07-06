# Task 011-D: 긴급 - CSS/JS 로드 문제 해결

## 🚨 심각한 문제 발견
1. **Tailwind CSS가 전혀 작동하지 않음**
2. **JavaScript가 로드되지 않음**
3. **페이지가 순수 HTML처럼 보임**
4. **shadcn/ui 컴포넌트 스타일 없음**

## 🔍 문제 원인 분석

### 가능한 원인들:
1. PostCSS 설정 누락
2. Tailwind 설정 파일 문제
3. Next.js 빌드 오류
4. 개발 서버 캐시 문제

## 🛠️ 즉시 해결 방법

### 1. PostCSS 설정 확인/생성
**frontend/postcss.config.js** 생성:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 2. 개발 서버 완전 재시작
```bash
# 1. 모든 프로세스 종료
# Ctrl+C로 서버 중지

# 2. 캐시 삭제
cd frontend
rm -rf .next
rm -rf node_modules/.cache

# 3. 의존성 재설치
pnpm install

# 4. 개발 서버 재시작
pnpm dev
```

### 3. globals.css 임포트 확인
**frontend/src/app/layout.tsx**에서:
```tsx
import './globals.css'  // 이 줄이 있는지 확인
```

### 4. Tailwind 설정 경로 확인
**frontend/tailwind.config.ts**에서 content 경로가 정확한지:
```ts
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
]
```

### 5. 브라우저 개발자 도구 확인
1. F12로 개발자 도구 열기
2. Console 탭에서 에러 확인
3. Network 탭에서 CSS/JS 파일 로드 실패 확인
4. 실패한 리소스의 경로 확인

### 6. Next.js 설정 파일 생성
**frontend/next.config.js** 생성 (없다면):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

### 7. 빌드 테스트
```bash
# 빌드가 성공하는지 확인
pnpm build

# 빌드 에러가 있다면 해결 필요
```

## 📋 체크리스트

### 파일 존재 확인:
- [ ] frontend/postcss.config.js
- [ ] frontend/tailwind.config.ts
- [ ] frontend/src/app/globals.css
- [ ] frontend/next.config.js

### 임포트 확인:
- [ ] layout.tsx에 globals.css import
- [ ] globals.css에 @tailwind 지시문

### 프로세스:
- [ ] .next 폴더 삭제
- [ ] node_modules/.cache 삭제
- [ ] pnpm install 재실행
- [ ] pnpm dev로 서버 재시작

## 🧪 테스트

### 1. 간단한 테스트 페이지 생성
**frontend/src/app/test/page.tsx**:
```tsx
export default function TestPage() {
  return (
    <div className="p-8 bg-blue-500 text-white">
      <h1 className="text-4xl font-bold">Tailwind Test</h1>
      <button className="mt-4 px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100">
        Button Test
      </button>
    </div>
  )
}
```

http://localhost:3000/test 접속해서 스타일 적용 확인

### 2. 브라우저 콘솔 에러 확인
```javascript
// 콘솔에서 확인
console.log('Tailwind loaded:', typeof window !== 'undefined' && document.querySelector('[href*="tailwind"]'))
console.log('CSS files:', Array.from(document.styleSheets).map(s => s.href))
```

## 🚑 응급 해결책

만약 위 방법이 안 되면:

### 1. 새 Next.js 프로젝트에서 파일 복사
```bash
# 임시 폴더에 새 프로젝트 생성
npx create-next-app@latest test-app --typescript --tailwind --app

# 설정 파일들 복사
cp test-app/postcss.config.js frontend/
cp test-app/next.config.js frontend/
```

### 2. package.json 스크립트 확인
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

## 🎯 예상 결과
- Tailwind 클래스가 적용되어 스타일이 보임
- 버튼에 호버 효과가 작동
- 다크모드 스타일 적용
- shadcn/ui 컴포넌트가 제대로 보임

---
작성일: 2025-01-30
우선순위: 🔴🔴🔴 최우선 (스타일 없이는 아무것도 할 수 없음)