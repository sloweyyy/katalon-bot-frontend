'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { WidgetProvider } from '@/providers/widget-provider';
import { UserProvider } from '@/providers/user-provider';
import { Widget } from '@/components/widget';
import { useWidget } from '@/providers/widget-provider';

const inter = Inter({ subsets: ['latin'] });

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
          enableSystem={true}
        >
          <UserProvider>
            <WidgetProvider>
              {children}
              <WidgetContainer />
            </WidgetProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
