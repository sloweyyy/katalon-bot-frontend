"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { Header } from "@/components/header";
import { ChatModel, ChatMode } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { sendGeminiChatMessage, sendMcpChatMessage } from "@/lib/api";
import { Cpu, Sparkles } from "lucide-react";

interface Message {
	content: string;
	isUser: boolean;
	id: string;
	timestamp?: number;
}

interface ChatHistory {
	role: "user" | "model";
	parts: Array<{ text: string }>;
}

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

function getOrCreateSessionId() {
	if (typeof window === "undefined") return "";
	let sessionId = localStorage.getItem("chat_session_id");
	if (!sessionId) {
		sessionId = uuidv4();
		localStorage.setItem("chat_session_id", sessionId);
	}
	return sessionId;
}

export default function Home() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedModel, setSelectedModel] = useState<ChatModel>("gemini");
	const [selectedMode, setSelectedMode] = useState<ChatMode>("mcp");
	const firstMessageRef = useRef<HTMLDivElement>(null);
	const sessionId = getOrCreateSessionId();

	// Convert messages to Gemini chat history format
	const getChatHistory = (msgs: Message[]): ChatHistory[] => {
		return msgs.map((msg) => ({
			role: msg.isUser ? "user" : "model",
			parts: [{ text: msg.content }],
		}));
	};

	const handleSendMessage = async (message: string) => {
		setIsLoading(true);
		const newMessage: Message = {
			content: message,
			isUser: true,
			id: uuidv4(),
			timestamp: Date.now(),
		};

		setMessages((prev) => [...prev, newMessage]);

		try {
			const sendMessage =
				selectedMode === "gemini" ? sendGeminiChatMessage : sendMcpChatMessage;
			const res = await sendMessage({
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
				content:
					"I apologize, but I encountered an error. Could you please rephrase your question?",
				isUser: false,
				id: uuidv4(),
				timestamp: Date.now(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (messages.length === 2 && firstMessageRef.current) {
			firstMessageRef.current.classList.add("animate-fade-in");
		}
	}, [messages]);

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
			<Header
				selectedModel={selectedModel}
				setSelectedModel={setSelectedModel}
				selectedMode={selectedMode}
				setSelectedMode={setSelectedMode}
			/>

			{/* Main Chat Area with top padding to account for fixed header */}
			<div className="flex-1 flex flex-col items-center justify-center px-2 pt-20">
				<div className="w-full max-w-3xl flex flex-col flex-1 justify-end mx-auto">
					{messages.length === 0 && !isLoading ? (
						<div className="flex flex-col items-center justify-center flex-1 mt-24 transition-all duration-500">
							<h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
								What can I help with?
							</h1>
							<div className="text-sm mb-4 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
								<span>Using</span>
								<span
									className={`font-medium flex items-center gap-1 ${
										selectedMode === "mcp" ? "text-purple-500" : "text-blue-500"
									}`}
								>
									{selectedMode === "mcp" ? (
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
							<div className="w-full flex justify-center">
								<ChatInput onSubmit={handleSendMessage} isLoading={isLoading} />
							</div>
						</div>
					) : (
						<>
							<div className="flex flex-col gap-2 w-full pb-28">
								{messages.map((message, index) => (
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
							{/* Floating Chat Input at bottom */}
							<div className="fixed bottom-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
								<div className="w-full max-w-3xl pointer-events-auto">
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
		</main>
	);
}
