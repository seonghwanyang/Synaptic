# Task 009: 환경 설정 및 프로젝트 실행 테스트

## 목표
개발 환경을 완전히 설정하고 프로젝트가 정상적으로 실행되는지 확인합니다.

## 작업 내용

### 1. 환경 변수 파일 생성
- [ ] frontend/.env.local 파일 생성 (.env.local.example 복사)
- [ ] backend/.env 파일 생성 (.env.example 복사)
- [ ] 로컬 개발용 기본값 설정

### 2. Supabase 로컬 환경 초기화
- [ ] database 폴더에서 supabase init 실행
- [ ] config.toml 파일 확인 및 수정
- [ ] 로컬 Supabase 시작 (supabase start)

### 3. 데이터베이스 마이그레이션
- [ ] 마이그레이션 파일 순차 실행
- [ ] 시드 데이터 삽입
- [ ] 테이블 생성 확인

### 4. 의존성 설치 및 빌드
- [ ] 루트에서 pnpm install
- [ ] TypeScript 타입 생성 (supabase gen types)
- [ ] 빌드 테스트 (pnpm build)

### 5. 개발 서버 실행
- [ ] Frontend 서버 실행 확인 (포트 3000)
- [ ] Supabase Studio 접속 확인 (포트 54323)
- [ ] 기본 페이지 로딩 확인

## 완료 조건
- [ ] localhost:3000 접속 가능
- [ ] Supabase Studio에서 테이블 확인 가능
- [ ] 콘솔에 에러 없음
- [ ] 환경 변수가 올바르게 로드됨

## 참고사항
- Docker Desktop 실행 필수
- 포트 충돌 확인 (3000, 54321, 54322, 54323)
