import fs from 'node:fs'
import path from 'node:path'
import { walkFiles } from '../utils/fsWalk.js'

const DEFAULT_EXT_RE = /\.(js|cjs|mjs|ts|tsx|jsx|json|yml|yaml|env|txt|md)$/i

function toRel(root, absPath) {
  try {
    return path.relative(root, absPath)
  } catch {
    return absPath
  }
}

function clip(s, maxLen) {
  const str = String(s ?? '')
  if (str.length <= maxLen) return str
  return str.slice(0, Math.max(0, maxLen - 1)) + '…'
}

const RULES = [
  { id: 'HARD_CODED_PRIVATE_KEY', severity: 'high', re: /BEGIN (RSA|EC|OPENSSH) PRIVATE KEY/ },
  { id: 'AWS_ACCESS_KEY', severity: 'high', re: /AKIA[0-9A-Z]{16}/ },
  { id: 'GITHUB_TOKEN', severity: 'high', re: /gh[pousr]_[A-Za-z0-9_]{20,}/ },
  { id: 'NPM_TOKEN', severity: 'high', re: /npm_[A-Za-z0-9]{20,}/ },
  { id: 'GENERIC_SECRET_ASSIGN', severity: 'high', re: /(secret|password|token|api[_-]?key)\s*[:=]\s*['"][^'\"]{8,}/i },
  { id: 'EVAL_USAGE', severity: 'high', re: /\beval\s*\(/ },
  { id: 'FUNCTION_CTOR', severity: 'high', re: /\bnew\s+Function\s*\(/ },
  { id: 'CHILD_PROCESS_EXEC', severity: 'high', re: /\bexec(File)?\s*\(/ },
  { id: 'DANGEROUS_HTML', severity: 'medium', re: /dangerouslySetInnerHTML/ },
  { id: 'INSECURE_HTTP_URL', severity: 'low', re: /\bhttp:\/\// }
]

export async function toolSecurityScan({ params, context }) {
  const cwd = context?.cwd ? path.resolve(context.cwd) : process.cwd()
  const rootDir = params?.rootDir ? path.resolve(cwd, String(params.rootDir)) : cwd
  const maxFiles = params?.maxFiles != null ? Number(params.maxFiles) : 20000
  const maxFindings = params?.maxFindings != null ? Number(params.maxFindings) : 200
  const maxFileBytes = params?.maxFileBytes != null ? Number(params.maxFileBytes) : 1024 * 1024

  if (!Number.isFinite(maxFiles) || maxFiles <= 0) return { ok: false, error: 'Invalid maxFiles' }
  if (!Number.isFinite(maxFindings) || maxFindings <= 0) return { ok: false, error: 'Invalid maxFindings' }

  const files = walkFiles({ rootDir, maxFiles })

  const findings = []
  let scannedFiles = 0

  const summary = { high: 0, medium: 0, low: 0 }

  for (const absPath of files) {
    if (findings.length >= maxFindings) break

    const rel = toRel(rootDir, absPath)

    if (!DEFAULT_EXT_RE.test(rel)) continue

    let st
    try {
      st = fs.statSync(absPath)
      if (!st.isFile()) continue
      if (st.size > maxFileBytes) continue
    } catch {
      continue
    }

    let text
    try {
      text = fs.readFileSync(absPath, 'utf8')
    } catch {
      continue
    }

    scannedFiles += 1

    const lines = text.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      if (findings.length >= maxFindings) break

      const lineText = lines[i]
      if (!lineText) continue

      for (const rule of RULES) {
        if (findings.length >= maxFindings) break
        if (!rule.re.test(lineText)) continue

        findings.push({
          id: rule.id,
          severity: rule.severity,
          file: rel,
          line: i + 1,
          snippet: clip(lineText.trim(), 200)
        })

        summary[rule.severity] += 1
      }
    }
  }

  const ok = findings.length === 0

  return {
    ok: true,
    scanOk: ok,
    cwd,
    rootDir,
    scannedFiles,
    maxFindings,
    findingsCount: findings.length,
    summary,
    findings
  }
}
