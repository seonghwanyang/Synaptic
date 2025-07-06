# Git Flow 브랜치 전략 가이드

## 🌳 브랜치 구조

```
main (production)
  └── develop (개발 통합)
       ├── feature/[기능명] (기능 개발)
       ├── bugfix/[버그명] (버그 수정)
       └── hotfix/[핫픽스명] (긴급 수정)

release/[버전] (배포 준비)
```

## 📝 브랜치 명명 규칙

### 기능 브랜치
- **패턴**: `feature/[기능명]`
- **예시**: 
  - `feature/user-authentication`
  - `feature/ai-note-clustering`
  - `feature/3d-network-view`

### 버그 수정 브랜치
- **패턴**: `bugfix/[버그명]`
- **예시**:
  - `bugfix/login-error`
  - `bugfix/memory-leak`

### 핫픽스 브랜치
- **패턴**: `hotfix/[버전-이슈]`
- **예시**:
  - `hotfix/v1.0.1-security-patch`
  - `hotfix/v1.0.2-crash-fix`

### 릴리즈 브랜치
- **패턴**: `release/v[메이저].[마이너].[패치]`
- **예시**:
  - `release/v0.1.0`
  - `release/v1.0.0`

## 🔄 작업 플로우

### 1. 새 기능 개발
```bash
# 1. develop에서 feature 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/awesome-feature

# 2. 작업 진행
git add .
git commit -m "feat: add awesome feature"

# 3. develop에 병합
git checkout develop
git merge feature/awesome-feature
git push origin develop

# 4. feature 브랜치 삭제
git branch -d feature/awesome-feature
```

### 2. 버그 수정
```bash
# 1. develop에서 bugfix 브랜치 생성
git checkout develop
git checkout -b bugfix/login-error

# 2. 버그 수정
git add .
git commit -m "fix: resolve login error"

# 3. develop에 병합
git checkout develop
git merge bugfix/login-error
```

### 3. 배포 준비
```bash
# 1. develop에서 release 브랜치 생성
git checkout develop
git checkout -b release/v0.2.0

# 2. 버전 업데이트, 최종 테스트

# 3. main과 develop에 병합
git checkout main
git merge release/v0.2.0
git tag -a v0.2.0 -m "Release version 0.2.0"

git checkout develop
git merge release/v0.2.0
```

### 4. 긴급 수정 (Hotfix)
```bash
# 1. main에서 hotfix 브랜치 생성
git checkout main
git checkout -b hotfix/v0.1.1-security-patch

# 2. 긴급 수정
git add .
git commit -m "fix: patch security vulnerability"

# 3. main과 develop에 병합
git checkout main
git merge hotfix/v0.1.1-security-patch
git tag -a v0.1.1 -m "Hotfix version 0.1.1"

git checkout develop
git merge hotfix/v0.1.1-security-patch
```

## 📋 커밋 메시지 규칙

### 형식
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드 업무, 패키지 매니저 수정 등
- `perf`: 성능 개선
- `ci`: CI 설정 수정
- `revert`: 커밋 되돌리기

### 예시
```bash
# 좋은 예
git commit -m "feat(capture): add voice recording feature"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs: update API documentation"

# 나쁜 예
git commit -m "수정"
git commit -m "fixed stuff"
git commit -m "WIP"
```

## 🚀 Pull Request 가이드

### PR 생성 전 체크리스트
1. ✅ 최신 develop 브랜치와 동기화
2. ✅ 모든 테스트 통과
3. ✅ 린트 에러 없음
4. ✅ 커밋 메시지 규칙 준수
5. ✅ 관련 이슈 번호 연결

### PR 제목 형식
```
[Type] 간단한 설명 (#이슈번호)

예시:
[Feature] Add quick capture functionality (#23)
[Fix] Resolve login timeout issue (#45)
[Docs] Update installation guide (#12)
```

## 🔐 브랜치 보호 규칙

### main 브랜치
- PR 필수
- 1명 이상의 리뷰 승인 필요
- 모든 상태 체크 통과 필요
- 관리자도 규칙 적용

### develop 브랜치
- PR 필수
- 상태 체크 통과 필요
- 대화 해결 필요

## 📊 버전 관리

### Semantic Versioning
`MAJOR.MINOR.PATCH`

- **MAJOR**: 호환성이 깨지는 변경
- **MINOR**: 하위 호환성 있는 기능 추가
- **PATCH**: 하위 호환성 있는 버그 수정

### 예시
- `0.1.0`: 첫 번째 알파 릴리즈
- `0.2.0`: 새로운 기능 추가
- `0.2.1`: 버그 수정
- `1.0.0`: 첫 번째 정식 릴리즈

## 🛠 유용한 Git 명령어

```bash
# 브랜치 목록 보기
git branch -a

# 원격 브랜치 업데이트
git fetch --all --prune

# 브랜치 그래프 보기
git log --graph --oneline --all

# 특정 커밋으로 이동
git checkout <commit-hash>

# 변경사항 임시 저장
git stash
git stash pop

# 커밋 수정
git commit --amend

# 인터랙티브 리베이스
git rebase -i HEAD~3
```

## ⚠️ 주의사항

1. **절대 main에 직접 푸시하지 마세요**
2. **force push는 신중하게 사용하세요**
3. **큰 바이너리 파일은 커밋하지 마세요**
4. **민감한 정보(패스워드, API 키)는 커밋하지 마세요**

## 🆘 문제 해결

### 실수로 main에 커밋한 경우
```bash
# 커밋 되돌리기
git reset --soft HEAD~1

# develop 브랜치로 이동
git checkout develop

# 변경사항 커밋
git add .
git commit -m "feat: your feature"
```

### 충돌 해결
```bash
# 최신 변경사항 가져오기
git pull origin develop

# 충돌 해결 후
git add .
git commit -m "merge: resolve conflicts"
```
