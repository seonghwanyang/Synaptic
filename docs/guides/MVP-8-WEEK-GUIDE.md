# 🚀 Synaptic 실전 개발 플레이북
## MVP 8주 완성 가이드

> "Desktop Claude Opus → Task 생성 → Claude Code 실행" 워크플로우 최적화

---

# 목차
1. [프로젝트 셋업 (Week 1)](#week-1-프로젝트-셋업)
2. [핵심 백엔드 구축 (Week 2-3)](#week-2-3-핵심-백엔드-구축)
3. [AI 엔진 통합 (Week 4)](#week-4-ai-엔진-통합)
4. [프론트엔드 개발 (Week 5-6)](#week-5-6-프론트엔드-개발)
5. [통합 및 최적화 (Week 7)](#week-7-통합-및-최적화)
6. [배포 및 런칭 (Week 8)](#week-8-배포-및-런칭)

---

# Week 1: 프로젝트 셋업

## Task 1: 프로젝트 초기화 및 개발 환경 구성

```bash
# Claude Code에 전달할 명령
"Synaptic 프로젝트를 위한 모노레포 구조를 생성하고, 
Next.js 14 (App Router), Supabase, Tailwind CSS, shadcn/ui를 설정해줘.
Docker Compose로 로컬 개발 환경도 구성해줘."
```

### 예상 결과물:
```
synaptic/
├── apps/
│   ├── web/                 # Next.js 14 앱
│   └── mobile/              # React Native (나중에)
├── packages/
│   ├── database/            # Prisma 스키마
│   ├── ui/                  # 공통 UI 컴포넌트
│   └── ai-core/             # AI 로직
├── docker-compose.yml       # 로컬 개발 환경
├── turbo.json              # Turborepo 설정
└── package.json
```

## Task 2: Supabase 설정 및 데이터베이스 스키마

```sql
-- Claude Code에 전달할 스키마
"다음 테이블들을 Supabase에 생성해줘:
1. users (인증은 Supabase Auth 사용)
2. notes (content, embedding vector, metadata)
3. categories (AI가 자동 생성)
4. connections (노트 간 연결)
5. insights (AI 생성 인사이트)

pgvector 익스텐션도 활성화하고, RLS 정책도 설정해줘."
```

## Task 3: 기본 인증 시스템

```typescript
// Claude Code 명령
"Supabase Auth를 사용해서 다음 기능을 구현해줘:
1. 이메일/비밀번호 로그인
2. Google OAuth
3. 세션 관리 (Zustand)
4. 보호된 라우트
5. 프로필 설정 페이지"
```

---

# Week 2-3: 핵심 백엔드 구축

## Task 4: Note CRUD API

```typescript
// Claude Code 명령
"Next.js Route Handlers로 노트 CRUD API를 만들어줘:
- POST /api/notes - 노트 생성 (2초 내 응답)
- GET /api/notes - 페이지네이션, 필터링
- PUT /api/notes/[id] - 수정
- DELETE /api/notes/[id] - 삭제
- GET /api/notes/search - 시맨틱 검색

Zod로 입력 검증하고, 에러 핸들링도 구현해줘."
```

## Task 5: Quick Capture 시스템

```typescript
// Claude Code 명령
"Quick Capture 기능을 구현해줘:
1. 글로벌 단축키 (Cmd+Shift+N)
2. 음성 입력 (Web Speech API)
3. 이미지 붙여넣기/드래그앤드롭
4. 자동 저장 (디바운스 500ms)
5. 오프라인 큐 (IndexedDB)

모든 입력은 2초 내에 캡처 가능해야 해."
```

## Task 6: 실시간 동기화

```typescript
// Claude Code 명령
"Supabase Realtime을 사용해서 구현해줘:
1. 노트 변경사항 실시간 동기화
2. Optimistic UI 업데이트
3. Conflict resolution
4. 연결 상태 표시
5. 백그라운드 동기화"
```

---

# Week 4: AI 엔진 통합

## Task 7: AI 자동 분류 시스템

```typescript
// Claude Code 명령
"LangChain과 OpenAI API를 사용해서 AI 분류 시스템을 만들어줘:

1. 노트 생성 시 자동 분류 파이프라인:
   - 콘텐츠 분석
   - 카테고리 예측 (신뢰도 포함)
   - 태그 자동 생성
   - 중요도 평가

2. Edge Function으로 구현 (300ms 내 응답)
3. 분류 결과 캐싱 (Redis)
4. 사용자 피드백 학습 시스템"
```

## Task 8: 임베딩 및 벡터 검색

```typescript
// Claude Code 명령
"pgvector를 사용한 시맨틱 검색을 구현해줘:

1. 노트 저장 시 임베딩 생성 (OpenAI Ada)
2. 벡터 유사도 검색
3. 하이브리드 검색 (키워드 + 시맨틱)
4. 연관 노트 자동 발견
5. 검색 결과 랭킹 알고리즘"
```

## Task 9: AI 인사이트 생성

```typescript
// Claude Code 명령
"주기적으로 실행되는 AI 인사이트 시스템을 만들어줘:

1. 사용자 노트 패턴 분석 (일일/주간)
2. 숨겨진 연결 발견
3. 트렌드 및 주제 클러스터링
4. 실행 가능한 제안 생성
5. 알림/대시보드 표시

Supabase Edge Functions + Cron으로 구현"
```

---

# Week 5-6: 프론트엔드 개발

## Task 10: 메인 대시보드

```typescript
// Claude Code 명령
"Synaptic 메인 대시보드를 만들어줘:

1. Quick Capture Bar (상단 고정)
2. 노트 그리드/리스트 뷰 (토글)
3. AI 분류별 필터 사이드바
4. 실시간 검색
5. 무한 스크롤

Tailwind CSS + shadcn/ui 사용, 다크모드 지원"
```

## Task 11: 노트 에디터

```typescript
// Claude Code 명령
"Rich Text 노트 에디터를 구현해줘:

1. Tiptap 기반 에디터
2. 마크다운 지원
3. 이미지/파일 임베드
4. 코드 하이라이팅
5. AI 자동완성 (슬래시 커맨드)
6. 실시간 저장 인디케이터"
```

## Task 12: 3D 네트워크 시각화

```typescript
// Claude Code 명령
"Three.js로 노트 네트워크 시각화를 만들어줘:

1. Force-directed 3D 그래프
2. 노드: 노트 (크기 = 중요도)
3. 엣지: 연결 (두께 = 강도)
4. 인터랙티브 네비게이션
5. 필터/검색 기능
6. 시간축 애니메이션

성능 최적화 필수 (1000+ 노드)"
```

## Task 13: AI 어시스턴트 패널

```typescript
// Claude Code 명령
"우측 사이드바에 AI 어시스턴트를 구현해줘:

1. 컨텍스트 인식 제안
2. 관련 노트 추천
3. 다음 액션 제안
4. 인사이트 카드
5. 채팅 인터페이스

Framer Motion으로 부드러운 애니메이션"
```

---

# Week 7: 통합 및 최적화

## Task 14: 성능 최적화

```typescript
// Claude Code 명령
"다음 성능 최적화를 적용해줘:

1. 이미지 최적화 (next/image, Sharp)
2. 번들 사이즈 최적화 (dynamic imports)
3. API 응답 캐싱 (SWR)
4. 데이터베이스 쿼리 최적화
5. Lighthouse 점수 95+ 달성

성능 모니터링 대시보드도 추가"
```

## Task 15: PWA 구현

```typescript
// Claude Code 명령
"Progressive Web App으로 만들어줘:

1. Service Worker (오프라인 지원)
2. Web App Manifest
3. Push Notifications
4. 설치 프롬프트
5. 백그라운드 동기화"
```

## Task 16: 테스트 작성

```typescript
// Claude Code 명령
"핵심 기능 테스트를 작성해줘:

1. E2E 테스트 (Playwright)
   - 노트 생성/편집/삭제 플로우
   - AI 분류 정확도 검증
   - 검색 기능

2. 통합 테스트 (Vitest)
   - API 엔드포인트
   - AI 파이프라인

3. 단위 테스트
   - 유틸리티 함수
   - React 컴포넌트"
```

---

# Week 8: 배포 및 런칭

## Task 17: 프로덕션 환경 설정

```typescript
// Claude Code 명령
"Vercel 배포를 위한 설정을 완료해줘:

1. 환경 변수 설정
2. 도메인 연결 (synaptic.ai)
3. Edge Functions 배포
4. 데이터베이스 마이그레이션
5. CDN 설정

GitHub Actions CI/CD 파이프라인도 구성"
```

## Task 18: 모니터링 및 분석

```typescript
// Claude Code 명령
"프로덕션 모니터링을 설정해줘:

1. Sentry (에러 트래킹)
2. Vercel Analytics (성능)
3. PostHog (사용자 행동)
4. LangSmith (AI 모니터링)
5. 커스텀 대시보드

알림 설정도 포함"
```

## Task 19: 보안 강화

```typescript
// Claude Code 명령
"보안 강화 작업을 수행해줘:

1. Rate limiting
2. CORS 설정
3. CSP 헤더
4. Input sanitization
5. SQL injection 방어
6. XSS 방어

보안 감사 체크리스트도 작성"
```

## Task 20: 베타 런칭 준비

```typescript
// Claude Code 명령
"베타 런칭을 위한 준비를 완료해줘:

1. 랜딩 페이지 제작
2. 대기자 명단 시스템
3. 초대 코드 시스템
4. 피드백 수집 도구
5. 온보딩 플로우
6. 문서/튜토리얼"
```

---

# 일일 개발 워크플로우

## 아침 루틴 (30분)
```bash
1. 어제 작업 리뷰
2. 오늘 Task 선정 (2-3개)
3. Claude Opus에서 상세 Task 생성
```

## 개발 사이클 (4시간 블록)
```bash
1. Claude Opus: Task 상세 명세 작성
2. Claude Code: 실제 구현
3. 로컬 테스트
4. 커밋 & 푸시
5. 다음 Task로 이동
```

## 저녁 마무리 (30분)
```bash
1. 코드 리뷰
2. 내일 계획
3. 이슈/블로커 정리
```

---

# 핵심 개발 원칙

## 1. 속도 우선
- 완벽보다 동작하는 MVP
- 80/20 법칙 적용
- 핵심 기능에 집중

## 2. AI First
- 모든 기능에 AI 통합
- 사용자 경험 중심
- 자동화 극대화

## 3. 단순함 유지
- 과도한 추상화 금지
- 명확한 코드
- 빠른 피드백 루프

---

# MVP 체크리스트

## 필수 기능 ✅
- [ ] 사용자 인증
- [ ] 노트 CRUD
- [ ] Quick Capture (텍스트)
- [ ] AI 자동 분류
- [ ] 기본 검색
- [ ] 실시간 동기화

## 차별화 기능 🚀
- [ ] 2초 내 캡처
- [ ] 3D 네트워크 뷰
- [ ] AI 인사이트
- [ ] 음성 입력

## 나중에 ⏰
- [ ] 모바일 앱
- [ ] 팀 협업
- [ ] API 공개
- [ ] 플러그인

---

# 리소스 & 참고

## 기술 스택 공식 문서
- [Next.js 14](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [LangChain](https://js.langchain.com/docs)
- [Three.js](https://threejs.org/docs)

## 유용한 라이브러리
- [Tiptap](https://tiptap.dev/) - 에디터
- [Framer Motion](https://www.framer.com/motion/) - 애니메이션
- [React Flow](https://reactflow.dev/) - 2D 그래프 대안
- [Zod](https://zod.dev/) - 검증

## 영감을 주는 레퍼런스
- Notion의 단순함
- Obsidian의 그래프 뷰
- Linear의 속도
- Raycast의 Quick Capture

---

# 🎯 Action Items

## 오늘 당장 시작하기:
1. **Task 1 실행**: 프로젝트 초기화
2. **도메인 구매**: synaptic.ai
3. **API 키 준비**: OpenAI, Supabase
4. **팀 슬랙 생성**: 진행상황 공유

## 이번 주 목표:
- Week 1 Task 1-3 완료
- 기본 인증 동작
- 첫 노트 저장 성공

**"Move fast, ship daily, iterate constantly"**

---

*이 플레이북을 Claude Code와 함께 사용하면서 지속적으로 업데이트하세요.*