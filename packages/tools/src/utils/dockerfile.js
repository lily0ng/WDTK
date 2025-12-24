export function generateDockerfile({ nodeVersion, packageManager, port }) {
  const nv = String(nodeVersion || '20')
  const pm = String(packageManager || 'npm')
  const p = Number(port || 3000)

  const install = pm === 'pnpm'
    ? 'corepack enable && pnpm install --frozen-lockfile'
    : pm === 'yarn'
      ? 'yarn install --frozen-lockfile'
      : 'npm ci'

  const run = pm === 'pnpm' ? 'pnpm run start' : pm === 'yarn' ? 'yarn start' : 'npm run start'

  return `FROM node:${nv}-alpine\n\nWORKDIR /app\n\nCOPY package*.json ./\n\nRUN ${install}\n\nCOPY . .\n\nEXPOSE ${p}\n\nCMD [\"sh\", \"-lc\", \"${run}\"]\n`
}
