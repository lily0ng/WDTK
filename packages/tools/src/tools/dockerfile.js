import { generateDockerfile } from '../utils/dockerfile.js'

export async function toolDockerfile({ params }) {
  const dockerfile = generateDockerfile({
    nodeVersion: params?.nodeVersion,
    packageManager: params?.packageManager,
    port: params?.port
  })

  return { ok: true, dockerfile }
}
