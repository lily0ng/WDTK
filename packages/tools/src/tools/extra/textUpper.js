export async function toolTextUpper({ params }) {
  return { ok: true, output: String(params?.text ?? '').toUpperCase() }
}
