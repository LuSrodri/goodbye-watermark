import Replicate from 'replicate'

const replicate = new Replicate()

const MODEL = 'qwen/qwen-image-2-pro'

const PROMPT =
  'Remove all watermarks and the image overlay elements. Be assertive. And keep the better image quality and size.'

const NEGATIVE_PROMPT =
  'watermarks, logos, text overlays, signatures, stamps, blur, distortion'

export async function removeWatermark(image: string): Promise<ArrayBuffer> {
  const input = {
    image,
    prompt: PROMPT,
    negative_prompt: NEGATIVE_PROMPT,
    match_input_image: true,
    enable_prompt_expansion: false,
  }

  const output = (await replicate.run(MODEL, { input })) as { url: () => string }

  const imageUrl = output?.url?.()
  if (!imageUrl) {
    throw new Error('No processed image in response')
  }

  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch processed image from Replicate')
  }

  return response.arrayBuffer()
}
