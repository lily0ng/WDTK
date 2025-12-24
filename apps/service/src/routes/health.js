import express from 'express'

export function healthRouter() {
  const router = express.Router()

  router.get('/', (_req, res) => {
    res.json({ ok: true, ts: Date.now() })
  })

  return router
}
