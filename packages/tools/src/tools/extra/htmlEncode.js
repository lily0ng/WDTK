export async function toolHtmlEncode({ params }) {
  const text = String(params?.text ?? '')
  const out = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')
  return { ok: true, output: out }
}
