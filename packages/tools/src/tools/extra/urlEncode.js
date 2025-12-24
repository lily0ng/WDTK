export async function toolUrlEncode({ params }) {
  const text = String(params?.text ?? '')
  return { ok: true, output: encodeURIComponent(text) }
}
