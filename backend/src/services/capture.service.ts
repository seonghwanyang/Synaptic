import * as notesService from './notes.service';

interface TextCaptureData {
  content: string;
  tags?: string[];
}

interface VoiceCaptureData {
  audioUrl: string;
  duration?: number;
}

interface ImageCaptureData {
  imageUrl: string;
  caption?: string;
}

interface QueuedCapture {
  id: string;
  type: 'text' | 'voice' | 'image';
  data: TextCaptureData | VoiceCaptureData | ImageCaptureData;
  timestamp: string;
}

export async function processTextCapture(
  userId: string,
  data: TextCaptureData
) {
  // Extract title from content (first line or first 50 chars)
  const lines = data.content.split('\n');
  const title =
    lines[0].length > 50 ? lines[0].substring(0, 50) + '...' : lines[0];

  // Create note with AI-suggested tags (placeholder for now)
  const note = await notesService.createNote({
    userId,
    title,
    content: data.content,
    tags: data.tags || ['quick-capture'],
  });

  // TODO: Process with AI for auto-categorization and additional tags

  return note;
}

export async function processVoiceCapture(
  userId: string,
  data: VoiceCaptureData
) {
  // TODO: Implement voice transcription
  // For now, create a note with audio URL reference

  const note = await notesService.createNote({
    userId,
    title: 'Voice Note',
    content: `[Voice recording - ${data.duration || 0} seconds]\n\nAudio: ${data.audioUrl}`,
    tags: ['voice', 'quick-capture'],
  });

  return note;
}

export async function processImageCapture(
  userId: string,
  data: ImageCaptureData
) {
  // TODO: Implement OCR or image analysis
  // For now, create a note with image reference

  const note = await notesService.createNote({
    userId,
    title: data.caption || 'Image Note',
    content: `![Image](${data.imageUrl})\n\n${data.caption || ''}`,
    tags: ['image', 'quick-capture'],
  });

  return note;
}

export async function processQueuedCaptures(
  userId: string,
  captures: QueuedCapture[]
) {
  const results = [];

  for (const capture of captures) {
    try {
      let result;

      switch (capture.type) {
        case 'text':
          result = await processTextCapture(
            userId,
            capture.data as TextCaptureData
          );
          break;
        case 'voice':
          result = await processVoiceCapture(
            userId,
            capture.data as VoiceCaptureData
          );
          break;
        case 'image':
          result = await processImageCapture(
            userId,
            capture.data as ImageCaptureData
          );
          break;
        default:
          throw new Error(`Unknown capture type: ${capture.type}`);
      }

      results.push({
        id: capture.id,
        success: true,
        noteId: result.id,
      });
    } catch (error) {
      results.push({
        id: capture.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}
