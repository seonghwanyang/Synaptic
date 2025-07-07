import { getSupabaseAdmin } from './src/config/supabase'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function testDatabase() {
  try {
    console.log('Testing Supabase connection...')
    
    const supabaseAdmin = getSupabaseAdmin()
    
    // Test 1: Check if notes table exists
    console.log('\n1. Checking notes table...')
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('notes')
      .select('*')
      .limit(1)
    
    if (tablesError) {
      console.error('Error accessing notes table:', tablesError)
    } else {
      console.log('✓ Notes table accessible')
    }
    
    // Test 2: Test insert (with a test user ID)
    console.log('\n2. Testing insert...')
    const testUserId = '00000000-0000-0000-0000-000000000000' // Dummy UUID
    
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('notes')
      .insert({
        user_id: testUserId,
        content: 'Test note',
        content_type: 'text',
        category: 'Test',
        tags: ['test'],
        ai_insights: {
          confidence: 0.9,
          summary: 'Test summary'
        }
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Insert error:', insertError)
      console.error('Error details:', JSON.stringify(insertError, null, 2))
    } else {
      console.log('✓ Insert successful:', insertData?.id)
      
      // Clean up test data
      if (insertData?.id) {
        const { error: deleteError } = await supabaseAdmin
          .from('notes')
          .delete()
          .eq('id', insertData.id)
        
        if (deleteError) {
          console.error('Cleanup error:', deleteError)
        } else {
          console.log('✓ Test data cleaned up')
        }
      }
    }
    
    // Test 3: Check table schema
    console.log('\n3. Checking table columns...')
    const { data: schemaData, error: schemaError } = await supabaseAdmin
      .from('notes')
      .select()
      .limit(0)
    
    if (!schemaError) {
      console.log('✓ Table schema check passed')
    }
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

// Run the test
testDatabase()