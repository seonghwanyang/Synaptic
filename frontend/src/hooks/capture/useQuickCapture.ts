import { useEffect } from 'react';
import { useCaptureStore } from '@/lib/stores/captureStore';
import { useHotkeys } from 'react-hotkeys-hook';

export function useQuickCapture() {
  const {
    isOpen,
    mode,
    currentCapture,
    queue,
    openCapture,
    closeCapture,
    setMode,
    updateCurrentCapture,
    addToQueue,
    processQueue,
    reset,
  } = useCaptureStore();

  // Global keyboard shortcut
  useHotkeys('mod+shift+n', () => {
    if (!isOpen) {
      openCapture();
    }
  }, {
    enabled: true,
    enableOnFormTags: false,
  });

  // Quick mode shortcuts when capture is open
  useHotkeys('mod+1', () => {
    if (isOpen) setMode('text');
  }, {
    enabled: isOpen,
  });

  useHotkeys('mod+2', () => {
    if (isOpen) setMode('voice');
  }, {
    enabled: isOpen,
  });

  useHotkeys('mod+3', () => {
    if (isOpen) setMode('image');
  }, {
    enabled: isOpen,
  });

  // Escape to close
  useHotkeys('escape', () => {
    if (isOpen) closeCapture();
  }, {
    enabled: isOpen,
    enableOnFormTags: true,
  });

  // Process queue on mount and when coming online
  useEffect(() => {
    // Check for queued items on mount
    if (queue.items.length > 0 && navigator.onLine) {
      processQueue();
    }

    // Listen for online event
    const handleOnline = () => {
      if (queue.items.length > 0) {
        processQueue();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return {
    isOpen,
    mode,
    currentCapture,
    queue,
    openCapture,
    closeCapture,
    setMode,
    updateCurrentCapture,
    addToQueue,
    processQueue,
    reset,
  };
}