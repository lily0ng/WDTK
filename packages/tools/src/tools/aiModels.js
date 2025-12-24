function joinUrl(baseUrl, path) {
  const base = String(baseUrl || '').replace(/\/+$/, '')
  const p = String(path || '').replace(/^\/+/, '')
  return `${base}/${p}`
}

async function fetchJsonWithTimeout(url, timeoutMs) {
  const t = typeof timeoutMs === 'number' ? timeoutMs : 2500
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), t)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    const json = await res.json().catch(() => null)
    return { ok: res.ok, status: res.status, json, error: null }
  } catch (e) {
    return { ok: false, status: 0, json: null, error: e?.message || String(e) }
  } finally {
    clearTimeout(timer)
  }
}

export async function toolAiModels({ params }) {
  const provider = params?.provider ? String(params.provider) : null

  const providers = {
    openai: { key: 'openai', label: 'OpenAI (hosted)', baseUrl: 'https://api.openai.com/v1', needsApiKey: true },
    openai_compatible: { key: 'openai_compatible', label: 'OpenAI-compatible (local/server)', baseUrl: 'http://127.0.0.1:1234/v1', needsApiKey: false },
    ollama: { key: 'ollama', label: 'Ollama (local)', baseUrl: 'http://127.0.0.1:11434', needsApiKey: false },
    openrouter: { key: 'openrouter', label: 'OpenRouter (hosted, OpenAI-compatible)', baseUrl: 'https://openrouter.ai/api/v1', needsApiKey: true },
    together: { key: 'together', label: 'Together.ai (hosted, OpenAI-compatible)', baseUrl: 'https://api.together.xyz/v1', needsApiKey: true },
    groq: { key: 'groq', label: 'Groq (hosted, OpenAI-compatible)', baseUrl: 'https://api.groq.com/openai/v1', needsApiKey: true },
    mistral: { key: 'mistral', label: 'Mistral (hosted, OpenAI-compatible)', baseUrl: 'https://api.mistral.ai/v1', needsApiKey: true },
    deepinfra: { key: 'deepinfra', label: 'DeepInfra (hosted, OpenAI-compatible)', baseUrl: 'https://api.deepinfra.com/v1/openai', needsApiKey: true },
    fireworks: { key: 'fireworks', label: 'Fireworks (hosted, OpenAI-compatible)', baseUrl: 'https://api.fireworks.ai/inference/v1', needsApiKey: true },
    perplexity: { key: 'perplexity', label: 'Perplexity (hosted, OpenAI-compatible)', baseUrl: 'https://api.perplexity.ai', needsApiKey: true }
  }

  const recommended = [
    { id: 'llama3.1:8b', family: 'Llama 3.1', task: 'general', notes: 'Great general-purpose local model (Ollama).' },
    { id: 'llama3.1:70b', family: 'Llama 3.1', task: 'general', notes: 'High quality, needs strong hardware.' },
    { id: 'mistral:7b', family: 'Mistral', task: 'general', notes: 'Fast, strong baseline.' },
    { id: 'mixtral:8x7b', family: 'Mixtral', task: 'general', notes: 'MoE model, strong reasoning for local.' },
    { id: 'qwen2.5:7b', family: 'Qwen 2.5', task: 'general', notes: 'Strong multilingual + coding mix.' },
    { id: 'qwen2.5:14b', family: 'Qwen 2.5', task: 'general', notes: 'Better quality, heavier.' },
    { id: 'phi3:mini', family: 'Phi-3', task: 'general', notes: 'Small, efficient.' },
    { id: 'gemma2:9b', family: 'Gemma 2', task: 'general', notes: 'Strong open model for local use.' },
    { id: 'starcoder2:7b', family: 'StarCoder2', task: 'code', notes: 'Code-focused open model.' },
    { id: 'deepseek-coder:6.7b', family: 'DeepSeek Coder', task: 'code', notes: 'Code-focused open model (local).' }
  ]

  if (provider && !providers[provider]) {
    return { ok: false, error: 'Unknown provider' }
  }

  const filteredProviders = provider ? { [provider]: providers[provider] } : providers
  let models = recommended
  const runtime = {}

  if (!provider || provider === 'ollama') {
    const baseUrl = String(params?.baseUrl || providers.ollama.baseUrl)
    const r = await fetchJsonWithTimeout(joinUrl(baseUrl, 'api/tags'), 2500)
    const list = Array.isArray(r.json?.models) ? r.json.models : []
    const installed = list
      .map((m) => ({ id: String(m?.name || '').trim() }))
      .filter((m) => m.id)

    runtime.ollama = {
      ok: r.ok,
      baseUrl,
      installedCount: installed.length,
      error: r.ok ? null : (r.error || `HTTP ${r.status}`)
    }

    if (provider === 'ollama' && installed.length > 0) {
      models = installed.map((m) => ({ id: m.id, family: 'installed', task: 'local', notes: 'Installed in Ollama' }))
    }
  }

  return {
    ok: true,
    providers: filteredProviders,
    models,
    runtime,
    output: {
      schema: 'webdevkit.ai.models.v2',
      ts: Date.now()
    }
  }
}
