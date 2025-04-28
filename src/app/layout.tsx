"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { WidgetProvider } from "@/providers/widget-provider";
import { Widget } from "@/components/widget";
import { useWidget } from "@/providers/widget-provider";

const inter = Inter({ subsets: ["latin"] });

// Metadata is defined in a separate file: metadata.ts

function WidgetContainer() {
	const { isWidgetEnabled } = useWidget();
	return <Widget isEnabled={isWidgetEnabled} />;
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<WidgetProvider>
						{children}
						<WidgetContainer />
					</WidgetProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
