import { hashText } from '../../utils/hash.js'

export async function toolHashText({ params }) {
  const algorithm = String(params?.algorithm ?? 'sha256')
  const text = String(params?.text ?? '')
  return { ok: true, algorithm, hash: hashText({ text, algorithm }) }
}
