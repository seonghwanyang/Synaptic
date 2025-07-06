# Task 012: Express API 서버 기본 구조 구축

## 목표
백엔드 Express 서버의 기본 구조를 구축하고 필수 미들웨어를 설정합니다.

## 작업 내용

### 1. Express 서버 설정
- [ ] backend/src/index.ts 완성
  - Express 앱 초기화
  - 포트 설정 (기본 5000)
  - 기본 라우트 설정
- [ ] 환경 변수 로드 (dotenv)

### 2. 미들웨어 설정
- [ ] CORS 설정 (frontend 허용)
- [ ] JSON 파싱 미들웨어
- [ ] 요청 로깅 (morgan)
- [ ] 에러 핸들링 미들웨어
- [ ] 인증 미들웨어 (이미 생성됨)

### 3. 라우트 구조 생성
- [ ] backend/src/routes/index.ts
- [ ] backend/src/routes/auth.routes.ts
- [ ] backend/src/routes/notes.routes.ts
- [ ] backend/src/routes/capture.routes.ts

### 4. 컨트롤러 생성
- [ ] backend/src/controllers/auth.controller.ts
- [ ] backend/src/controllers/notes.controller.ts
- [ ] backend/src/controllers/capture.controller.ts

### 5. 서비스 레이어
- [ ] backend/src/services/notes.service.ts
- [ ] backend/src/services/capture.service.ts
- [ ] backend/src/services/supabase.service.ts

### 6. 유틸리티
- [ ] backend/src/utils/response.ts (통일된 응답 포맷)
- [ ] backend/src/utils/errors.ts (커스텀 에러 클래스)
- [ ] backend/src/utils/validation.ts (입력 검증)

### 7. 타입 정의
- [ ] backend/src/types/index.ts
- [ ] Request/Response 타입 정의
- [ ] 서비스 인터페이스 정의

## 완료 조건
- [ ] npm run dev로 서버 실행 가능
- [ ] http://localhost:5000/api/health 응답 확인
- [ ] 콘솔에 에러 없음
- [ ] TypeScript 컴파일 성공

## API 엔드포인트 계획
```
GET    /api/health          - 서버 상태 확인
POST   /api/auth/login      - 로그인
POST   /api/auth/logout     - 로그아웃
GET    /api/auth/me         - 현재 사용자 정보

GET    /api/notes           - 노트 목록
GET    /api/notes/:id       - 노트 상세
POST   /api/notes           - 노트 생성
PATCH  /api/notes/:id       - 노트 수정
DELETE /api/notes/:id       - 노트 삭제

POST   /api/capture/text    - 텍스트 캡처
POST   /api/capture/voice   - 음성 캡처
POST   /api/capture/image   - 이미지 캡처
```
