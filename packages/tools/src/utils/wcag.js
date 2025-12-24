function hexToRgb(hex) {
  const h = String(hex).replace('#', '').trim()
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  if (full.length !== 6) return null

  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return { r, g, b }
}

function srgbToLin(v) {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function luminance({ r, g, b }) {
  const R = srgbToLin(r)
  const G = srgbToLin(g)
  const B = srgbToLin(b)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export function contrastRatio(fgHex, bgHex) {
  const fg = hexToRgb(fgHex)
  const bg = hexToRgb(bgHex)
  if (!fg || !bg) return null

  const L1 = luminance(fg)
  const L2 = luminance(bg)

  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)

  return (lighter + 0.05) / (darker + 0.05)
}

export function wcagScore(ratio) {
  if (ratio == null) return null
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA Large'
  return 'Fail'
}
