"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { ModelSelector } from "@/components/model-selector";
import { ModeSelector } from "@/components/mode-selector";
import { ChatModel, ChatMode } from "@/lib/utils";
import { useWidget } from "@/providers/widget-provider";
import { MessageSquare, Menu } from "lucide-react";

interface HeaderProps {
	selectedModel: ChatModel;
	setSelectedModel: (model: ChatModel) => void;
	selectedMode: ChatMode;
	setSelectedMode: (mode: ChatMode) => void;
	onShowSidebar?: () => void;
	className?: string;
}

export function Header({
	selectedModel,
	setSelectedModel,
	selectedMode,
	setSelectedMode,
	onShowSidebar,
	className,
}: HeaderProps) {
	const { isWidgetEnabled, toggleWidget } = useWidget();

	return (
		<header className={`w-full flex items-center justify-between px-6 py-3 fixed top-0 left-0 right-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 ${className || ''}`}>
			<div className="flex items-center gap-3">
				{onShowSidebar && (
					<button
						onClick={onShowSidebar}
						className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
						aria-label="Show chat history"
					>
						<Menu className="h-5 w-5" />
					</button>
				)}
				<div className="text-base font-medium text-gray-800 dark:text-gray-200 select-none">
				Katalon Support Bot
				</div>
			</div>
			
			<div className="flex items-center gap-3">
				<div className="hidden sm:flex items-center gap-3">
					<ModeSelector selected={selectedMode} onChange={setSelectedMode} />
					<ModelSelector selected={selectedModel} onChange={setSelectedModel} />
				</div>
				<button
					onClick={toggleWidget}
					className={`p-1.5 rounded-md flex items-center ${
						isWidgetEnabled
							? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
							: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
					}`}
					title={isWidgetEnabled ? "Disable widget" : "Enable widget"}
				>
					<MessageSquare className="h-4 w-4" />
				</button>
				<ThemeToggle />
			</div>
		</header>
	);
}
