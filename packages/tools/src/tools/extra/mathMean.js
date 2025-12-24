export async function toolMathMean({ params }) {
  const numbers = Array.isArray(params?.numbers) ? params.numbers.map(Number).filter((n) => Number.isFinite(n)) : []
  if (numbers.length === 0) return { ok: false, error: 'Missing numbers (array)' }
  const sum = numbers.reduce((a, b) => a + b, 0)
  return { ok: true, count: numbers.length, mean: sum / numbers.length }
}
