import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
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

  // pSEO pages
  const seoPages: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8
  }))

  // Public shared images
  let sharedImagePages: MetadataRoute.Sitemap = []

  if (supabaseAdmin) {
    try {
      const { data: publicImages } = await supabaseAdmin
        .from('processed_images')
        .select('share_slug, created_at')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(1000)

      if (publicImages) {
        sharedImagePages = publicImages.map((image) => ({
          url: `${siteUrl}/s/${image.share_slug}`,
          lastModified: new Date(image.created_at),
          changeFrequency: 'yearly' as const,
          priority: 0.5
        }))
      }
    } catch (error) {
      console.error('Failed to fetch public images for sitemap:', error)
    }
  }

  return [...staticPages, ...seoPages, ...sharedImagePages]
}
