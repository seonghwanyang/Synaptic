import { useCallback, useEffect, useRef, useState } from 'react';
import { VoiceRecordingState } from '@/types/capture';
import { toast } from 'sonner';

export function useVoiceRecording() {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (state.audioUrl) {
        URL.revokeObjectURL(state.audioUrl);
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        setState(prev => ({
          ...prev,
          audioBlob: blob,
          audioUrl: url,
          isRecording: false,
          isPaused: false,
        }));
        
        // Clean up stream
        streamRef.current?.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      
      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        error: null,
      }));
      
      // Start duration timer
      intervalRef.current = setInterval(() => {
        setState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isRecording: false,
      }));
      
      toast.error(errorMessage);
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      if (state.isPaused) {
        // Resume
        mediaRecorderRef.current.resume();
        setState(prev => ({ ...prev, isPaused: false }));
        
        // Resume timer
        intervalRef.current = setInterval(() => {
          setState(prev => ({ ...prev, duration: prev.duration + 1 }));
        }, 1000);
      } else {
        // Pause
        mediaRecorderRef.current.pause();
        setState(prev => ({ ...prev, isPaused: true }));
        
        // Pause timer
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }
  }, [state.isRecording, state.isPaused]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Stop all tracks
      streamRef.current?.getTracks().forEach(track => track.stop());
    }
  }, [state.isRecording]);

  const resetRecording = useCallback(() => {
    // Stop any ongoing recording
    stopRecording();
    
    // Clean up old audio URL
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }
    
    // Reset state
    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
      audioUrl: null,
      error: null,
    });
  }, [state.audioUrl, stopRecording]);

  const getAudioFile = useCallback((): File | null => {
    if (!state.audioBlob) return null;
    
    return new File(
      [state.audioBlob], 
      `recording-${Date.now()}.webm`, 
      { type: 'audio/webm' }
    );
  }, [state.audioBlob]);

  return {
    ...state,
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    getAudioFile,
  };
}