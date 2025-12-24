import { Preferences } from '@webdevkit/db'

export async function toolPreferences({ params, db, events }) {
  const action = String(params?.action ?? 'get')

  if (action === 'all') {
    return { ok: true, preferences: Preferences.all(db) }
  }

  if (action === 'get') {
    const key = String(params?.key ?? '')
    if (!key) return { ok: false, error: 'Missing key' }
    const value = Preferences.get(db, key)
    return { ok: true, key, value }
  }

  if (action === 'set') {
    const key = String(params?.key ?? '')
    if (!key) return { ok: false, error: 'Missing key' }
    const value = params?.value ?? null
    Preferences.set(db, key, value)
    events?.publish({ type: 'preferences.updated', key, ts: Date.now() })
    return { ok: true, key, value }
  }

  return { ok: false, error: 'Unsupported action' }
}
