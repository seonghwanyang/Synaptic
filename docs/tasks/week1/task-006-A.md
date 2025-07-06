# Task 006-A: Git Flow 나머지 작업 완료 (Claude Code용)

## 목표
Git Flow 설정 중 Claude Code가 할 수 있는 나머지 작업을 완료합니다.

## 작업 내용

### 1. pre-push 훅 생성
```bash
# 파일 생성
.husky/pre-push

# 내용
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-push checks..."

# Type check
echo "📝 Type checking..."
npm run type-check || exit 1

# Lint
echo "🧹 Linting..."
npm run lint || exit 1

echo "✅ All pre-push checks passed!"
```

### 2. commitlint 설정 파일 생성
```bash
# 파일: commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 새로운 기능
        'fix',      // 버그 수정
        'docs',     // 문서 수정
        'style',    // 코드 포맷팅
        'refactor', // 리팩토링
        'test',     // 테스트 코드
        'chore',    // 빌드 업무 수정
        'perf',     // 성능 개선
        'ci',       // CI 설정 수정
        'revert'    // 커밋 되돌리기
      ]
    ]
  }
};
```

### 3. Git Flow 가이드 문서 작성
```bash
# 파일: docs/guides/GIT-FLOW-GUIDE.md
# 아래 내용으로 작성
```

### 4. package.json에 commitlint 의존성 추가
```bash
# 루트 package.json에 추가
"devDependencies": {
  "@commitlint/cli": "^18.4.3",
  "@commitlint/config-conventional": "^18.4.3"
}
```

### 5. 의존성 설치
```bash
pnpm install
```

## 완료 조건
- [ ] pre-push 훅 파일이 생성되고 실행 권한이 있음
- [ ] commitlint.config.js 파일이 생성됨
- [ ] Git Flow 가이드 문서가 생성됨
- [ ] 의존성이 설치됨
