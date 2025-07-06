# 🚀 AI 노트 서비스 사업기획서
## "생각의 속도로 정리하는 두 번째 뇌"

> Version 2.0 | 2025년 1월
> Brand Colors: Coral (#FF6B6B) & Deep Teal (#008B8B)

---

# 목차

1. [Executive Summary](#1-executive-summary)
2. [사업 본질과 핵심 가치](#2-사업-본질과-핵심-가치)
3. [브랜드 전략](#3-브랜드-전략)
4. [기술 아키텍처](#4-기술-아키텍처)
5. [MVP 개발 계획](#5-mvp-개발-계획)
6. [개발 태스크 분해](#6-개발-태스크-분해)
7. [데이터베이스 설계](#7-데이터베이스-설계)
8. [AI 엔진 설계](#8-ai-엔진-설계)
9. [보안 및 프라이버시](#9-보안-및-프라이버시)
10. [출시 및 성장 전략](#10-출시-및-성장-전략)

---

# 1. Executive Summary

## 프로젝트 개요
**제품명**: (Synaptic)  
**비전**: 인류의 모든 생각이 자동으로 정리되고 적시에 회상되는 지능형 메모 시스템  
**미션**: AI 기술로 흩어진 생각을 자동 분류하고 리마인드하여 아이디어의 실행률을 3배 향상

## 핵심 지표
- **MVP 목표** (3개월): DAU 1,000명, 일일 메모 5개/사용자
- **6개월 목표**: MAU 10만명, 유료 전환율 5%
- **12개월 목표**: MAU 100만명, ARR $10M

## 기술 스택 요약
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express/Fastify, PostgreSQL, Redis
- **AI**: OpenAI API, Langchain, Vector DB (Pinecone)
- **Infrastructure**: Vercel/AWS, Docker, GitHub Actions

---

# 2. 사업 본질과 핵심 가치

## 2.1 문제 정의

### 사용자의 고통점
```
"하루에도 수많은 아이디어가 떠오르지만..."

1. 📝 한 메모장에 여러 주제가 뒤섞임
   - "오늘 할 일 + 사업 아이디어 + 장보기 리스트"가 한 곳에
   
2. 🔍 나중에 찾기 어려움
   - "그 아이디어 어느 날짜에 적었더라?"
   
3. 💨 메모하고 잊어버림
   - 메모의 90%는 다시 보지 않음
```

## 2.2 우리의 솔루션

### 3단계 가치 제공
`
1️⃣ 메모는 빠르게 어플 이나 서비스 키자마자 바로 나오는 메모장 --> 여기저기 메모 분류 파일 찾아볼 시간 x  (2초 내)
   ↓
2️⃣ AI 자동 분류 (0.3초)
   ↓
3️⃣ 스마트 리마인드 (적시에)
```

### 핵심 기능
1. **무의식적 캡처**: 어떤 형태든 즉시 기록
2. **자동 카테고리화**: AI가 실시간으로 분류
3. **컨텍스트 리마인드**: 잊혀질 위기의 아이디어 알림

---

# 3. 브랜드 전략

## 3.1 브랜드 아이덴티티

### 브랜드 컬러
```css
:root {
  /* Primary Colors */
  --coral-primary: #FF6B6B;
  --coral-light: #FFB6B6;
  --coral-dark: #E85555;
  
  /* Secondary Colors */
  --teal-primary: #008B8B;
  --teal-light: #20B2AA;
  --teal-dark: #006666;
  
  /* Neutral Colors */
  --black: #0A0A0A;
  --gray-900: #1A1A2E;
  --gray-800: #2D3436;
  --gray-100: #F8F9FA;
  --white: #FFFFFF;
}
```

### 타이포그래피
```css
/* Font Stack */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;

/* Type Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### 디자인 원칙
1. **Effortless**: 생각만큼 빠른 기록
2. **Intelligent**: 똑똑한 자동 정리
3. **Timely**: 적시의 리마인드
4. **Personal**: 개인화된 경험

---

# 4. 기술 아키텍처

## 4.1 시스템 아키텍처

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │   Backend API   │     │   AI Services   │
│   (Next.js)     │────▶│   (Node.js)     │────▶│  (OpenAI API)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Vercel      │     │   PostgreSQL    │     │    Pinecone     │
│   (Hosting)     │     │   (Database)    │     │  (Vector DB)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 4.2 기술 스택 상세

### Frontend
```javascript
{
  "framework": "Next.js 14 (App Router)",
  "ui": {
    "library": "React 18",
    "language": "TypeScript",
    "styling": "Tailwind CSS + CSS Modules",
    "components": "Radix UI + Custom",
    "animations": "Framer Motion",
    "icons": "Lucide React"
  },
  "state": {
    "client": "Zustand",
    "server": "TanStack Query",
    "forms": "React Hook Form + Zod"
  },
  "tools": {
    "bundler": "Turbopack",
    "linter": "ESLint + Prettier",
    "testing": "Jest + React Testing Library"
  }
}
```

### Backend
```javascript
{
  "runtime": "Node.js 20 LTS",
  "framework": "Express.js / Fastify",
  "language": "TypeScript",
  "database": {
    "primary": "PostgreSQL 15",
    "cache": "Redis 7",
    "vector": "Pinecone",
    "orm": "Prisma"
  },
  "authentication": {
    "method": "JWT + Refresh Token",
    "provider": "Auth0 / Supabase Auth"
  },
  "api": {
    "style": "RESTful + GraphQL",
    "documentation": "OpenAPI 3.0",
    "validation": "Joi / Yup"
  }
}
```

### AI & ML
```javascript
{
  "llm": {
    "provider": "OpenAI",
    "models": ["gpt-4-turbo", "gpt-3.5-turbo"],
    "embedding": "text-embedding-3-small"
  },
  "framework": "Langchain.js",
  "vectorDB": "Pinecone",
  "processing": {
    "classification": "Custom fine-tuned model",
    "summarization": "GPT-4",
    "similarity": "Cosine similarity"
  }
}
```

### Infrastructure
```javascript
{
  "hosting": {
    "frontend": "Vercel",
    "backend": "AWS EC2 / Railway",
    "database": "AWS RDS / Supabase"
  },
  "cicd": {
    "vcs": "GitHub",
    "ci": "GitHub Actions",
    "monitoring": "Sentry + Datadog"
  },
  "security": {
    "waf": "Cloudflare",
    "secrets": "AWS Secrets Manager",
    "encryption": "AES-256"
  }
}
```

---

# 5. MVP 개발 계획

## 5.1 MVP 범위 (8주)

### Week 1-2: 기반 구축
- [ ] Next.js 프로젝트 설정
- [ ] 인증 시스템 구현
- [ ] 데이터베이스 스키마 설계
- [ ] 기본 UI 컴포넌트 개발

### Week 3-4: 핵심 기능 1 - Quick Capture
- [ ] 텍스트 입력 인터페이스
- [ ] 음성 메모 (Web Speech API)
- [ ] 이미지 첨부
- [ ] 실시간 저장

### Week 5-6: 핵심 기능 2 - AI 자동 분류
- [ ] OpenAI API 연동
- [ ] 카테고리 자동 생성
- [ ] 태그 추출
- [ ] 벡터 임베딩 저장

### Week 7-8: 핵심 기능 3 - 스마트 리마인드
- [ ] 리마인드 알고리즘
- [ ] 알림 시스템
- [ ] 대시보드 개발
- [ ] 성능 최적화

## 5.2 Post-MVP 로드맵

### Phase 2 (Month 3-4): 연결과 발견
- 아이디어 네트워크 시각화
- 유사 메모 자동 연결
- 고급 검색 기능

### Phase 3 (Month 5-6): 협업과 공유
- 팀 워크스페이스
- 공유 기능
- 실시간 동기화

---

# 6. 개발 태스크 분해

## 6.1 Frontend Tasks

### Setup & Configuration
```bash
# TASK-001: 프로젝트 초기 설정
- Next.js 14 App Router 설정
- TypeScript 설정
- Tailwind CSS + 디자인 시스템
- ESLint, Prettier 설정
- Git hooks (Husky)

# TASK-002: 디자인 시스템 구축
- Color tokens (Coral & Teal)
- Typography scales
- Component library setup
- Dark mode support
```

### Core Components
```bash
# TASK-003: Quick Capture 컴포넌트
- TextInput component
- VoiceInput component  
- ImageUpload component
- AutoSave hook

# TASK-004: Note Display 컴포넌트
- NoteCard component
- NoteGrid layout
- CategoryBadge component
- TagList component

# TASK-005: AI 피드백 UI
- LoadingStates
- AIProcessingIndicator
- CategorySuggestion
- ConfidenceScore display
```

## 6.2 Backend Tasks

### API Development
```bash
# TASK-101: 인증 API
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- GET /auth/me

# TASK-102: Notes CRUD API
- POST /notes
- GET /notes
- PUT /notes/:id
- DELETE /notes/:id

# TASK-103: AI Processing API
- POST /ai/categorize
- POST /ai/extract-tags
- POST /ai/find-similar
- POST /ai/generate-summary
```

### Database & Infrastructure
```bash
# TASK-201: Database Setup
- PostgreSQL schema design
- Prisma ORM setup
- Migration scripts
- Seed data

# TASK-202: Redis Cache
- Session management
- API response caching
- Rate limiting
```

## 6.3 AI Integration Tasks

```bash
# TASK-301: OpenAI Integration
- API key management
- Prompt engineering
- Token optimization
- Error handling

# TASK-302: Vector Database
- Pinecone setup
- Embedding generation
- Similarity search
- Index optimization

# TASK-303: Classification Model
- Category taxonomy design
- Training data preparation
- Model fine-tuning
- Accuracy testing
```

---

# 7. 데이터베이스 설계

## 7.1 주요 테이블

```sql
-- Users 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes 테이블
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'text',
  category_id UUID REFERENCES categories(id),
  ai_confidence DECIMAL(3,2),
  embedding_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reminded_at TIMESTAMP,
  is_archived BOOLEAN DEFAULT FALSE
);

-- Categories 테이블
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#FF6B6B',
  icon VARCHAR(50),
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags 테이블
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  usage_count INTEGER DEFAULT 0,
  UNIQUE(name, user_id)
);

-- Note_Tags 연결 테이블
CREATE TABLE note_tags (
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Reminders 테이블
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP NOT NULL,
  type VARCHAR(50) DEFAULT 'review',
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP
);
```

## 7.2 인덱스 전략

```sql
-- 검색 성능 최적화
CREATE INDEX idx_notes_user_created ON notes(user_id, created_at DESC);
CREATE INDEX idx_notes_category ON notes(category_id);
CREATE INDEX idx_notes_content_search ON notes USING gin(to_tsvector('english', content));

-- 태그 검색 최적화
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_note_tags_note ON note_tags(note_id);
```

---

# 8. AI 엔진 설계

## 8.1 자동 분류 시스템

### 분류 프롬프트 엔지니어링
```javascript
const CATEGORIZATION_PROMPT = `
You are an intelligent note categorization system. 
Analyze the following note and categorize it.

Note: "{content}"

Categories:
1. Work/Business - 업무, 회의, 프로젝트
2. Personal/Life - 일상, 가족, 친구
3. Learning/Growth - 공부, 독서, 인사이트
4. Ideas/Creative - 아이디어, 기획, 창작
5. Tasks/Todo - 할일, 일정, 마감

Output format:
{
  "category": "category_name",
  "confidence": 0.95,
  "keywords": ["keyword1", "keyword2"],
  "summary": "one line summary"
}
`;
```

### 벡터 임베딩 처리
```javascript
async function processNoteEmbedding(noteContent: string) {
  // 1. 텍스트 정제
  const cleanedText = preprocessText(noteContent);
  
  // 2. 임베딩 생성
  const embedding = await openai.createEmbedding({
    model: "text-embedding-3-small",
    input: cleanedText
  });
  
  // 3. Pinecone 저장
  await pinecone.upsert({
    vectors: [{
      id: noteId,
      values: embedding.data[0].embedding,
      metadata: { userId, category, created_at }
    }]
  });
  
  // 4. 유사 노트 찾기
  const similar = await pinecone.query({
    vector: embedding.data[0].embedding,
    topK: 5,
    includeMetadata: true
  });
  
  return similar;
}
```

## 8.2 스마트 리마인드 알고리즘

```javascript
// 리마인드 우선순위 계산
function calculateRemindPriority(note) {
  let score = 0;
  
  // 1. 시간 경과 (오래될수록 높은 점수)
  const daysSinceCreated = getDaysSince(note.created_at);
  score += Math.min(daysSinceCreated * 2, 20);
  
  // 2. 카테고리 중요도
  const categoryWeights = {
    'Work/Business': 1.5,
    'Ideas/Creative': 1.3,
    'Tasks/Todo': 1.2,
    'Learning/Growth': 1.0,
    'Personal/Life': 0.8
  };
  score *= categoryWeights[note.category] || 1.0;
  
  // 3. 키워드 중요도
  const importantKeywords = ['important', '중요', 'deadline', '마감', 'idea', '아이디어'];
  const hasImportantKeyword = importantKeywords.some(kw => 
    note.content.toLowerCase().includes(kw)
  );
  if (hasImportantKeyword) score += 10;
  
  // 4. 연결된 노트 수
  score += note.connected_notes_count * 3;
  
  // 5. 이전 리마인드 응답률
  if (note.previous_remind_opened) score += 5;
  
  return score;
}

// 리마인드 시간 결정
function determineRemindTime(user) {
  // 사용자의 활동 패턴 분석
  const activeHours = analyzeUserActiveHours(user);
  const preferredTime = activeHours.most_active_hour;
  
  // 주중/주말 구분
  const isWeekend = [0, 6].includes(new Date().getDay());
  
  return {
    time: isWeekend ? preferredTime + 2 : preferredTime,
    frequency: user.remind_frequency || 'daily'
  };
}
```

---

# 9. 보안 및 프라이버시

## 9.1 데이터 보안

### 암호화 전략
```javascript
// 1. 전송 중 암호화 (TLS 1.3)
// 2. 저장 시 암호화
const encryptedContent = await encrypt(note.content, user.encryptionKey);

// 3. 민감 정보 마스킹
function maskSensitiveData(content) {
  // 전화번호, 이메일, 주민번호 등 마스킹
  return content
    .replace(/\d{3}-\d{4}-\d{4}/g, '***-****-****')
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, '***@***.***');
}
```

### 접근 제어
```javascript
// Row Level Security (RLS)
CREATE POLICY "Users can only see own notes" ON notes
  FOR ALL USING (auth.uid() = user_id);

// API 레벨 검증
async function validateNoteAccess(noteId, userId) {
  const note = await db.note.findUnique({
    where: { id: noteId, userId }
  });
  if (!note) throw new UnauthorizedError();
  return note;
}
```

## 9.2 프라이버시 정책

1. **데이터 수집 최소화**: 필수 정보만 수집
2. **사용자 통제권**: 언제든 데이터 삭제 가능
3. **제3자 공유 금지**: 사용자 데이터 판매 없음
4. **로컬 우선**: 가능한 한 클라이언트 처리

---

# 10. 출시 및 성장 전략

## 10.1 MVP 출시 계획

### Week 1-2: Closed Beta
- 목표: 100명 베타 테스터
- 채널: 개인 네트워크, 프로덕트 헌트
- 피드백 수집 및 버그 수정

### Week 3-4: Open Beta
- 목표: 1,000명 사용자
- 채널: Reddit, 인디해커스, 트위터
- 온보딩 최적화

### Month 2: 공식 출시
- Product Hunt 런칭
- 블로그 포스트 시리즈
- 초기 유료 플랜 도입

## 10.2 성장 전략

### 바이럴 메커니즘
```
1. 공유 가능한 인사이트 리포트
   "이번 달 당신의 아이디어 통계"

2. 소셜 증명
   "X개의 아이디어가 실행되었습니다"

3. 초대 인센티브
   친구 초대 시 프리미엄 1개월 무료
```

### 수익 모델
```
Free Tier:
- 월 100개 노트
- 기본 카테고리
- 7일 히스토리

Pro ($9.99/월):
- 무제한 노트
- AI 고급 기능
- 무제한 히스토리
- API 액세스

Team ($19.99/월/사용자):
- 모든 Pro 기능
- 팀 협업
- 관리자 대시보드
- 우선 지원
```

---

# 부록: 클로드 코드 태스크 예시

## Frontend 컴포넌트 개발
```bash
# Claude Code Task
"Quick Capture 컴포넌트를 만들어줘. 
- React + TypeScript 사용
- 텍스트 입력 시 자동 저장 (debounce 1초)
- 음성 입력 버튼 (Web Speech API)
- Coral(#FF6B6B)과 Teal(#008B8B) 색상 사용
- Tailwind CSS로 스타일링
- 모바일 반응형"
```

## API 엔드포인트 개발
```bash
# Claude Code Task
"노트 생성 API를 만들어줘.
- POST /api/notes
- TypeScript + Express
- Prisma ORM 사용
- 입력 검증 (Joi)
- JWT 인증 체크
- OpenAI API로 자동 카테고리 분류
- 에러 핸들링 포함"
```

## AI 통합 기능
```bash
# Claude Code Task
"노트 자동 분류 함수를 만들어줘.
- OpenAI GPT-4 사용
- 5개 카테고리로 분류
- 신뢰도 점수 반환
- 키워드 추출
- 한 줄 요약 생성
- 비용 최적화 (토큰 제한)"
```

---

이 플레이북을 기반으로 새로운 채팅 세션에서 체계적으로 개발을 진행할 수 있습니다. 각 태스크는 명확히 정의되어 있어 Claude Opus가 태스크를 분해하고, Claude Code가 구현하기에 최적화되어 있습니다.

준비되신 부분이나 조정이 필요한 부분이 있으면 말씀해주세요!