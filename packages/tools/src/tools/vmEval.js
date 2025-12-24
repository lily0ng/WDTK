import vm from 'node:vm'

function safeJson(value) {
  if (value === undefined) return null
  if (typeof value === 'bigint') return value.toString()
  if (typeof value === 'function') return '[Function]'
  try {
    return JSON.parse(JSON.stringify(value))
  } catch {
    return String(value)
  }
}

export async function toolVmEval({ params }) {
  const code = String(params?.code ?? '')
  const timeoutMs = params?.timeoutMs != null ? Number(params.timeoutMs) : 500

  if (!code.trim()) return { ok: false, error: 'Missing code' }
  if (code.length > 10000) return { ok: false, error: 'Code too large' }

  const sandbox = {
    Math,
    Date,
    JSON
  }

  const context = vm.createContext(sandbox)

  try {
    const script = new vm.Script(`(function(){\n${code}\n})()`, {
      filename: 'webdevkit-vm-eval.js'
    })

    const started = Date.now()
    const result = script.runInContext(context, { timeout: timeoutMs })
    const ended = Date.now()

    return {
      ok: true,
      timeoutMs,
      durationMs: ended - started,
      result: safeJson(result)
    }
  } catch (e) {
    return { ok: false, error: e?.message || String(e), timeoutMs }
  }
}
