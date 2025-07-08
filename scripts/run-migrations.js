const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Supabase 설정
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   SUPABASE_URL and SUPABASE_SERVICE_KEY must be set')
  console.error('   Please create a .env file or set environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('🚀 Running database migrations...')
    
    // Notes 테이블 마이그레이션 파일 읽기
    const migrationPath = path.join(__dirname, '../database/migrations/002_create_notes_table.sql')
    const sql = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('📄 Executing migration: 002_create_notes_table.sql')
    
    // SQL 실행
    const { data, error } = await supabase.rpc('exec_sql', { query: sql })
    
    if (error) {
      // RPC 함수가 없을 수 있으므로 직접 실행 시도
      console.log('ℹ️  Direct SQL execution is not available through Supabase client')
      console.log('📋 Please run the following SQL in your Supabase SQL Editor:')
      console.log('\n' + '='.repeat(60) + '\n')
      console.log(sql)
      console.log('\n' + '='.repeat(60) + '\n')
      return
    }
    
    console.log('✅ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// 테이블 존재 여부 확인
async function checkTables() {
  try {
    console.log('\n🔍 Checking database tables...')
    
    // Notes 테이블 확인
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select('id')
      .limit(1)
    
    if (notesError && notesError.code === '42P01') {
      console.log('❌ Notes table does not exist')
      return false
    }
    
    console.log('✅ Notes table exists')
    
    // RLS 정책 확인을 위한 테스트 쿼리
    const { count } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📊 Current notes count: ${count || 0}`)
    
    return true
  } catch (error) {
    console.error('❌ Error checking tables:', error)
    return false
  }
}

async function main() {
  console.log('🗄️  Synaptic Database Migration Tool')
  console.log('====================================')
  console.log(`📍 Supabase URL: ${supabaseUrl}`)
  console.log(`🔑 Using service role key: ${supabaseServiceKey.substring(0, 20)}...`)
  
  const tablesExist = await checkTables()
  
  if (!tablesExist) {
    console.log('\n⚠️  Tables not found. Running migration...')
    await runMigration()
  } else {
    console.log('\n✅ All tables are already set up!')
  }
  
  console.log('\n🎉 Database setup complete!')
}

main().catch(console.error)