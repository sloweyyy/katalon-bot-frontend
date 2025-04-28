"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { ModelSelector } from "@/components/model-selector";
import { ModeSelector } from "@/components/mode-selector";
import { ChatModel, ChatMode } from "@/lib/utils";
import { useWidget } from "@/providers/widget-provider";
import { MessageSquare } from "lucide-react";

interface HeaderProps {
	selectedModel: ChatModel;
	setSelectedModel: (model: ChatModel) => void;
	selectedMode: ChatMode;
	setSelectedMode: (mode: ChatMode) => void;
}

export function Header({
	selectedModel,
	setSelectedModel,
	selectedMode,
	setSelectedMode,
}: HeaderProps) {
	const { isWidgetEnabled, toggleWidget } = useWidget();

	return (
		<header className="w-full flex items-center justify-between px-6 py-4 fixed top-0 left-0 right-0 z-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
			<div className="text-lg font-semibold text-gray-900 dark:text-white select-none">
				Katalon Support Bot
			</div>
			<div className="flex items-center gap-4">
				<div className="hidden sm:flex items-center gap-4">
					<ModeSelector selected={selectedMode} onChange={setSelectedMode} />
					<ModelSelector selected={selectedModel} onChange={setSelectedModel} />
				</div>
				<button
					onClick={toggleWidget}
					className={`p-1.5 rounded-md flex items-center ${
						isWidgetEnabled
							? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
							: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
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
