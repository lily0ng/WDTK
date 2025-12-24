export async function toolUrlDecode({ params }) {
  const input = String(params?.input ?? '')
  return { ok: true, output: decodeURIComponent(input) }
}
