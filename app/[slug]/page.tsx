import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSloganData, getAllSlugs, defaultSlogan } from '@/lib/slogans'
import HomeClient from '../HomeClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const sloganData = getSloganData(slug)

  if (sloganData === defaultSlogan && slug !== '') {
    return {}
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goodbyewatermark.com'

  return {
    title: sloganData.metaTitle,
    description: sloganData.metaDescription,
    keywords: ['watermark remover', 'remove watermark', slug.replace('-', ' '), 'free watermark remover', 'AI watermark remover'],
    openGraph: {
      title: sloganData.metaTitle,
      description: sloganData.metaDescription,
      url: `${siteUrl}/${slug}`,
      siteName: 'Goodbye Watermark',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/goodbyewatermark.com-logo-favicon.png`,
          width: 1200,
          height: 630,
          alt: sloganData.metaTitle
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: sloganData.metaTitle,
      description: sloganData.metaDescription,
      images: [`${siteUrl}/goodbyewatermark.com-logo-favicon.png`]
    },
    alternates: {
      canonical: `${siteUrl}/${slug}`
    }
  }
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  const sloganData = getSloganData(slug)

  // If slug doesn't exist in our slogans, show 404
  if (sloganData === defaultSlogan && slug !== '') {
    notFound()
  }

  return <HomeClient sloganData={sloganData} />
}
