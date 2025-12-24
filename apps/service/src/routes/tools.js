import express from 'express'
import { listTools, runTool } from '@webdevkit/tools'
import { getDb } from '@webdevkit/db'

export function toolsRouter({ events }) {
  const router = express.Router()

  router.get('/list', (_req, res) => {
    res.json({ ok: true, tools: listTools() })
  })

  router.post('/run', async (req, res) => {
    const { name, params, context } = req.body || {}

    if (!name) {
      res.status(400).json({ ok: false, error: 'Missing tool name' })
      return
    }

    try {
      const db = getDb()
      const result = await runTool({ name, params: params || {}, context: context || {}, db, events })
      res.json({ ok: true, result })
    } catch (err) {
      res.status(500).json({ ok: false, error: err?.message || String(err) })
    }
  })

  return router
}
