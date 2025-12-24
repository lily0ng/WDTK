export async function toolColorInvert({ params }) {
  const hex = String(params?.hex ?? '').trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return { ok: false, error: 'Expected 6-digit hex color' }
  const r = 255 - parseInt(hex.slice(0, 2), 16)
  const g = 255 - parseInt(hex.slice(2, 4), 16)
  const b = 255 - parseInt(hex.slice(4, 6), 16)
  const out = `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`
  return { ok: true, input: `#${hex.toLowerCase()}`, output: out }
}
