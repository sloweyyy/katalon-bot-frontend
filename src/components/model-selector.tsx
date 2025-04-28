"use client";

import { ChatModel } from "@/lib/utils";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon, Sparkles } from "lucide-react";
import { Fragment } from "react";

const models = [
	{
		id: "gemini",
		name: "Gemini Pro",
		icon: <Sparkles className="h-4 w-4 text-blue-500" />,
	},
	{
		id: "gpt-3.5-turbo",
		name: "GPT-3.5 Turbo",
		icon: <Sparkles className="h-4 w-4 text-green-500" />,
	},
	{
		id: "gpt-4",
		name: "GPT-4",
		icon: <Sparkles className="h-4 w-4 text-purple-500" />,
	},
];

export function ModelSelector({
	selected,
	onChange,
}: {
	selected: ChatModel;
	onChange: (model: ChatModel) => void;
}) {
	const selectedModel = models.find((m) => m.id === selected);

	return (
		<Listbox value={selected} onChange={onChange}>
			<div className="relative">
				<Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white dark:bg-gray-700 py-1.5 pl-3 pr-10 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600">
					<span className="flex items-center gap-2">
						{selectedModel?.icon}
						<span className="block truncate">{selectedModel?.name}</span>
					</span>
					<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
						<ChevronDownIcon
							className="h-4 w-4 text-gray-500"
							aria-hidden="true"
						/>
					</span>
				</Listbox.Button>
				<Listbox.Options className="absolute right-0 z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-sm shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none">
					{models.map((model) => (
						<Listbox.Option
							key={model.id}
							className={({ active }) =>
								`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
									active
										? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
										: "text-gray-700 dark:text-gray-300"
								}`
							}
							value={model.id}
						>
							{({ selected }) => (
								<>
									<span className="flex items-center gap-2">
										{model.icon}
										<span
											className={`block truncate ${
												selected ? "font-medium" : "font-normal"
											}`}
										>
											{model.name}
										</span>
									</span>
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
