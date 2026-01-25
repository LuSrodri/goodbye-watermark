import { Metadata } from 'next'
import { defaultSlogan } from '@/lib/slogans'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: defaultSlogan.metaTitle,
  description: defaultSlogan.metaDescription,
  keywords: ['watermark remover', 'remove watermark', 'watermark removal', 'free watermark remover', 'AI watermark remover', 'image watermark removal'],
  authors: [{ name: 'Goodbye Watermark' }],
  openGraph: {
    title: defaultSlogan.metaTitle,
    description: defaultSlogan.metaDescription,
    url: 'https://goodbyewatermark.com',
    siteName: 'Goodbye Watermark',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://goodbyewatermark.com/goodbyewatermark.com-logo-favicon.png',
        width: 1200,
        height: 630,
        alt: 'Goodbye Watermark - Free AI Watermark Remover'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultSlogan.metaTitle,
    description: defaultSlogan.metaDescription,
    images: ['https://goodbyewatermark.com/goodbyewatermark.com-logo-favicon.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  alternates: {
    canonical: 'https://goodbyewatermark.com'
  }
}

export default function HomePage() {
  return <HomeClient sloganData={defaultSlogan} />
}
