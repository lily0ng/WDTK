export async function toolBase64Decode({ params }) {
  const input = String(params?.input ?? '')
  return { ok: true, output: Buffer.from(input, 'base64').toString('utf8') }
}
