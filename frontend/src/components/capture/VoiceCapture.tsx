'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Pause, Play, RotateCcw } from 'lucide-react';
import { useCaptureStore } from '@/lib/stores/captureStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function VoiceCapture() {
  const { updateCurrentCapture, setRecording } = useCaptureStore();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Convert blob to file and update capture
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
        updateCurrentCapture({ file, fileUrl: url });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecording(true);
      
      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setRecording(false);
      setIsPaused(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        intervalRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }
  };

  const resetRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    setDuration(0);
    setAudioUrl(null);
    setAudioBlob(null);
    updateCurrentCapture({ file: undefined, fileUrl: undefined });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Recording visualization */}
      <div className="relative flex h-32 w-32 items-center justify-center">
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full bg-coral-600/20"
            animate={{ scale: isPaused ? 1 : [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-coral-600 text-white dark:bg-coral-500">
          {isRecording ? (
            <Mic className="h-10 w-10" />
          ) : (
            <MicOff className="h-10 w-10" />
          )}
        </div>
      </div>

      {/* Duration display */}
      <div className="text-2xl font-mono">
        {formatDuration(duration)}
      </div>

      {/* Audio preview */}
      {audioUrl && !isRecording && (
        <audio controls className="w-full max-w-sm">
          <source src={audioUrl} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      )}

      {/* Control buttons */}
      <div className="flex gap-2">
        {!isRecording && !audioUrl && (
          <Button
            onClick={startRecording}
            size="lg"
            className="bg-coral-600 hover:bg-coral-700"
          >
            <Mic className="mr-2 h-4 w-4" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <>
            <Button
              onClick={pauseRecording}
              size="lg"
              variant="outline"
            >
              {isPaused ? (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              )}
            </Button>
            <Button
              onClick={stopRecording}
              size="lg"
              variant="destructive"
            >
              <MicOff className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </>
        )}

        {audioUrl && !isRecording && (
          <Button
            onClick={resetRecording}
            size="lg"
            variant="outline"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Record Again
          </Button>
        )}
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {!isRecording && !audioUrl && 'Click "Start Recording" to begin'}
        {isRecording && !isPaused && 'Recording in progress...'}
        {isRecording && isPaused && 'Recording paused'}
        {audioUrl && !isRecording && 'Review your recording or record again'}
      </p>
    </div>
  );
}