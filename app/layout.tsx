import type { Metadata } from 'next'
import { Bricolage_Grotesque, Figtree, Spline_Sans_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  axes: ['opsz', 'wdth'],
})
const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
})
const splineMono = Spline_Sans_Mono({
  subsets: ['latin'],
  variable: '--font-spline-mono',
})

export const metadata: Metadata = {
  title: 'My Trial Board',
  description: 'Visit Schedule Management',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${figtree.variable} ${bricolage.variable} ${splineMono.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
