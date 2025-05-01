"use client";

import { ChatMode } from "@/lib/utils";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon, Sparkles, Cpu } from "lucide-react";

const modes = [
	{
		id: "mcp",
		name: "MCP Mode",
		icon: <Cpu className="h-4 w-4 text-purple-500" />,
		description: "Uses MCP server for enhanced Katalon-specific responses",
	},
	{
		id: "gemini",
		name: "Gemini Mode",
		icon: <Sparkles className="h-4 w-4 text-blue-500" />,
		description: "Direct Gemini AI interaction for general queries",
	},
];

interface ModeSelectorProps {
	selected: ChatMode;
	onChange: (mode: ChatMode) => void;
}

export function ModeSelector({ selected, onChange }: ModeSelectorProps) {
	const selectedMode = modes.find((m) => m.id === selected);

	return (
		<Listbox value={selected} onChange={onChange}>
			<div className="relative">
				<Listbox.Button className="relative w-48 cursor-pointer rounded-md bg-gray-100 dark:bg-gray-800 py-1.5 pl-3 pr-10 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
					<span className="flex items-center gap-2">
						{selectedMode?.icon}
						<span className="block truncate">{selectedMode?.name}</span>
						{selected === "mcp" ? (
							<span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-800">
								Katalon
							</span>
						) : (
							<span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
								AI
							</span>
						)}
					</span>
					<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
						<ChevronDownIcon
							className="h-4 w-4 text-gray-500"
							aria-hidden="true"
						/>
					</span>
				</Listbox.Button>
				<Listbox.Options className="absolute right-0 z-10 mt-1 max-h-60 w-64 overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-sm shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none">
					{modes.map((mode) => (
						<Listbox.Option
							key={mode.id}
							className={({ active }) =>
								`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
									active
										? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
										: "text-gray-700 dark:text-gray-300"
								}`
							}
							value={mode.id}
						>
							{({ selected }) => (
								<>
									<div className="flex flex-col">
										<div className="flex items-center gap-2">
											{mode.icon}
											<span
												className={`block truncate ${
													selected ? "font-medium" : "font-normal"
												}`}
											>
												{mode.name}
											</span>
										</div>
										<span className="block text-xs text-gray-500 dark:text-gray-400 pl-6 mt-0.5">
											{mode.description}
										</span>
									</div>
									{selected ? (
										<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600 dark:text-gray-400">
											<CheckIcon className="h-4 w-4" aria-hidden="true" />
										</span>
									) : null}
								</>
							)}
						</Listbox.Option>
					))}
				</Listbox.Options>
			</div>
		</Listbox>
	);
}
