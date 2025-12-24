import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import express from 'express'

const servers = new Map()

export async function toolStaticServer({ params, context }) {
  const action = String(params?.action ?? 'start')

  if (action === 'status') {
    return { ok: true, servers: Array.from(servers.values()).map((s) => ({ id: s.id, port: s.port, dir: s.dir })) }
  }

  if (action === 'stop') {
    const id = String(params?.id ?? '')
    const s = servers.get(id)
    if (!s) return { ok: false, error: 'Unknown server id' }
    await new Promise((resolve) => s.server.close(resolve))
    servers.delete(id)
    return { ok: true, id }
  }

  const cwd = context?.cwd ? path.resolve(context.cwd) : process.cwd()
  const dir = params?.dir ? path.resolve(cwd, String(params.dir)) : cwd
  const port = Number(params?.port ?? 4000)

  if (!fs.existsSync(dir)) return { ok: false, error: 'Directory does not exist' }

  const app = express()
  app.use(express.static(dir))

  const id = crypto.randomUUID()
  const server = app.listen(port, '127.0.0.1')

  servers.set(id, { id, port, dir, server })

  return { ok: true, id, port, dir }
}
