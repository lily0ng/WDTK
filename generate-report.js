import fs from 'node:fs'
import path from 'node:path'

function main() {
  const root = process.cwd()
  const outDir = path.join(root, 'reports')
  fs.mkdirSync(outDir, { recursive: true })

  const securityTemplatesDir = path.join(root, 'templates', 'security', 'secure-code-style')
  const securityTemplatesExists = fs.existsSync(securityTemplatesDir)

  const report = {
    ok: true,
    ts: Date.now(),
    sections: {
      securityTemplates: {
        path: 'templates/security/secure-code-style',
        exists: securityTemplatesExists
      }
    }
  }

  const outFile = path.join(outDir, 'security-report.json')
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2) + '\n')
  process.stdout.write(JSON.stringify({ ok: true, outFile: path.relative(root, outFile) }, null, 2) + '\n')
}

main()
