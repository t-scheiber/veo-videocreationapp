import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Generate videos with Veo',
  description: 'Generate videos using Google\'s Veo AI model',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#1E1F20] font-sans text-gray-300 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
