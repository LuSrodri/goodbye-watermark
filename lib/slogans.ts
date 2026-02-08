export interface SloganData {
  slug: string
  title: string
  slogan: string
  subslogan: string
  metaTitle: string
  metaDescription: string
}

export const defaultSlogan: SloganData = {
  slug: '',
  title: 'Goodbye Watermark',
  slogan: 'Remove watermarks instantly',
  subslogan: 'Free AI-powered watermark removal. No signup required.',
  metaTitle: 'Goodbye Watermark - Free AI Watermark Remover',
  metaDescription: 'Remove watermarks from images instantly with AI. Free, no signup required. Supports JPG, PNG, and WebP formats.'
}

export const slogans: Record<string, SloganData> = {
  'stock-photos': {
    slug: 'stock-photos',
    title: 'Goodbye Watermark',
    slogan: 'Clean up your stock photos',
    subslogan: 'Remove watermarks from stock images instantly with AI.',
    metaTitle: 'Remove Watermarks from Stock Photos - Goodbye Watermark',
    metaDescription: 'Remove watermarks from stock photos instantly. Free AI-powered tool for cleaning up stock images. No signup required.'
  },
  'social-media': {
    slug: 'social-media',
    title: 'Goodbye Watermark',
    slogan: 'Perfect images for social media',
    subslogan: 'Remove unwanted watermarks for your social posts.',
    metaTitle: 'Remove Watermarks for Social Media - Goodbye Watermark',
    metaDescription: 'Clean up images for social media by removing watermarks. Free AI tool, no signup required.'
  },
  'presentations': {
    slug: 'presentations',
    title: 'Goodbye Watermark',
    slogan: 'Professional presentations deserve clean images',
    subslogan: 'Remove watermarks for polished presentations.',
    metaTitle: 'Remove Watermarks for Presentations - Goodbye Watermark',
    metaDescription: 'Create professional presentations with watermark-free images. Free AI watermark removal tool.'
  },
  'designers': {
    slug: 'designers',
    title: 'Goodbye Watermark',
    slogan: 'Design without distractions',
    subslogan: 'Clean images for your creative projects.',
    metaTitle: 'Watermark Remover for Designers - Goodbye Watermark',
    metaDescription: 'Remove watermarks from images for your design projects. Free AI-powered tool for designers.'
  },
  'photographers': {
    slug: 'photographers',
    title: 'Goodbye Watermark',
    slogan: 'Restore your photos to their original beauty',
    subslogan: 'AI-powered watermark removal for photographers.',
    metaTitle: 'Watermark Remover for Photographers - Goodbye Watermark',
    metaDescription: 'Remove unwanted watermarks from photographs. Professional AI tool for photographers. Free and easy to use.'
  },
  'marketers': {
    slug: 'marketers',
    title: 'Goodbye Watermark',
    slogan: 'Marketing visuals, watermark-free',
    subslogan: 'Create compelling marketing materials without watermarks.',
    metaTitle: 'Remove Watermarks for Marketing - Goodbye Watermark',
    metaDescription: 'Remove watermarks from images for marketing campaigns. Free AI-powered tool for marketers.'
  },
  'bloggers': {
    slug: 'bloggers',
    title: 'Goodbye Watermark',
    slogan: 'Blog with beautiful, clean images',
    subslogan: 'Remove watermarks for your blog posts.',
    metaTitle: 'Watermark Remover for Bloggers - Goodbye Watermark',
    metaDescription: 'Clean up images for your blog by removing watermarks. Free AI tool, perfect for content creators.'
  },
  'ecommerce': {
    slug: 'ecommerce',
    title: 'Goodbye Watermark',
    slogan: 'Product images that sell',
    subslogan: 'Remove watermarks from your product photos.',
    metaTitle: 'Remove Watermarks from Product Photos - Goodbye Watermark',
    metaDescription: 'Remove watermarks from e-commerce product images. Free AI-powered tool for online sellers.'
  },
  'youtube': {
    slug: 'youtube',
    title: 'Goodbye Watermark',
    slogan: 'Thumbnails that stand out',
    subslogan: 'Remove watermarks for eye-catching YouTube thumbnails.',
    metaTitle: 'Remove Watermarks for YouTube Thumbnails - Goodbye Watermark',
    metaDescription: 'Create professional YouTube thumbnails without watermarks. Free AI watermark removal tool.'
  },
  'instagram': {
    slug: 'instagram',
    title: 'Goodbye Watermark',
    slogan: 'Instagram-ready images',
    subslogan: 'Remove watermarks for a polished Instagram feed.',
    metaTitle: 'Remove Watermarks for Instagram - Goodbye Watermark',
    metaDescription: 'Clean up images for Instagram by removing watermarks. Free AI tool for content creators.'
  },
  'sports-photos': {
    slug: 'sports-photos',
    title: 'Goodbye Watermark',
    slogan: 'Your best moments, without watermarks',
    subslogan: 'Remove watermarks from your sports and race photos.',
    metaTitle: 'Remove Watermarks from Sports Photos - Goodbye Watermark',
    metaDescription: 'Remove watermarks from sports photos, marathon pictures, and race images. Free AI-powered tool for athletes.'
  },
  'race': {
    slug: 'race',
    title: 'Goodbye Watermark',
    slogan: 'Your race photos, watermark-free',
    subslogan: 'Remove race watermarks from your race photos instantly.',
    metaTitle: 'Remove Race Watermark - Goodbye Watermark',
    metaDescription: 'Remove race watermarks from your marathon and race photos. Free AI-powered watermark removal tool.'
  },
  'nano-banana': {
    slug: 'nano-banana',
    title: 'Goodbye Watermark',
    slogan: 'Your Nano Banana generated photos, watermark-free',
    subslogan: 'Remove Nano Banana watermarks from your generated photos instantly.',
    metaTitle: 'Remove Nano Banana Watermark - Goodbye Watermark',
    metaDescription: 'Remove Nano Banana watermarks from your generated photos. Free AI-powered watermark removal tool.'
  }
}

export function getSloganData(slug: string): SloganData {
  return slogans[slug] || defaultSlogan
}

export function getAllSlugs(): string[] {
  return Object.keys(slogans)
}
