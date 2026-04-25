import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Jakob - Photographer',
  description: 'Photography portfolio showcasing editorial and personal projects',
  icons: {
    icon: '/favicon.ico',}
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-black dark">
      <body className="font-sans antialiased bg-black text-white">
        {children}
        {process.env.NODE_ENV === 'production'}
      </body>
    </html>
  )
}
