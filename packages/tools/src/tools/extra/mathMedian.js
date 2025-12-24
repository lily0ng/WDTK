export async function toolMathMedian({ params }) {
  const numbers = Array.isArray(params?.numbers) ? params.numbers.map(Number).filter((n) => Number.isFinite(n)) : []
  if (numbers.length === 0) return { ok: false, error: 'Missing numbers (array)' }
  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
  return { ok: true, count: numbers.length, median }
}
