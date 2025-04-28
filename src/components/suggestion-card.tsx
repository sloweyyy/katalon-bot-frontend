import { Lightbulb, FileText, Search } from "lucide-react";

export function SuggestionCard() {
	return (
		<div className="w-full flex flex-col gap-4">
			<div className="flex gap-4">
				<div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
					<Lightbulb className="h-6 w-6 text-yellow-400" />
					<div>
						<div className="font-medium text-gray-900 dark:text-gray-100">
							Suggest a test case
						</div>
						<div className="text-gray-500 dark:text-gray-400 text-sm">
							Get ideas for your next automation
						</div>
					</div>
				</div>
				<div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
					<FileText className="h-6 w-6 text-indigo-500" />
					<div>
						<div className="font-medium text-gray-900 dark:text-gray-100">
							Documentation
						</div>
						<div className="text-gray-500 dark:text-gray-400 text-sm">
							Find answers in the docs
						</div>
					</div>
				</div>
			</div>
			<div className="flex gap-4">
				<div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
					<Search className="h-6 w-6 text-green-500" />
					<div>
						<div className="font-medium text-gray-900 dark:text-gray-100">
							Search issues
						</div>
						<div className="text-gray-500 dark:text-gray-400 text-sm">
							Look up known problems and solutions
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
