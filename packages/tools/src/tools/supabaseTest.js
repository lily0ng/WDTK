import { getSupabaseConfig, createSupabaseClient } from '@webdevkit/supabase'

export async function toolSupabaseTest({ db, params }) {
  const cfg = getSupabaseConfig(db)
  const url = String(params?.url ?? cfg.url ?? '')
  const anonKey = String(params?.anonKey ?? cfg.anonKey ?? '')

  const sb = createSupabaseClient({ url, anonKey })
  const { data, error } = await sb.from('wdtk_preferences').select('key').limit(1)
  if (error) return { ok: false, error: error.message }

  return { ok: true, url, reachable: true, sample: data }
}
