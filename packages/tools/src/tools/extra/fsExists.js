import fs from 'node:fs'
import path from 'node:path'

export async function toolFsExists({ params, context }) {
  const cwd = context?.cwd ? path.resolve(context.cwd) : process.cwd()
  const p = String(params?.path ?? '')
  if (!p) return { ok: false, error: 'Missing path' }
  const abs = path.resolve(cwd, p)
  return { ok: true, path: abs, exists: fs.existsSync(abs) }
}
