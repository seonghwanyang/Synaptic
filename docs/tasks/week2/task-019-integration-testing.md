# Task 019: 통합 테스트 및 문제 해결

## 🎯 목표
현재 구성된 인증 시스템이 프로덕션 환경에서 정상 작동하는지 확인하고, 발견된 문제를 해결합니다.

## 📋 테스트 계획

### 1. 서버 상태 확인

#### 1-1. Backend 서버 테스트
```bash
# Backend 서버 실행
cd backend
pnpm dev

# 헬스체크 (새 터미널에서)
curl http://localhost:5000/api/health
```

#### 1-2. Frontend 서버 테스트
```bash
# Frontend 서버 실행
cd frontend
pnpm dev

# 브라우저에서 확인
http://localhost:3000
```

### 2. 인증 플로우 테스트

#### 2-1. 회원가입 테스트
1. http://localhost:3000/signup 접속
2. 새 계정 생성:
   - Email: testuser@example.com
   - Password: Test1234!
   - Full Name: Test User

#### 2-2. 로그인 테스트
1. 생성한 계정으로 로그인
2. 개발자 도구 Network 탭 열기
3. 로그인 후 요청 확인:
   - Supabase 인증 요청
   - 세션 토큰 확인

#### 2-3. API 연동 테스트
1. 대시보드에서 Quick Capture (Cmd+Shift+N)
2. 테스트 노트 작성:
   ```
   오늘 Synaptic 프로젝트의 인증 시스템을 완성했다.
   Frontend와 Backend가 Supabase를 통해 완벽하게 통합되었다.
   이제 실제 데이터를 저장하고 AI 분류도 작동한다!
   ```
3. 저장 버튼 클릭
4. Network 탭에서 확인:
   - POST /api/notes 요청
   - Authorization 헤더 확인
   - 응답 상태 (200 OK)

### 3. 데이터 확인

#### 3-1. Supabase Studio에서 확인
1. https://app.supabase.com/project/sevrswzazvuckncdzwfy 접속
2. Table Editor → notes 테이블
3. 저장된 노트 확인:
   - user_id 매칭
   - AI 분류 결과
   - 생성 시간

#### 3-2. Frontend에서 확인
1. 노트 목록 페이지 새로고침
2. 저장된 노트 표시 확인
3. 노트 클릭하여 상세 페이지 확인

### 4. 에러 시나리오 테스트

#### 4-1. 401 에러 테스트
1. 개발자 도구 → Application → Local Storage
2. Supabase 세션 삭제
3. API 요청 시도
4. 자동 로그인 페이지 리다이렉트 확인

#### 4-2. 토큰 새로고침 테스트
1. 장시간 대기 (토큰 만료)
2. API 요청 시도
3. 자동 토큰 새로고침 확인

## 🔍 일반적인 문제 해결

### CORS 에러
```
Access to fetch at 'http://localhost:5000/api/notes' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**해결방법**:
- Backend의 CORS 설정 확인
- frontend URL이 허용 목록에 있는지 확인

### 401 Unauthorized
```
{
  "error": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```
**해결방법**:
1. Frontend와 Backend가 같은 Supabase 프로젝트 사용하는지 확인
2. 환경변수의 SUPABASE_URL이 일치하는지 확인
3. 토큰 형식 확인 (Bearer 포함)

### 500 Internal Server Error
```
{
  "error": "Authentication error",
  "code": "AUTH_ERROR"
}
```
**해결방법**:
1. Backend 로그 확인
2. Supabase 연결 상태 확인
3. 환경변수 설정 확인

### OpenAI API 에러
```
Error: OpenAI API key not configured
```
**해결방법**:
1. Backend .env의 OPENAI_API_KEY 확인
2. API 키 유효성 확인
3. API 사용량 한도 확인

## ✅ 체크리스트

### 기본 기능
- [ ] 회원가입 성공
- [ ] 로그인 성공
- [ ] 대시보드 접근 가능
- [ ] Quick Capture 작동

### API 연동
- [ ] 노트 생성 API 성공
- [ ] 노트 목록 조회 성공
- [ ] 노트 상세 조회 성공
- [ ] 노트 수정/삭제 성공

### AI 기능
- [ ] 자동 분류 작동
- [ ] 태그 추출 성공
- [ ] 요약 생성 성공

### 에러 처리
- [ ] 401 에러 시 로그인 리다이렉트
- [ ] 토큰 자동 새로고침
- [ ] 에러 메시지 표시

## 📊 성능 기준

- 로그인 응답: < 2초
- 노트 저장: < 3초 (AI 분류 포함)
- 노트 목록 로드: < 1초
- 페이지 전환: < 500ms

## 🎯 다음 단계

1. **성능 최적화**
   - 캐싱 전략 구현
   - 로딩 상태 개선
   - 에러 재시도 로직

2. **기능 추가**
   - 음성 녹음 기능
   - 이미지 업로드
   - 실시간 동기화

3. **배포 준비**
   - 환경변수 분리
   - 프로덕션 빌드 최적화
   - 모니터링 설정

---
작성일: 2025-01-30
예상 소요시간: 1시간
우선순위: 🔴🔴🔴 (핵심 검증)
