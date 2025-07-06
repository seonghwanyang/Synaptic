# 🚀 Claude Code Git 작업 자동화 가이드

## 📋 초기 프로젝트 설정 (한 번만)

```
GitHub MCP를 사용해서 다음 작업을 수행해줘:

1. develop 브랜치 생성
2. 브랜치 보호 규칙 설정
   - main: PR 필수, 리뷰 2명 이상, 테스트 통과 필수, 직접 push 금지
   - develop: PR 필수, 리뷰 1명 이상
   - release/*: PR 필수, 리뷰 1명 이상
3. .github/pull_request_template.md 생성
4. .gitignore 업데이트
5. 브랜치 전략 문서를 README에 추가
```

## 🔄 Task 시작 시 자동화

```
Task XXX를 시작할 때:

1. develop 브랜치 최신화
2. feature/task-XXX-{설명} 브랜치 생성
3. /docs/checklists/week1/task-XXX-checklist.md 생성
4. 첫 커밋: "docs: create task-XXX checklist"
5. Draft PR 생성
```

## 📝 커밋 규칙 자동화

```
커밋할 때 이 규칙을 따라줘:

<type>(<scope>): <subject>

Types:
- feat: 새 기능
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷
- refactor: 리팩토링
- test: 테스트
- chore: 기타

예시:
feat(auth): implement Google OAuth login
fix(capture): resolve memory leak in voice recording
docs: update task-001 checklist (60% complete)
```

## 🏁 Task 완료 시

```
Task 완료 시:

1. 최종 체크리스트 확인 (100% 완료)
2. PR 상태를 Ready for review로 변경
3. 리뷰어 할당
4. develop 브랜치와 충돌 확인
5. 머지 후 feature 브랜치 삭제
```

## 🚀 Release 준비

```
Release 준비 시:

1. develop에서 release/v0.1.0 브랜치 생성
2. 버전 번호 업데이트 (package.json, README)
3. CHANGELOG.md 업데이트
4. Release PR 생성 (main으로)
5. QA 팀에 테스트 요청
```

## 🔥 Hotfix 처리

```
긴급 버그 발생 시:

1. main에서 hotfix/critical-bug 브랜치 생성
2. 버그 수정
3. 버전 패치 번호 증가 (v0.1.0 → v0.1.1)
4. main, develop, 현재 release 브랜치에 머지
5. 태그 생성 및 배포
```

## 🛠️ 일일 Git 작업

### 아침 (작업 시작)
```
1. 현재 브랜치 상태 확인
2. develop 최신 변경사항 병합
3. 어제 작업 이어서 진행
```

### 작업 중 (1-2시간마다)
```
1. 변경사항 스테이징
2. 의미 있는 커밋 메시지 작성
3. origin에 push
4. 체크리스트 업데이트
```

### 저녁 (작업 종료)
```
1. 모든 변경사항 커밋
2. 체크리스트 최종 업데이트
3. PR 상태 업데이트
4. 내일 할 일 코멘트 작성
```

## ⚠️ 주의사항

1. main 브랜치에 직접 push 금지
2. force push 절대 금지
3. .env 파일 커밋 금지
4. 대용량 파일 커밋 전 확인
5. 커밋 전 항상 diff 확인

## 🔍 유용한 Git 명령어

```bash
# 브랜치 상태 확인
git branch -a

# 커밋 히스토리 확인
git log --oneline --graph --decorate

# 변경사항 확인
git diff --staged

# 머지된 브랜치 정리
git branch --merged | grep -v main | grep -v develop | xargs -n 1 git branch -d
```