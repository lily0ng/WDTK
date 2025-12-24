import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const ignore = new Set(['node_modules', '.git', 'dist', 'build', 'out'])

function walk(dir, depth) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    if (ignore.has(e.name)) continue
    const p = path.join(dir, e.name)
    process.stdout.write(`${'  '.repeat(depth)}- ${e.name}\n`)
    if (e.isDirectory()) walk(p, depth + 1)
  }
}

walk(root, 0)
