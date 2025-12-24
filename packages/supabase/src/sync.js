import { Preferences, ToolData } from '@webdevkit/db'
import { createSupabaseClient } from './client.js'

export async function syncPreferencesToSupabase({ db, url, anonKey }) {
  const sb = createSupabaseClient({ url, anonKey })
  const prefs = Preferences.all(db)

  const rows = Object.entries(prefs).map(([key, value]) => ({ key, value }))
  const { error } = await sb.from('wdtk_preferences').upsert(rows, { onConflict: 'key' })
  if (error) throw new Error(error.message)

  return { ok: true, count: rows.length }
}

export async function syncSnippetsToSupabase({ db, url, anonKey }) {
  const sb = createSupabaseClient({ url, anonKey })
  const items = ToolData.list(db, 'snippets')

  const rows = items.map((it) => ({ id: it.id, value: it.value }))
  const { error } = await sb.from('wdtk_snippets').upsert(rows, { onConflict: 'id' })
  if (error) throw new Error(error.message)

  return { ok: true, count: rows.length }
}
