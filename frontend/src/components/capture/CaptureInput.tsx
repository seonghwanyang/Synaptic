'use client';

import { useEffect, useRef, useState } from 'react';
import { useCaptureStore } from '@/lib/stores/captureStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export function CaptureInput() {
  const { currentCapture, updateCurrentCapture } = useCaptureStore();
  const [content, setContent] = useState(currentCapture?.content || '');
  const [tags, setTags] = useState<string[]>(currentCapture?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      updateCurrentCapture({ content, tags });
    }, 2000); // 2 second debounce

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, tags, updateCurrentCapture]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleTagSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="capture-content">What's on your mind?</Label>
        <textarea
          ref={textareaRef}
          id="capture-content"
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing your thoughts..."
          className="min-h-[200px] w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-coral-500 focus:outline-none focus:ring-2 focus:ring-coral-500/20 dark:border-gray-700 dark:bg-gray-900 dark:placeholder:text-gray-500"
          style={{ height: 'auto' }}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Supports Markdown formatting • Auto-saves after 2 seconds
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="capture-tags">Tags</Label>
        <div className="space-y-2">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 rounded-full p-0.5 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <Input
            id="capture-tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagSubmit}
            placeholder="Add tags (press Enter)"
            className="h-9"
          />
        </div>
      </div>

      {/* Character count */}
      <div className="text-right text-xs text-gray-500 dark:text-gray-400">
        {content.length} characters
      </div>
    </div>
  );
}