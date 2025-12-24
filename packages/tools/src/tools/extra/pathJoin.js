import path from 'node:path'

export async function toolPathJoin({ params }) {
  const parts = Array.isArray(params?.parts) ? params.parts.map(String) : []
  if (parts.length === 0) return { ok: false, error: 'Missing parts (array)' }
  return { ok: true, path: path.join(...parts) }
}
