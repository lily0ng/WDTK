export async function toolTextCount({ params }) {
  const text = String(params?.text ?? '')
  const chars = text.length
  const bytes = Buffer.byteLength(text, 'utf8')
  const lines = text.length ? text.split(/\r?\n/).length : 0
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  return { ok: true, chars, bytes, lines, words }
}
