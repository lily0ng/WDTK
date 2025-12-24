export async function toolRegexEscape({ params }) {
  const text = String(params?.text ?? '')
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return { ok: true, output: escaped }
}
