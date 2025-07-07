import dotenv from 'dotenv'
import path from 'path'

// 환경 변수 먼저 로드
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import { supabaseAdmin } from '../config/supabase'
import fs from 'fs'

async function checkTables() {
  try {
    console.log('\n🔍 Checking database tables...')
    
    // Notes 테이블 확인
    const { data: notes, error: notesError } = await supabaseAdmin
      .from('notes')
      .select('id')
      .limit(1)
    
    if (notesError && notesError.message.includes('relation "public.notes" does not exist')) {
      console.log('❌ Notes table does not exist')
      return false
    }
    
    console.log('✅ Notes table exists')
    
    // RLS 정책 확인을 위한 테스트 쿼리
    const { count } = await supabaseAdmin
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
  console.log(`📍 Supabase URL: ${process.env.SUPABASE_URL}`)
  console.log(`🔑 Using service role key: ${process.env.SUPABASE_SERVICE_KEY?.substring(0, 20)}...`)
  
  const tablesExist = await checkTables()
  
  if (!tablesExist) {
    console.log('\n⚠️  Tables not found.')
    console.log('\n📋 Please run the following SQL in your Supabase SQL Editor:')
    console.log('🔗 https://app.supabase.com/project/sevrswzazvuckncdzwfy/sql/new')
    
    // 마이그레이션 파일 읽기
    const migrationPath = path.join(__dirname, '../../../database/migrations/002_create_notes_table.sql')
    const sql = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('\n' + '='.repeat(60) + '\n')
    console.log(sql)
    console.log('\n' + '='.repeat(60) + '\n')
  } else {
    console.log('\n✅ All tables are already set up!')
  }
}

main().catch(console.error)