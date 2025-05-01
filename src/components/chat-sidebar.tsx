'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ChatSession,
  deleteChatSession,
  updateChatSessionTitle,
} from '@/lib/api';
import { useUser } from '@/providers/user-provider';
import {
  Archive,
  MoreHorizontal,
  Plus,
  Clock,
  Edit,
  Check,
  X,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDelete?: () => void;
  isLoading: boolean;
  onClose?: () => void;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDelete,
  isLoading,
  onClose,
}: ChatSidebarProps) {
  const { userId } = useUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null,
  );
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const refreshedRef = useRef(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onDelete && !isLoading && !refreshedRef.current) {
      refreshedRef.current = true;
      onDelete();
    }
  }, [onDelete, isLoading]);

  useEffect(() => {
    if (editingSessionId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingSessionId]);

  const handleDeleteSession = async (sessionId: string) => {
    try {
      setDeletingSessionId(sessionId);
      await deleteChatSession(userId, sessionId);

      if (sessionId === currentSessionId) {
        onNewChat();
      }

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    } finally {
      setShowDeleteConfirm(null);
      setDeletingSessionId(null);
    }
  };

  const startEditing = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditingTitle(session.title || 'New Chat');
  };

  const cancelEditing = () => {
    setEditingSessionId(null);
    setEditingTitle('');
  };

  const saveTitle = async (sessionId: string) => {
    if (!editingTitle.trim()) {
      setEditingTitle('New Chat');
    }

    try {
      await updateChatSessionTitle(userId, sessionId, editingTitle.trim());

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Failed to update chat title:', error);
    } finally {
      setEditingSessionId(null);
    }
  };

  return (
    <div className="w-64 h-full flex flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="flex-shrink-0 pt-0 p-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={onNewChat}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="font-medium text-sm">New Chat</span>
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex items-center justify-center h-20 text-gray-500 dark:text-gray-400">
            Loading history...
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400 text-center p-4">
            <Archive className="h-8 w-8 mb-2 text-gray-400 dark:text-gray-600" />
            <p>No chat history yet</p>
            <p className="text-xs mt-1">
              Start a new conversation to see your history here
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {sessions.map((session) => (
              <li key={session.id} className="relative">
                {showDeleteConfirm === session.id ? (
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-700 dark:text-red-300 mb-2">
                      Delete this chat?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        disabled={deletingSessionId === session.id}
                        className={`flex-1 py-1 px-2 text-white text-xs rounded-md ${
                          deletingSessionId === session.id
                            ? 'bg-red-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {deletingSessionId === session.id
                          ? 'Deleting...'
                          : 'Delete'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        disabled={deletingSessionId === session.id}
                        className="flex-1 py-1 px-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : editingSessionId === session.id ? (
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        placeholder="Chat name"
                        className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveTitle(session.id);
                          } else if (e.key === 'Escape') {
                            cancelEditing();
                          }
                        }}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEditing}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => saveTitle(session.id)}
                        className="p-1 text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                        title="Save"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`relative ${
                      deletingSessionId === session.id ? 'opacity-50' : ''
                    }`}
                  >
                    <button
                      onClick={() => onSelectSession(session.id)}
                      disabled={deletingSessionId === session.id}
                      className={cn(
                        'w-full text-left rounded-md p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors overflow-hidden disabled:cursor-not-allowed',
                        currentSessionId === session.id
                          ? 'bg-gray-200 dark:bg-gray-700'
                          : '',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate text-sm text-gray-900 dark:text-white flex-1">
                          {session.title ||
                            (session.messages.length === 0
                              ? 'Loading title...'
                              : 'Untitled Chat')}
                        </span>
                        <div className="flex items-center">
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(session);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation();
                                startEditing(session);
                              }
                            }}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer mr-1"
                            aria-label="Edit chat name"
                          >
                            <Edit className="h-3 w-3" />
                          </div>
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(session.id);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation();
                                setShowDeleteConfirm(session.id);
                              }
                            }}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                            aria-label="Delete chat"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {formatDistanceToNow(new Date(session.updated), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <div className="text-xs mt-1 text-gray-500 dark:text-gray-400 truncate">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mr-1">
                          {session.config.mode}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                          {session.config.model}
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
