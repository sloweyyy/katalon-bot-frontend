"use client";

import React, { createContext, useContext, useState } from "react";

interface WidgetContextProps {
	isWidgetEnabled: boolean;
	toggleWidget: () => void;
	enableWidget: () => void;
	disableWidget: () => void;
}

const WidgetContext = createContext<WidgetContextProps>({
	isWidgetEnabled: true,
	toggleWidget: () => {},
	enableWidget: () => {},
	disableWidget: () => {},
});

export function WidgetProvider({ children }: { children: React.ReactNode }) {
	const [isWidgetEnabled, setIsWidgetEnabled] = useState(true);

	const toggleWidget = () => setIsWidgetEnabled((prev) => !prev);
	const enableWidget = () => setIsWidgetEnabled(true);
	const disableWidget = () => setIsWidgetEnabled(false);

	return (
		<WidgetContext.Provider
			value={{
				isWidgetEnabled,
				toggleWidget,
				enableWidget,
				disableWidget,
			}}
		>
			{children}
		</WidgetContext.Provider>
	);
}

export const useWidget = () => useContext(WidgetContext);
