export async function toolRandomInt({ params }) {
  const min = params?.min != null ? Number(params.min) : 0
  const max = params?.max != null ? Number(params.max) : 100
  const a = Math.min(min, max)
  const b = Math.max(min, max)
  const value = Math.floor(a + Math.random() * (b - a + 1))
  return { ok: true, min: a, max: b, value }
}
