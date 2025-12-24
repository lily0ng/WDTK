export async function toolHexEncode({ params }) {
  const text = String(params?.text ?? '')
  return { ok: true, output: Buffer.from(text, 'utf8').toString('hex') }
}
