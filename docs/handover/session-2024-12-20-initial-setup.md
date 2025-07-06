# 🤝 Synaptic 프로젝트 인수인계 문서
## Claude Desktop Session - 2024년 12월 20일

---

## 📌 핵심 요약

**프로젝트**: Synaptic - AI 기반 노트 앱 (제2의 뇌)
**목표**: 8주 내 MVP 완성
**현재 단계**: Week 1 - 프로젝트 초기 설정
**다음 작업**: 프로젝트 구조 생성 및 기본 셋업

---

## 🎯 프로젝트 개요

### 핵심 기능
1. **2초 내 Quick Capture** (텍스트/음성/이미지)
2. **AI 자동 분류** (0.3초 내 처리)
3. **3D 네트워크 시각화** (생각의 연결)
4. **능동적 AI 어시스턴트** (인사이트 제공)

### 기술 스택
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI**: LangChain, OpenAI API, pgvector
- **배포**: Vercel + Supabase

---

## 📁 생성된 문서들

### 1. **개발 플레이북** (8주 MVP 가이드)
- 위치: Artifacts에 저장됨
- ID: `synaptic-dev-playbook`
- 내용: Week별 상세 Task 분리, Claude Code 명령어 포함

### 2. **개발 가이드라인** (의존성 관리 & 작업 추적)
- 위치: Artifacts에 저장됨
- ID: `synaptic-dev-guidelines`
- 내용: npm 의존성 체크리스트, 폴더 구조, Task 관리 시스템

### 3. **MCP 서버 설정 가이드**
- 위치: Artifacts에 저장됨
- ID: `mcp-config-complete`
- 내용: Synaptic 디렉토리 접근 설정 완료

---

## 🛠️ 환경 설정 현황

### MCP 서버 설정 ✅
```json
{
  "filesystem": {
    // Synaptic 디렉토리 접근 가능
    "args": [
      "C:\\Users\\msd12\\OneDrive\\Desktop\\cushion",
      "C:\\Users\\msd12\\OneDrive\\Desktop\\Synaptic\\synaptic_code"
    ]
  },
  "git": {
    // Git 작업 디렉토리 설정 필요
    "GIT_WORKING_DIRECTORY": "C:/Users/msd12/OneDrive/Desktop/Synaptic/synaptic_code"
  }
}
```

### GitHub 연동 ⚠️
- Repository: https://github.com/seonghwanyang/Synaptic
- **중요**: 새 GitHub Personal Access Token 생성 필요 (기존 토큰 노출됨)

---

## 📋 다음 세션에서 해야 할 작업

### 1. 즉시 해야 할 것
1. **GitHub 토큰 재생성**
   - 기존 토큰 즉시 revoke
   - 새 토큰 생성 후 MCP 설정 업데이트

2. **프로젝트 초기화** (Task 1)
   ```bash
   # Claude Code에 전달
   "Synaptic 프로젝트를 위한 모노레포 구조를 생성하고, 
   Next.js 14 (App Router), Supabase, Tailwind CSS, shadcn/ui를 설정해줘.
   Docker Compose로 로컬 개발 환경도 구성해줘."
   ```

### 2. Week 1 남은 Task
- [ ] Task 2: Supabase 설정 및 데이터베이스 스키마
- [ ] Task 3: 기본 인증 시스템

### 3. 폴더 구조 생성
```
synaptic_code/
├── apps/frontend/      # Next.js
├── backend/           # API & Supabase
├── ai/                # AI 서비스
├── database/          # Prisma
├── packages/          # 공유 코드
└── docs/              # 문서 (생성됨)
    ├── tasks/         # Task 관리
    ├── checklists/    # 체크리스트
    └── handover/      # 인수인계
```

---

## 🚨 주의사항

### 1. 의존성 관리
- 매번 `npm install` 확인
- `/scripts/check-deps.js` 스크립트 활용
- shadcn 컴포넌트는 수동 추가 필요

### 2. 작업 기록
- 각 Task마다 문서 작성
- `/docs/tasks/` 폴더에 저장
- 템플릿 사용 권장

### 3. Git 작업
- 2시간마다 커밋
- 의미 있는 커밋 메시지
- feature 브랜치 사용

---

## 📊 현재 진행 상황

### 완료된 작업
- [x] 프로젝트 비전 및 전략 수립
- [x] 8주 개발 플레이북 작성
- [x] 개발 가이드라인 작성
- [x] MCP 서버 설정
- [x] 문서 폴더 구조 생성

### 진행률
- 전체: 5% (Week 1 시작)
- Week 1: 25% (환경 설정 완료)

---

## 💡 핵심 기억사항

### 1. 개발 철학
- **속도 우선**: 완벽보다 동작하는 MVP
- **AI First**: 모든 기능에 AI 통합
- **2초 룰**: Quick Capture는 2초 내 가능해야 함

### 2. 차별화 포인트
- 자동 분류 (0.3초)
- 3D 네트워크 뷰
- 능동적 AI 어시스턴트

### 3. 작업 흐름
```
Desktop Claude Opus → Task 생성
↓
Claude Code → 실제 코딩
↓
테스트 & 커밋
↓
다음 Task
```

---

## 🔗 참고 링크

### 공식 문서
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [LangChain JS Docs](https://js.langchain.com/docs)

### 프로젝트 리소스
- GitHub: https://github.com/seonghwanyang/Synaptic
- 도메인: synaptic.ai (구매 예정)

---

## ✉️ 다음 세션 시작 메시지

```
안녕! 나는 Synaptic 프로젝트를 계속 개발하려고 해.

현재 상황:
- Week 1 진행 중 (프로젝트 초기 설정)
- MCP로 Synaptic 폴더 접근 가능
- 다음 Task: 프로젝트 구조 생성

인수인계 문서 위치:
C:\Users\msd12\OneDrive\Desktop\Synaptic\synaptic_code\docs\handover\session-2024-12-20-initial-setup.md

8주 개발 플레이북 확인하고 Task 1부터 시작하자!
```

---

**작성자**: Claude Desktop Session
**작성일**: 2024-12-20
**다음 업데이트**: 다음 세션 종료 시