import { toolAiChat } from './aiChat.js'

function extractJsonObject(text) {
  const s = String(text || '').trim()
  try {
    return JSON.parse(s)
  } catch {
    // fallthrough
  }

  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start >= 0 && end > start) {
    const sliced = s.slice(start, end + 1)
    try {
      return JSON.parse(sliced)
    } catch {
      // fallthrough
    }
  }

  return null
}

function validateFiles(payload) {
  const files = payload?.files
  if (!Array.isArray(files) || files.length === 0) {
    return { ok: false, error: 'Missing files array in model output' }
  }

  const out = []
  for (const f of files) {
    const p = typeof f?.path === 'string' ? f.path : ''
    const c = typeof f?.content === 'string' ? f.content : ''
    if (!p || !c) return { ok: false, error: 'Each file must have path and content (string)' }
    out.push({ path: p, content: c })
  }

  return { ok: true, files: out }
}

export async function toolAiCodegen({ params }) {
  const provider = String(params?.provider || 'openai')
  const model = params?.model != null ? String(params.model) : undefined
  const baseUrl = params?.baseUrl != null ? String(params.baseUrl) : undefined
  const apiKey = params?.apiKey != null ? String(params.apiKey) : undefined
  const spec = String(params?.spec || '')

  if (!spec) return { ok: false, error: 'Missing spec' }

  const system = {
    role: 'system',
    content:
      'You are a code generator. Output ONLY valid JSON with this exact schema: {"files":[{"path":"relative/path.ext","content":"file contents"}]}. ' +
      'Do not include markdown fences. Do not include explanations. Use forward slashes. Paths must be relative (no leading /, no ..).'
  }

  const user = {
    role: 'user',
    content: `Generate code files for this request:\n\n${spec}\n\nRemember: output only JSON with {"files":[...]}.`
  }

  const chatParams = { provider, messages: [system, user] }
  if (model) chatParams.model = model
  if (baseUrl) chatParams.baseUrl = baseUrl
  if (apiKey) chatParams.apiKey = apiKey

  const r = await toolAiChat({ params: chatParams })
  if (!r?.ok) return r

  const payload = extractJsonObject(r.reply)
  if (!payload) {
    return { ok: false, error: 'Model did not return valid JSON', reply: r.reply }
  }

  const v = validateFiles(payload)
  if (!v.ok) return { ok: false, error: v.error, reply: r.reply }

  return {
    ok: true,
    provider: r.provider,
    model: r.model,
    files: v.files,
    rawReply: r.reply
  }
}
