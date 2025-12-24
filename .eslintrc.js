module.exports = {
  root: true,
  env: { node: true, es2022: true, browser: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-proto': 'error',
    'no-with': 'error',
    'no-unsafe-finally': 'error',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
  }
}
