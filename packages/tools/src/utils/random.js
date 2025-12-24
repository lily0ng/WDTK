export function createRng(seed) {
  let s = Number.isFinite(seed) ? seed : Date.now()

  return function next() {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

export function pick(rng, arr) {
  if (!arr.length) return null
  const idx = Math.floor(rng() * arr.length)
  return arr[idx]
}
