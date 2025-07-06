# Task 007: Week 2 준비 - 백엔드 API 고도화

## 목표
Week 2 백엔드 고도화를 위한 기본 API 구조 구현

## 작업 내용

### 1. Express.js 서버 설정
- [ ] backend/src/index.ts 업데이트
- [ ] Express 미들웨어 설정 (cors, helmet, compression)
- [ ] 에러 핸들링 미들웨어 구현
- [ ] 로깅 시스템 설정 (winston)

### 2. API 라우트 구조
- [ ] backend/src/routes 폴더 생성
- [ ] /api/v1/notes 라우트 구현
  - GET /notes (목록 조회)
  - GET /notes/:id (상세 조회)
  - POST /notes (생성)
  - PATCH /notes/:id (수정)
  - DELETE /notes/:id (삭제)
- [ ] /api/v1/capture 라우트 구현
  - POST /capture/text
  - POST /capture/voice
  - POST /capture/image

### 3. 서비스 레이어
- [ ] backend/src/services 폴더 구조
- [ ] NotesService 클래스 구현
- [ ] CaptureService 클래스 구현
- [ ] Supabase 클라이언트 통합

### 4. 유틸리티
- [ ] backend/src/utils/validation.ts (입력 검증)
- [ ] backend/src/utils/response.ts (통일된 응답 포맷)
- [ ] backend/src/utils/errors.ts (커스텀 에러 클래스)

### 5. 테스트 설정
- [ ] Jest 설정
- [ ] 기본 테스트 작성
- [ ] API 통합 테스트 준비

## 완료 조건
- [ ] Express 서버가 정상 실행됨
- [ ] 모든 API 엔드포인트가 작동함
- [ ] Postman 컬렉션 생성
- [ ] 기본 테스트 통과

## 참고 자료
- Express Best Practices: https://expressjs.com/en/advanced/best-practice-security.html
- Supabase JavaScript Client: https://supabase.com/docs/reference/javascript/introduction
