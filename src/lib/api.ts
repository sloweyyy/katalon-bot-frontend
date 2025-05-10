export interface ChatRequest {
  sessionId: string;
  message: string;
  systemInstruction?: string;
  history?: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
}

export interface ChatResponse {
  answer: string;
}

export interface Message {
  content: string;
  isUser: boolean;
  id: string;
  timestamp: number;
}

export interface ChatConfig {
  model: string;
  mode: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  config: ChatConfig;
  created: number;
  updated: number;
}

export async function sendGeminiChatMessage(
  req: ChatRequest,
): Promise<ChatResponse> {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/mcp/ask/gemini',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    },
  );
  if (!res.ok) throw new Error('Failed to send message to Gemini');
  return res.json();
}

export async function sendMcpChatMessage(
  req: ChatRequest,
): Promise<ChatResponse> {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/mcp/ask/mcp',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    },
  );
  if (!res.ok) throw new Error('Failed to send message to MCP');
  return res.json();
}

export async function sendChatMessage(
  req: ChatRequest,
  mode: string = 'mcp',
): Promise<ChatResponse> {
  if (mode === 'gemini') {
    console.log('Using Gemini API');
    return sendGeminiChatMessage(req);
  } else {
    console.log('Using MCP API');
    return sendMcpChatMessage(req);
  }
}

export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-history/sessions?userId=${userId}`,
  );
  if (!res.ok) throw new Error('Failed to fetch chat sessions');
  return res.json();
}

export async function getChatSession(
  userId: string,
  sessionId: string,
): Promise<ChatSession> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-history/sessions/${sessionId}?userId=${userId}`,
  );
  if (!res.ok) throw new Error('Failed to fetch chat session');
  return res.json();
}

export async function createChatSession(
  userId: string,
  sessionId: string,
  title: string,
  config: ChatConfig,
): Promise<ChatSession> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-history/sessions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, sessionId, title, config }),
    },
  );
  if (!res.ok) throw new Error('Failed to create chat session');
  return res.json();
}

export async function addMessageToChatSession(
  userId: string,
  sessionId: string,
  message: Message,
): Promise<ChatSession> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-history/sessions/${sessionId}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, message }),
    },
  );
  if (!res.ok) throw new Error('Failed to add message to chat session');
  return res.json();
}

export async function updateChatSessionTitle(
  userId: string,
  sessionId: string,
  title: string,
): Promise<ChatSession> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-history/sessions/${sessionId}/title`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title }),
    },
  );
  if (!res.ok) throw new Error('Failed to update chat session title');
  return res.json();
}

export async function deleteChatSession(
  userId: string,
  sessionId: string,
): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-history/sessions/${sessionId}?userId=${userId}`,
    {
      method: 'DELETE',
    },
  );
  if (!res.ok) throw new Error('Failed to delete chat session');
}

export async function generateTitle(
  userId: string,
  sessionId: string,
  firstMessage: string,
): Promise<string> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-history/generate-title`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, sessionId, firstMessage }),
    },
  );
  if (!res.ok) throw new Error('Failed to generate title');
  const data = await res.json();
  return data.title;
}

export async function updateChatSessionConfig(
  userId: string,
  sessionId: string,
  config: ChatConfig,
): Promise<ChatSession> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-history/sessions/${sessionId}/config`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, config }),
    },
  );
  if (!res.ok) throw new Error('Failed to update chat session config');
  return res.json();
}
