export async function toolJsonMinify({ params }) {
  const input = String(params?.input ?? '')
  const obj = JSON.parse(input)
  return { ok: true, output: JSON.stringify(obj) }
}
