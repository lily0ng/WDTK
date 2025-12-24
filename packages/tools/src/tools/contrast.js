import { contrastRatio, wcagScore } from '../utils/wcag.js'

export async function toolContrast({ params }) {
  const fg = String(params?.fg ?? '')
  const bg = String(params?.bg ?? '')
  const ratio = contrastRatio(fg, bg)
  if (ratio == null) return { ok: false, error: 'Invalid color(s). Use hex like #112233' }
  return { ok: true, fg, bg, ratio, score: wcagScore(ratio) }
}
