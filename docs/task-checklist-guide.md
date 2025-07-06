# 📋 Task 체크리스트 관리 가이드

## 🎯 체크리스트 사용 규칙

### 1. Task 시작 시
각 Task를 받으면 **반드시** 다음 위치에 체크리스트를 생성해야 합니다:

```
synaptic_code/
└── docs/
    └── checklists/
        └── week1/
            ├── task-001-checklist.md
            ├── task-002-checklist.md
            └── task-003-checklist.md
```

### 2. 체크리스트 템플릿

```markdown
# Task [번호]: [Task 제목] 체크리스트

## 📅 Task 정보
- **시작일**: 2024-12-20
- **예상 완료일**: 2024-12-20
- **담당자**: Claude Code
- **상태**: 🟡 진행중

## ✅ 구현 체크리스트

### 1. 프로젝트 구조 생성
- [ ] frontend 폴더 생성
- [ ] backend 폴더 생성
- [ ] database 폴더 생성
- [ ] ai 폴더 생성

### 2. 의존성 설치
- [ ] package.json 생성
- [ ] 필수 패키지 설치
- [ ] 개발 도구 설치
- [ ] 설치 오류 해결

### 3. 설정 파일
- [ ] tsconfig.json 생성
- [ ] .eslintrc.json 생성
- [ ] tailwind.config.ts 생성
- [ ] .env.example 생성

## 🐛 이슈 및 해결

### 발생한 이슈
1. **이슈**: [설명]
   - **원인**: [원인 분석]
   - **해결**: [해결 방법]
   - **상태**: ✅ 해결됨

## 📝 작업 로그

### 2024-12-20
- 14:00 - Task 시작
- 14:30 - 프로젝트 구조 생성 완료
- 15:00 - Next.js 설치 중 오류 발생
- 15:15 - 오류 해결 (Node 버전 업데이트)
- 16:00 - 기본 설정 완료

## 🔗 관련 파일
- Task 문서: `/docs/tasks/week1/task-001.md`
- 코드 위치: `/frontend/`, `/backend/`
- PR 링크: #1

## 💡 메모
- shadcn/ui 설치 시 수동으로 컴포넌트 추가 필요
- Supabase 로컬 환경 설정에 Docker 필수
```

### 3. 체크리스트 업데이트 규칙

#### 작업 진행 시
```markdown
# ❌ 작업 전
- [ ] Next.js 프로젝트 생성

# ✅ 작업 후
- [x] Next.js 프로젝트 생성 (15:30 완료)
```

#### 이슈 발생 시
```markdown
## 🐛 이슈 및 해결

### 발생한 이슈
1. **이슈**: npm install 시 peer dependency 충돌
   - **원인**: React 18과 일부 패키지 호환성 문제
   - **해결**: --legacy-peer-deps 플래그 사용
   - **상태**: ✅ 해결됨 (16:45)
   - **커밋**: fix: resolve peer dependency conflicts (abc123)
```

### 4. 상태 표시 규칙

```markdown
## Task 상태
- 🔴 시작 전 (Not Started)
- 🟡 진행 중 (In Progress) 
- 🟢 완료 (Completed)
- 🔵 검토 중 (Under Review)
- ⚫ 보류 (On Hold)
```

### 5. 일일 업데이트

매일 작업 종료 시 다음 항목 업데이트:
1. 완료된 항목 체크
2. 발생한 이슈 기록
3. 다음 작업 계획
4. 진행률 업데이트

## 🔄 Git 커밋과 연동

체크리스트 업데이트 시 커밋 메시지:
```bash
# 체크리스트만 업데이트
git commit -m "docs: update task-001 checklist progress"

# 코드와 함께 업데이트
git commit -m "feat: implement quick capture UI

- Complete text input component
- Add voice recording functionality
- Update task-004 checklist"
```

## 📊 진행률 계산

```markdown
## 📊 진행률
- **전체**: 15/20 항목 완료 (75%)
- **필수 기능**: 10/10 완료 (100%)
- **추가 기능**: 5/10 완료 (50%)
```

## 🚨 중요 규칙

1. **즉시 생성**: Task를 받으면 즉시 체크리스트 생성
2. **실시간 업데이트**: 작업하면서 실시간으로 업데이트
3. **이슈 기록**: 모든 이슈와 해결 방법 상세히 기록
4. **시간 기록**: 주요 마일스톤에 시간 기록
5. **링크 추가**: 관련 PR, 이슈, 문서 링크 추가

## 💻 Claude Code에게 전달할 지침

```
"Task를 시작하기 전에 반드시:
1. /docs/checklists/week1/task-XXX-checklist.md 파일을 생성하세요
2. 위 템플릿을 사용하여 체크리스트를 작성하세요
3. 작업하면서 실시간으로 체크리스트를 업데이트하세요
4. 이슈가 발생하면 즉시 기록하고 해결 과정을 문서화하세요
5. 작업 완료 시 최종 상태를 업데이트하고 진행률을 계산하세요"
```