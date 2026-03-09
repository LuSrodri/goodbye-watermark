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
    }
  ]

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/blog/how-to-detect-and-remove-invisible-ai-watermarks`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9
    }
  ]

  // pSEO pages
  const seoPages: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8
  }))

  return [...staticPages, ...blogPages, ...seoPages]
}
