"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<button
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
			aria-label="Toggle theme"
		>
			<div className="relative h-5 w-5">
				<Sun className="absolute h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			</div>
		</button>
	);
}
