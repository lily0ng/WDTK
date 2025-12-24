import path from 'node:path'
import { buildFileTree } from '../utils/fileTree.js'

export async function toolFileTree({ params, context }) {
  const cwd = context?.cwd ? path.resolve(context.cwd) : process.cwd()
  const dir = params?.dir ? path.resolve(cwd, String(params.dir)) : cwd
  const maxDepth = params?.maxDepth != null ? Number(params.maxDepth) : 4
  const maxEntries = params?.maxEntries != null ? Number(params.maxEntries) : 1000

  return { ok: true, ...buildFileTree({ rootDir: dir, maxDepth, maxEntries }) }
}
