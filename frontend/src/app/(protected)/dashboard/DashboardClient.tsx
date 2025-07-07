'use client';

import { Toaster } from 'sonner';

export function DashboardClient() {
  return (
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
  );
}