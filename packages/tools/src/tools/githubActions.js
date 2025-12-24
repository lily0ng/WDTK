import { generateGithubActions } from '../utils/githubActions.js'

export async function toolGithubActions({ params }) {
  const yaml = generateGithubActions({
    nodeVersion: params?.nodeVersion,
    packageManager: params?.packageManager
  })

  return { ok: true, yaml }
}
