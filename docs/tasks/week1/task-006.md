# Task 006: Git Flow 브랜치 전략 구현

## 목표
Git Flow 브랜치 전략을 구현하고 브랜치 보호 규칙을 설정합니다.

## 작업 내용

### 1. 브랜치 생성
- [ ] develop 브랜치 생성 (main에서 분기)
- [ ] release/v0.1.0 브랜치 생성 (develop에서 분기)
- [ ] 현재 main의 모든 코드를 develop으로 이동

### 2. GitHub 브랜치 보호 규칙
- [ ] main 브랜치 보호 규칙 설정
  - Require pull request reviews (1명 이상)
  - Dismiss stale pull request approvals
  - Require status checks to pass
  - Require branches to be up to date
  - Include administrators
- [ ] develop 브랜치 보호 규칙 설정
  - Require pull request reviews
  - Require status checks to pass

### 3. PR 템플릿 개선
- [ ] .github/PULL_REQUEST_TEMPLATE.md 업데이트
  - 체크리스트 추가
  - 관련 이슈 링크 섹션
  - 테스트 결과 섹션

### 4. Git 훅 설정
- [ ] commit-msg 훅 추가 (Conventional Commits 검증)
- [ ] pre-push 훅 추가 (lint, type-check 실행)

### 5. 브랜치 전략 문서화
- [ ] docs/guides/GIT-FLOW-GUIDE.md 작성
- [ ] 브랜치 명명 규칙 문서화
- [ ] 머지 전략 문서화

## 완료 조건
- [ ] 모든 브랜치가 GitHub에 생성됨
- [ ] 브랜치 보호 규칙이 적용됨
- [ ] Git 훅이 정상 작동함
- [ ] 문서가 작성됨

## 참고 자료
- Git Flow: https://nvie.com/posts/a-successful-git-branching-model/
- GitHub Branch Protection: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches
