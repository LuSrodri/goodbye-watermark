import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import ShareClient from './ShareClient'
import { ProcessedImage } from '@/lib/types'

interface Props {
  params: Promise<{ shareSlug: string }>
}

async function getSharedImage(shareSlug: string): Promise<ProcessedImage | null> {
  if (!supabaseAdmin) {
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('processed_images')
    .select('*')
    .eq('share_slug', shareSlug)
    .eq('is_public', true)
    .single()

  if (error || !data) {
    return null
  }

  return data as ProcessedImage
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareSlug } = await params
  const image = await getSharedImage(shareSlug)

  if (!image) {
    return {
      title: 'Image Not Found'
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goodbyewatermark.com'

  return {
    title: 'Shared Image - Goodbye Watermark',
    description: 'View this watermark-free image processed with Goodbye Watermark AI.',
    openGraph: {
      title: 'Shared Image - Goodbye Watermark',
      description: 'View this watermark-free image processed with Goodbye Watermark AI.',
      url: `${siteUrl}/s/${shareSlug}`,
      siteName: 'Goodbye Watermark',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: image.processed_url,
          width: 1200,
          height: 630,
          alt: 'Shared processed image'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Shared Image - Goodbye Watermark',
      description: 'View this watermark-free image processed with Goodbye Watermark AI.',
      images: [image.processed_url]
    }
  }
}

export default async function SharePage({ params }: Props) {
  const { shareSlug } = await params
  const image = await getSharedImage(shareSlug)

  if (!image) {
    notFound()
  }

  return <ShareClient image={image} />
}
