export async function toolTextTitle({ params }) {
  const text = String(params?.text ?? '')
  const out = text
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
  return { ok: true, output: out }
}
