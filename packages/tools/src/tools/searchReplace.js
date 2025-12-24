import fs from 'node:fs'
import path from 'node:path'

const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out'])

function walk(dir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name)) continue
      walk(path.join(dir, e.name), out)
      continue
    }
    if (e.isFile()) out.push(path.join(dir, e.name))
  }
}

export async function toolSearchReplace({ params, context }) {
  const cwd = context?.cwd ? path.resolve(context.cwd) : process.cwd()
  const pattern = String(params?.pattern ?? '')
  const flags = String(params?.flags ?? 'g')
  const replacement = params?.replacement ?? ''
  const dryRun = params?.dryRun !== false

  let re
  try {
    re = new RegExp(pattern, flags)
  } catch (e) {
    return { ok: false, error: e?.message || String(e) }
  }

  const files = []
  walk(cwd, files)

  let changedFiles = 0
  let totalReplacements = 0
  const preview = []

  for (const file of files) {
    let text
    try {
      if (fs.statSync(file).size > 1024 * 1024) continue
      text = fs.readFileSync(file, 'utf8')
    } catch {
      continue
    }

    const before = text
    const after = before.replace(re, replacement)
    if (after === before) continue

    const fileReplacements = (before.match(re) || []).length
    totalReplacements += fileReplacements
    changedFiles++

    preview.push({ file, replacements: fileReplacements })

    if (!dryRun) {
      fs.writeFileSync(file, after)
    }
  }

  return { ok: true, cwd, dryRun, changedFiles, totalReplacements, preview: preview.slice(0, 50) }
}
