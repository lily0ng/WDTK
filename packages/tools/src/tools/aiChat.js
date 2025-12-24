function normalizeMessages(params) {
  if (Array.isArray(params?.messages)) return params.messages
  if (params?.prompt) return [{ role: 'user', content: String(params.prompt) }]
  return null
}

function joinUrl(baseUrl, path) {
  const base = String(baseUrl || '').replace(/\/+$/, '')
  const p = String(path || '').replace(/^\/+/, '')
  return `${base}/${p}`
}

async function chatOpenAi({ params, baseUrl }) {
  const apiKey = String(params?.apiKey || process.env.OPENAI_API_KEY || '')
  if (!apiKey) return { ok: false, error: 'Missing OPENAI_API_KEY (or params.apiKey)' }

  const model = String(params?.model || process.env.OPENAI_MODEL || 'gpt-4o-mini')
  const temperature = params?.temperature != null ? Number(params.temperature) : 0.2
  const maxTokens = params?.maxTokens != null ? Number(params.maxTokens) : undefined
  const messages = normalizeMessages(params)

  if (!messages || messages.length === 0) return { ok: false, error: 'Missing messages or prompt' }

  const body = { model, messages, temperature }
  if (Number.isFinite(maxTokens)) body.max_tokens = maxTokens

  const res = await fetch(joinUrl(baseUrl, 'chat/completions'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) return { ok: false, error: json?.error?.message || `HTTP ${res.status}` }

  const reply = json?.choices?.[0]?.message?.content ?? ''
  const usage = json?.usage ?? null

  return { ok: true, provider: 'openai', model, reply, usage, raw: json }
}

async function chatOpenAiCompatible({ params, baseUrl }) {
  const model = String(params?.model || 'local-model')
  const temperature = params?.temperature != null ? Number(params.temperature) : 0.2
  const maxTokens = params?.maxTokens != null ? Number(params.maxTokens) : undefined
  const messages = normalizeMessages(params)
  if (!messages || messages.length === 0) return { ok: false, error: 'Missing messages or prompt' }

  const headers = { 'content-type': 'application/json' }
  const apiKey = String(params?.apiKey || '')
  if (apiKey) headers.authorization = `Bearer ${apiKey}`

  const body = { model, messages, temperature }
  if (Number.isFinite(maxTokens)) body.max_tokens = maxTokens

  const res = await fetch(joinUrl(baseUrl, 'chat/completions'), {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) return { ok: false, error: json?.error?.message || `HTTP ${res.status}` }

  const reply = json?.choices?.[0]?.message?.content ?? ''
  const usage = json?.usage ?? null

  return { ok: true, provider: String(params?.provider || 'openai_compatible'), model, reply, usage, raw: json }
}

async function chatOllama({ params, baseUrl }) {
  const model = String(params?.model || 'llama3.1')
  const temperature = params?.temperature != null ? Number(params.temperature) : 0.2
  const messages = normalizeMessages(params)
  if (!messages || messages.length === 0) return { ok: false, error: 'Missing messages or prompt' }

  const body = {
    model,
    messages,
    stream: false,
    options: { temperature }
  }

  const res = await fetch(joinUrl(baseUrl, 'api/chat'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) return { ok: false, error: json?.error || `HTTP ${res.status}` }

  const reply = json?.message?.content ?? ''

  return { ok: true, provider: 'ollama', model, reply, usage: null, raw: json }
}

export async function toolAiChat({ params }) {
  const provider = String(params?.provider || process.env.WEBDEVKIT_AI_PROVIDER || 'openai')

  const openAiCompatibleProviders = {
    openai_compatible: { baseUrl: 'http://127.0.0.1:1234/v1', envKey: 'OPENAI_API_KEY' },
    openrouter: { baseUrl: 'https://openrouter.ai/api/v1', envKey: 'OPENROUTER_API_KEY' },
    together: { baseUrl: 'https://api.together.xyz/v1', envKey: 'TOGETHER_API_KEY' },
    groq: { baseUrl: 'https://api.groq.com/openai/v1', envKey: 'GROQ_API_KEY' },
    mistral: { baseUrl: 'https://api.mistral.ai/v1', envKey: 'MISTRAL_API_KEY' },
    deepinfra: { baseUrl: 'https://api.deepinfra.com/v1/openai', envKey: 'DEEPINFRA_API_KEY' },
    fireworks: { baseUrl: 'https://api.fireworks.ai/inference/v1', envKey: 'FIREWORKS_API_KEY' },
    perplexity: { baseUrl: 'https://api.perplexity.ai', envKey: 'PERPLEXITY_API_KEY' }
  }

  if (provider === 'openai') {
    const baseUrl = String(params?.baseUrl || process.env.WEBDEVKIT_AI_BASE_URL || 'https://api.openai.com/v1')
    return await chatOpenAi({ params, baseUrl })
  }

  if (provider in openAiCompatibleProviders) {
    const preset = openAiCompatibleProviders[provider]
    const baseUrl = String(params?.baseUrl || process.env.WEBDEVKIT_AI_BASE_URL || preset.baseUrl)

    if (!params?.apiKey && preset.envKey && process.env[preset.envKey]) {
      params.apiKey = process.env[preset.envKey]
    }

    return await chatOpenAiCompatible({ params: { ...params, provider }, baseUrl })
  }

  if (provider === 'ollama') {
    const baseUrl = String(params?.baseUrl || process.env.WEBDEVKIT_AI_BASE_URL || 'http://127.0.0.1:11434')
    return await chatOllama({ params, baseUrl })
  }

  return { ok: false, error: 'Unsupported provider' }
}
