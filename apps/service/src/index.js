import { createHttpServer } from './http.js'
import { createWsServer } from './ws.js'

const port = Number(process.env.WEBDEVKIT_SERVICE_PORT || 3001)
const host = String(process.env.WEBDEVKIT_SERVICE_HOST || '127.0.0.1')

const { app, server, events } = await createHttpServer()
createWsServer({ server, events })

server.listen(port, host, () => {
  process.stdout.write(`webdevkit-service listening on http://${host}:${port}\n`)
})

process.on('SIGINT', () => {
  server.close(() => process.exit(0))
})
