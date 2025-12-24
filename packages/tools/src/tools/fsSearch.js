import path from 'node:path'
import fs from 'node:fs'
import { walkFiles } from '../utils/fsWalk.js'

export async function toolFsSearch({ params, context }) {
  const cwd = context?.cwd ? path.resolve(context.cwd) : process.cwd()
  const pattern = String(params?.pattern ?? '')
  const flags = String(params?.flags ?? 'i')
  const maxMatches = Number(params?.maxMatches ?? 200)

  let re
  try {
    re = new RegExp(pattern, flags)
  } catch (e) {
    return { ok: false, error: e?.message || String(e) }
  }

  const files = walkFiles({ rootDir: cwd, maxFiles: 20000 })
  const matches = []

  for (const file of files) {
    if (matches.length >= maxMatches) break

    let text
    try {
      if (fs.statSync(file).size > 1024 * 1024) continue
      text = fs.readFileSync(file, 'utf8')
    } catch {
      continue
    }

    const lines = text.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      if (matches.length >= maxMatches) break
      const line = lines[i]
      const m = re.exec(line)
      if (!m) continue
      matches.push({ file, line: i + 1, index: m.index, match: m[0], text: line })
      if (re.global) re.lastIndex = 0
    }
  }

  return { ok: true, cwd, count: matches.length, matches }
}
