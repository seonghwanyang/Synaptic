import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

async function testAPI() {
  try {
    console.log('Testing API endpoints...')
    
    // First, get a token (simulate login)
    const email = 'yangseonghwan119@gmail.com'
    const password = 'test123!@#' // You'll need the actual password
    
    console.log('\n1. Attempting to get auth token...')
    console.log('Note: This test requires the actual password for the test user')
    
    // For now, let's test the health endpoint
    console.log('\n2. Testing health endpoint...')
    try {
      const healthResponse = await axios.get('http://localhost:5000/health')
      console.log('Health check:', healthResponse.data)
    } catch (error: any) {
      console.error('Health check failed:', error.response?.data || error.message)
    }
    
    // Test with a mock token to see the error
    console.log('\n3. Testing notes endpoint with mock token...')
    try {
      const notesResponse = await axios.post(
        'http://localhost:5000/api/notes',
        {
          content: 'Test note from API test',
          content_type: 'text'
        },
        {
          headers: {
            'Authorization': 'Bearer mock-token',
            'Content-Type': 'application/json'
          }
        }
      )
      console.log('Notes response:', notesResponse.data)
    } catch (error: any) {
      console.error('Notes API error:', error.response?.status, error.response?.data)
      
      // Log the full error details
      if (error.response?.data) {
        console.log('\nFull error details:')
        console.log(JSON.stringify(error.response.data, null, 2))
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

// Run the test
testAPI()