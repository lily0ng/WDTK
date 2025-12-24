import fs from 'node:fs'
import path from 'node:path'

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function parseFilesParam(value) {
  if (Array.isArray(value)) return value

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.files)) return parsed.files
    } catch {
      return null
    }
  }

  if (value && typeof value === 'object' && Array.isArray(value.files)) return value.files

  return null
}

function isSafeRelativePath(p) {
  const s = String(p || '').replace(/\\/g, '/')
  if (!s) return false
  if (s.startsWith('/')) return false
  if (s.includes('..')) return false
  return true
}

export async function toolAiFilesWrite({ params, context }) {
  const cwd = context?.cwd ? path.resolve(context.cwd) : process.cwd()
  const overwrite = Boolean(params?.overwrite)
  const dryRun = Boolean(params?.dryRun)

  const files = parseFilesParam(params?.files)
  if (!files) return { ok: false, error: 'Missing files (array or JSON string)' }

  const written = []
  const skipped = []
  const rejected = []

  for (const f of files) {
    const rel = typeof f?.path === 'string' ? f.path : ''
    const content = typeof f?.content === 'string' ? f.content : ''

    if (!isSafeRelativePath(rel)) {
      rejected.push({ path: rel, error: 'Unsafe path (must be relative, no .., no leading /)' })
      continue
    }

    const abs = path.resolve(cwd, rel)
    if (!abs.startsWith(cwd + path.sep) && abs !== cwd) {
      rejected.push({ path: rel, error: 'Path escapes cwd' })
      continue
    }

    const exists = fs.existsSync(abs)
    if (exists && !overwrite) {
      skipped.push({ path: rel, reason: 'exists' })
      continue
    }

    if (!dryRun) {
      ensureDir(path.dirname(abs))
      fs.writeFileSync(abs, content)
    }

    written.push({ path: rel, bytes: Buffer.byteLength(content, 'utf8') })
  }

  return { ok: rejected.length === 0, cwd, overwrite, dryRun, written, skipped, rejected }
}
