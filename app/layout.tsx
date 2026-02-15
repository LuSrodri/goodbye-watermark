import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Space_Grotesk } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

const sentient = localFont({
  src: [
    {
      path: './assets/fonts/Sentient-complete/fonts/Sentient-Variable.woff2',
      style: 'normal',
    },
    {
      path: './assets/fonts/Sentient-complete/fonts/Sentient-VariableItalic.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-sentient',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff'
}

export const metadata: Metadata = {
  metadataBase: new URL('https://goodbyewatermark.com'),
  title: {
    default: 'Goodbye Watermark - Free AI Watermark Remover',
    template: '%s | Goodbye Watermark'
  },
  description: 'Remove watermarks from images instantly with AI. Free, no signup required. Supports JPG, PNG, and WebP formats.',
  icons: {
    icon: '/goodbyewatermark.com-logo-favicon.png',
    apple: '/goodbyewatermark.com-logo-favicon.png'
  },
  manifest: '/manifest.json'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/goodbyewatermark.com-logo-favicon.png" sizes="any" />
        <link rel="icon" href="/goodbyewatermark.com-logo-favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/goodbyewatermark.com-logo-favicon.png" />
      </head>
      <body className={`${spaceGrotesk.variable} ${sentient.variable} font-sans antialiased`}>
        {children}
        <Analytics/>
      </body>
    </html>
  )
}
