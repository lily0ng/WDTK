function parseCsv(csv) {
  const lines = csv.split(/\r?\n/).filter((l) => l.length)
  if (lines.length === 0) return []
  const headers = lines[0].split(',').map((s) => s.trim())
  return lines.slice(1).map((line) => {
    const cols = line.split(',')
    const obj = {}
    for (let i = 0; i < headers.length; i++) obj[headers[i]] = cols[i] ?? ''
    return obj
  })
}

function toCsv(rows) {
  const arr = Array.isArray(rows) ? rows : []
  const headers = Array.from(new Set(arr.flatMap((r) => Object.keys(r || {}))))
  const out = [headers.join(',')]
  for (const r of arr) {
    out.push(headers.map((h) => String((r || {})[h] ?? '')).join(','))
  }
  return out.join('\n')
}

export async function toolConvert({ params }) {
  const from = String(params?.from ?? 'json')
  const to = String(params?.to ?? 'csv')
  const input = String(params?.input ?? '')

  if (from === 'json' && to === 'csv') {
    const rows = JSON.parse(input)
    return { ok: true, output: toCsv(rows) }
  }

  if (from === 'csv' && to === 'json') {
    return { ok: true, output: JSON.stringify(parseCsv(input), null, 2) }
  }

  return { ok: false, error: `Unsupported conversion: ${from} -> ${to}` }
}
