# Task 013: Synaptic 핵심 페이지 구현

## 🎯 목표
Synaptic의 핵심 기능인 "2초 Quick Capture"와 "AI 자동 정리"를 위한 필수 페이지들을 구현합니다.

## 📌 현재 상황
- ✅ 랜딩페이지, 로그인/회원가입 완료
- ✅ 대시보드 기본 구조 완료
- ❌ Quick Capture 페이지 없음
- ❌ 노트 목록/상세 페이지 없음
- ❌ AI 분류 결과 페이지 없음
- ❌ 3D 네트워크 뷰 없음

## 📋 구현할 페이지 목록

### 1. Quick Capture 페이지 (최우선!)
**경로**: `/capture` 또는 모달/오버레이
**기능**:
- 즉시 포커스되는 텍스트 입력창
- 음성 입력 버튼 (Web Speech API)
- 이미지 업로드/드래그앤드롭
- 자동 저장 (1초 디바운스)
- Cmd+Enter로 저장 후 닫기

**UI 특징**:
```tsx
// 미니멀한 인터페이스
<div className="min-h-screen bg-gradient-to-br from-coral-50 to-teal-50">
  <div className="max-w-4xl mx-auto p-8">
    <textarea 
      className="w-full min-h-[300px] text-2xl bg-transparent border-none outline-none placeholder-gray-400"
      placeholder="무엇이든 적어보세요..."
      autoFocus
    />
    <div className="flex justify-between mt-8">
      <div className="flex gap-4">
        <button className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl">
          <Mic className="w-6 h-6 text-coral-500" />
        </button>
        <button className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl">
          <Image className="w-6 h-6 text-teal-500" />
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Sparkles className="w-4 h-4" />
        AI가 자동으로 분류합니다
      </div>
    </div>
  </div>
</div>
```

### 2. 노트 목록 페이지
**경로**: `/notes`
**기능**:
- 카테고리별 필터링 (Work, Personal, Learning, Ideas, Tasks)
- 태그 필터
- 검색 기능
- 그리드/리스트 뷰 전환
- 무한 스크롤

**레이아웃**:
```tsx
<div className="flex h-full">
  {/* 사이드바 - 카테고리 & 태그 */}
  <aside className="w-64 border-r bg-gray-50">
    <CategoryFilter />
    <TagCloud />
  </aside>
  
  {/* 메인 - 노트 그리드 */}
  <main className="flex-1 p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map(note => (
        <NoteCard 
          key={note.id}
          note={note}
          categoryColor={getCategoryColor(note.category)}
        />
      ))}
    </div>
  </main>
</div>
```

### 3. 노트 상세 페이지
**경로**: `/notes/:id`
**기능**:
- 노트 내용 표시
- 인라인 편집
- AI 분석 결과 표시 (카테고리, 태그, 요약)
- 관련 노트 추천
- 공유 기능
- 리마인더 설정

**AI 인사이트 섹션**:
```tsx
<div className="bg-gradient-to-r from-coral-50 to-teal-50 p-6 rounded-xl">
  <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
    <Brain className="w-5 h-5" />
    AI 인사이트
  </h3>
  
  <div className="space-y-4">
    {/* 카테고리 */}
    <div>
      <span className="text-sm text-gray-600">카테고리</span>
      <div className="flex items-center gap-2 mt-1">
        <Badge className="bg-coral-100 text-coral-700">
          {note.category}
        </Badge>
        <span className="text-xs text-gray-500">
          신뢰도 {note.aiConfidence}%
        </span>
      </div>
    </div>
    
    {/* 추출된 태그 */}
    <div>
      <span className="text-sm text-gray-600">키워드</span>
      <div className="flex flex-wrap gap-2 mt-1">
        {note.tags.map(tag => (
          <span className="px-2 py-1 bg-white rounded-full text-sm">
            #{tag}
          </span>
        ))}
      </div>
    </div>
    
    {/* 한 줄 요약 */}
    <div>
      <span className="text-sm text-gray-600">요약</span>
      <p className="mt-1 text-gray-800">{note.summary}</p>
    </div>
  </div>
</div>
```

### 4. AI 대시보드 페이지
**경로**: `/dashboard` (개선)
**추가 기능**:
- 오늘의 인사이트
- 카테고리별 통계
- 최근 활동 타임라인
- 리마인더 예정 노트
- 주간/월간 리포트

**통계 카드 예시**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <StatCard
    title="총 노트"
    value={stats.totalNotes}
    icon={<FileText />}
    trend="+12%"
    color="coral"
  />
  <StatCard
    title="이번 주 아이디어"
    value={stats.weeklyIdeas}
    icon={<Lightbulb />}
    trend="+23%"
    color="teal"
  />
  <StatCard
    title="실행된 태스크"
    value={stats.completedTasks}
    icon={<CheckCircle />}
    trend="+8%"
    color="green"
  />
  <StatCard
    title="연결된 인사이트"
    value={stats.connections}
    icon={<Network />}
    trend="+15%"
    color="purple"
  />
</div>
```

### 5. 3D 네트워크 뷰 (Phase 2)
**경로**: `/network`
**기능**:
- Three.js 기반 3D 시각화
- 노드: 노트, 엣지: 연결관계
- 카테고리별 색상 구분
- 인터랙티브 탐색
- 시간축 필터

**기본 구조**:
```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function NetworkView() {
  return (
    <div className="h-screen bg-gray-900">
      <Canvas camera={{ position: [0, 0, 50] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* 노트 노드들 */}
        {notes.map(note => (
          <NoteNode
            key={note.id}
            position={note.position}
            category={note.category}
            connections={note.connections}
          />
        ))}
        
        {/* 연결선 */}
        {connections.map(conn => (
          <ConnectionLine
            key={conn.id}
            start={conn.from}
            end={conn.to}
          />
        ))}
        
        <OrbitControls />
      </Canvas>
      
      {/* UI 오버레이 */}
      <div className="absolute top-4 left-4">
        <CategoryLegend />
        <TimelineSlider />
      </div>
    </div>
  )
}
```

### 6. 설정 페이지
**경로**: `/settings`
**섹션**:
- 프로필 설정
- AI 설정 (분류 민감도, 리마인더 빈도)
- 알림 설정
- 데이터 & 프라이버시
- 구독 관리

## 🎨 디자인 시스템 통일

### 색상 팔레트
```css
:root {
  /* Primary - Coral */
  --coral-50: #fff5f5;
  --coral-100: #ffe3e3;
  --coral-200: #ffc9c9;
  --coral-300: #ffa8a8;
  --coral-400: #ff8787;
  --coral-500: #ff6b6b;  /* Primary */
  --coral-600: #fa5252;
  --coral-700: #f03e3e;
  
  /* Secondary - Teal */
  --teal-50: #e6fcfc;
  --teal-100: #c3fafa;
  --teal-200: #99f0f0;
  --teal-300: #66e0e0;
  --teal-400: #33c9c9;
  --teal-500: #20b2aa;
  --teal-600: #008b8b;  /* Primary */
  --teal-700: #007272;
}
```

### 컴포넌트 스타일
```tsx
// 노트 카드
const NoteCard = ({ note, categoryColor }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all p-6 cursor-pointer"
  >
    <div className="flex items-start justify-between mb-3">
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: categoryColor }}
      />
      <span className="text-xs text-gray-500">
        {formatRelativeTime(note.createdAt)}
      </span>
    </div>
    
    <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
      {note.title || note.content.substring(0, 50)}
    </h3>
    
    <p className="text-sm text-gray-600 line-clamp-3">
      {note.content}
    </p>
    
    <div className="flex items-center gap-2 mt-4">
      {note.tags.slice(0, 3).map(tag => (
        <span key={tag} className="text-xs text-gray-500">
          #{tag}
        </span>
      ))}
    </div>
  </motion.div>
)
```

## 📋 구현 순서

1. **Quick Capture** (가장 중요!)
   - 글로벌 단축키 설정
   - 자동 저장 로직
   - AI 분류 트리거

2. **노트 목록 페이지**
   - 기본 CRUD
   - 필터링 & 검색
   - 페이지네이션

3. **노트 상세 페이지**
   - 편집 기능
   - AI 인사이트 표시
   - 관련 노트 추천

4. **대시보드 개선**
   - 통계 위젯
   - 활동 타임라인
   - 리마인더 섹션

5. **설정 페이지**
   - 기본 프로필
   - AI 설정
   - 알림 설정

## 🧪 테스트 시나리오

1. **Quick Capture 플로우**
   - Cmd+Shift+N → 캡처 창 열림
   - 텍스트 입력 → 1초 후 자동 저장
   - AI 분류 → 카테고리 자동 지정

2. **노트 탐색**
   - 카테고리 클릭 → 필터링
   - 검색어 입력 → 실시간 검색
   - 노트 클릭 → 상세 페이지

3. **AI 기능**
   - 노트 저장 → AI 분석 시작
   - 2-3초 내 분류 완료
   - 관련 노트 자동 연결

## 🎯 완료 조건
- [ ] Quick Capture가 2초 내에 열림
- [ ] 모든 입력 형태 지원 (텍스트, 음성, 이미지)
- [ ] AI 분류가 자동으로 작동
- [ ] 노트 CRUD 완성
- [ ] 반응형 디자인 적용

---
작성일: 2025-01-30
예상 소요시간: 4-6시간
우선순위: 🔴 최우선 (핵심 기능)