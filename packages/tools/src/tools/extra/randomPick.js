export async function toolRandomPick({ params }) {
  const items = Array.isArray(params?.items) ? params.items : []
  if (items.length === 0) return { ok: false, error: 'Missing items (array)' }
  const idx = Math.floor(Math.random() * items.length)
  return { ok: true, index: idx, value: items[idx] }
}
