import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type ChatModel = "gemini" | "gpt-3.5-turbo" | "gpt-4";
export type ChatMode = "gemini" | "mcp";
