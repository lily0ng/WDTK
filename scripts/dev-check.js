import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const pkg = path.join(root, 'package.json')

if (!fs.existsSync(pkg)) {
  process.stderr.write('package.json not found\n')
  process.exit(1)
}

process.stdout.write('ok\n')
