export async function toolHexDecode({ params }) {
  const input = String(params?.input ?? '')
  return { ok: true, output: Buffer.from(input, 'hex').toString('utf8') }
}
