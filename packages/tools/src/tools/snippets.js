import crypto from 'node:crypto'
import { ToolData } from '@webdevkit/db'

export async function toolSnippets({ params, db, events }) {
  const action = String(params?.action ?? 'list')

  if (action === 'list') {
    return { ok: true, items: ToolData.list(db, 'snippets') }
  }

  if (action === 'add') {
    const id = crypto.randomUUID()
    const value = {
      title: String(params?.title ?? ''),
      language: String(params?.language ?? ''),
      code: String(params?.code ?? ''),
      tags: Array.isArray(params?.tags) ? params.tags : []
    }
    ToolData.upsert(db, 'snippets', id, value)
    events?.publish({ type: 'toolData.updated', kind: 'snippets', id, ts: Date.now() })
    return { ok: true, id, value }
  }

  if (action === 'remove') {
    const id = String(params?.id ?? '')
    if (!id) return { ok: false, error: 'Missing id' }
    ToolData.remove(db, 'snippets', id)
    events?.publish({ type: 'toolData.removed', kind: 'snippets', id, ts: Date.now() })
    return { ok: true, id }
  }

  return { ok: false, error: 'Unsupported action' }
}
