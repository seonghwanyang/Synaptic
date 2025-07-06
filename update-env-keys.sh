#!/bin/bash

echo "🔐 환경 변수 키 업데이트 스크립트"
echo "================================"
echo ""

# Frontend .env.local 업데이트
echo "📝 Frontend 환경 변수 업데이트 (/frontend/.env.local)"
echo ""

# Supabase 정보 입력
echo "1. Supabase 설정 (https://app.supabase.com 에서 확인)"
read -p "   NEXT_PUBLIC_SUPABASE_URL (예: https://xxxxx.supabase.co): " SUPABASE_URL
read -p "   NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY

# OpenAI 정보 입력
echo ""
echo "2. OpenAI API Key (https://platform.openai.com/api-keys)"
read -p "   OPENAI_API_KEY (sk-로 시작): " OPENAI_API_KEY

# Frontend .env.local 파일 업데이트
cat > frontend/.env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# OpenAI (나중에 사용)
OPENAI_API_KEY=$OPENAI_API_KEY

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF

echo ""
echo "✅ Frontend .env.local 업데이트 완료!"
echo ""

# Backend .env 업데이트
echo "📝 Backend 환경 변수 업데이트 (/backend/.env)"
echo ""

# Supabase Service Key 입력
echo "3. Supabase Service Key (Settings > API > service_role key)"
read -p "   SUPABASE_SERVICE_KEY: " SUPABASE_SERVICE_KEY

# Backend .env 파일 업데이트
cat > backend/.env << EOF
# Server
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY

# OpenAI
OPENAI_API_KEY=$OPENAI_API_KEY

# CORS
FRONTEND_URL=http://localhost:3000
EOF

echo ""
echo "✅ Backend .env 업데이트 완료!"
echo ""
echo "🎉 모든 환경 변수가 성공적으로 업데이트되었습니다!"
echo ""
echo "다음 단계:"
echo "1. pnpm install (의존성 설치)"
echo "2. Docker Desktop 실행"
echo "3. cd database && supabase start (Supabase 로컬 실행)"
echo "4. pnpm dev (개발 서버 실행)"