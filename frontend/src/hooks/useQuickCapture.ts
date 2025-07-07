import { useState, useCallback } from 'react';
import { api } from '@/lib/api/client';

interface CaptureData {
  type: 'text' | 'voice' | 'image';
  data: {
    content?: string;
    fileUrl?: string;
    metadata?: Record<string, any>;
  };
}

export function useQuickCapture() {
  const [isLoading, setIsLoading] = useState(false);

  const saveCapture = useCallback(async (captureData: CaptureData) => {
    if (!captureData.data.content && !captureData.data.fileUrl) {
      throw new Error('No content to save');
    }

    setIsLoading(true);
    try {
      // For text captures, create a note directly
      if (captureData.type === 'text' && captureData.data.content) {
        const result = await api.notes.create({
          content: captureData.data.content,
          type: 'text',
        });
        return result.data;
      }

      // For other types, use the capture endpoint
      const result = await api.capture.quickSave(captureData);
      return result.data;
    } catch (error) {
      console.error('Failed to save capture:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    saveCapture,
    isLoading,
  };
}
