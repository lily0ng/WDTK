import { Preferences } from '@webdevkit/db'

export function getSupabaseConfig(db) {
  const url = Preferences.get(db, 'supabase.url')
  const anonKey = Preferences.get(db, 'supabase.anonKey')
  return { url, anonKey }
}
