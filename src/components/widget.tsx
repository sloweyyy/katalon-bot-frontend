import { useState } from 'react';
import { MessageSquare, X, Maximize2, Minimize2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { sendMcpChatMessage } from '@/lib/api';

interface Message {
  content: string;
  isUser: boolean;
  id: string;
  timestamp?: number;
}

interface ChatHistory {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

const SYSTEM_INSTRUCTION = `
Respond concisely and professionally to Katalon-related questions.
`;

interface WidgetProps {
  isEnabled?: boolean;
}

export function Widget({ isEnabled = true }: WidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const sessionId = uuidv4();

  const getChatHistory = (msgs: Message[]): ChatHistory[] => {
    return msgs.map((msg) => ({
      role: msg.isUser ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setInputValue('');

    const userMessage: Message = {
      content: message,
      isUser: true,
      id: uuidv4(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await sendMcpChatMessage({
        sessionId,
        message,
        systemInstruction: SYSTEM_INSTRUCTION,
        history: getChatHistory(messages),
      });

      const botResponse: Message = {
        content: res.answer,
        isUser: false,
        id: uuidv4(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch {
      const errorMessage: Message = {
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        id: uuidv4(),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return isEnabled ? (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-all"
          aria-label="Open support chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}

      {isOpen && (
        <div
          className={cn(
            'bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-200',
            isExpanded ? 'w-[380px] h-[480px]' : 'w-72 h-96',
          )}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-800 text-white rounded-t-lg">
            <h3 className="font-medium">Katalon Assistant</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white/80 hover:text-white"
                aria-label={isExpanded ? 'Minimize chat' : 'Expand chat'}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                <p>How can I help with Katalon today?</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex w-full',
                      message.isUser ? 'justify-end' : 'justify-start',
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] px-3 py-2 rounded-2xl text-sm',
                        message.isUser
                          ? 'bg-gray-200 text-gray-900 rounded-br-none'
                          : 'bg-gray-100 text-gray-900 rounded-bl-none',
                      )}
                    >
                      {isLoading && !message.content ? (
                        <span className="inline-block animate-pulse">...</span>
                      ) : (
                        message.content
                      )}
                    </div>
                    {message.isUser && (
                      <div className="w-7 h-7 rounded-full bg-gray-600 text-white ml-2 flex items-center justify-center text-xs">
                        U
                      </div>
                    )}
                  </div>
                ))}
                {isLoading &&
                  !messages.some((m) => isLoading && !m.content) && (
                    <div className="flex w-full justify-start">
                      <div className="max-w-[85%] px-3 py-2 rounded-2xl text-sm bg-gray-100 text-gray-900 rounded-bl-none">
                        <span className="inline-block animate-pulse">...</span>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>

          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything"
                className="w-full p-2 pl-3 pr-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSendMessage(inputValue);
                  }
                }}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
}
