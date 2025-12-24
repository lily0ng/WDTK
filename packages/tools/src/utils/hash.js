import crypto from 'node:crypto'
import fs from 'node:fs'

export function hashText({ text, algorithm }) {
  const alg = algorithm || 'sha256'
  return crypto.createHash(alg).update(String(text ?? '')).digest('hex')
}

export function hashFile({ filePath, algorithm }) {
  const alg = algorithm || 'sha256'
  const buf = fs.readFileSync(filePath)
  return crypto.createHash(alg).update(buf).digest('hex')
}
