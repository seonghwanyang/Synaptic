# 🚀 다음 세션 작업 지시서

## 📅 작성일: 2025-01-07

### 🎯 진행할 Task 목록

## 1. Task 011-B: 대시보드 UI 완성 (30분-1시간)

### Claude Code 지시문:
```
Task 11-B를 진행해줘. 대시보드 UI에서 미완성된 부분을 완료해야 해.

주요 작업:
1. 사이드바 네비게이션 구현 (Sidebar.tsx)
2. Protected 레이아웃에 사이드바 추가
3. 대시보드에 노트 목록 통합
4. 빈 상태 UI 연결
5. notes, categories, settings 페이지 생성

파일 위치: docs/tasks/week1/task-011-B.md

참고:
- NotesList와 EmptyState 컴포넌트는 이미 있음
- 사이드바는 접기/펼치기 가능하게
- 모바일 반응형 필수
```

---

## 2. Task 012: Express API 서버 구축 (2-3시간)

### Claude Code 지시문:
```
Task 12를 진행해줘. Express API 서버 기본 구조를 구축해야 해.

주요 작업:
1. backend/src/index.ts 완성 (Express 서버)
2. 미들웨어 설정 (CORS, 에러 핸들링)
3. 라우트 구조 생성 (/api/notes, /api/capture)
4. 서비스 레이어 기본 구조
5. Supabase 클라이언트 연동

파일 위치: docs/tasks/week2/task-012.md

중요:
- 포트 5000 사용
- CORS는 http://localhost:3000 허용
- TypeScript 사용
- 환경 변수는 이미 설정됨
```

---

## 📊 작업 전 체크리스트

### 환경 확인:
- [ ] Docker Desktop 실행 중
- [ ] Supabase 로컬 실행 중
- [ ] Frontend 개발 서버 실행 중 (포트 3000)
- [ ] 터미널 2개 준비 (frontend/backend용)

### 파일 확인:
- [ ] frontend/.env.local 존재
- [ ] backend/.env 존재
- [ ] node_modules 설치됨

---

## 🔄 작업 순서

### Step 1: UI 완성 (Task 011-B)
1. 사이드바 구현
2. 레이아웃 수정
3. 페이지 라우팅
4. 테스트

### Step 2: 백엔드 시작 (Task 012)
1. Express 서버 설정
2. 라우트 구조 생성
3. 서비스 레이어 구현
4. API 테스트

### Step 3: 통합 테스트
1. Frontend에서 API 호출
2. 데이터 흐름 확인
3. 에러 처리 테스트

---

## 💡 주의사항

### Task 011-B 진행 시:
- 이미 만들어진 컴포넌트 활용
- 사이드바는 모든 protected 페이지에 표시
- 다크모드 스타일 잊지 말 것

### Task 012 진행 시:
- package.json의 스크립트 확인
- `npm run dev`로 서버 실행
- Postman이나 Thunder Client로 API 테스트

---

## 📝 완료 후 확인사항

### UI (Task 011-B):
- [ ] 사이드바가 모든 페이지에 표시됨
- [ ] 노트 목록이 대시보드에 표시됨
- [ ] 페이지 이동이 작동함
- [ ] 모바일에서 사이드바 토글 작동

### Backend (Task 012):
- [ ] http://localhost:5000/api/health 응답
- [ ] 콘솔에 "Server running on port 5000" 표시
- [ ] TypeScript 컴파일 에러 없음
- [ ] CORS 에러 없음

---

## 🎉 화이팅!

두 Task를 완료하면:
- 완전한 대시보드 UI ✅
- 작동하는 백엔드 서버 ✅
- Frontend-Backend 연동 준비 완료 ✅

이제 실제로 동작하는 앱에 한 발짝 더 가까워집니다! 💪
