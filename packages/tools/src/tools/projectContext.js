import path from 'node:path'
import { findProjectRoot } from '@webdevkit/core'

export async function toolProjectContext({ context }) {
  const cwd = context?.cwd ? path.resolve(context.cwd) : process.cwd()
  const projectRoot = findProjectRoot(cwd)
  return { cwd, projectRoot }
}
