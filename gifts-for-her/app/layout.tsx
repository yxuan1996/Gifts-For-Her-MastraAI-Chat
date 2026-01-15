/**
 * Root Layout
 * Wraps the entire application with providers
 */

import { Inter } from 'next/font/google'
import './globals.css'
// import { SettingsProvider } from '@/contexts/SettingsContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gifts For Her - Beauty Product Recommendations',
  description: 'AI-powered beauty and wellness product recommendations',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <SettingsProvider> */}
          {children}
        {/* </SettingsProvider> */}
      </body>
    </html>
  )
}