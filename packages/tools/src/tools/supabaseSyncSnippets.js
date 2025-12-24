import { getSupabaseConfig, syncSnippetsToSupabase } from '@webdevkit/supabase'

export async function toolSupabaseSyncSnippets({ db, params }) {
  const cfg = getSupabaseConfig(db)
  const url = String(params?.url ?? cfg.url ?? '')
  const anonKey = String(params?.anonKey ?? cfg.anonKey ?? '')

  const res = await syncSnippetsToSupabase({ db, url, anonKey })
  return { ok: true, ...res }
}
