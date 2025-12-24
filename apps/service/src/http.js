import http from 'node:http'
import express from 'express'
import cors from 'cors'
import { createEvents } from '@webdevkit/sync'
import { toolsRouter } from './routes/tools.js'
import { healthRouter } from './routes/health.js'

export async function createHttpServer() {
  const app = express()
  const server = http.createServer(app)
  const events = createEvents()

  app.use(cors({ origin: true, credentials: true }))
  app.use(express.json({ limit: '5mb' }))

  app.use('/health', healthRouter())
  app.use('/api/tools', toolsRouter({ events }))

  return { app, server, events }
}
