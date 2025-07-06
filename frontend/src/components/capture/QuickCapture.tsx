'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { X, Mic, Camera, Type, Loader2 } from 'lucide-react';
import { useCaptureStore } from '@/lib/stores/captureStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CaptureInput } from './CaptureInput';
import { VoiceCapture } from './VoiceCapture';
import { ImageCapture } from './ImageCapture';
import { toast } from 'sonner';

export function QuickCapture() {
  const {
    isOpen,
    mode,
    currentCapture,
    queue,
    openCapture,
    closeCapture,
    setMode,
    addToQueue,
    processQueue,
  } = useCaptureStore();

  const [isSaving, setIsSaving] = useState(false);

  // Global keyboard shortcut
  useHotkeys('mod+shift+n', () => {
    if (!isOpen) openCapture();
  });

  // Process queue when online
  useEffect(() => {
    const handleOnline = () => {
      if (queue.items.length > 0) {
        toast.info('Back online! Processing queued captures...');
        processQueue();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [queue.items.length, processQueue]);

  const handleSave = async () => {
    if (!currentCapture || (!currentCapture.content && !currentCapture.file)) {
      toast.error('Nothing to capture!');
      return;
    }

    setIsSaving(true);
    
    const captureItem = {
      id: crypto.randomUUID(),
      mode: currentCapture.mode || mode,
      content: currentCapture.content || '',
      file: currentCapture.file,
      fileUrl: currentCapture.fileUrl,
      tags: currentCapture.tags || [],
      createdAt: new Date(),
      status: 'pending' as const,
    };

    addToQueue(captureItem);
    
    // Process immediately if online
    if (navigator.onLine) {
      await processQueue();
      toast.success('Capture saved!');
    } else {
      toast.info('Capture queued (offline mode)');
    }

    setIsSaving(false);
    closeCapture();
  };

  const modeIcons = {
    text: <Type className="h-4 w-4" />,
    voice: <Mic className="h-4 w-4" />,
    image: <Camera className="h-4 w-4" />,
  };

  return (
    <>
      {/* Floating action button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => openCapture()}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-coral-600 text-white shadow-lg hover:bg-coral-700 dark:bg-coral-500 dark:hover:bg-coral-600"
      >
        <Type className="h-6 w-6" />
      </motion.button>

      {/* Capture modal */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeCapture()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Quick Capture</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCapture}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {/* Mode selector */}
          <div className="flex gap-2 border-b pb-4">
            {(['text', 'voice', 'image'] as const).map((m) => (
              <Button
                key={m}
                variant={mode === m ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode(m)}
                className={cn(
                  'flex items-center gap-2',
                  mode === m && 'bg-coral-600 hover:bg-coral-700'
                )}
              >
                {modeIcons[m]}
                <span className="capitalize">{m}</span>
              </Button>
            ))}
          </div>

          {/* Capture content */}
          <div className="min-h-[300px] py-4">
            <AnimatePresence mode="wait">
              {mode === 'text' && (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CaptureInput />
                </motion.div>
              )}
              {mode === 'voice' && (
                <motion.div
                  key="voice"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <VoiceCapture />
                </motion.div>
              )}
              {mode === 'image' && (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ImageCapture />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={closeCapture}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || (!currentCapture?.content && !currentCapture?.file)}
              className="bg-coral-600 hover:bg-coral-700"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>

          {/* Offline indicator */}
          {!navigator.onLine && (
            <div className="absolute bottom-4 left-4 text-xs text-orange-600 dark:text-orange-400">
              Offline - captures will sync when online
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}