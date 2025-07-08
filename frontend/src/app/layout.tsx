import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { QuickCaptureProvider } from '@/providers/QuickCaptureProvider'
import { SupabaseProvider } from '@/providers/SupabaseProvider'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Synaptic - Your AI Second Brain',
  description: 'Capture, organize, and retrieve information intelligently with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            <QuickCaptureProvider>
              {/* Global theme toggle - visible on all pages */}
              <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
              </div>
              <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster position="top-right" />
            </QuickCaptureProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}