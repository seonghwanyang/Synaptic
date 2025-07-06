# 🛡️ Synaptic 개발 가이드라인
## 의존성 관리 & 작업 추적 시스템

> 최종 업데이트: 2024-12-20
> MCP 서버 설정 완료: Synaptic 디렉토리 접근 가능

---

# 1. 의존성 관리 체크리스트

## 🔴 매번 발생하는 문제 방지

### 컴포넌트 추가 전 필수 체크리스트

```bash
# 새로운 컴포넌트/라이브러리 추가 시 반드시 확인!

□ 1. 패키지가 이미 설치되어 있는지 확인
   npm list [패키지명]

□ 2. 필요한 모든 의존성 확인
   - 메인 패키지
   - Peer dependencies
   - Type definitions (@types/*)

□ 3. 올바른 위치에서 설치
   - 모노레포 루트? 
   - 특정 workspace?
   - 전역 설치 필요?

□ 4. package.json 확인
   - dependencies vs devDependencies
   - 버전 호환성

□ 5. 설치 후 확인
   - node_modules 존재 여부
   - import 에러 없는지
   - TypeScript 에러 없는지
```

### 자주 놓치는 의존성 패턴

```javascript
// ❌ 자주 하는 실수들
import { Button } from '@/components/ui/button'  // shadcn 컴포넌트 추가 안함
import { motion } from 'framer-motion'          // framer-motion 설치 안함
import { z } from 'zod'                          // zod 설치 안함

// ✅ 올바른 접근
// 1. 먼저 필요한 패키지 체크
const requiredPackages = {
  'shadcn-ui': ['@radix-ui/react-*', 'class-variance-authority', 'clsx'],
  'framer-motion': ['framer-motion'],
  'validation': ['zod', '@hookform/resolvers'],
  'ai': ['langchain', '@langchain/openai', 'openai'],
  'database': ['@prisma/client', 'prisma'],
  'auth': ['@supabase/supabase-js', '@supabase/auth-helpers-nextjs']
};

// 2. 설치 스크립트
npm install framer-motion zod @hookform/resolvers
```

### 프로젝트별 의존성 설치 가이드

```bash
# Frontend (Next.js)
cd apps/frontend
npm install [패키지명]

# Backend API
cd apps/backend
npm install [패키지명]

# AI Service
cd services/ai
npm install [패키지명]

# 공통 패키지 (루트)
npm install -w packages/shared [패키지명]
```

---

# 2. 폴더 구조 (명확한 분리)

```
C:\Users\msd12\OneDrive\Desktop\Synaptic\synaptic_code\
├── apps/
│   ├── frontend/                    # Next.js 웹 애플리케이션
│   │   ├── src/
│   │   │   ├── app/                # App Router
│   │   │   ├── components/         # React 컴포넌트
│   │   │   ├── hooks/              # Custom Hooks
│   │   │   ├── lib/                # 유틸리티
│   │   │   └── styles/             # CSS/Tailwind
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   └── mobile/                      # React Native (향후)
│
├── backend/
│   ├── api/                         # REST API 서버
│   │   ├── src/
│   │   │   ├── routes/             # API 라우트
│   │   │   ├── controllers/        # 비즈니스 로직
│   │   │   ├── middleware/         # 인증, 검증 등
│   │   │   └── utils/              # 헬퍼 함수
│   │   ├── package.json
│   │   └── server.ts
│   │
│   └── supabase/                    # Supabase Edge Functions
│       ├── functions/
│       │   ├── ai-classify/        # AI 분류 함수
│       │   ├── note-process/       # 노트 처리
│       │   └── insights-gen/       # 인사이트 생성
│       └── migrations/             # DB 마이그레이션
│
├── ai/
│   ├── models/                      # AI/ML 모델
│   │   ├── classifier/             # 노트 분류 모델
│   │   ├── embeddings/             # 임베딩 생성
│   │   └── nlp/                    # 자연어 처리
│   │
│   ├── services/                    # AI 서비스
│   │   ├── langchain/              # LangChain 통합
│   │   ├── openai/                 # OpenAI API
│   │   └── vector-search/          # 벡터 검색
│   │
│   └── pipelines/                   # AI 파이프라인
│       ├── auto-categorize.ts      # 자동 분류
│       ├── insight-generation.ts   # 인사이트 생성
│       └── connection-discovery.ts # 연결 발견
│
├── database/
│   ├── prisma/
│   │   ├── schema.prisma           # 데이터베이스 스키마
│   │   └── migrations/             # 마이그레이션 파일
│   │
│   ├── seed/                        # 시드 데이터
│   └── backup/                      # 백업 스크립트
│
├── packages/                        # 공유 패키지
│   ├── shared/                      # 공통 유틸리티
│   │   ├── types/                  # TypeScript 타입
│   │   ├── constants/              # 상수
│   │   └── utils/                  # 공통 함수
│   │
│   └── ui/                          # 공통 UI 컴포넌트
│       ├── components/
│       └── styles/
│
├── scripts/                         # 개발 스크립트
│   ├── setup.sh                    # 초기 설정
│   ├── check-deps.js               # 의존성 체크
│   └── dev.sh                      # 개발 서버 실행
│
├── docs/                            # 문서
│   ├── API.md
│   ├── SETUP.md
│   └── TROUBLESHOOTING.md
│
└── devops/                          # 배포 및 인프라
    ├── docker/
    ├── k8s/
    └── terraform/
```

---

# 3. 작업 추적 시스템

## Task 작업 기록 템플릿

```markdown
# Task ID: TASK-001
## 제목: Quick Capture 시스템 구현

### 📅 작업 정보
- **시작일**: 2024-12-20
- **완료일**: 2024-12-22
- **담당자**: [이름]
- **상태**: 🟢 완료 | 🟡 진행중 | 🔴 블로킹

### 📋 작업 내용
```
Claude Code에 전달한 명령:
"Quick Capture 기능을 구현해줘..."
```

### 📦 추가한 의존성
- [ ] `framer-motion@^10.16.0` - 애니메이션
- [ ] `@radix-ui/react-dialog@^1.0.0` - 모달
- [ ] `react-hotkeys-hook@^4.4.0` - 단축키

### ✅ 구현 완료 항목
- [x] 글로벌 단축키 (Cmd+Shift+N)
- [x] 텍스트 입력
- [x] 자동 저장
- [ ] 음성 입력 (차주 예정)

### 🐛 발생한 이슈
1. **이슈**: `Cannot find module 'framer-motion'`
   - **원인**: 패키지 미설치
   - **해결**: `npm install framer-motion`

2. **이슈**: TypeScript 에러
   - **원인**: @types 누락
   - **해결**: `npm install -D @types/react-hotkeys-hook`

### 📝 코드 위치
- Frontend: `/apps/frontend/src/components/QuickCapture.tsx`
- API: `/backend/api/src/routes/notes.ts`
- Types: `/packages/shared/types/note.ts`

### 🔗 관련 PR/커밋
- PR: #23 - feat: implement quick capture
- Commit: abc123f

### 📌 다음 단계
- 음성 입력 통합
- 이미지 지원 추가
- 성능 최적화
```

## 일일 작업 체크리스트

```markdown
# 📅 2024-12-20 작업 일지

## 🌅 아침 체크
- [ ] 어제 작업 리뷰
- [ ] 오늘 Task 목록 작성
- [ ] 의존성 업데이트 확인 (`npm outdated`)
- [ ] Git pull & 브랜치 생성

## 💻 작업 전 체크
- [ ] 필요한 패키지 목록 작성
- [ ] 패키지 설치 (`npm install`)
- [ ] 환경 변수 확인 (`.env.local`)
- [ ] 개발 서버 정상 작동 (`npm run dev`)

## 🔧 작업 중 체크
- [ ] 정기적으로 커밋 (2시간마다)
- [ ] 콘솔 에러 체크
- [ ] TypeScript 에러 체크
- [ ] 테스트 실행

## 🌙 저녁 체크
- [ ] 모든 변경사항 커밋
- [ ] PR 생성 또는 업데이트
- [ ] 내일 작업 계획
- [ ] 이슈/블로커 문서화
```

---

# 4. 의존성 체크 스크립트

## /scripts/check-deps.js

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 필수 의존성 매핑
const requiredDeps = {
  frontend: {
    dependencies: [
      'next',
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'framer-motion',
      'zustand',
      '@tanstack/react-query'
    ],
    devDependencies: [
      'typescript',
      '@types/react',
      '@types/node',
      'tailwindcss',
      'eslint',
      'prettier'
    ]
  },
  backend: {
    dependencies: [
      'fastify',
      '@supabase/supabase-js',
      'zod',
      'prisma'
    ],
    devDependencies: [
      'typescript',
      '@types/node',
      'nodemon',
      'tsx'
    ]
  },
  ai: {
    dependencies: [
      'langchain',
      '@langchain/openai',
      'openai',
      '@pinecone-database/pinecone'
    ]
  }
};

function checkDependencies(projectPath, projectName) {
  console.log(`\n🔍 Checking ${projectName} dependencies...`);
  
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error(`❌ package.json not found in ${projectPath}`);
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const installedDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  const missing = [];
  const required = requiredDeps[projectName];
  
  if (required) {
    [...(required.dependencies || []), ...(required.devDependencies || [])]
      .forEach(dep => {
        if (!installedDeps[dep]) {
          missing.push(dep);
        }
      });
  }
  
  if (missing.length > 0) {
    console.error(`❌ Missing dependencies in ${projectName}:`);
    missing.forEach(dep => console.error(`   - ${dep}`));
    console.log(`\n💡 Run: cd ${projectPath} && npm install ${missing.join(' ')}`);
  } else {
    console.log(`✅ All dependencies installed for ${projectName}`);
  }
}

// 실행
checkDependencies('./apps/frontend', 'frontend');
checkDependencies('./backend/api', 'backend');
checkDependencies('./ai/services', 'ai');

console.log('\n✨ Dependency check complete!');
```

## 사용법

```bash
# 의존성 체크 실행
node scripts/check-deps.js

# 개발 시작 전 항상 실행
npm run check:deps
```

---

# 5. 빠른 설정 스크립트

## /scripts/setup.sh

```bash
#!/bin/bash

echo "🚀 Setting up Synaptic development environment..."

# 1. 기본 폴더 구조 생성
echo "📁 Creating folder structure..."
mkdir -p apps/frontend/src/{app,components,hooks,lib,styles}
mkdir -p backend/{api/src/{routes,controllers,middleware,utils},supabase/functions}
mkdir -p ai/{models,services,pipelines}
mkdir -p database/{prisma,seed,backup}
mkdir -p packages/{shared/{types,constants,utils},ui/{components,styles}}
mkdir -p scripts docs devops/{docker,k8s,terraform}

# 2. 기본 package.json 생성
echo "📦 Initializing packages..."
npm init -y
npm init -y -w apps/frontend
npm init -y -w backend/api
npm init -y -w ai/services

# 3. 필수 의존성 설치
echo "📥 Installing dependencies..."
cd apps/frontend && npm install next react react-dom
cd ../../backend/api && npm install fastify @supabase/supabase-js
cd ../../

# 4. Git 초기화
echo "🔧 Setting up Git..."
git init
echo "node_modules/\n.env\n.env.local\n.next/\ndist/\nbuild/" > .gitignore

echo "✅ Setup complete! Run 'npm run check:deps' to verify dependencies."
```

---

# 6. 문제 해결 가이드

## 자주 발생하는 에러와 해결법

### 1. Module not found 에러
```bash
# 증상
Module not found: Can't resolve 'framer-motion'

# 해결
1. 올바른 디렉토리인지 확인
2. npm install framer-motion
3. npm run dev 재시작
```

### 2. Type 에러
```bash
# 증상
Cannot find module '@types/...' or its corresponding type declarations

# 해결
npm install -D @types/[패키지명]
```

### 3. Peer dependency 경고
```bash
# 증상
npm WARN peer dep missing...

# 해결
npm install [경고에 나온 패키지]
```

---

# 7. 개발 시작 체크리스트

```bash
# 매일 개발 시작 전 실행
□ git pull origin main
□ npm run check:deps
□ npm install (필요시)
□ npm run dev
□ 브라우저에서 localhost:3000 확인
```

이 가이드라인을 따르면 의존성 문제로 시간 낭비하는 일이 크게 줄어들 것입니다!

---

# 8. Task 및 체크리스트 관리 시스템

## 📁 작업 문서 폴더 구조

```
C:\Users\msd12\OneDrive\Desktop\Synaptic\synaptic_code\
├── docs/
│   ├── tasks/                       # Task 관리
│   │   ├── completed/              # 완료된 Task
│   │   │   ├── 2024-12-20-task-001-project-setup.md
│   │   │   └── 2024-12-21-task-002-auth-system.md
│   │   ├── in-progress/            # 진행 중인 Task
│   │   │   └── 2024-12-22-task-003-quick-capture.md
│   │   └── backlog/                # 대기 중인 Task
│   │       └── task-ideas.md
│   │
│   ├── checklists/                  # 체크리스트
│   │   ├── daily/                  # 일일 체크리스트
│   │   │   └── 2024-12-20.md
│   │   ├── weekly/                 # 주간 리뷰
│   │   │   └── week-51-review.md
│   │   └── templates/              # 템플릿
│   │       ├── task-template.md
│   │       └── daily-checklist-template.md
│   │
│   ├── progress/                    # 진행상황 추적
│   │   ├── sprint-1.md             # 스프린트별 진행
│   │   └── roadmap-status.md       # 전체 로드맵 상태
│   │
│   └── handover/                    # 인수인계 문서
│       └── session-handover.md     # 세션 간 인수인계
```

## 📝 Task 템플릿 (/docs/tasks/templates/task-template.md)

```markdown
# Task-[번호]: [제목]

## 📋 기본 정보
- **생성일**: YYYY-MM-DD
- **담당 세션**: Claude Desktop Session #X
- **우선순위**: 🔴 긴급 | 🟡 보통 | 🟢 낮음
- **예상 소요**: X시간
- **실제 소요**: X시간

## 🎯 목표
[이 Task로 달성하려는 것]

## 📌 Claude Code 명령
```
[복사해서 사용할 수 있는 정확한 명령]
```

## ✅ 체크리스트
- [ ] 서브태스크 1
- [ ] 서브태스크 2
- [ ] 서브태스크 3

## 📦 의존성
```json
{
  "dependencies": [],
  "devDependencies": []
}
```

## 💻 작업 내용
[실제 수행한 작업 상세 기록]

## 🐛 이슈 & 해결
| 이슈 | 원인 | 해결 방법 |
|------|------|----------|
| | | |

## 📁 생성/수정 파일
- `path/to/file1.ts` - 설명
- `path/to/file2.tsx` - 설명

## 🔗 관련 링크
- PR: #
- Issue: #
- Commit: 

## 📝 다음 세션 참고사항
[다음에 작업할 사람이 알아야 할 중요 정보]
```

## 🗓️ 일일 체크리스트 템플릿

```markdown
# 📅 YYYY-MM-DD 일일 체크리스트

## 🌅 아침 준비 (09:00)
- [ ] 이전 세션 인수인계 문서 확인
- [ ] 오늘의 Task 선정 (최대 3개)
- [ ] Git 상태 확인 및 pull
- [ ] 개발 환경 실행

## 💼 오전 작업 (09:30 - 12:30)
### Task 1: [제목]
- [ ] Claude Code 명령 준비
- [ ] 구현
- [ ] 테스트
- [ ] 커밋
- [ ] 문서 업데이트

## 🍽️ 점심 체크 (12:30)
- [ ] 오전 작업 정리
- [ ] 블로커 확인

## 💼 오후 작업 (13:30 - 18:00)
### Task 2: [제목]
- [ ] 구현
- [ ] 테스트
- [ ] 커밋

### Task 3: [제목]
- [ ] 구현
- [ ] 테스트
- [ ] 커밋

## 🌙 저녁 마무리 (18:00)
- [ ] 모든 변경사항 push
- [ ] Task 문서 완성
- [ ] 내일 작업 계획
- [ ] 인수인계 문서 작성

## 📊 일일 성과
- 완료 Task: X개
- 생성 파일: X개
- 해결 이슈: X개
- 남은 작업: [리스트]
```

## 🔄 자동화 스크립트

### Task 생성 스크립트 (/scripts/create-task.js)

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const taskNumber = process.argv[2];
const taskTitle = process.argv[3];

if (!taskNumber || !taskTitle) {
  console.log('Usage: node create-task.js [number] [title]');
  process.exit(1);
}

const date = new Date().toISOString().split('T')[0];
const fileName = `${date}-task-${taskNumber}-${taskTitle.toLowerCase().replace(/\s+/g, '-')}.md`;
const filePath = path.join(__dirname, '../docs/tasks/in-progress', fileName);

const template = fs.readFileSync(
  path.join(__dirname, '../docs/tasks/templates/task-template.md'), 
  'utf8'
);

const content = template
  .replace('[번호]', taskNumber)
  .replace('[제목]', taskTitle)
  .replace('YYYY-MM-DD', date);

fs.writeFileSync(filePath, content);
console.log(`✅ Task 생성: ${filePath}`);
```

### 일일 체크리스트 생성 (/scripts/daily-checklist.js)

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const date = new Date().toISOString().split('T')[0];
const fileName = `${date}.md`;
const filePath = path.join(__dirname, '../docs/checklists/daily', fileName);

const template = fs.readFileSync(
  path.join(__dirname, '../docs/checklists/templates/daily-checklist-template.md'), 
  'utf8'
);

const content = template.replace(/YYYY-MM-DD/g, date);

fs.writeFileSync(filePath, content);
console.log(`✅ 일일 체크리스트 생성: ${filePath}`);

// 자동으로 VS Code에서 열기
require('child_process').exec(`code ${filePath}`);
```

## 📈 진행상황 대시보드

### /docs/progress/dashboard.md

```markdown
# 📊 Synaptic 개발 대시보드

## 🎯 전체 진행률: 15% (Week 1/8)

### 📅 Week 1: Foundation (진행 중)
- [x] 프로젝트 구조 설정
- [x] MCP 서버 설정
- [ ] 데이터베이스 스키마
- [ ] 기본 인증 시스템

### 📈 통계
- 총 Task: 20개
- 완료: 3개
- 진행 중: 2개
- 대기: 15개

### 🔥 이번 주 핵심 목표
1. MVP 기본 구조 완성
2. Supabase 연동
3. 첫 번째 노트 저장 성공

### ⚡ 속도
- 일일 평균 Task 완료: 1.5개
- 예상 완료일: 2025-02-14
```