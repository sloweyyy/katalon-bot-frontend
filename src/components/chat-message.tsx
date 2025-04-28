"use client";

import { cn } from "@/lib/utils";
import { Bot, User, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { useState } from "react";

interface ChatMessageProps {
	message: string;
	isUser: boolean;
	isLoading?: boolean;
}

export function ChatMessage({ message, isUser, isLoading }: ChatMessageProps) {
	const [copied, setCopied] = useState(false);

	function parseResultXml(msg: string): { uri: string; text: string } | null {
		try {
			// Fixed regex pattern with matching opening and closing tags
			const regex =
				/<result>\s*<uri>(.*?)<\/uri>\s*<text>([\s\S]*?)<\/text>\s*<\/result>/i;
			const resultMatch = msg.match(regex);

			if (resultMatch && resultMatch.length >= 3) {
				return {
					uri: resultMatch[1].trim(),
					text: resultMatch[2].trim(),
				};
			}
		} catch (error) {
			console.error("Error parsing XML:", error);
		}
		return null;
	}

	const parsed = parseResultXml(message);

	// Define markdown components configuration once to avoid duplication
	const markdownComponents: Components = {
		pre: ({ children, ...props }) => (
			<pre
				className="bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto my-3 font-mono text-sm"
				{...props}
			>
				{children}
			</pre>
		),
		code: ({ children, ...props }) => (
			<code
				className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-1.5 py-0.5 rounded font-mono text-sm"
				{...props}
			>
				{children}
			</code>
		),
		ul: ({ children, ...props }) => (
			<ul className="list-disc pl-6 space-y-1.5 my-3" {...props}>
				{children}
			</ul>
		),
		ol: ({ children, ...props }) => (
			<ol className="list-decimal pl-6 space-y-1.5 my-3" {...props}>
				{children}
			</ol>
		),
		li: ({ children, ...props }) => (
			<li className="my-1" {...props}>
				{children}
			</li>
		),
		h1: ({ children, ...props }) => (
			<h1
				className="text-xl font-bold my-4 text-gray-900 dark:text-gray-100"
				{...props}
			>
				{children}
			</h1>
		),
		h2: ({ children, ...props }) => (
			<h2
				className="text-lg font-bold my-3 text-gray-900 dark:text-gray-100"
				{...props}
			>
				{children}
			</h2>
		),
		h3: ({ children, ...props }) => (
			<h3
				className="text-base font-bold my-2 text-gray-900 dark:text-gray-100"
				{...props}
			>
				{children}
			</h3>
		),
		h4: ({ children, ...props }) => (
			<h4
				className="text-sm font-bold my-2 text-gray-900 dark:text-gray-100"
				{...props}
			>
				{children}
			</h4>
		),
		p: ({ children, ...props }) => (
			<p
				className="my-2 text-gray-800 dark:text-gray-200 leading-relaxed"
				{...props}
			>
				{children}
			</p>
		),
		a: ({ children, ...props }) => (
			<a
				className="text-gray-700 dark:text-gray-300 underline hover:text-black dark:hover:text-white"
				{...props}
			>
				{children}
			</a>
		),
		blockquote: ({ children, ...props }) => (
			<blockquote
				className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-3 text-gray-700 dark:text-gray-300"
				{...props}
			>
				{children}
			</blockquote>
		),
		table: ({ children, ...props }) => (
			<div className="overflow-x-auto my-3">
				<table className="min-w-full border-collapse" {...props}>
					{children}
				</table>
			</div>
		),
		thead: ({ children, ...props }) => (
			<thead className="bg-gray-200 dark:bg-gray-700" {...props}>
				{children}
			</thead>
		),
		tbody: ({ children, ...props }) => (
			<tbody
				className="divide-y divide-gray-300 dark:divide-gray-600"
				{...props}
			>
				{children}
			</tbody>
		),
		tr: ({ children, ...props }) => (
			<tr className="border-b border-gray-300 dark:border-gray-600" {...props}>
				{children}
			</tr>
		),
		th: ({ children, ...props }) => (
			<th className="px-2 py-1 text-left font-semibold" {...props}>
				{children}
			</th>
		),
		td: ({ children, ...props }) => (
			<td className="px-2 py-1" {...props}>
				{children}
			</td>
		),
	};

	return (
		<div
			className={cn(
				"flex w-full gap-3 my-4",
				isUser ? "justify-end" : "justify-start"
			)}
		>
			{!isUser && (
				<div className="flex-shrink-0 flex items-end">
					<Bot className="h-7 w-7 text-white bg-gray-800 rounded-full p-1.5" />
				</div>
			)}
			<div
				className={cn(
					"max-w-[95%] px-5 py-3 rounded-2xl text-base shadow-sm border transition-colors duration-300 group relative",
					isUser
						? "bg-gray-200 text-gray-900 rounded-br-none border-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-700"
						: "bg-gray-100 text-gray-900 rounded-bl-none border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
				)}
			>
				{/* Message controls */}
				<div
					className={cn(
						"absolute -bottom-11 left-0 flex items-center gap-2 opacity-0 transition-opacity z-10",
						!isLoading && "group-hover:opacity-100"
					)}
				>
					{!isUser && (
						<>
							<button
								className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-300"
								title="Thumbs up"
								onClick={() => {
									// Implement feedback handler
									console.log("Like message");
								}}
							>
								<ThumbsUp className="h-4 w-4" />
							</button>
							<button
								className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-300"
								title="Thumbs down"
								onClick={() => {
									// Implement feedback handler
									console.log("Dislike message");
								}}
							>
								<ThumbsDown className="h-4 w-4" />
							</button>
						</>
					)}
					<button
						className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-300"
						title="Copy message"
						onClick={() => {
							navigator.clipboard.writeText(message);
							setCopied(true);
							setTimeout(() => setCopied(false), 2000);
						}}
					>
						<Copy className="h-4 w-4" />
						{copied && (
							<span className="absolute top-0 left-full ml-2 text-xs bg-gray-800 text-white px-2 py-1 rounded">
								Copied!
							</span>
						)}
					</button>
				</div>

				{isLoading ? (
					<span className="inline-block animate-pulse">...</span>
				) : parsed ? (
					<div>
						<a
							href={parsed.uri}
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-700 dark:text-gray-300 underline hover:text-black dark:hover:text-white break-all"
						>
							{parsed.uri}
						</a>
						<div className="mt-1 text-gray-800 dark:text-gray-300">
							<ReactMarkdown components={markdownComponents}>
								{parsed.text}
							</ReactMarkdown>
						</div>
					</div>
				) : (
					<div
						className={cn(
							"prose dark:prose-invert max-w-none prose-sm",
							isUser && "dark:text-gray-100"
						)}
					>
						<ReactMarkdown components={markdownComponents}>
							{message}
						</ReactMarkdown>
					</div>
				)}
			</div>
			{isUser && (
				<div className="flex-shrink-0 flex items-end">
					<User className="h-7 w-7 text-white bg-gray-600 rounded-full p-1.5" />
				</div>
			)}
		</div>
	);
}
