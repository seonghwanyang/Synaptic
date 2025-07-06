'use client';

import { QuickCapture } from '@/components/capture/QuickCapture';
import { Toaster } from 'sonner';
import { useKeyboardShortcuts } from '@/hooks/capture/useKeyboardShortcuts';

export function DashboardClient() {
  // Enable global keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <>
      <QuickCapture />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </>
  );
}