import { WebSocketServer } from 'ws'

export function createWsServer({ server, events }) {
  const wss = new WebSocketServer({ noServer: true })

  server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1')
    if (url.pathname !== '/ws') return

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req)
    })
  })

  wss.on('connection', (ws) => {
    const send = (msg) => {
      if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(msg))
    }

    const unsub = events.subscribe((evt) => send(evt))

    ws.on('close', () => {
      unsub()
    })

    send({ type: 'hello', ts: Date.now() })
  })

  return wss
}
