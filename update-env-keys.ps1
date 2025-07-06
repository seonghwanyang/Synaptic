Write-Host "🔐 환경 변수 키 업데이트 스크립트" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Frontend .env.local 업데이트
Write-Host "📝 Frontend 환경 변수 업데이트 (/frontend/.env.local)" -ForegroundColor Yellow
Write-Host ""

# Supabase 정보 입력
Write-Host "1. Supabase 설정 (https://app.supabase.com 에서 확인)" -ForegroundColor Cyan
$SUPABASE_URL = Read-Host "   NEXT_PUBLIC_SUPABASE_URL (예: https://xxxxx.supabase.co)"
$SUPABASE_ANON_KEY = Read-Host "   NEXT_PUBLIC_SUPABASE_ANON_KEY"

# OpenAI 정보 입력
Write-Host ""
Write-Host "2. OpenAI API Key (https://platform.openai.com/api-keys)" -ForegroundColor Cyan
$OPENAI_API_KEY = Read-Host "   OPENAI_API_KEY (sk-로 시작)"

# Frontend .env.local 파일 업데이트
$frontendEnv = @"
# Supabase
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# OpenAI (나중에 사용)
OPENAI_API_KEY=$OPENAI_API_KEY

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
"@

$frontendEnv | Out-File -FilePath "frontend\.env.local" -Encoding UTF8

Write-Host ""
Write-Host "✅ Frontend .env.local 업데이트 완료!" -ForegroundColor Green
Write-Host ""

# Backend .env 업데이트
Write-Host "📝 Backend 환경 변수 업데이트 (/backend/.env)" -ForegroundColor Yellow
Write-Host ""

# Supabase Service Key 입력
Write-Host "3. Supabase Service Key (Settings > API > service_role key)" -ForegroundColor Cyan
$SUPABASE_SERVICE_KEY = Read-Host "   SUPABASE_SERVICE_KEY"

# Backend .env 파일 업데이트
$backendEnv = @"
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
"@

$backendEnv | Out-File -FilePath "backend\.env" -Encoding UTF8

Write-Host ""
Write-Host "✅ Backend .env 업데이트 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 모든 환경 변수가 성공적으로 업데이트되었습니다!" -ForegroundColor Green
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Yellow
Write-Host "1. pnpm install (의존성 설치)"
Write-Host "2. Docker Desktop 실행"
Write-Host "3. cd database && supabase start (Supabase 로컬 실행)"
Write-Host "4. pnpm dev (개발 서버 실행)"