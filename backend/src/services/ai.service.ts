import OpenAI from 'openai';
import { AppError } from '../middleware/error';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AICategorization {
  category: string;
  confidence: number;
  tags: string[];
  summary: string;
}

export interface EmbeddingResult {
  embedding: number[];
  model: string;
}

export class AIService {
  async categorizeNote(content: string): Promise<AICategorization> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-1106',
        messages: [
          {
            role: 'system',
            content: `You are a note categorization system. Categorize the note into one of these categories:
            - work (Work/Business related)
            - personal (Personal/Life related)
            - learning (Learning/Growth/Education)
            - ideas (Ideas/Creative thoughts)
            - tasks (Tasks/Todo items)
            
            Also extract 3-5 relevant tags and create a one-line summary.
            
            Return JSON format:
            {
              "category": "category_name",
              "confidence": 0.0-1.0,
              "tags": ["tag1", "tag2"],
              "summary": "one line summary"
            }`,
          },
          {
            role: 'user',
            content: content,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 200,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');

      // Validate result
      if (!result.category || !Array.isArray(result.tags)) {
        throw new Error('Invalid AI response format');
      }

      return {
        category: result.category,
        confidence: result.confidence || 0.8,
        tags: result.tags.slice(0, 5), // Max 5 tags
        summary: result.summary || content.substring(0, 100),
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('AI categorization error:', error);

      // Fallback categorization
      return {
        category: 'personal',
        confidence: 0.5,
        tags: this.extractBasicTags(content),
        summary: content.substring(0, 100),
      };
    }
  }

  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });

      return {
        embedding: response.data[0].embedding,
        model: response.model,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Embedding generation error:', error);
      throw new AppError('Failed to generate embedding', 500);
    }
  }

  async findRelatedContent(
    embedding: number[],
    _threshold: number = 0.8
  ): Promise<string[]> {
    // This would typically use a vector database like Pinecone or pgvector
    // For now, we'll return an empty array
    // TODO: Implement vector similarity search
    return [];
  }

  private extractBasicTags(content: string): string[] {
    // Basic tag extraction using common patterns
    const words = content.toLowerCase().split(/\s+/);
    const commonWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'from',
      'about',
      'as',
      'is',
      'was',
      'are',
      'were',
      'been',
      'be',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'should',
      'could',
      'may',
      'might',
      'must',
      'can',
      'this',
      'that',
      'these',
      'those',
      'i',
      'you',
      'he',
      'she',
      'it',
      'we',
      'they',
      'what',
      'which',
      'who',
      'when',
      'where',
      'why',
      'how',
      'not',
      'no',
      'yes',
    ]);

    const tags = words
      .filter((word) => word.length > 3 && !commonWords.has(word))
      .slice(0, 5);

    return tags;
  }
}

// Singleton instance
export const aiService = new AIService();
