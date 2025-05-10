'use client';

import { ChatInput } from '@/components/chat-input';
import { ChatMessage } from '@/components/chat-message';
import { Header } from '@/components/header';
import { ChatModel, ChatMode } from '@/lib/utils';
import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  sendChatMessage,
  Message,
  ChatConfig,
  ChatSession,
  createChatSession,
  getChatSessions,
  getChatSession,
  addMessageToChatSession,
  generateTitle,
} from '@/lib/api';
import { Cpu, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { ChatSidebar } from '@/components/chat-sidebar';
import { useUser } from '@/providers/user-provider';

const SYSTEM_INSTRUCTION = `
Tone and Style: Always maintain a polite, professional, and empathetic tone. Be patient and actively listen to customer concerns. Use simple, clear, and friendly language.

Response Goals:
- Provide comprehensive, well-structured answers
- Include relevant examples and use cases
- Break down complex topics into digestible sections
- Use proper formatting (headers, lists, code blocks) for clarity
- Add relevant technical details when appropriate
- Include step-by-step instructions when applicable
- Reference official documentation when relevant
- Ensure the customer feels heard, understood, and valued
- Maintain the company's positive brand image

Response Structure:
1. Start with a warm greeting and acknowledgment of the question
2. Provide a brief overview/summary of the answer
3. Break down the main content into clear sections with headers
4. Include practical examples or step-by-step instructions
5. Add relevant technical details or specifications
6. Reference documentation or additional resources
7. Conclude with a summary and invitation for follow-up questions

Behavior Guidelines:
- Always greet the customer warmly at the beginning and thank them at the end
- Confirm your understanding of their issue by paraphrasing or summarizing it
- If you don't know the answer, reassure the customer and escalate internally — never guess
- Use positive language: focus on what can be done rather than what can't
- Keep responses organized and well-structured
- Use markdown formatting effectively:
  * Headers for sections
  * Lists for steps or multiple points
  * Code blocks for technical content
  * Bold for emphasis
  * Tables for comparing options
  * Blockquotes for important notes

Handling Difficult Situations:
- Stay calm and never argue
- Acknowledge the customer's frustration and apologize for the inconvenience
- Offer solutions or next steps clearly and quickly
- Provide alternative approaches when possible

Knowledge Management:
- Always use the latest support articles, FAQs, or internal resources
- Include links to relevant documentation
- Provide context for technical terms
- Explain concepts thoroughly but clearly

Context Management:
- Maintain full conversation history for context
- Reference previous messages when relevant
- Build upon previous explanations
- Ensure continuity in multi-turn conversations
- Use the extended context window effectively
- Maintain coherent thread of discussion

Security and Privacy:
- Never ask for sensitive information unless necessary
- Follow company policies regarding data protection
- Mask any sensitive data in examples

KPIs to Keep in Mind:
- First Response Time
- Customer Satisfaction (CSAT)
- Resolution Time
- Escalation Rate
- Response Completeness
- Technical Accuracy
- Clarity of Communication
`;

export default function Home() {
  const { userId, isLoaded } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ChatModel>('gemini');
  const [selectedMode, setSelectedMode] = useState<ChatMode>(() => {
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('selectedMode');
      return (storedMode as ChatMode) || 'mcp';
    }
    return 'mcp';
  });
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const firstMessageRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem('selectedMode', selectedMode);
  }, [selectedMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebarOpen');
      if (stored !== null) {
        setSidebarOpen(JSON.parse(stored));
      } else {
        setSidebarOpen(window.innerWidth >= 1024);
      }
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      localStorage.setItem('sidebarOpen', JSON.stringify(!prev));
      return !prev;
    });
  }, []);

  const createNewChat = useCallback(async () => {
    if (!userId) return;

    console.log('Creating new chat with mode:', selectedMode);

    const newSessionId = uuidv4();
    setCurrentSessionId(newSessionId);
    setMessages([]);

    try {
      const config: ChatConfig = {
        model: selectedModel,
        mode: selectedMode,
      };

      console.log('New chat config:', config);

      await createChatSession(userId, newSessionId, 'New Chat', config);

      const sessions = await getChatSessions(userId);
      setChatSessions(sessions);
    } catch (error) {
      console.error('Failed to create new chat session:', error);
    }
  }, [userId, selectedModel, selectedMode]);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const initializeChat = async () => {
      setIsFetchingHistory(true);
      try {
        const sessions = await getChatSessions(userId);
        setChatSessions(sessions);

        if (sessions.length > 0) {
          const mostRecentSession = sessions[0];
          setCurrentSessionId(mostRecentSession.id);
          setMessages(mostRecentSession.messages);
          setSelectedModel(mostRecentSession.config.model as ChatModel);
          const storedMode = localStorage.getItem('selectedMode');
          if (!storedMode) {
            setSelectedMode(mostRecentSession.config.mode as ChatMode);
          }
        } else {
          createNewChat();
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
        createNewChat();
      } finally {
        setIsFetchingHistory(false);
      }
    };

    initializeChat();
  }, [userId, isLoaded, createNewChat]);

  const refreshSessions = useCallback(async () => {
    if (!userId || isRefreshing) return;

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        setIsRefreshing(true);
        setIsFetchingHistory(true);
        const sessions = await getChatSessions(userId);
        setChatSessions(sessions);
      } catch (error) {
        console.error('Failed to refresh chat sessions:', error);
      } finally {
        setIsFetchingHistory(false);
        setIsRefreshing(false);
        refreshTimeoutRef.current = null;
      }
    }, 300);
  }, [userId, isRefreshing]);

  useEffect(() => {
    const updateConfig = async () => {
      if (!userId || !currentSessionId || messages.length === 0) return;

      try {
        const session = await getChatSession(userId, currentSessionId);

        // Skip if the last message is a config update
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.content === '__config_update__') {
          return;
        }

        if (
          session.config.model !== selectedModel ||
          session.config.mode !== selectedMode
        ) {
          console.log('Updating session config to match UI selection');

          const updatedSessions = chatSessions.map((s) => {
            if (s.id === currentSessionId) {
              return {
                ...s,
                config: {
                  model: selectedModel,
                  mode: selectedMode,
                },
              };
            }
            return s;
          });
          setChatSessions(updatedSessions);

          const dummyUpdateMessage: Message = {
            content: '__config_update__',
            isUser: false,
            id: uuidv4(),
            timestamp: Date.now(),
          };

          await addMessageToChatSession(
            userId,
            currentSessionId,
            dummyUpdateMessage,
          );

          setMessages((prev) => [...prev, dummyUpdateMessage]);
        }
      } catch (error) {
        console.error('Failed to update chat config:', error);
      }
    };

    updateConfig();
  }, [selectedModel, selectedMode]);

  const updateChatConfig = async (
    session: ChatSession,
    modelToUse: ChatModel,
    modeToUse: ChatMode,
  ) => {
    try {
      console.log('updateChatConfig called with:', {
        sessionId: session.id,
        modelToUse,
        modeToUse,
      });

      const currentSession = await getChatSession(userId, session.id);
      console.log('Current session config:', currentSession.config);

      // Don't update if the config is already correct
      if (
        currentSession.config.model === modelToUse &&
        currentSession.config.mode === modeToUse
      ) {
        console.log('Config already matches, no update needed');
        return;
      }

      console.log('Updating session config to:', {
        model: modelToUse,
        mode: modeToUse,
      });

      // Update the sessions list in state
      const updatedSessions = chatSessions.map((s) => {
        if (s.id === session.id) {
          return {
            ...s,
            config: {
              model: modelToUse,
              mode: modeToUse,
            },
          };
        }
        return s;
      });
      setChatSessions(updatedSessions);

      // Only update the UI state if this is the current session
      if (session.id === currentSessionId) {
        console.log('This is the current session, updating UI state');
        setSelectedModel(modelToUse);
        setSelectedMode(modeToUse);
      }

      // Add a dummy message to trigger a save
      const configUpdateMessage: Message = {
        content: '__config_update__',
        isUser: false,
        id: uuidv4(),
        timestamp: Date.now(),
      };

      await addMessageToChatSession(userId, session.id, configUpdateMessage);
      console.log('Config update saved to backend');
    } catch (error) {
      console.error('Failed to update chat config:', error);
    }
  };

  const selectChatSession = async (sessionId: string) => {
    if (!userId || currentSessionId === sessionId) return;

    try {
      const sessionExists = chatSessions.some(
        (session) => session.id === sessionId,
      );

      if (!sessionExists) {
        console.error('Chat session not found in current list');
        const refreshedSessions = await getChatSessions(userId);
        setChatSessions(refreshedSessions);

        if (refreshedSessions.length > 0) {
          const firstSession = refreshedSessions[0];
          setCurrentSessionId(firstSession.id);
          setMessages(firstSession.messages);
        } else {
          createNewChat();
        }
        return;
      }

      // Keep the current mode and model selections
      const currentModel = selectedModel;
      const currentMode = selectedMode;

      const session = await getChatSession(userId, sessionId);

      setCurrentSessionId(sessionId);
      setMessages(session.messages);

      // Update the session config to match the user's current selections
      if (
        session.config.model !== currentModel ||
        session.config.mode !== currentMode
      ) {
        await updateChatConfig(session, currentModel, currentMode);
      }
    } catch (error) {
      console.error('Failed to load chat session:', error);

      const updatedSessions = chatSessions.filter(
        (session) => session.id !== sessionId,
      );
      setChatSessions(updatedSessions);

      if (updatedSessions.length > 0) {
        try {
          const firstSession = await getChatSession(
            userId,
            updatedSessions[0].id,
          );
          setCurrentSessionId(updatedSessions[0].id);
          setMessages(firstSession.messages);
        } catch {
          createNewChat();
        }
      } else {
        createNewChat();
      }
    }
  };

  const getChatHistory = (
    msgs: Message[],
  ): Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }> => {
    return msgs.map((msg) => ({
      role: msg.isUser ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
  };

  const handleSendMessage = async (message: string) => {
    if (!userId || !currentSessionId) return;

    setIsLoading(true);
    const newMessage: Message = {
      content: message,
      isUser: true,
      id: uuidv4(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      await addMessageToChatSession(userId, currentSessionId, newMessage);

      if (messages.length === 0) {
        generateTitle(userId, currentSessionId, message)
          .then(async () => {
            try {
              setTimeout(async () => {
                const updatedSessions = await getChatSessions(userId);
                setChatSessions(updatedSessions);
              }, 1000);
            } catch (error) {
              console.error(
                'Failed to refresh sessions after title generation:',
                error,
              );
            }
          })
          .catch((error) => {
            console.error('Failed to generate title:', error);
          });
      }

      console.log(`Selected mode: ${selectedMode}`);

      const res = await sendChatMessage(
        {
          sessionId: currentSessionId,
          message,
          systemInstruction: SYSTEM_INSTRUCTION,
          history: getChatHistory(messages),
        },
        selectedMode,
      );

      const botResponse: Message = {
        content: res.answer,
        isUser: false,
        id: uuidv4(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botResponse]);

      await addMessageToChatSession(userId, currentSessionId, botResponse);

      const sessions = await getChatSessions(userId);
      setChatSessions(sessions);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        content:
          'I apologize, but I encountered an error. Could you please rephrase your question?',
        isUser: false,
        id: uuidv4(),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      await addMessageToChatSession(userId, currentSessionId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length === 2 && firstMessageRef.current) {
      firstMessageRef.current.classList.add('animate-fade-in');
    }
  }, [messages]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Header
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        onShowSidebar={() => {
          setSidebarOpen(true);
          localStorage.setItem('sidebarOpen', JSON.stringify(true));
        }}
        className="flex-shrink-0 fixed top-0 left-0 right-0 z-30"
      />

      <div className="flex flex-1 h-screen pt-16">
        <div
          className={`
						lg:relative fixed top-0 inset-y-0 left-0 z-20 w-64
						bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
						transform transition-transform duration-300 lg:transition-none
						${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'}
					`}
        >
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-gray-900/50 lg:hidden z-10"
              onClick={() => {
                setSidebarOpen(false);
                localStorage.setItem('sidebarOpen', JSON.stringify(false));
              }}
            />
          )}

          <div className="relative z-20 h-full">
            <ChatSidebar
              sessions={chatSessions}
              currentSessionId={currentSessionId}
              onSelectSession={selectChatSession}
              onNewChat={createNewChat}
              onDelete={refreshSessions}
              isLoading={isFetchingHistory}
              onClose={() => {
                setSidebarOpen(false);
                localStorage.setItem('sidebarOpen', JSON.stringify(false));
              }}
            />
          </div>
        </div>

        <div
          className={`
					hidden lg:block absolute top-[5.5rem] z-20 transition-all duration-300
					${sidebarOpen ? 'left-[256px] ml-2' : 'left-4'}
				`}
        >
          <button
            onClick={toggleSidebar}
            className={`
							p-2 rounded-full bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 
							text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200
							transition-all duration-200 shadow-md border border-gray-200 dark:border-gray-700
						`}
            aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="w-full max-w-3xl flex flex-col flex-1 justify-end px-4 sm:px-6 relative mx-auto">
            {messages.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center flex-1 mt-24 transition-all duration-500">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                  What can I help with?
                </h1>
                <div className="text-sm mb-4 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                  <span>Using</span>
                  <span
                    className={`font-medium flex items-center gap-1 ${
                      selectedMode === 'mcp'
                        ? 'text-purple-500'
                        : 'text-blue-500'
                    }`}
                  >
                    {selectedMode === 'mcp' ? (
                      <>
                        <Cpu className="h-4 w-4" /> MCP Mode
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Gemini Mode
                      </>
                    )}
                  </span>
                </div>
                <div className="w-full max-w-2xl flex justify-center mx-auto">
                  <ChatInput
                    onSubmit={handleSendMessage}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2 w-full pb-28 pt-4">
                  {messages
                    .filter(
                      (message) => message.content !== '__config_update__',
                    )
                    .map((message, index) => (
                      <div
                        key={message.id}
                        ref={index === 1 ? firstMessageRef : undefined}
                      >
                        <ChatMessage
                          message={message.content}
                          isUser={message.isUser}
                          isLoading={false}
                        />
                      </div>
                    ))}
                  {isLoading && (
                    <ChatMessage message="" isUser={false} isLoading={true} />
                  )}
                </div>
                <div className="absolute bottom-4 left-0 right-0 px-4 sm:px-6 pointer-events-none">
                  <div className="w-full pointer-events-auto">
                    <ChatInput
                      onSubmit={handleSendMessage}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
