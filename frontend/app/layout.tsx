import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ClerkProvider} from "@clerk/nextjs";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata: Metadata = {
  title: 'Aion AI | Premium Voice Assistant',
  description: 'AI-powered Voice Assistant for professional call handling',
};

import { ThemeProvider } from "@/components/providers/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="dark" 
            enableSystem 
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
