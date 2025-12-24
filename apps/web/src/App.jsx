import React, { useEffect, useMemo, useState } from 'react'

const toolCategories = [
  { key: 'server', name: 'Local Servers', desc: 'Multi-port server, static server, SSL, mocks' },
  { key: 'code', name: 'Code Quality', desc: 'Linting, dead code, TypeScript strictness' },
  { key: 'css', name: 'CSS & Design', desc: 'Grid/flex builder, tokens, SVG tools' },
  { key: 'data', name: 'Data Tools', desc: 'SQLite browser, converters, fake data' },
  { key: 'perf', name: 'Performance', desc: 'Vitals, Lighthouse history, throttling' },
  { key: 'deploy', name: 'Build & Deploy', desc: 'Env manager, Docker, CI/CD generators' },
  { key: 'security', name: 'Security & Testing', desc: 'Vuln scan, JWT debugger, flow tests' },
  { key: 'workflow', name: 'Workflow', desc: 'Search/replace, snippets, regex tester' }
]

const categoryToolHints = {
  server: ['server.static'],
  code: [],
  css: [],
  data: ['schema.infer', 'fakeData.generate', 'hash.compute', 'convert.run'],
  perf: [],
  deploy: ['dockerfile.generate', 'cicd.githubActions', 'env.list'],
  security: ['security.scan', 'jwt.debug', 'password.check'],
  workflow: ['regex.test', 'searchReplace.run', 'snippets.run'],
  ai: ['ai.chat', 'ai.models', 'ai.codegen', 'ai.files.write'],
  cyber: ['cyber.codec'],
  system: ['os.info', 'vm.eval']
}

 export default function App() {
  const serviceUrl = useMemo(
    () => {
      const desktopUrl = globalThis?.webdevkit?.serviceUrl
      return desktopUrl || import.meta.env.VITE_WEBDEVKIT_SERVICE_URL || 'http://127.0.0.1:3001'
    },
    []
  )
  const [serviceOk, setServiceOk] = useState(null)
  const [availableTools, setAvailableTools] = useState([])
  const [projectContext, setProjectContext] = useState(null)
  const [sbUrl, setSbUrl] = useState('')
  const [sbKey, setSbKey] = useState('')
  const [sbStatus, setSbStatus] = useState(null)
  const [plugins, setPlugins] = useState([])
  const [pluginSource, setPluginSource] = useState('')
  const [pluginId, setPluginId] = useState('')
  const [pluginTool, setPluginTool] = useState('')
  const [pluginToolParams, setPluginToolParams] = useState('{}')
  const [pluginsStatus, setPluginsStatus] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [runToolName, setRunToolName] = useState('')
  const [runToolParams, setRunToolParams] = useState('{}')
  const [runToolStatus, setRunToolStatus] = useState(null)
  const [runToolResult, setRunToolResult] = useState(null)
  const [aiApiKey, setAiApiKey] = useState('')
  const [aiProvider, setAiProvider] = useState('openai')
  const [aiAutoBaseUrl, setAiAutoBaseUrl] = useState(true)
  const [aiBaseUrl, setAiBaseUrl] = useState('')
  const [aiModel, setAiModel] = useState('gpt-4o-mini')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiStatus, setAiStatus] = useState(null)
  const [aiReply, setAiReply] = useState(null)
  const [aiCatalog, setAiCatalog] = useState(null)
  const [codegenSpec, setCodegenSpec] = useState('')
  const [codegenStatus, setCodegenStatus] = useState(null)
  const [codegenResult, setCodegenResult] = useState(null)
  const [codegenDryRun, setCodegenDryRun] = useState(true)
  const [codegenOverwrite, setCodegenOverwrite] = useState(false)
  const [writeStatus, setWriteStatus] = useState(null)
  const [writeResult, setWriteResult] = useState(null)
  const [fsPattern, setFsPattern] = useState('')
  const [fsFlags, setFsFlags] = useState('i')
  const [fsMaxMatches, setFsMaxMatches] = useState(200)
  const [fsStatus, setFsStatus] = useState(null)
  const [fsResult, setFsResult] = useState(null)
  const [treeDir, setTreeDir] = useState('')
  const [treeMaxDepth, setTreeMaxDepth] = useState(4)
  const [treeMaxEntries, setTreeMaxEntries] = useState(1000)
  const [treeStatus, setTreeStatus] = useState(null)
  const [treeResult, setTreeResult] = useState(null)
  const [httpMethod, setHttpMethod] = useState('GET')
  const [httpUrl, setHttpUrl] = useState('')
  const [httpHeaders, setHttpHeaders] = useState('{}')
  const [httpBody, setHttpBody] = useState('')
  const [httpTimeoutMs, setHttpTimeoutMs] = useState(15000)
  const [httpStatus, setHttpStatus] = useState(null)
  const [httpResult, setHttpResult] = useState(null)
  const [hashAlgorithm, setHashAlgorithm] = useState('sha256')
  const [hashTextInput, setHashTextInput] = useState('')
  const [hashFileInput, setHashFileInput] = useState('')
  const [hashStatus, setHashStatus] = useState(null)
  const [hashResult, setHashResult] = useState(null)
  const [cyberAction, setCyberAction] = useState('encode')
  const [cyberCodec, setCyberCodec] = useState('base64')
  const [cyberInput, setCyberInput] = useState('')
  const [cyberOptions, setCyberOptions] = useState('{}')
  const [cyberStatus, setCyberStatus] = useState(null)
  const [cyberResult, setCyberResult] = useState(null)
  const [cyberCatalog, setCyberCatalog] = useState(null)
  const [cyberPreset, setCyberPreset] = useState('')
  const [editorText, setEditorText] = useState('')
  const [editorPath, setEditorPath] = useState('')
  const [editorStatus, setEditorStatus] = useState(null)
  const [editorResult, setEditorResult] = useState(null)
  const [vmCode, setVmCode] = useState('return ({ ok: true, msg: "hello", now: Date.now() })')
  const [vmTimeoutMs, setVmTimeoutMs] = useState(500)
  const [vmStatus, setVmStatus] = useState(null)
  const [vmResult, setVmResult] = useState(null)
  const [osStatus, setOsStatus] = useState(null)
  const [osResult, setOsResult] = useState(null)
  const [secRootDir, setSecRootDir] = useState('')
  const [secMaxFindings, setSecMaxFindings] = useState(200)
  const [secStatus, setSecStatus] = useState(null)
  const [secResult, setSecResult] = useState(null)

  function defaultAiBaseUrl(p) {
    if (p === 'ollama') return 'http://127.0.0.1:11434'
    if (p === 'openai_compatible') return 'http://127.0.0.1:1234/v1'
    if (p === 'openrouter') return 'https://openrouter.ai/api/v1'
    if (p === 'together') return 'https://api.together.xyz/v1'
    if (p === 'groq') return 'https://api.groq.com/openai/v1'
    if (p === 'mistral') return 'https://api.mistral.ai/v1'
    if (p === 'deepinfra') return 'https://api.deepinfra.com/v1/openai'
    if (p === 'fireworks') return 'https://api.fireworks.ai/inference/v1'
    if (p === 'perplexity') return 'https://api.perplexity.ai'
    return 'https://api.openai.com/v1'
  }

  async function runSecurityScan() {
    setSecStatus('running')
    setSecResult(null)
    try {
      const params = { maxFindings: Number(secMaxFindings) }
      if (String(secRootDir || '').trim()) params.rootDir = String(secRootDir).trim()

      const r = await runToolViaService({ name: 'security.scan', params })
      setSecStatus(r.ok ? 'ok' : 'error')
      setSecResult(r.ok ? r.result : r)
    } catch (e) {
      setSecStatus('error')
      setSecResult({ error: e?.message || String(e) })
    }
  }

  async function loadEditorFromFile() {
    setEditorStatus('loading')
    setEditorResult(null)
    try {
      const r = await runToolViaService({ name: 'util.fs.readText', params: { path: editorPath, maxBytes: 20000 } })
      if (!r.ok) {
        setEditorStatus('error')
        setEditorResult(r)
        return
      }
      setEditorStatus(r.result?.truncated ? 'loaded (truncated)' : 'loaded')
      setEditorText(String(r.result?.text || ''))
    } catch (e) {
      setEditorStatus('error')
      setEditorResult({ error: e?.message || String(e) })
    }
  }

  async function editorPrettyJson() {
    setEditorStatus('formatting')
    setEditorResult(null)
    try {
      const r = await runToolViaService({ name: 'util.json.pretty', params: { input: editorText, indent: 2 } })
      if (!r.ok) {
        setEditorStatus('error')
        setEditorResult(r)
        return
      }
      setEditorStatus('ok')
      setEditorText(String(r.result?.output || ''))
    } catch (e) {
      setEditorStatus('error')
      setEditorResult({ error: e?.message || String(e) })
    }
  }

  async function editorMinifyJson() {
    setEditorStatus('minifying')
    setEditorResult(null)
    try {
      const r = await runToolViaService({ name: 'util.json.minify', params: { input: editorText } })
      if (!r.ok) {
        setEditorStatus('error')
        setEditorResult(r)
        return
      }
      setEditorStatus('ok')
      setEditorText(String(r.result?.output || ''))
    } catch (e) {
      setEditorStatus('error')
      setEditorResult({ error: e?.message || String(e) })
    }
  }

  function editorValidateJson() {
    setEditorResult(null)
    try {
      JSON.parse(editorText)
      setEditorStatus('valid json')
    } catch (e) {
      setEditorStatus('invalid json')
      setEditorResult({ error: e?.message || String(e) })
    }
  }

  async function runVmEval() {
    setVmStatus('running')
    setVmResult(null)
    try {
      const r = await runToolViaService({ name: 'vm.eval', params: { code: vmCode, timeoutMs: Number(vmTimeoutMs) } })
      setVmStatus(r.ok ? 'ok' : 'error')
      setVmResult(r.ok ? r.result : r)
    } catch (e) {
      setVmStatus('error')
      setVmResult({ error: e?.message || String(e) })
    }
  }

  async function loadOsInfo() {
    setOsStatus('loading')
    setOsResult(null)
    try {
      const r = await runToolViaService({ name: 'os.info', params: {} })
      setOsStatus(r.ok ? 'ok' : 'error')
      setOsResult(r.ok ? r.result : r)
    } catch (e) {
      setOsStatus('error')
      setOsResult({ error: e?.message || String(e) })
    }
  }

  async function runFsSearch() {
    setFsStatus('running')
    setFsResult(null)
    try {
      const r = await runToolViaService({
        name: 'fs.search',
        params: { pattern: fsPattern, flags: fsFlags, maxMatches: Number(fsMaxMatches) }
      })
      setFsStatus(r.ok ? 'ok' : 'error')
      setFsResult(r.ok ? r.result : r)
    } catch (e) {
      setFsStatus('error')
      setFsResult({ error: e?.message || String(e) })
    }
  }

  async function runTree() {
    setTreeStatus('running')
    setTreeResult(null)
    try {
      const r = await runToolViaService({
        name: 'fs.tree',
        params: { dir: treeDir || '.', maxDepth: Number(treeMaxDepth), maxEntries: Number(treeMaxEntries) }
      })
      setTreeStatus(r.ok ? 'ok' : 'error')
      setTreeResult(r.ok ? r.result : r)
    } catch (e) {
      setTreeStatus('error')
      setTreeResult({ error: e?.message || String(e) })
    }
  }

  async function runHttpRequest() {
    setHttpStatus('running')
    setHttpResult(null)

    let headers
    try {
      headers = JSON.parse(httpHeaders || '{}')
    } catch {
      setHttpStatus('invalid headers')
      return
    }

    const body = httpBody ? httpBody : null

    try {
      const r = await runToolViaService({
        name: 'http.request',
        params: {
          method: httpMethod,
          url: httpUrl,
          headers,
          body,
          timeoutMs: Number(httpTimeoutMs)
        }
      })
      setHttpStatus(r.ok ? 'ok' : 'error')
      setHttpResult(r.ok ? r.result : r)
    } catch (e) {
      setHttpStatus('error')
      setHttpResult({ error: e?.message || String(e) })
    }
  }

  async function runHash() {
    setHashStatus('running')
    setHashResult(null)

    const params = { algorithm: hashAlgorithm }
    if (hashFileInput) params.file = hashFileInput
    else params.text = hashTextInput

    try {
      const r = await runToolViaService({ name: 'hash.compute', params })
      setHashStatus(r.ok ? 'ok' : 'error')
      setHashResult(r.ok ? r.result : r)
    } catch (e) {
      setHashStatus('error')
      setHashResult({ error: e?.message || String(e) })
    }
  }

  function defaultCyberOptions(codec) {
    if (codec === 'caesar') return '{"shift":13}'
    if (codec === 'xor_base64') return '{"key":"secret"}'
    return '{}'
  }

  function getCyberPresets() {
    const codecs = Array.isArray(cyberCatalog?.codecs) ? cyberCatalog.codecs : []
    const out = []
    for (const c of codecs) {
      const id = String(c?.id || '')
      if (!id) continue
      out.push({ id: `encode:${id}`, action: 'encode', codec: id, options: defaultCyberOptions(id) })
      out.push({ id: `decode:${id}`, action: 'decode', codec: id, options: defaultCyberOptions(id) })
    }
    return out
  }

  function applyCyberPreset(presetId) {
    const p = getCyberPresets().find((x) => x.id === presetId)
    if (!p) return
    setCyberAction(p.action)
    setCyberCodec(p.codec)
    setCyberOptions(p.options)
  }

  async function loadCyberCodecs() {
    setCyberStatus('loading codecs')
    setCyberCatalog(null)

    try {
      const r = await runToolViaService({ name: 'cyber.codec', params: { action: 'list' } })
      if (!r.ok) {
        setCyberStatus('error')
        setCyberCatalog(r)
        return
      }
      setCyberStatus('ok')
      setCyberCatalog(r.result)
      const first = r.result?.codecs?.[0]?.id
      if (first && !cyberCodec) setCyberCodec(first)
    } catch (e) {
      setCyberStatus('error')
      setCyberCatalog({ error: e?.message || String(e) })
    }
  }

  async function runCyberCodec() {
    setCyberStatus('running')
    setCyberResult(null)

    let options
    try {
      options = JSON.parse(cyberOptions || '{}')
    } catch {
      setCyberStatus('invalid options')
      return
    }

    try {
      const r = await runToolViaService({
        name: 'cyber.codec',
        params: { action: cyberAction, codec: cyberCodec, input: cyberInput, options }
      })
      setCyberStatus(r.ok ? 'ok' : 'error')
      setCyberResult(r.ok ? r.result : r)
    } catch (e) {
      setCyberStatus('error')
      setCyberResult({ error: e?.message || String(e) })
    }
  }

  function getContextCwd() {
    return projectContext?.projectRoot || projectContext?.cwd || '.'
  }

  async function runToolViaService({ name, params }) {
    const res = await fetch(`${serviceUrl}/api/tools/run`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, params: params || {}, context: { cwd: getContextCwd() } })
    })
    const json = await res.json()
    if (!res.ok || !json.ok) return { ok: false, error: json.error || `HTTP ${res.status}` }

    const result = json.result
    const toolOk = result && typeof result === 'object' && 'ok' in result ? Boolean(result.ok) : true
    if (!toolOk) return { ok: false, error: 'Tool returned ok:false', result }
    return { ok: true, result }
  }

  async function saveSupabaseConfig() {
    setSbStatus(null)
    const r1 = await runToolViaService({ name: 'preferences.getSet', params: { action: 'set', key: 'supabase.url', value: sbUrl } })
    const r2 = await runToolViaService({ name: 'preferences.getSet', params: { action: 'set', key: 'supabase.anonKey', value: sbKey } })
    setSbStatus(r1.ok && r2.ok ? 'saved' : 'error')
  }

  async function runAiChat() {
    setAiStatus('running')
    setAiReply(null)

    const params = {
      provider: aiProvider,
      model: aiModel,
      prompt: aiPrompt
    }

    if (aiBaseUrl) params.baseUrl = aiBaseUrl

    if (aiApiKey) params.apiKey = aiApiKey

    try {
      const r = await runToolViaService({ name: 'ai.chat', params })
      if (!r.ok) {
        setAiStatus('error')
        setAiReply(r)
        return
      }
      setAiStatus('ok')
      setAiReply(r.result)
    } catch (e) {
      setAiStatus('error')
      setAiReply({ error: e?.message || String(e) })
    }
  }

  async function loadAiModels() {
    setAiStatus('loading models')
    setAiCatalog(null)

    const params = {}
    if (aiProvider) params.provider = aiProvider

    try {
      const r = await runToolViaService({ name: 'ai.models', params })
      if (!r.ok) {
        setAiStatus('error')
        setAiCatalog(r)
        return
      }

      setAiStatus('ok')
      setAiCatalog(r.result)

      const p = r.result?.providers?.[aiProvider]
      if (p?.baseUrl && !aiBaseUrl) setAiBaseUrl(p.baseUrl)

      const firstModel = r.result?.models?.[0]?.id
      if (firstModel && !aiModel) setAiModel(firstModel)
    } catch (e) {
      setAiStatus('error')
      setAiCatalog({ error: e?.message || String(e) })
    }
  }

  function getFilteredTools() {
    if (activeCategory === 'all') return availableTools
    const hints = categoryToolHints[activeCategory] || []
    const set = new Set(hints)
    const picked = availableTools.filter((t) => set.has(t))
    return picked.length > 0 ? picked : availableTools
  }

  function onPickCategory(key) {
    setActiveCategory(key)
    const preferred = (categoryToolHints[key] || []).find((t) => availableTools.includes(t))
    if (preferred) setRunToolName(preferred)
  }

  async function testSupabase() {
    setSbStatus('testing')
    const r = await runToolViaService({ name: 'supabase.test', params: {} })
    setSbStatus(r.ok ? 'ok' : 'error')
  }

  async function syncSupabase() {
    setSbStatus('syncing')
    const r1 = await runToolViaService({ name: 'supabase.syncPreferences', params: {} })
    const r2 = await runToolViaService({ name: 'supabase.syncSnippets', params: {} })
    setSbStatus(r1.ok && r2.ok ? 'synced' : 'error')
  }

  async function refreshPlugins() {
    const r = await runToolViaService({ name: 'plugins.manage', params: { action: 'list' } })
    if (r.ok) setPlugins(r.result?.plugins || [])
  }

  async function installPlugin() {
    setPluginsStatus('installing')
    const r = await runToolViaService({ name: 'plugins.manage', params: { action: 'install', source: pluginSource } })
    setPluginsStatus(r.ok ? 'installed' : 'error')
    await refreshPlugins()
  }

  async function removePlugin() {
    setPluginsStatus('removing')
    const r = await runToolViaService({ name: 'plugins.manage', params: { action: 'remove', id: pluginId } })
    setPluginsStatus(r.ok ? 'removed' : 'error')
    await refreshPlugins()
  }

  async function runPluginTool() {
    setPluginsStatus('running')
    let params
    try {
      params = JSON.parse(pluginToolParams || '{}')
    } catch {
      setPluginsStatus('invalid params')
      return
    }

    const r = await runToolViaService({ name: 'plugins.manage', params: { action: 'run', id: pluginId, tool: pluginTool, params } })
    setPluginsStatus(r.ok ? 'ok' : 'error')
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const health = await fetch(`${serviceUrl}/health`)
        if (!cancelled) setServiceOk(health.ok)
      } catch {
        if (!cancelled) setServiceOk(false)
      }

      try {
        const res = await fetch(`${serviceUrl}/api/tools/list`)
        const json = await res.json()
        if (!cancelled) {
          const list = json.tools || []
          setAvailableTools(list)
          if (!runToolName && list.length > 0) setRunToolName(list[0])
        }
      } catch {
        if (!cancelled) setAvailableTools([])
      }

      try {
        const res = await fetch(`${serviceUrl}/api/tools/run`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: 'project.context', params: {}, context: { cwd: '.' } })
        })
        const json = await res.json()
        if (!cancelled && json.ok) setProjectContext(json.result)
      } catch {
        if (!cancelled) setProjectContext(null)
      }

      try {
        if (!cancelled) await refreshPlugins()
      } catch {
        if (!cancelled) setPlugins([])
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [serviceUrl])

  useEffect(() => {
    if (aiAutoBaseUrl) {
      setAiBaseUrl(defaultAiBaseUrl(aiProvider))
      return
    }

    if (!aiBaseUrl) setAiBaseUrl(defaultAiBaseUrl(aiProvider))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiProvider])

  useEffect(() => {
    if (serviceOk && !cyberCatalog) {
      loadCyberCodecs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceOk])

  useEffect(() => {
    const normalized = String(cyberOptions || '').trim()
    if (!normalized || normalized === '{}' || normalized === 'null') {
      setCyberOptions(defaultCyberOptions(cyberCodec))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cyberCodec])

  async function runProjectContext() {
    const r = await runToolViaService({ name: 'project.context', params: {} })
    if (r.ok) setProjectContext(r.result)
  }

  async function runAnyTool() {
    if (!runToolName) return
    setRunToolStatus('running')
    setRunToolResult(null)

    let params
    try {
      params = JSON.parse(runToolParams || '{}')
    } catch {
      setRunToolStatus('invalid params')
      return
    }

    try {
      const r = await runToolViaService({ name: runToolName, params })
      if (!r.ok) {
        setRunToolStatus('error')
        setRunToolResult(r)
        return
      }
      setRunToolStatus('ok')
      setRunToolResult(r.result)
    } catch (e) {
      setRunToolStatus('error')
      setRunToolResult({ error: e?.message || String(e) })
    }
  }

  async function generateCodeFiles() {
    setCodegenStatus('generating')
    setCodegenResult(null)
    setWriteStatus(null)
    setWriteResult(null)

    const params = {
      provider: aiProvider,
      model: aiModel,
      spec: codegenSpec
    }

    if (aiBaseUrl) params.baseUrl = aiBaseUrl
    if (aiApiKey) params.apiKey = aiApiKey

    try {
      const r = await runToolViaService({ name: 'ai.codegen', params })
      if (!r.ok) {
        setCodegenStatus('error')
        setCodegenResult(r)
        return
      }
      setCodegenStatus('ok')
      setCodegenResult(r.result)
    } catch (e) {
      setCodegenStatus('error')
      setCodegenResult({ error: e?.message || String(e) })
    }
  }

  async function writeGeneratedFiles() {
    setWriteStatus('writing')
    setWriteResult(null)

    const files = codegenResult?.files
    if (!Array.isArray(files) || files.length === 0) {
      setWriteStatus('missing files')
      return
    }

    try {
      const r = await runToolViaService({
        name: 'ai.files.write',
        params: { files, overwrite: codegenOverwrite, dryRun: codegenDryRun }
      })
      setWriteStatus(r.ok ? 'ok' : 'error')
      setWriteResult(r.ok ? r.result : r)
    } catch (e) {
      setWriteStatus('error')
      setWriteResult({ error: e?.message || String(e) })
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">WebDevKit</div>
        <div className="subtitle">Local-first developer toolkit</div>
      </header>

      <main className="content">
        <section className="panel">
          <div className="panelTitle">Project</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Current directory</div>
              <div className="v">{projectContext?.cwd || '(not loaded)'}</div>
            </div>
            <div className="kv">
              <div className="k">Theme</div>
              <div className="v">light</div>
            </div>
            <div className="kv">
              <div className="k">Service</div>
              <div className="v">{serviceOk === null ? 'checking…' : serviceOk ? 'connected' : 'offline'}</div>
            </div>
            <div className="kv">
              <div className="k">Tools registered</div>
              <div className="v">{availableTools.length}</div>
            </div>
            <div className="kv">
              <div className="k">Test</div>
              <div className="v">
                <button className="btn" type="button" onClick={runProjectContext} disabled={!serviceOk}>
                  Run project.context
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">Security Scan</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Root dir (relative)</div>
              <div className="v"><input className="input" value={secRootDir} onChange={(e) => setSecRootDir(e.target.value)} placeholder="." disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Max findings</div>
              <div className="v"><input className="input" value={String(secMaxFindings)} onChange={(e) => setSecMaxFindings(e.target.value)} disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={runSecurityScan} disabled={!serviceOk}>Run Scan</button>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{secStatus || ''}</span>
              </div>
            </div>
            {secResult !== null ? (
              <div className="kv">
                <div className="k">Result</div>
                <div className="v"><pre>{JSON.stringify(secResult, null, 2)}</pre></div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">Code Editor</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Load file (relative)</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input className="input" value={editorPath} onChange={(e) => setEditorPath(e.target.value)} placeholder="README.md" disabled={!serviceOk} />
                <button className="btn" type="button" onClick={loadEditorFromFile} disabled={!serviceOk || !editorPath}>
                  Load
                </button>
              </div>
            </div>
            <div className="kv">
              <div className="k">Editor</div>
              <div className="v">
                <textarea className="input" rows={10} value={editorText} onChange={(e) => setEditorText(e.target.value)} disabled={!serviceOk} />
              </div>
            </div>
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={editorValidateJson} disabled={!serviceOk || !editorText}>Validate JSON</button>
                <button className="btn" type="button" onClick={editorPrettyJson} disabled={!serviceOk || !editorText}>Format JSON</button>
                <button className="btn" type="button" onClick={editorMinifyJson} disabled={!serviceOk || !editorText}>Minify JSON</button>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{editorStatus || ''}</span>
              </div>
            </div>
            {editorResult !== null ? (
              <div className="kv">
                <div className="k">Result</div>
                <div className="v"><pre>{JSON.stringify(editorResult, null, 2)}</pre></div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">VM Runner (safe eval)</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Timeout (ms)</div>
              <div className="v"><input className="input" value={String(vmTimeoutMs)} onChange={(e) => setVmTimeoutMs(e.target.value)} disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Code</div>
              <div className="v"><textarea className="input" rows={6} value={vmCode} onChange={(e) => setVmCode(e.target.value)} disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={runVmEval} disabled={!serviceOk || !vmCode}>Run</button>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{vmStatus || ''}</span>
              </div>
            </div>
            {vmResult !== null ? (
              <div className="kv">
                <div className="k">Result</div>
                <div className="v"><pre>{JSON.stringify(vmResult, null, 2)}</pre></div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">Online OS Info</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={loadOsInfo} disabled={!serviceOk}>Refresh</button>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{osStatus || ''}</span>
              </div>
            </div>
            {osResult !== null ? (
              <div className="kv">
                <div className="k">Result</div>
                <div className="v"><pre>{JSON.stringify(osResult, null, 2)}</pre></div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">File Search</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Pattern (regex)</div>
              <div className="v"><input className="input" value={fsPattern} onChange={(e) => setFsPattern(e.target.value)} disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Flags</div>
              <div className="v"><input className="input" value={fsFlags} onChange={(e) => setFsFlags(e.target.value)} disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Max matches</div>
              <div className="v"><input className="input" value={String(fsMaxMatches)} onChange={(e) => setFsMaxMatches(e.target.value)} disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={runFsSearch} disabled={!serviceOk || !fsPattern}>Search</button>
                <span style={{ fontSize: 12, color: '#475569' }}>{fsStatus || ''}</span>
              </div>
            </div>
            {fsResult !== null ? (
              <div className="kv">
                <div className="k">Result</div>
                <div className="v"><pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(fsResult, null, 2)}</pre></div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">File Tree</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Directory</div>
              <div className="v"><input className="input" value={treeDir} onChange={(e) => setTreeDir(e.target.value)} placeholder="." disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Max depth</div>
              <div className="v"><input className="input" value={String(treeMaxDepth)} onChange={(e) => setTreeMaxDepth(e.target.value)} disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Max entries</div>
              <div className="v"><input className="input" value={String(treeMaxEntries)} onChange={(e) => setTreeMaxEntries(e.target.value)} disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={runTree} disabled={!serviceOk}>Build tree</button>
                <span style={{ fontSize: 12, color: '#475569' }}>{treeStatus || ''}</span>
              </div>
            </div>
            {treeResult !== null ? (
              <div className="kv">
                <div className="k">Result</div>
                <div className="v"><pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(treeResult, null, 2)}</pre></div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">HTTP Request</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Method</div>
              <div className="v">
                <select className="input" value={httpMethod} onChange={(e) => setHttpMethod(e.target.value)} disabled={!serviceOk}>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                  <option value="HEAD">HEAD</option>
                </select>
              </div>
            </div>
            <div className="kv">
              <div className="k">URL</div>
              <div className="v"><input className="input" value={httpUrl} onChange={(e) => setHttpUrl(e.target.value)} placeholder="https://example.com" disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Headers (JSON)</div>
              <div className="v"><input className="input" value={httpHeaders} onChange={(e) => setHttpHeaders(e.target.value)} disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Body</div>
              <div className="v"><textarea className="input" rows={3} value={httpBody} onChange={(e) => setHttpBody(e.target.value)} disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Timeout (ms)</div>
              <div className="v"><input className="input" value={String(httpTimeoutMs)} onChange={(e) => setHttpTimeoutMs(e.target.value)} disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={runHttpRequest} disabled={!serviceOk || !httpUrl}>Send</button>
                <span style={{ fontSize: 12, color: '#475569' }}>{httpStatus || ''}</span>
              </div>
            </div>
            {httpResult !== null ? (
              <div className="kv">
                <div className="k">Result</div>
                <div className="v"><pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(httpResult, null, 2)}</pre></div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">Hash</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Algorithm</div>
              <div className="v"><input className="input" value={hashAlgorithm} onChange={(e) => setHashAlgorithm(e.target.value)} placeholder="sha256" disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Text</div>
              <div className="v"><textarea className="input" rows={2} value={hashTextInput} onChange={(e) => setHashTextInput(e.target.value)} disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">File (relative)</div>
              <div className="v"><input className="input" value={hashFileInput} onChange={(e) => setHashFileInput(e.target.value)} placeholder="package.json" disabled={!serviceOk} /></div>
            </div>
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={runHash} disabled={!serviceOk}>Compute</button>
                <span style={{ fontSize: 12, color: '#475569' }}>{hashStatus || ''}</span>
              </div>
            </div>
            {hashResult !== null ? (
              <div className="kv">
                <div className="k">Result</div>
                <div className="v"><pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(hashResult, null, 2)}</pre></div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">Encode / Decode (Cyber)</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Supported</div>
              <div className="v">{Array.isArray(cyberCatalog?.codecs) ? `${cyberCatalog.codecs.length} codecs (~${cyberCatalog.codecs.length * 2} ops)` : '—'}</div>
            </div>
            <div className="kv">
              <div className="k">Preset</div>
              <div className="v">
                <select
                  className="input"
                  value={cyberPreset}
                  onChange={(e) => {
                    const id = e.target.value
                    setCyberPreset(id)
                    applyCyberPreset(id)
                  }}
                  disabled={!serviceOk || !Array.isArray(cyberCatalog?.codecs)}
                >
                  <option value="">(select preset)</option>
                  {getCyberPresets().map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="kv">
              <div className="k">Action</div>
              <div className="v">
                <select className="input" value={cyberAction} onChange={(e) => setCyberAction(e.target.value)} disabled={!serviceOk}>
                  <option value="encode">encode</option>
                  <option value="decode">decode</option>
                </select>
              </div>
            </div>
            <div className="kv">
              <div className="k">Codec</div>
              <div className="v">
                {Array.isArray(cyberCatalog?.codecs) && cyberCatalog.codecs.length > 0 ? (
                  <select className="input" value={cyberCodec} onChange={(e) => setCyberCodec(e.target.value)} disabled={!serviceOk}>
                    {cyberCatalog.codecs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input className="input" value={cyberCodec} onChange={(e) => setCyberCodec(e.target.value)} placeholder="base64" disabled={!serviceOk} />
                )}
              </div>
            </div>
            <div className="kv">
              <div className="k">Options (JSON)</div>
              <div className="v">
                <input className="input" value={cyberOptions} onChange={(e) => setCyberOptions(e.target.value)} placeholder='{"shift":13} or {"key":"secret"}' disabled={!serviceOk} />
              </div>
            </div>
            <div className="kv">
              <div className="k">Input</div>
              <div className="v">
                <textarea className="input" rows={5} value={cyberInput} onChange={(e) => setCyberInput(e.target.value)} disabled={!serviceOk} />
              </div>
            </div>
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={loadCyberCodecs} disabled={!serviceOk}>
                  Load codecs
                </button>
                <button className="btn" type="button" onClick={runCyberCodec} disabled={!serviceOk || !cyberCodec}>
                  Run
                </button>
                <span style={{ fontSize: 12, color: '#475569' }}>{cyberStatus || ''}</span>
              </div>
            </div>
            {cyberResult !== null ? (
              <div className="kv">
                <div className="k">Result</div>
                <div className="v">
                  <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(cyberResult, null, 2)}</pre>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">Tool Runner</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Service URL</div>
              <div className="v">{serviceUrl}</div>
            </div>
            <div className="kv">
              <div className="k">Tool</div>
              <div className="v">
                <select
                  className="input"
                  value={runToolName}
                  onChange={(e) => setRunToolName(e.target.value)}
                  disabled={!serviceOk || availableTools.length === 0}
                >
                  {getFilteredTools().map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="kv">
              <div className="k">Params (JSON)</div>
              <div className="v">
                <textarea
                  className="input"
                  rows={4}
                  value={runToolParams}
                  onChange={(e) => setRunToolParams(e.target.value)}
                  style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
                  disabled={!serviceOk}
                />
              </div>
            </div>
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={runAnyTool} disabled={!serviceOk || !runToolName}>
                  Run
                </button>
                <span style={{ fontSize: 12, color: '#475569' }}>{runToolStatus || ''}</span>
              </div>
            </div>
            {runToolResult !== null ? (
              <div className="kv">
                <div className="k">Result</div>
                <div className="v">
                  <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(runToolResult, null, 2)}</pre>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">AI / LLM (optional)</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Provider</div>
              <div className="v">
                <select className="input" value={aiProvider} onChange={(e) => setAiProvider(e.target.value)} disabled={!serviceOk}>
                  <option value="openai">openai (hosted)</option>
                  <option value="openai_compatible">openai_compatible (LM Studio / llama.cpp / vLLM)</option>
                  <option value="ollama">ollama (local)</option>
                  <option value="openrouter">openrouter</option>
                  <option value="together">together</option>
                  <option value="groq">groq</option>
                  <option value="mistral">mistral</option>
                  <option value="deepinfra">deepinfra</option>
                  <option value="fireworks">fireworks</option>
                  <option value="perplexity">perplexity</option>
                </select>
              </div>
            </div>
            <div className="kv">
              <div className="k">Base URL</div>
              <div className="v">
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    className="input"
                    value={aiBaseUrl}
                    onChange={(e) => setAiBaseUrl(e.target.value)}
                    placeholder="(auto) https://api.openai.com/v1 or http://127.0.0.1:11434"
                    disabled={!serviceOk || aiAutoBaseUrl}
                  />
                  <label style={{ display: 'flex', gap: 6, alignItems: 'center', whiteSpace: 'nowrap', fontSize: 12, color: '#475569' }}>
                    <input type="checkbox" checked={aiAutoBaseUrl} onChange={(e) => setAiAutoBaseUrl(e.target.checked)} disabled={!serviceOk} />
                    Auto
                  </label>
                </div>
              </div>
            </div>
            <div className="kv">
              <div className="k">Model</div>
              <div className="v">
                {Array.isArray(aiCatalog?.models) && aiCatalog.models.length > 0 ? (
                  <select className="input" value={aiModel} onChange={(e) => setAiModel(e.target.value)} disabled={!serviceOk}>
                    {aiCatalog.models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input className="input" value={aiModel} onChange={(e) => setAiModel(e.target.value)} placeholder="gpt-4o-mini / llama3.1:8b / local-model" />
                )}
              </div>
            </div>
            <div className="kv">
              <div className="k">API key</div>
              <div className="v">
                <input className="input" value={aiApiKey} onChange={(e) => setAiApiKey(e.target.value)} placeholder="OPENAI_API_KEY (optional)" />
              </div>
            </div>
            <div className="kv">
              <div className="k">Prompt</div>
              <div className="v">
                <textarea className="input" rows={4} value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
              </div>
            </div>
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={loadAiModels} disabled={!serviceOk}>
                  Load models
                </button>
                <button className="btn" type="button" onClick={runAiChat} disabled={!serviceOk || !aiPrompt}>
                  Chat
                </button>
                <span style={{ fontSize: 12, color: '#475569' }}>{aiStatus || ''}</span>
              </div>
            </div>
            {aiCatalog !== null ? (
              <div className="kv">
                <div className="k">Catalog</div>
                <div className="v">
                  <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(aiCatalog, null, 2)}</pre>
                </div>
              </div>
            ) : null}
            {aiReply !== null ? (
              <div className="kv">
                <div className="k">Reply</div>
                <div className="v">
                  <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(aiReply, null, 2)}</pre>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">LLM Codegen (generate files)</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Spec</div>
              <div className="v">
                <textarea className="input" rows={6} value={codegenSpec} onChange={(e) => setCodegenSpec(e.target.value)} placeholder="Describe the files to generate (paths + features)." disabled={!serviceOk} />
              </div>
            </div>
            <div className="kv">
              <div className="k">Options</div>
              <div className="v" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="checkbox" checked={codegenDryRun} onChange={(e) => setCodegenDryRun(e.target.checked)} />
                  dry-run write
                </label>
                <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="checkbox" checked={codegenOverwrite} onChange={(e) => setCodegenOverwrite(e.target.checked)} />
                  overwrite
                </label>
              </div>
            </div>
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={generateCodeFiles} disabled={!serviceOk || !codegenSpec}>
                  Generate JSON files
                </button>
                <button className="btn" type="button" onClick={writeGeneratedFiles} disabled={!serviceOk || !codegenResult?.files}>
                  Write files
                </button>
                <span style={{ fontSize: 12, color: '#475569' }}>{codegenStatus || writeStatus || ''}</span>
              </div>
            </div>
            {codegenResult !== null ? (
              <div className="kv">
                <div className="k">Codegen JSON</div>
                <div className="v">
                  <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(codegenResult, null, 2)}</pre>
                </div>
              </div>
            ) : null}
            {writeResult !== null ? (
              <div className="kv">
                <div className="k">Write result</div>
                <div className="v">
                  <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(writeResult, null, 2)}</pre>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">Plugins</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Installed</div>
              <div className="v">{plugins.length}</div>
            </div>
            <div className="kv">
              <div className="k">Install source</div>
              <div className="v">
                <input className="input" value={pluginSource} onChange={(e) => setPluginSource(e.target.value)} />
              </div>
            </div>
            <div className="kv">
              <div className="k">Plugin id</div>
              <div className="v">
                <input className="input" value={pluginId} onChange={(e) => setPluginId(e.target.value)} />
              </div>
            </div>
            <div className="kv">
              <div className="k">Tool</div>
              <div className="v">
                <input className="input" value={pluginTool} onChange={(e) => setPluginTool(e.target.value)} />
              </div>
            </div>
            <div className="kv">
              <div className="k">Tool params (JSON)</div>
              <div className="v">
                <input className="input" value={pluginToolParams} onChange={(e) => setPluginToolParams(e.target.value)} />
              </div>
            </div>
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn" type="button" onClick={refreshPlugins} disabled={!serviceOk}>Refresh</button>
                <button className="btn" type="button" onClick={installPlugin} disabled={!serviceOk}>Install</button>
                <button className="btn" type="button" onClick={removePlugin} disabled={!serviceOk}>Remove</button>
                <button className="btn" type="button" onClick={runPluginTool} disabled={!serviceOk}>Run</button>
                <span style={{ fontSize: 12, color: '#475569' }}>{pluginsStatus || ''}</span>
              </div>
            </div>
            {plugins.length > 0 ? (
              <div className="kv">
                <div className="k">Installed plugins</div>
                <div className="v">
                  <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(plugins, null, 2)}</pre>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelTitle">Supabase (optional)</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">URL</div>
              <div className="v">
                <input className="input" value={sbUrl} onChange={(e) => setSbUrl(e.target.value)} placeholder="https://xxxx.supabase.co" />
              </div>
            </div>
            <div className="kv">
              <div className="k">Anon key</div>
              <div className="v">
                <input className="input" value={sbKey} onChange={(e) => setSbKey(e.target.value)} placeholder="supabase anon key" />
              </div>
            </div>
            <div className="kv">
              <div className="k">Actions</div>
              <div className="v" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="btn" type="button" onClick={saveSupabaseConfig} disabled={!serviceOk}>Save</button>
                <button className="btn" type="button" onClick={testSupabase} disabled={!serviceOk}>Test</button>
                <button className="btn" type="button" onClick={syncSupabase} disabled={!serviceOk}>Sync</button>
                <span style={{ fontSize: 12, color: '#475569' }}>{sbStatus || ''}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid">
          {toolCategories.map((t) => (
            <button key={t.key} className="card" type="button" onClick={() => onPickCategory(t.key)}>
              <div className="cardTitle">{t.name}</div>
              <div className="cardDesc">{t.desc}</div>
            </button>
          ))}
          <button key="ai" className="card" type="button" onClick={() => onPickCategory('ai')}>
            <div className="cardTitle">AI / LLM</div>
            <div className="cardDesc">Chat, refactor prompts, generate snippets (optional key)</div>
          </button>
          <button key="cyber" className="card" type="button" onClick={() => onPickCategory('cyber')}>
            <div className="cardTitle">Encode / Decode</div>
            <div className="cardDesc">CyberChef-style codecs (Base64, Hex, URL, Gzip, XOR, …)</div>
          </button>
          <button key="system" className="card" type="button" onClick={() => onPickCategory('system')}>
            <div className="cardTitle">VM + OS</div>
            <div className="cardDesc">Safe eval + OS info (local service)</div>
          </button>
        </section>
      </main>
    </div>
  )
}
