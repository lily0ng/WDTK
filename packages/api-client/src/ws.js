export function connectWs({ baseUrl, onEvent }) {
  const url = new URL('/ws', baseUrl || 'http://127.0.0.1:3001')
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'

  const ws = new WebSocket(url.toString())
  ws.onmessage = (ev) => {
    try {
      onEvent?.(JSON.parse(ev.data))
    } catch {
      onEvent?.(ev.data)
    }
  }
  return ws
}
