import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'

export async function toolEnvManager({ params, context }) {
  const cwd = context?.cwd ? path.resolve(context.cwd) : process.cwd()
  const mode = String(params?.mode ?? 'list')
  const envFile = String(params?.file ?? '.env')

  if (mode !== 'list') return { ok: false, error: 'Unsupported mode' }

  const filePath = path.isAbsolute(envFile) ? envFile : path.join(cwd, envFile)
  if (!fs.existsSync(filePath)) return { ok: true, file: filePath, vars: {} }

  const text = fs.readFileSync(filePath, 'utf8')
  const parsed = dotenv.parse(text)
  return { ok: true, file: filePath, vars: parsed }
}
