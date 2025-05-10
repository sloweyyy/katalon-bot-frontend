'use client';

import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const KATALON_DOCS_BASE_URL = 'https://docs.katalon.com';

function parseMcpResponse(message: string): string {
  try {
    if (message.includes('<result>')) {
      const startText = message.indexOf('<text>');
      const endText = message.indexOf('</text>');
      if (startText !== -1 && endText !== -1) {
        return message.substring(startText + 6, endText).trim();
      }
    }
    return message;
  } catch (error) {
    console.error('Error parsing MCP response:', error);
    return message;
  }
}

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isLoading?: boolean;
}

export function ChatMessage({ message, isUser, isLoading }: ChatMessageProps) {
  const parsedMessage = isUser ? message : parseMcpResponse(message);

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      } items-start gap-4`}
    >
      <div
        className={`rounded-2xl px-4 py-2 max-w-[85%] ${
          isUser
            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none overflow-x-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {children}
                  </td>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5">
                    {children}
                  </code>
                ),
                a: ({ href, children }) => {
                  const fullHref = href?.startsWith('/')
                    ? `${KATALON_DOCS_BASE_URL}${href}`
                    : href;

                  const isConfigLink = href?.includes('network-configuration');
                  return (
                    <a
                      href={fullHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${
                        isConfigLink
                          ? 'text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2'
                          : 'text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline'
                      }`}
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {parsedMessage}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
