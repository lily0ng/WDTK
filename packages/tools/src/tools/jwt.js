import crypto from 'node:crypto'

function b64urlToBuf(str) {
  const pad = str.length % 4 === 2 ? '==' : str.length % 4 === 3 ? '=' : ''
  const b64 = (str + pad).replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(b64, 'base64')
}

function decodePart(part) {
  return JSON.parse(b64urlToBuf(part).toString('utf8'))
}

function verifyHs256(signingInput, signatureB64Url, secret) {
  const expected = crypto.createHmac('sha256', secret).update(signingInput).digest()
  const actual = b64urlToBuf(signatureB64Url)
  if (expected.length !== actual.length) return false
  return crypto.timingSafeEqual(expected, actual)
}

export async function toolJwt({ params }) {
  const token = String(params?.token ?? '')
  const secret = params?.secret ? String(params.secret) : null

  const parts = token.split('.')
  if (parts.length !== 3) return { ok: false, error: 'Invalid JWT format' }

  let header, payload
  try {
    header = decodePart(parts[0])
    payload = decodePart(parts[1])
  } catch (e) {
    return { ok: false, error: e?.message || String(e) }
  }

  const alg = header?.alg || null
  let verified = null
  if (secret && alg === 'HS256') {
    verified = verifyHs256(`${parts[0]}.${parts[1]}`, parts[2], secret)
  }

  return { ok: true, header, payload, alg, verified }
}
