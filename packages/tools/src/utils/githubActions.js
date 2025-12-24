export function generateGithubActions({ nodeVersion, packageManager }) {
  const nv = String(nodeVersion || '20')
  const pm = String(packageManager || 'npm')

  const install = pm === 'pnpm'
    ? 'corepack enable\npnpm install --frozen-lockfile'
    : pm === 'yarn'
      ? 'yarn install --frozen-lockfile'
      : 'npm ci'

  const test = pm === 'pnpm' ? 'pnpm test' : pm === 'yarn' ? 'yarn test' : 'npm test'

  return `name: CI\n\non:\n  push:\n  pull_request:\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '${nv}'\n      - name: Install\n        run: |\n          ${install.replace(/\n/g, '\n          ')}\n      - name: Test\n        run: ${test}\n`
}
