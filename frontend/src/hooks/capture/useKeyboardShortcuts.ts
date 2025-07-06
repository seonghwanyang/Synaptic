import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCaptureStore } from '@/lib/stores/captureStore';
import { toast } from 'sonner';

interface ShortcutOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(options: ShortcutOptions = {}) {
  const { enabled = true, preventDefault = true } = options;
  const { isOpen, openCapture, closeCapture, setMode } = useCaptureStore();

  // Main capture shortcut: Cmd/Ctrl + Shift + N
  useHotkeys(
    'mod+shift+n',
    (e) => {
      if (preventDefault) e.preventDefault();
      if (!isOpen) {
        openCapture();
        toast.info('Quick Capture opened (Esc to close)');
      }
    },
    {
      enabled,
      enableOnFormTags: false,
    }
  );

  // Quick mode shortcuts when capture is open
  useHotkeys(
    'mod+1',
    (e) => {
      if (preventDefault) e.preventDefault();
      if (isOpen) {
        setMode('text');
      }
    },
    {
      enabled: enabled && isOpen,
    }
  );

  useHotkeys(
    'mod+2',
    (e) => {
      if (preventDefault) e.preventDefault();
      if (isOpen) {
        setMode('voice');
      }
    },
    {
      enabled: enabled && isOpen,
    }
  );

  useHotkeys(
    'mod+3',
    (e) => {
      if (preventDefault) e.preventDefault();
      if (isOpen) {
        setMode('image');
      }
    },
    {
      enabled: enabled && isOpen,
    }
  );

  // Save shortcut: Cmd/Ctrl + S (when capture is open)
  useHotkeys(
    'mod+s',
    (e) => {
      if (preventDefault) e.preventDefault();
      if (isOpen) {
        // Trigger save by dispatching custom event
        window.dispatchEvent(new CustomEvent('quick-capture-save'));
      }
    },
    {
      enabled: enabled && isOpen,
      enableOnFormTags: true,
    }
  );

  // Escape to close
  useHotkeys(
    'escape',
    (e) => {
      if (preventDefault) e.preventDefault();
      if (isOpen) {
        closeCapture();
      }
    },
    {
      enabled: enabled && isOpen,
      enableOnFormTags: true,
    }
  );

  // Show available shortcuts
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Show help with ?
      if (e.key === '?' && !isOpen) {
        toast.info(
          <div className="space-y-1">
            <p className="font-semibold">Keyboard Shortcuts:</p>
            <p className="text-sm">⌘/Ctrl + Shift + N: Open Quick Capture</p>
            <p className="text-sm">⌘/Ctrl + 1/2/3: Switch modes (when open)</p>
            <p className="text-sm">⌘/Ctrl + S: Save capture</p>
            <p className="text-sm">Esc: Close capture</p>
          </div>,
          { duration: 5000 }
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, isOpen]);

  return {
    shortcuts: {
      openCapture: 'Cmd/Ctrl + Shift + N',
      textMode: 'Cmd/Ctrl + 1',
      voiceMode: 'Cmd/Ctrl + 2',
      imageMode: 'Cmd/Ctrl + 3',
      save: 'Cmd/Ctrl + S',
      close: 'Esc',
      help: '?',
    },
  };
}