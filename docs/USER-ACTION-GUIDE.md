# 🚨 사용자가 직접 해야 하는 작업 가이드

## 📅 작성일: 2025-01-07

---

## 1. 환경 변수 설정 ⚡

### A. Frontend 환경 변수
**파일 위치**: `C:\Users\msd12\OneDrive\Desktop\Synaptic\synaptic_code\frontend\.env.local`

```bash
# 1. 파일 생성
cd C:\Users\msd12\OneDrive\Desktop\Synaptic\synaptic_code\frontend
copy .env.local.example .env.local

# 2. 메모장으로 열기
notepad .env.local
```

**입력할 내용**:
```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# 나중에 실제 배포시에는 아래처럼 변경
# NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

### B. Backend 환경 변수
**파일 위치**: `C:\Users\msd12\OneDrive\Desktop\Synaptic\synaptic_code\backend\.env`

```bash
# 1. 파일 생성
cd C:\Users\msd12\OneDrive\Desktop\Synaptic\synaptic_code\backend
copy .env.example .env

# 2. 메모장으로 열기
notepad .env
```

**입력할 내용**:
```env
# Supabase Service Key (로컬 개발용)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# OpenAI API Key (필요한 경우)
OPENAI_API_KEY=sk-[YOUR-KEY-HERE]

# 로컬 개발용 Supabase URL
SUPABASE_URL=http://localhost:54321
```

---

## 2. GitHub 브랜치 보호 규칙 설정 🔒

### 브랜치 보호 규칙 설정 방법

1. **GitHub 리포지토리로 이동**
   ```
   https://github.com/[YOUR-USERNAME]/synaptic
   ```

2. **Settings → Branches 클릭**

3. **main 브랜치 보호 규칙**
   - "Add rule" 클릭
   - Branch name pattern: `main`
   - 체크할 항목들:
     - ✅ Require a pull request before merging
       - ✅ Require approvals (1)
       - ✅ Dismiss stale pull request approvals when new commits are pushed
     - ✅ Require status checks to pass before merging
       - ✅ Require branches to be up to date before merging
     - ✅ Require conversation resolution before merging
     - ✅ Include administrators
   - "Create" 클릭

4. **develop 브랜치 보호 규칙**
   - "Add rule" 클릭
   - Branch name pattern: `develop`
   - 체크할 항목들:
     - ✅ Require a pull request before merging
     - ✅ Require status checks to pass before merging
     - ✅ Require conversation resolution before merging
   - "Create" 클릭

---

## 3. 프로젝트 실행 테스트 🚀

### 순서대로 실행하세요:

```bash
# 1. Docker Desktop 실행 (필수!)
# Windows 시작 메뉴에서 Docker Desktop 실행

# 2. 프로젝트 폴더로 이동
cd C:\Users\msd12\OneDrive\Desktop\Synaptic\synaptic_code

# 3. 의존성 설치
pnpm install

# 4. Supabase 시작
cd database
supabase start

# 5. 다른 터미널에서 개발 서버 실행
cd C:\Users\msd12\OneDrive\Desktop\Synaptic\synaptic_code
pnpm dev
```

### 확인사항:
- http://localhost:3000 - Next.js 앱
- http://localhost:54323 - Supabase Studio
- http://localhost:54321 - Supabase API

---

## 4. API 키 발급 방법 🔑

### OpenAI API 키 (선택사항)
1. https://platform.openai.com/api-keys 접속
2. "Create new secret key" 클릭
3. 이름 입력 (예: "synaptic-dev")
4. 생성된 키를 backend/.env 파일에 입력

### Supabase 키 (프로덕션용)
1. https://app.supabase.com 접속
2. 프로젝트 생성 또는 선택
3. Settings → API 메뉴
4. Project URL과 anon key 복사
5. 각각의 .env 파일에 입력

---

## 5. 자주 발생하는 문제 해결 🔧

### Docker Desktop이 실행되지 않을 때
```
- WSL2 업데이트 필요할 수 있음
- 관리자 권한으로 실행
- 재부팅 후 다시 시도
```

### pnpm install 에러
```bash
# npm으로 pnpm 재설치
npm install -g pnpm

# 캐시 클리어
pnpm store prune
```

### Supabase start 에러
```bash
# Docker 실행 확인
docker --version

# Supabase CLI 재설치
npm install -g supabase
```

### 포트 충돌 문제
```bash
# 3000 포트 사용 중인 프로세스 확인
netstat -ano | findstr :3000

# 프로세스 종료 (PID는 위 명령어로 확인)
taskkill /PID [PID번호] /F
```

---

## 6. 체크리스트 ✅

### 환경 설정
- [ ] Docker Desktop 설치 및 실행
- [ ] frontend/.env.local 파일 생성 및 키 입력
- [ ] backend/.env 파일 생성 및 키 입력

### 프로젝트 실행
- [ ] pnpm install 성공
- [ ] supabase start 성공
- [ ] pnpm dev 성공
- [ ] localhost:3000 접속 확인

### GitHub 설정
- [ ] main 브랜치 보호 규칙 설정
- [ ] develop 브랜치 보호 규칙 설정

---

## 📞 추가 도움이 필요하면

1. 에러 메시지를 정확히 복사해서 보여주세요
2. 어느 단계에서 막혔는지 알려주세요
3. 스크린샷이 있으면 더 좋습니다!
