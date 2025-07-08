# Task 010: 랜딩페이지 및 기본 UI 구현

## 목표
Synaptic의 브랜드 아이덴티티를 반영한 랜딩페이지와 기본 UI를 구현합니다.

## 작업 내용

### 1. 랜딩페이지 구현 (app/page.tsx)
- [ ] 기존 템플릿 코드 제거
- [ ] Hero 섹션 구현
  - "Your AI-Powered Second Brain" 헤드라인
  - "Capture thoughts in 2 seconds, let AI organize them instantly" 서브텍스트
  - Get Started / Sign In 버튼
- [ ] 주요 기능 3가지 소개 섹션
  - ⚡ 2-Second Quick Capture
  - 🤖 AI Auto-Organization  
  - 🌐 3D Knowledge Network

### 2. 네비게이션 컴포넌트
- [ ] components/layout/Navigation.tsx 생성
- [ ] 로고 및 브랜드명
- [ ] 로그인/회원가입 버튼
- [ ] 로그인 상태에 따른 조건부 렌더링

### 3. 레이아웃 개선
- [ ] app/layout.tsx 업데이트
- [ ] Navigation 컴포넌트 추가
- [ ] Footer 컴포넌트 생성 및 추가
- [ ] 전체 레이아웃 일관성 확보

### 4. 스타일링
- [ ] Coral & Teal 색상 적용
- [ ] 다크모드 토글 버튼 추가
- [ ] 반응형 디자인 적용
- [ ] 부드러운 애니메이션 추가

### 5. 인증 플로우 연결
- [ ] 로그인 버튼 → /login 페이지
- [ ] 회원가입 버튼 → /signup 페이지
- [ ] 로그인 성공 시 → /dashboard 리다이렉트

## 완료 조건
- [ ] 브랜드가 적용된 랜딩페이지가 표시됨
- [ ] 네비게이션이 모든 페이지에 표시됨
- [ ] 다크모드 전환이 작동함
- [ ] 모바일에서도 잘 보임

## 디자인 참고
- 배경: 그라디언트 또는 미묘한 패턴
- 버튼: 둥근 모서리, 호버 효과
- 카드: 그림자 효과, 깔끔한 여백
- 폰트: Inter (이미 설정됨)
