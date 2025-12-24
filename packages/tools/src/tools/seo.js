import { generateSeoMeta } from '../utils/seo.js'

export async function toolSeo({ params }) {
  const meta = generateSeoMeta({
    title: params?.title,
    description: params?.description,
    url: params?.url,
    image: params?.image,
    twitterHandle: params?.twitterHandle
  })

  return { ok: true, meta }
}
