import { aiService } from './src/services/ai.service'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function testAI() {
  try {
    console.log('Testing AI Service...')
    console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Found' : 'Missing')
    
    const testContent = 'Meeting with team tomorrow at 3pm to discuss Q4 planning and budget allocation'
    
    console.log('\nTest content:', testContent)
    console.log('\nCategorizing...')
    
    const result = await aiService.categorizeNote(testContent)
    
    console.log('\nAI Categorization Result:')
    console.log('Category:', result.category)
    console.log('Confidence:', result.confidence)
    console.log('Tags:', result.tags)
    console.log('Summary:', result.summary)
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

// Run the test
testAI()