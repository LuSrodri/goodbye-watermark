import { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/slogans'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goodbyewatermark.com'

  // Base pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95
    }
  ]

  // Blog pages
  const blogSlugs = [
    'how-to-detect-and-remove-invisible-ai-watermarks',
    'remove-watermark-from-pdf-online-free',
    'ai-watermark-remover-for-screenshots',
    'remove-watermark-from-video-without-re-encoding',
    'how-to-remove-watermark-from-jpeg-image-online',
    'batch-watermark-remover-multiple-images-free',
    'remove-getty-images-watermark-free',
    'remove-shutterstock-watermark-free',
    'how-to-remove-istock-watermark-online-free',
    'remove-adobe-stock-watermark-free',
    'remove-watermark-from-product-photo-ecommerce',
    'remove-watermark-from-graduation-photo',
    'remove-timestamp-watermark-from-old-photos',
    'remove-watermark-from-contract-pdf',
    'watermark-remover-real-estate-photos',
    'remove-transparent-watermark-without-photoshop',
    'best-free-ai-watermark-remover-no-output-watermark',
    'remove-watermark-from-image-iphone-free',
    'remove-logo-from-image-ai',
    'goodbye-watermark-alternative-free',
    'remove-watermark-free-without-losing-quality',
    'remove-canva-watermark-free',
    'remove-watermark-without-blurring',
    'remove-dreamstime-watermark-free',
  ]

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9
  }))

  // pSEO pages
  const seoPages: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8
  }))

  return [...staticPages, ...blogPages, ...seoPages]
}
