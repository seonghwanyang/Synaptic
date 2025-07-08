# Task 018: 데이터베이스 설정 및 마이그레이션 실행

## 🎯 목표
Supabase 로컬 환경을 시작하고 준비된 마이그레이션을 실행하여 실제 데이터베이스를 구축합니다.

## 📋 작업 내용

### 1. Supabase 로컬 환경 시작

```bash
cd C:\Users\msd12\OneDrive\Desktop\Synaptic\synaptic_code

# Supabase 시작 (Docker Desktop 필요)
supabase start
```

### 2. 환경 변수 설정

#### 2-1. Backend 환경 변수 생성
**backend/.env** 파일 생성:
```env
# Server
PORT=3001
NODE_ENV=development

# Supabase (로컬)
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# OpenAI (나중에 추가)
OPENAI_API_KEY=

# CORS
FRONTEND_URL=http://localhost:3000
```

#### 2-2. Frontend 환경 변수 생성
**frontend/.env.local** 파일 생성:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Mock 모드 비활성화
NEXT_PUBLIC_USE_MOCK=false
```

### 3. 마이그레이션 실행

```bash
# Supabase DB push
supabase db push

# 상태 확인
supabase status
```

### 4. 테스트용 사용자 생성

Supabase Studio (http://localhost:54323)에서:
1. Authentication → Users 탭
2. "Create new user" 클릭
3. 테스트 계정 생성:
   - Email: test@example.com
   - Password: test1234

### 5. 서버 실행 및 테스트

```bash
# Terminal 1: Backend
cd backend
pnpm dev

# Terminal 2: Frontend  
cd frontend
pnpm dev
```

### 6. 기능 테스트

1. **로그인 테스트**
   - http://localhost:3000/login
   - test@example.com / test1234

2. **노트 생성 테스트**
   - Quick Capture (Cmd+Shift+N)
   - 텍스트 입력 후 저장

3. **API 연동 확인**
   - Network 탭에서 /api/notes 요청 확인
   - 200 응답 확인

## 🔍 문제 해결

### Docker Desktop 필요
```
Error: Docker Desktop is not running
해결: Docker Desktop 설치 및 실행
```

### 포트 충돌
```
Error: Port 54321 is already in use
해결: supabase stop 후 다시 시작
```

### 마이그레이션 오류
```
Error: relation "profiles" does not exist
해결: 마이그레이션 순서 확인 (001 → 002 → 003)
```

## ✅ 완료 조건

- [ ] Supabase 로컬 실행 중
- [ ] 모든 테이블 생성 완료
- [ ] 테스트 사용자 생성
- [ ] Frontend/Backend 연동 성공
- [ ] 노트 CRUD 작동 확인

---
작성일: 2025-01-30
예상 소요시간: 30분
우선순위: 🔴🔴🔴 (필수)
