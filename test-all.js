import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

function listJsFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist') continue
      listJsFiles(p, out)
      continue
    }
    if (e.isFile() && /\.js$/i.test(e.name)) out.push(p)
  }
  return out
}

async function smokeImport(files) {
  const imported = []
  const failed = []

  for (const f of files) {
    if (!f.includes(path.join('templates', 'security', 'secure-code-style'))) continue
    try {
      await import(pathToFileURL(f).toString())
      imported.push(path.relative(process.cwd(), f))
    } catch (e) {
      failed.push({ file: path.relative(process.cwd(), f), error: e?.message || String(e) })
    }
  }

  return { importedCount: imported.length, failed }
}

async function main() {
  const root = process.cwd()
  const files = listJsFiles(root)
  const res = await smokeImport(files)
  const ok = res.failed.length === 0
  process.stdout.write(JSON.stringify({ ok, ...res }, null, 2) + '\n')
  if (!ok) process.exit(3)
}

main()
