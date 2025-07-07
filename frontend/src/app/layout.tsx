import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { QuickCaptureProvider } from '@/providers/QuickCaptureProvider'
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
    <html lang="en">
      <body className={inter.className}>
        <QuickCaptureProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </QuickCaptureProvider>
      </body>
    </html>
  )
}