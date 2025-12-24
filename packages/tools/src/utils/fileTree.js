import fs from 'node:fs'
import path from 'node:path'

const DEFAULT_IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', '.turbo'])

export function buildFileTree({ rootDir, maxDepth, maxEntries }) {
  const depthLimit = typeof maxDepth === 'number' ? maxDepth : 4
  const entryLimit = typeof maxEntries === 'number' ? maxEntries : 1000
  const ignore = DEFAULT_IGNORE_DIRS

  let count = 0

  function walk(dir, depth) {
    if (count >= entryLimit) return []
    if (depth > depthLimit) return []

    let entries
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return []
    }

    const nodes = []
    for (const e of entries) {
      if (count >= entryLimit) break
      if (e.isDirectory() && ignore.has(e.name)) continue

      const fullPath = path.join(dir, e.name)
      count++

      if (e.isDirectory()) {
        nodes.push({ type: 'dir', name: e.name, children: walk(fullPath, depth + 1) })
      } else if (e.isFile()) {
        nodes.push({ type: 'file', name: e.name })
      }
    }

    return nodes
  }

  return {
    root: path.resolve(rootDir),
    maxDepth: depthLimit,
    maxEntries: entryLimit,
    tree: walk(rootDir, 0)
  }
}
