export function createClient({ baseUrl, fetchFn }) {
  const base = String(baseUrl || 'http://127.0.0.1:3001')
  const f = fetchFn || globalThis.fetch

  async function listTools() {
    const res = await f(`${base}/api/tools/list`)
    const json = await res.json()
    if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`)
    return json.tools
  }

  async function runTool({ name, params, context }) {
    const res = await f(`${base}/api/tools/run`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, params: params || {}, context: context || {} })
    })
    const json = await res.json()
    if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`)
    return json.result
  }

  return { listTools, runTool }
}
