export async function toolTextLower({ params }) {
  return { ok: true, output: String(params?.text ?? '').toLowerCase() }
}
