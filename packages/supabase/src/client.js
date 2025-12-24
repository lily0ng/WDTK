import { createClient } from '@supabase/supabase-js'

export function createSupabaseClient({ url, anonKey }) {
  if (!url) throw new Error('Missing Supabase url')
  if (!anonKey) throw new Error('Missing Supabase anon key')
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}
