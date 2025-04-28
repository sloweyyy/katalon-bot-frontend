export interface ChatRequest {
	sessionId: string;
	message: string;
	systemInstruction?: string;
	history?: Array<{
		role: "user" | "model";
		parts: Array<{ text: string }>;
	}>;
}

export interface ChatResponse {
	answer: string;
}

export async function sendGeminiChatMessage(
	req: ChatRequest
): Promise<ChatResponse> {
	const res = await fetch(
		process.env.NEXT_PUBLIC_BACKEND_URL + "/mcp/ask/gemini",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(req),
		}
	);
	if (!res.ok) throw new Error("Failed to send message to Gemini");
	return res.json();
}

export async function sendMcpChatMessage(
	req: ChatRequest
): Promise<ChatResponse> {
	const res = await fetch(
		process.env.NEXT_PUBLIC_BACKEND_URL + "/mcp/ask/mcp",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(req),
		}
	);
	if (!res.ok) throw new Error("Failed to send message to MCP");
	return res.json();
}

// Legacy function for backward compatibility
export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
	return sendMcpChatMessage(req); // Default to MCP for existing usage
}
