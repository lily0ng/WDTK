export async function toolJsonPretty({ params }) {
  const input = String(params?.input ?? '')
  const indent = params?.indent != null ? Number(params.indent) : 2
  const obj = JSON.parse(input)
  return { ok: true, output: JSON.stringify(obj, null, indent) }
}
