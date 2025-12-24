import { request } from '../utils/httpClient.js'

export async function toolHttpRequest({ params }) {
  const method = String(params?.method ?? 'GET').toUpperCase()
  const url = String(params?.url ?? '')
  const headers = params?.headers && typeof params.headers === 'object' ? params.headers : {}
  const body = params?.body ?? null
  const timeoutMs = params?.timeoutMs != null ? Number(params.timeoutMs) : 15000

  if (!url) return { ok: false, error: 'Missing url' }

  const res = await request({ method, url, headers, body, timeoutMs })

  let parsed = null
  const ct = String(res.headers?.['content-type'] || '')
  if (ct.includes('application/json')) {
    try {
      parsed = JSON.parse(res.body)
    } catch {
      parsed = null
    }
  }

  return { ok: true, request: { method, url }, response: { status: res.status, headers: res.headers, body: res.body, json: parsed } }
}
