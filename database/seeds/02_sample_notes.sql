-- Sample notes and categories seed data

-- Sample categories for test user
INSERT INTO public.categories (id, user_id, name, slug, color, icon, description) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '업무', 'work', '#FF6B6B', 'briefcase', '업무 관련 노트'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '아이디어', 'ideas', '#008B8B', 'lightbulb', '새로운 아이디어와 생각'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', '학습', 'learning', '#20B2AA', 'book', '공부하고 배운 내용'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', '일상', 'daily', '#FFD700', 'calendar', '일상 기록')
ON CONFLICT (id) DO NOTHING;

-- Sample tags
INSERT INTO public.tags (id, user_id, name, slug) VALUES
    ('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'important', 'important'),
    ('22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'todo', 'todo'),
    ('33333333-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'reference', 'reference')
ON CONFLICT (id) DO NOTHING;

-- Sample notes
INSERT INTO public.notes (
    id, user_id, title, content, content_type, 
    ai_category_id, ai_summary, ai_keywords,
    is_pinned, is_favorite, created_at
) VALUES
    (
        'note1111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111111',
        'Synaptic 프로젝트 킥오프 미팅',
        '오늘 Synaptic 프로젝트 킥오프 미팅을 진행했다. 주요 논의사항:

1. MVP 개발 일정: 8주
2. 핵심 기능:
   - AI 기반 노트 자동 분류
   - 시맨틱 검색
   - 자동 인사이트 생성
3. 기술 스택: Next.js, Supabase, OpenAI

다음 주까지 데이터베이스 스키마 설계 완료 예정.',
        'text',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Synaptic 프로젝트 킥오프 미팅 내용. MVP 8주 개발, AI 자동 분류 및 시맨틱 검색 기능 포함.',
        ARRAY['프로젝트', '킥오프', 'MVP', 'AI', '자동분류'],
        true,
        true,
        NOW() - INTERVAL '2 days'
    ),
    (
        'note2222-2222-2222-2222-222222222222',
        '11111111-1111-1111-1111-111111111111',
        'Vector Database 성능 최적화 아이디어',
        'pgvector를 사용한 시맨틱 검색 성능 최적화 방법:

1. IVFFlat 인덱스 사용
2. 적절한 lists 파라미터 설정 (보통 sqrt(rows))
3. 차원 축소 고려 (1536 -> 768)
4. 부분 인덱스 활용

벤치마크 테스트 필요.',
        'text',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'pgvector 성능 최적화 방법: IVFFlat 인덱스, 차원 축소, 부분 인덱스 활용',
        ARRAY['pgvector', '성능', '최적화', '인덱스', '검색'],
        false,
        true,
        NOW() - INTERVAL '1 day'
    ),
    (
        'note3333-3333-3333-3333-333333333333',
        '11111111-1111-1111-1111-111111111111',
        'Supabase RLS 정책 설정',
        '## Row Level Security 설정 체크리스트

- [x] profiles 테이블: 자신의 프로필만 조회/수정
- [x] notes 테이블: 자신의 노트만 CRUD
- [x] categories 테이블: 자신의 카테고리만 관리
- [ ] 공유 기능을 위한 정책 추가 필요

참고: https://supabase.com/docs/guides/auth/row-level-security',
        'text',
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'Supabase RLS 정책 설정 체크리스트. 각 테이블별 보안 정책 구현 상태.',
        ARRAY['Supabase', 'RLS', '보안', '정책', '체크리스트'],
        false,
        false,
        NOW() - INTERVAL '12 hours'
    ),
    (
        'note4444-4444-4444-4444-444444444444',
        '11111111-1111-1111-1111-111111111111',
        '오늘의 할 일',
        '- [ ] 데이터베이스 마이그레이션 작성
- [ ] API 엔드포인트 설계
- [ ] 프론트엔드 컴포넌트 구조 잡기
- [ ] shadcn/ui 테마 커스터마이징

오후에 팀 미팅 예정',
        'text',
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        '오늘의 할 일 목록: DB 마이그레이션, API 설계, 프론트엔드 구조, UI 테마 작업',
        ARRAY['할일', 'TODO', '일정', '미팅'],
        true,
        false,
        NOW() - INTERVAL '3 hours'
    );

-- Sample note tags
INSERT INTO public.note_tags (note_id, tag_id) VALUES
    ('note1111-1111-1111-1111-111111111111', '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('note1111-1111-1111-1111-111111111111', '22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    ('note3333-3333-3333-3333-333333333333', '33333333-cccc-cccc-cccc-cccccccccccc'),
    ('note4444-4444-4444-4444-444444444444', '22222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
ON CONFLICT (note_id, tag_id) DO NOTHING;

-- Sample note connections
INSERT INTO public.note_connections (from_note_id, to_note_id, connection_type, strength) VALUES
    ('note1111-1111-1111-1111-111111111111', 'note3333-3333-3333-3333-333333333333', 'related', 0.8),
    ('note2222-2222-2222-2222-222222222222', 'note3333-3333-3333-3333-333333333333', 'reference', 0.6)
ON CONFLICT (from_note_id, to_note_id) DO NOTHING;

-- Update category notes count
UPDATE public.categories c
SET notes_count = (
    SELECT COUNT(*) 
    FROM public.notes n 
    WHERE n.ai_category_id = c.id
)
WHERE c.user_id = '11111111-1111-1111-1111-111111111111';

-- Update tag usage count
UPDATE public.tags t
SET usage_count = (
    SELECT COUNT(*) 
    FROM public.note_tags nt 
    WHERE nt.tag_id = t.id
)
WHERE t.user_id = '11111111-1111-1111-1111-111111111111';