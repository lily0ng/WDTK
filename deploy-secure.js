import fs from 'node:fs'
import path from 'node:path'

function main() {
  const root = process.cwd()
  const outDir = path.join(root, 'reports')
  fs.mkdirSync(outDir, { recursive: true })

  const payload = {
    ok: true,
    ts: Date.now(),
    message: 'deploy-secure is a template script. Integrate with your CI/CD environment.'
  }

  fs.writeFileSync(path.join(outDir, 'deploy-secure.json'), JSON.stringify(payload, null, 2) + '\n')
  process.stdout.write(JSON.stringify(payload, null, 2) + '\n')
}

main()
