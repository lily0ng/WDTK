import fs from 'node:fs'
import path from 'node:path'

const markers = ['package.json', '.git']

export function findProjectRoot(startDir) {
  let dir = path.resolve(startDir)

  while (true) {
    for (const m of markers) {
      if (fs.existsSync(path.join(dir, m))) return dir
    }

    const parent = path.dirname(dir)
    if (parent === dir) return path.resolve(startDir)
    dir = parent
  }
}
