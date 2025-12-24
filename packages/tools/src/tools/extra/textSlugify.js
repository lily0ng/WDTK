export async function toolTextSlugify({ params }) {
  const text = String(params?.text ?? '')
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return { ok: true, slug }
}
