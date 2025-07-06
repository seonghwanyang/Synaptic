import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CaptureState, CaptureItem, CaptureMode } from '@/types/capture';
import { createClient } from '@/lib/supabase/client';

const initialState = {
  isOpen: false,
  mode: 'text' as CaptureMode,
  currentCapture: null,
  queue: {
    items: [],
    isProcessing: false,
  },
  isRecording: false,
  isCapturing: false,
};

export const useCaptureStore = create<CaptureState>()(
  persist(
    (set, get) => ({
      ...initialState,

      openCapture: (mode = 'text') => {
        set({ isOpen: true, mode, currentCapture: { mode } });
      },

      closeCapture: () => {
        set({ isOpen: false, currentCapture: null, isRecording: false, isCapturing: false });
      },

      setMode: (mode) => {
        set((state) => ({
          mode,
          currentCapture: state.currentCapture ? { ...state.currentCapture, mode } : { mode },
        }));
      },

      updateCurrentCapture: (capture) => {
        set((state) => ({
          currentCapture: state.currentCapture 
            ? { ...state.currentCapture, ...capture }
            : capture,
        }));
      },

      addToQueue: (item) => {
        set((state) => ({
          queue: {
            ...state.queue,
            items: [...state.queue.items, item],
          },
        }));
      },

      removeFromQueue: (id) => {
        set((state) => ({
          queue: {
            ...state.queue,
            items: state.queue.items.filter((item) => item.id !== id),
          },
        }));
      },

      processQueue: async () => {
        const { queue } = get();
        if (queue.isProcessing || queue.items.length === 0) return;

        set((state) => ({
          queue: { ...state.queue, isProcessing: true },
        }));

        const supabase = createClient();
        const processedItems: string[] = [];

        for (const item of queue.items) {
          try {
            // Update item status to processing
            set((state) => ({
              queue: {
                ...state.queue,
                items: state.queue.items.map((i) =>
                  i.id === item.id ? { ...i, status: 'processing' } : i
                ),
              },
            }));

            // Upload file if exists
            let fileUrl = item.fileUrl;
            if (item.file && !fileUrl) {
              const fileExt = item.file.name.split('.').pop();
              const fileName = `${item.id}.${fileExt}`;
              const filePath = `captures/${fileName}`;

              const { error: uploadError, data } = await supabase.storage
                .from('captures')
                .upload(filePath, item.file);

              if (uploadError) throw uploadError;

              const { data: { publicUrl } } = supabase.storage
                .from('captures')
                .getPublicUrl(filePath);

              fileUrl = publicUrl;
            }

            // Create note
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { error: noteError } = await supabase
              .from('notes')
              .insert({
                user_id: user.id,
                title: item.mode === 'text' ? item.content.slice(0, 50) : `${item.mode} capture`,
                content: item.content || '',
                category_id: null, // Quick captures don't have a category initially
                metadata: {
                  capture_mode: item.mode,
                  file_url: fileUrl,
                  captured_at: item.createdAt,
                },
              });

            if (noteError) throw noteError;

            // Mark as completed and add to processed list
            set((state) => ({
              queue: {
                ...state.queue,
                items: state.queue.items.map((i) =>
                  i.id === item.id ? { ...i, status: 'completed' } : i
                ),
              },
            }));
            processedItems.push(item.id);

          } catch (error) {
            console.error('Error processing capture:', error);
            set((state) => ({
              queue: {
                ...state.queue,
                items: state.queue.items.map((i) =>
                  i.id === item.id 
                    ? { ...i, status: 'failed', error: (error as Error).message } 
                    : i
                ),
              },
            }));
          }
        }

        // Remove completed items from queue
        setTimeout(() => {
          set((state) => ({
            queue: {
              isProcessing: false,
              items: state.queue.items.filter((item) => !processedItems.includes(item.id)),
            },
          }));
        }, 1000);
      },

      setRecording: (isRecording) => {
        set({ isRecording });
      },

      setCapturing: (isCapturing) => {
        set({ isCapturing });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'capture-storage',
      partialize: (state) => ({
        queue: state.queue,
      }),
    }
  )
);