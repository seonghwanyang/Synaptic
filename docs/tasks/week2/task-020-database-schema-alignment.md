# Task 020: 데이터베이스 스키마 정렬

## 🎯 목표
Backend 서비스 코드와 데이터베이스 마이그레이션 스키마를 일치시켜 실제 작동하도록 수정합니다.

## 🔍 문제 분석

### 현재 상황
1. **Backend 서비스**가 기대하는 스키마:
   ```typescript
   notes {
     id, user_id, content, content_type, 
     category, ai_confidence, tags[], 
     summary, embedding_id, is_archived
   }
   ```

2. **마이그레이션**의 실제 스키마:
   ```sql
   notes {
     id, user_id, title, content, content_type,
     ai_summary, ai_keywords[], ai_category_id,
     ai_confidence, embedding, metadata, 
     attachments, status, is_pinned, is_favorite
   }
   ```

### 해결 방안
Backend 서비스를 마이그레이션 스키마에 맞춰 수정하거나, 간단한 호환 뷰를 생성합니다.

## 📋 구현 계획

### 옵션 1: 간단한 스키마로 새 테이블 생성 (권장)

**supabase/migrations/006_create_simple_notes_table.sql**:
```sql
-- Drop existing complex tables if needed
DROP TABLE IF EXISTS public.note_connections CASCADE;
DROP TABLE IF EXISTS public.note_tags CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.notes CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- Create simple notes table matching backend service
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'text',
  category VARCHAR(100),
  ai_confidence DECIMAL(3,2),
  tags TEXT[] DEFAULT '{}',
  summary TEXT,
  embedding_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_archived BOOLEAN DEFAULT FALSE
);

-- Create indexes
CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_created_at ON public.notes(created_at DESC);
CREATE INDEX idx_notes_category ON public.notes(category);
CREATE INDEX idx_notes_tags ON public.notes USING gin(tags);

-- Enable RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own notes" ON public.notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notes" ON public.notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON public.notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON public.notes
  FOR DELETE USING (auth.uid() = user_id);

-- Update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 옵션 2: Backend 서비스 수정 (복잡함)

마이그레이션의 복잡한 스키마에 맞춰 Backend 서비스를 수정하는 방법입니다.
- 장점: 더 많은 기능 지원
- 단점: 당장 필요없는 복잡도 추가

## 📝 실행 계획

### 1. Supabase SQL Editor에서 실행
1. https://app.supabase.com/project/sevrswzazvuckncdzwfy/editor 접속
2. SQL Editor 열기
3. 위의 SQL 복사하여 실행
4. 성공 메시지 확인

### 2. 테이블 확인
1. Table Editor로 이동
2. notes 테이블 확인
3. 컬럼 구조 확인

### 3. 테스트 데이터 삽입
```sql
-- 테스트용 사용자 확인 (auth.users에서)
SELECT id, email FROM auth.users LIMIT 1;

-- 테스트 노트 삽입 (user_id를 위에서 얻은 값으로 교체)
INSERT INTO public.notes (
  user_id,
  content,
  content_type,
  category,
  ai_confidence,
  tags,
  summary
) VALUES (
  'YOUR-USER-ID-HERE',
  '테스트 노트입니다. Synaptic 프로젝트가 잘 작동하고 있습니다!',
  'text',
  'work',
  0.95,
  ARRAY['test', 'synaptic', 'project'],
  '프로젝트 테스트 노트'
);
```

### 4. Frontend에서 확인
1. 로그인 후 대시보드 접속
2. 노트 목록에 테스트 노트 표시 확인

## ❗ 주의사항

### 기존 데이터가 있는 경우
```sql
-- 백업 먼저!
CREATE TABLE notes_backup AS SELECT * FROM notes;

-- 확인 후 진행
SELECT COUNT(*) FROM notes;
```

### RLS 정책 확인
```sql
-- RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'notes';

-- 테스트
SET request.jwt.claim.sub = 'YOUR-USER-ID';
SELECT * FROM notes; -- 자신의 노트만 보여야 함
```

## ✅ 완료 조건

- [ ] Notes 테이블 생성 완료
- [ ] Backend 서비스와 스키마 일치
- [ ] RLS 정책 작동 확인
- [ ] 테스트 데이터 삽입 성공
- [ ] Frontend에서 노트 표시

## 🔄 롤백 계획

문제 발생 시:
```sql
-- 테이블 삭제
DROP TABLE IF EXISTS public.notes CASCADE;

-- 백업에서 복원 (있는 경우)
CREATE TABLE notes AS SELECT * FROM notes_backup;
```

---
작성일: 2025-01-30
예상 소요시간: 30분
우선순위: 🔴🔴🔴 (블로킹 이슈)
