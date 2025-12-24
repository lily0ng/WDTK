import fs from 'node:fs'
import path from 'node:path'

function listFiles(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist') continue
      listFiles(p, out)
      continue
    }
    if (e.isFile()) out.push(p)
  }
  return out
}

function scanForPatterns(files) {
  const findings = []
  const patterns = [
    { id: 'HARD_CODED_PRIVATE_KEY', re: /BEGIN (RSA|EC|OPENSSH) PRIVATE KEY/ },
    { id: 'AWS_ACCESS_KEY', re: /AKIA[0-9A-Z]{16}/ },
    { id: 'GENERIC_SECRET', re: /(secret|password|token)\s*[:=]\s*['"][^'\"]{8,}/i }
  ]

  for (const f of files) {
    if (!/\.(js|cjs|mjs|json|yml|yaml|env|txt)$/i.test(f)) continue
    let text
    try {
      text = fs.readFileSync(f, 'utf8')
    } catch {
      continue
    }

    for (const p of patterns) {
      if (p.re.test(text)) {
        findings.push({ file: path.relative(process.cwd(), f), id: p.id })
      }
    }
  }

  return findings
}

function main() {
  const root = process.cwd()
  const files = listFiles(root)
  const findings = scanForPatterns(files)
  const ok = findings.length === 0
  process.stdout.write(JSON.stringify({ ok, findings }, null, 2) + '\n')
  if (!ok) process.exit(2)
}

main()
