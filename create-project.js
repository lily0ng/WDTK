import fs from 'node:fs'
import path from 'node:path'

function toCamel(s) {
  return String(s)
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => String(c).toUpperCase())
    .replace(/^[^a-zA-Z]+/, '')
    .replace(/^(.)/, (m) => m.toLowerCase())
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function writeFileIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) return false
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, content)
  return true
}

function moduleStub(relPath) {
  const base = path.basename(relPath)
  const exportName = toCamel(base)
  const id = relPath.replace(/\\/g, '/')

  return `export function ${exportName}(input) {
  const safe = input && typeof input === 'object' ? input : {}
  return { ok: true, module: ${JSON.stringify(id)}, input: safe }
}
`
}

const SECURITY_TEMPLATE = [
  {
    dir: '01-authentication-system',
    files: [
      'auth-manager.js',
      'multi-factor-auth.js',
      'biometric-auth.js',
      'password-validator.js',
      'jwt-handler.js',
      'session-refresh.js',
      'account-lockout.js',
      'device-management.js',
      'login-analytics.js',
      'audit-logger.js',
      'auth-middleware.js',
      'key-rotation.js',
      'brute-force-detector.js',
      'password-reset-secure.js',
      'social-auth-security.js'
    ]
  },
  {
    dir: '02-authorization-framework',
    files: [
      'rbac-manager.js',
      'abac-engine.js',
      'permission-checker.js',
      'policy-evaluator.js',
      'scope-manager.js',
      'resource-guard.js',
      'access-decision-manager.js',
      'authorization-middleware.js',
      'permission-test.js',
      'role-hierarchy.js',
      'dynamic-authorization.js',
      'access-logger.js'
    ]
  },
  {
    dir: '03-input-validation',
    files: [
      'sanitizer.js',
      'validator-engine.js',
      'xss-filter.js',
      'sql-injection-filter.js',
      'file-path-validator.js',
      'email-validator.js',
      'phone-validator.js',
      'url-validator.js',
      'json-validator.js',
      'xml-validator.js',
      'regex-security.js',
      'input-normalizer.js',
      'validation-middleware.js',
      'schema-validator.js',
      'custom-validators.js',
      'validation-utils.js',
      'attack-pattern-detector.js',
      'validation-test-suite.js'
    ]
  },
  {
    dir: '04-crypto-security',
    files: [
      'encryption-service.js',
      'hash-manager.js',
      'key-management.js',
      'digital-signature.js',
      'secure-random.js',
      'crypto-utils.js',
      'password-hashing.js',
      'file-encryption.js',
      'ssl-tls-manager.js',
      'certificate-handler.js',
      'crypto-test.js',
      'vulnerability-scanner.js',
      'algorithm-selector.js',
      'crypto-config.js',
      'key-exchange.js',
      'quantum-resistant-crypto.js'
    ]
  },
  {
    dir: '05-api-security',
    files: [
      'api-rate-limiter.js',
      'api-key-manager.js',
      'oauth2-handler.js',
      'api-signature.js',
      'request-validator.js',
      'response-sanitizer.js',
      'api-gateway-security.js',
      'webhook-security.js',
      'graphql-security.js',
      'soap-security.js',
      'rest-security.js',
      'api-audit.js',
      'api-throttling.js',
      'api-security-test.js'
    ]
  },
  {
    dir: '06-xss-protection',
    files: [
      'dom-sanitizer.js',
      'html-encoder.js',
      'js-encoder.js',
      'url-encoder.js',
      'css-encoder.js',
      'xss-detector.js',
      'csp-manager.js',
      'trusted-types.js',
      'xss-payload-scanner.js',
      'xss-test-cases.js',
      'browser-security.js',
      'xss-middleware.js',
      'xss-report-generator.js'
    ]
  },
  {
    dir: '07-csrf-protection',
    files: [
      'csrf-token-manager.js',
      'double-submit-cookie.js',
      'synchronizer-token.js',
      'csrf-middleware.js',
      'referrer-checker.js',
      'origin-validator.js',
      'csrf-attack-simulator.js',
      'csrf-test.js',
      'csrf-config.js',
      'csrf-auditor.js'
    ]
  },
  {
    dir: '08-sql-injection-defense',
    files: [
      'query-sanitizer.js',
      'prepared-statement.js',
      'orm-security.js',
      'sql-param-checker.js',
      'sql-keyword-detector.js',
      'injection-scanner.js',
      'nosql-injection.js',
      'db-permission-manager.js',
      'sql-test.js',
      'input-encoding.js',
      'stored-procedure-security.js'
    ]
  },
  {
    dir: '09-rate-limiting',
    files: [
      'sliding-window-limiter.js',
      'token-bucket.js',
      'leaky-bucket.js',
      'ip-based-limiter.js',
      'user-based-limiter.js',
      'api-endpoint-limiter.js',
      'distributed-rate-limiter.js',
      'rate-limit-test.js',
      'limit-config-manager.js'
    ]
  },
  {
    dir: '10-logging-auditing',
    files: [
      'security-logger.js',
      'audit-trail.js',
      'log-sanitizer.js',
      'log-encryptor.js',
      'log-analyzer.js',
      'real-time-monitor.js',
      'alert-system.js',
      'compliance-logger.js',
      'log-rotation.js',
      'siem-integration.js',
      'log-test.js',
      'audit-report-generator.js'
    ]
  },
  {
    dir: '11-headers-security',
    files: [
      'security-headers.js',
      'csp-generator.js',
      'hsts-manager.js',
      'cors-security.js',
      'referrer-policy.js',
      'header-validator.js',
      'header-test.js',
      'security-headers-scanner.js'
    ]
  },
  {
    dir: '12-session-management',
    files: [
      'session-manager.js',
      'secure-cookie.js',
      'session-store.js',
      'session-fixation.js',
      'session-timeout.js',
      'concurrent-session.js',
      'session-encryption.js',
      'session-validation.js',
      'session-middleware.js',
      'session-attack-detector.js',
      'session-test.js',
      'jwt-session.js',
      'oauth-session.js',
      'session-audit.js'
    ]
  },
  {
    dir: '13-file-upload-security',
    files: [
      'file-validator.js',
      'malware-scanner.js',
      'file-type-checker.js',
      'upload-limiter.js',
      'secure-storage.js',
      'virus-detection.js',
      'file-sanitizer.js',
      'image-security.js',
      'zip-bomb-detector.js',
      'upload-logger.js',
      'upload-test.js',
      'file-encryption-upload.js',
      'secure-download.js'
    ]
  },
  {
    dir: '14-env-config-security',
    files: [
      'env-manager.js',
      'secret-manager.js',
      'config-validator.js',
      'env-encryption.js',
      'key-vault.js',
      'config-audit.js',
      'deployment-checker.js',
      'env-test.js',
      'config-rotation.js',
      'security-scanner-env.js'
    ]
  },
  {
    dir: '15-dependency-security',
    files: [
      'package-scanner.js',
      'vulnerability-checker.js',
      'license-checker.js',
      'dependency-audit.js',
      'supply-chain-security.js',
      'npm-security.js',
      'snyk-integration.js',
      'dependency-test.js',
      'version-pinning.js',
      'secure-install.js',
      'dep-update-manager.js'
    ]
  },
  {
    dir: '16-error-handling',
    files: [
      'secure-error-handler.js',
      'error-sanitizer.js',
      'stack-trace-protection.js',
      'custom-errors.js',
      'error-logger.js',
      'graceful-degradation.js',
      'error-middleware.js',
      'error-test.js',
      'info-leak-prevention.js',
      'error-response.js',
      'debug-mode-security.js',
      'error-monitoring.js'
    ]
  },
  {
    dir: '17-pentesting-tools',
    files: [
      'vulnerability-scanner.js',
      'sql-injection-tester.js',
      'xss-tester.js',
      'csrf-tester.js',
      'directory-traversal.js',
      'port-scanner.js',
      'brute-force-tool.js',
      'fuzzer.js',
      'ssl-tester.js',
      'header-scanner.js',
      'security-report.js',
      'automated-pentest.js',
      'payload-generator.js',
      'recon-tool.js',
      'pentest-report.js'
    ]
  },
  {
    dir: '18-security-monitoring',
    files: [
      'real-time-monitor.js',
      'anomaly-detector.js',
      'intrusion-detection.js',
      'performance-monitor.js',
      'alert-manager.js',
      'dashboard.js',
      'metrics-collector.js',
      'threat-intelligence.js',
      'monitoring-test.js',
      'incident-response.js'
    ]
  },
  {
    dir: '19-compliance-framework',
    files: [
      'gdpa-compliance.js',
      'hipaa-checker.js',
      'pci-dss.js',
      'soc2-auditor.js',
      'compliance-scanner.js',
      'policy-manager.js',
      'compliance-report.js',
      'audit-trail-compliance.js',
      'data-privacy.js'
    ]
  },
  {
    dir: '20-security-ci-cd',
    files: [
      'pre-commit-hooks.js',
      'ci-security-scanner.js',
      'saast-integration.js',
      'dast-integration.js',
      'security-gates.js',
      'deployment-security.js',
      'pipeline-audit.js',
      'security-ci-test.js'
    ]
  }
]

function scaffoldSecurityTemplates({ rootDir }) {
  const created = []
  const base = path.join(rootDir, 'templates', 'security', 'secure-code-style')
  ensureDir(base)

  for (const section of SECURITY_TEMPLATE) {
    const dir = path.join(base, section.dir)
    ensureDir(dir)

    for (const f of section.files) {
      const rel = path.join(section.dir, f)
      const abs = path.join(base, rel)
      const ok = writeFileIfMissing(abs, moduleStub(rel))
      if (ok) created.push(path.join('templates', 'security', 'secure-code-style', rel).replace(/\\/g, '/'))
    }
  }

  const readme = path.join(base, 'README.txt')
  const readmeContent = `Security templates: secure-code-style\n\nThis folder is a template pack.\n\nGenerate (idempotent, will not overwrite existing files):\n\n  node create-project.js --security\n\nLocation:\n\n  templates/security/secure-code-style\n\nSections: ${SECURITY_TEMPLATE.length}\n`
  writeFileIfMissing(readme, readmeContent)

  return created
}

function main() {
  const rootDir = process.cwd()
  const args = new Set(process.argv.slice(2))
  const doSecurity = args.has('--security') || args.has('--all') || process.argv.length <= 2

  const created = []
  if (doSecurity) {
    created.push(...scaffoldSecurityTemplates({ rootDir }))
  }

  process.stdout.write(JSON.stringify({ ok: true, createdCount: created.length, created }, null, 2) + '\n')
}

main()
