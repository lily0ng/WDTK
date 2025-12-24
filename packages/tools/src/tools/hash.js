import path from 'node:path'
import { hashFile, hashText } from '../utils/hash.js'

export async function toolHash({ params, context }) {
  const algorithm = String(params?.algorithm ?? 'sha256')

  if (params?.file) {
    const cwd = context?.cwd ? path.resolve(context.cwd) : process.cwd()
    const filePath = path.resolve(cwd, String(params.file))
    return { ok: true, algorithm, file: filePath, hash: hashFile({ filePath, algorithm }) }
  }

  return { ok: true, algorithm, hash: hashText({ text: String(params?.text ?? ''), algorithm }) }
}
