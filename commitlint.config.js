module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 새로운 기능
        'fix',      // 버그 수정
        'docs',     // 문서 변경
        'style',    // 코드 스타일 변경 (포맷팅 등)
        'refactor', // 코드 리팩토링
        'test',     // 테스트 추가/수정
        'chore',    // 빌드 프로세스, 의존성 등
        'perf',     // 성능 개선
        'ci',       // CI 설정 변경
        'revert'    // 커밋 되돌리기
      ]
    ]
  }
};