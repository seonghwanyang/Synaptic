import { getSupabaseAdmin } from './src/config/supabase'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function testAuthAndDatabase() {
  try {
    console.log('Testing Supabase Auth & Database...')
    
    const supabaseAdmin = getSupabaseAdmin()
    
    // Get a real user from auth.users
    console.log('\n1. Getting users from auth...')
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1
    })
    
    if (usersError) {
      console.error('Error getting users:', usersError)
      return
    }
    
    if (!users || users.length === 0) {
      console.log('No users found in the database')
      return
    }
    
    const testUser = users[0]
    console.log('✓ Found user:', testUser.email, 'ID:', testUser.id)
    
    // Test insert with real user ID
    console.log('\n2. Testing insert with real user...')
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('notes')
      .insert({
        user_id: testUser.id,
        content: 'Test note from backend',
        content_type: 'text',
        category: 'Test',
        tags: ['test', 'backend'],
        ai_insights: {
          confidence: 0.95,
          summary: 'Test summary from backend test',
          processedAt: new Date().toISOString()
        }
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Insert error:', insertError)
      console.error('Error details:', JSON.stringify(insertError, null, 2))
    } else {
      console.log('✓ Insert successful!')
      console.log('Note ID:', insertData?.id)
      console.log('Note content:', insertData?.content)
      
      // Test select
      console.log('\n3. Testing select...')
      const { data: notes, error: selectError } = await supabaseAdmin
        .from('notes')
        .select('*')
        .eq('user_id', testUser.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (selectError) {
        console.error('Select error:', selectError)
      } else {
        console.log(`✓ Found ${notes?.length} notes for user`)
        notes?.forEach((note, index) => {
          console.log(`  ${index + 1}. ${note.content.substring(0, 50)}... (${note.category})`)
        })
      }
      
      // Clean up test data
      if (insertData?.id) {
        console.log('\n4. Cleaning up test data...')
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
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

// Run the test
testAuthAndDatabase()