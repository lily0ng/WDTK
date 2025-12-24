import fs from 'node:fs'
import path from 'node:path'

export async function toolFsReadText({ params, context }) {
  const cwd = context?.cwd ? path.resolve(context.cwd) : process.cwd()
  const p = String(params?.path ?? '')
  const maxBytes = params?.maxBytes != null ? Number(params.maxBytes) : 20000
  if (!p) return { ok: false, error: 'Missing path' }
  const abs = path.resolve(cwd, p)
  const buf = fs.readFileSync(abs)
  const sliced = buf.length > maxBytes ? buf.subarray(0, maxBytes) : buf
  return { ok: true, path: abs, truncated: buf.length > maxBytes, text: sliced.toString('utf8') }
}
