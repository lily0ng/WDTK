import { getSupabaseConfig, syncPreferencesToSupabase } from '@webdevkit/supabase'

export async function toolSupabaseSyncPreferences({ db, params }) {
  const cfg = getSupabaseConfig(db)
  const url = String(params?.url ?? cfg.url ?? '')
  const anonKey = String(params?.anonKey ?? cfg.anonKey ?? '')

  const res = await syncPreferencesToSupabase({ db, url, anonKey })
  return { ok: true, ...res }
}
