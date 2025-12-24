import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'

export function getPluginsDir() {
  const dir = path.join(os.homedir(), '.webdevkit', 'plugins')
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

export function safeId(name, version) {
  const n = String(name || '').replace(/[^a-zA-Z0-9._-]/g, '-')
  const v = String(version || '').replace(/[^a-zA-Z0-9._-]/g, '-')
  return v ? `${n}@${v}` : n
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

export function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const e of entries) {
    const s = path.join(src, e.name)
    const d = path.join(dest, e.name)
    if (e.isDirectory()) {
      copyDir(s, d)
      continue
    }
    if (e.isFile()) {
      fs.copyFileSync(s, d)
    }
  }
}

export function removeDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true })
}
