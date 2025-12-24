export async function toolBase64Encode({ params }) {
  const text = String(params?.text ?? '')
  return { ok: true, output: Buffer.from(text, 'utf8').toString('base64') }
}
