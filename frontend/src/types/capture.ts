export type CaptureMode = 'text' | 'voice' | 'image';

export interface CaptureItem {
  id: string;
  mode: CaptureMode;
  content: string;
  file?: File;
  fileUrl?: string;
  tags?: string[];
  createdAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface CaptureQueue {
  items: CaptureItem[];
  isProcessing: boolean;
}

export interface CaptureState {
  isOpen: boolean;
  mode: CaptureMode;
  currentCapture: Partial<CaptureItem> | null;
  queue: CaptureQueue;
  isRecording: boolean;
  isCapturing: boolean;
  
  // Actions
  openCapture: (mode?: CaptureMode) => void;
  closeCapture: () => void;
  setMode: (mode: CaptureMode) => void;
  updateCurrentCapture: (capture: Partial<CaptureItem>) => void;
  addToQueue: (item: CaptureItem) => void;
  removeFromQueue: (id: string) => void;
  processQueue: () => Promise<void>;
  setRecording: (isRecording: boolean) => void;
  setCapturing: (isCapturing: boolean) => void;
  reset: () => void;
}

export interface VoiceRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
}

export interface ImageCaptureState {
  isCapturing: boolean;
  imageBlob: Blob | null;
  imageUrl: string | null;
  error: string | null;
}