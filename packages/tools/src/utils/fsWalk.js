import fs from 'node:fs'
import path from 'node:path'

const DEFAULT_IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', '.turbo'])

export function walkFiles({ rootDir, ignoreDirs, maxFiles }) {
  const out = []
  const ignore = ignoreDirs || DEFAULT_IGNORE_DIRS
  const max = typeof maxFiles === 'number' ? maxFiles : 20000

  function walk(dir) {
    if (out.length >= max) return

    let entries
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const e of entries) {
      if (out.length >= max) return
      const p = path.join(dir, e.name)

      if (e.isDirectory()) {
        if (ignore.has(e.name)) continue
        walk(p)
        continue
      }

      if (e.isFile()) out.push(p)
    }
  }

  walk(rootDir)
  return out
}
