export async function toolEnvGet({ params }) {
  const key = String(params?.key ?? '')
  if (!key) return { ok: false, error: 'Missing key' }
  const value = process.env[key]
  return { ok: true, key, present: value != null, value: value != null ? String(value) : null }
}
