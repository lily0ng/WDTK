function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function generateSeoMeta({ title, description, url, image, twitterHandle }) {
  const t = escapeAttr(title || '')
  const d = escapeAttr(description || '')
  const u = escapeAttr(url || '')
  const i = escapeAttr(image || '')
  const th = escapeAttr(twitterHandle || '')

  const tags = []
  if (t) tags.push(`<title>${t}</title>`, `<meta name="title" content="${t}" />`)
  if (d) tags.push(`<meta name="description" content="${d}" />`)

  if (t) tags.push(`<meta property="og:title" content="${t}" />`)
  if (d) tags.push(`<meta property="og:description" content="${d}" />`)
  if (u) tags.push(`<meta property="og:url" content="${u}" />`)
  if (i) tags.push(`<meta property="og:image" content="${i}" />`)

  if (t) tags.push(`<meta name="twitter:title" content="${t}" />`)
  if (d) tags.push(`<meta name="twitter:description" content="${d}" />`)
  if (i) tags.push(`<meta name="twitter:image" content="${i}" />`)
  if (th) tags.push(`<meta name="twitter:site" content="${th}" />`)

  return tags.join('\n')
}
