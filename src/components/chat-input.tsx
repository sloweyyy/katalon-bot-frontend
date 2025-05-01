'use client';

import { SendIcon, Mic } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  previewOnly?: boolean;
}

export function ChatInput({
  onSubmit,
  isLoading,
  previewOnly,
}: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !previewOnly) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 px-6 py-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full shadow-lg w-full focus-within:ring-2 focus-within:ring-gray-200 dark:focus-within:ring-gray-700 transition-all"
      style={{ minHeight: 56 }}
    >
      <input
        type="text"
        value={previewOnly ? '' : input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything"
        className="flex-1 bg-transparent outline-none border-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base px-0"
        disabled={isLoading || previewOnly}
        autoFocus={!previewOnly}
      />
      <button
        type="button"
        tabIndex={-1}
        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Mic"
        disabled={isLoading || previewOnly}
      >
        <Mic className="h-5 w-5" />
      </button>
      <button
        type="submit"
        disabled={!input.trim() || isLoading || previewOnly}
        className="rounded-full p-2 text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Send"
      >
        <SendIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
