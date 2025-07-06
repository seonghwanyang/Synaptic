# Task 011-B: 대시보드 UI 완성 (미완료 부분)

## 목표
Task 011에서 구현되지 않은 사이드바 네비게이션과 노트 목록 UI를 완성합니다.

## 작업 내용

### 1. 사이드바 네비게이션 구현
- [ ] components/layout/Sidebar.tsx 생성
- [ ] 메뉴 항목:
  - 🏠 Dashboard (현재 페이지)
  - 📝 My Notes
  - 📁 Categories
  - 🏷️ Tags
  - ⚙️ Settings
- [ ] 접기/펼치기 기능
- [ ] 현재 페이지 하이라이트
- [ ] 모바일에서는 오버레이 방식

### 2. Protected Layout 개선
- [ ] app/(protected)/layout.tsx 수정
- [ ] Sidebar 컴포넌트 추가
- [ ] 메인 콘텐츠 영역 조정
- [ ] 모바일 반응형 처리

### 3. 노트 목록 통합
- [ ] dashboard/page.tsx에 NotesList 컴포넌트 추가
- [ ] 더미 데이터로 노트 표시
- [ ] 그리드/리스트 뷰 전환 버튼
- [ ] 검색 바 추가

### 4. 빈 상태 UI 연결
- [ ] 노트가 없을 때 EmptyState 컴포넌트 표시
- [ ] "첫 노트 만들기" 버튼 → Quick Capture 열기
- [ ] 온보딩 툴팁 추가

### 5. 페이지 라우팅 설정
- [ ] app/(protected)/notes/page.tsx 생성
- [ ] app/(protected)/categories/page.tsx 생성
- [ ] app/(protected)/settings/page.tsx 생성
- [ ] 각 페이지 기본 구조 설정

## 구현 예시

### Sidebar 구조
```tsx
<aside className="w-64 bg-white dark:bg-gray-800 border-r">
  <nav className="p-4 space-y-2">
    <SidebarItem href="/dashboard" icon={Home} label="Dashboard" />
    <SidebarItem href="/notes" icon={FileText} label="My Notes" />
    <SidebarItem href="/categories" icon={Folder} label="Categories" />
    <SidebarItem href="/settings" icon={Settings} label="Settings" />
  </nav>
</aside>
```

### Protected Layout 구조
```tsx
<div className="flex h-screen">
  <Sidebar />
  <main className="flex-1 overflow-y-auto">
    {children}
  </main>
</div>
```

## 완료 조건
- [ ] 모든 protected 페이지에 사이드바가 표시됨
- [ ] 대시보드에 노트 목록이 표시됨
- [ ] 빈 상태 UI가 작동함
- [ ] 모바일에서도 잘 보임

## 참고사항
- 이미 생성된 NotesList, EmptyState 컴포넌트 활용
- Lucide React 아이콘 사용
- 다크모드 지원 필수
