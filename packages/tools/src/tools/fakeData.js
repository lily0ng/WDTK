import { createRng, pick } from '../utils/random.js'

const FIRST = ['Alex', 'Jordan', 'Taylor', 'Sam', 'Casey', 'Riley', 'Jamie', 'Morgan']
const LAST = ['Lee', 'Patel', 'Kim', 'Garcia', 'Nguyen', 'Brown', 'Wilson', 'Martinez']
const DOMAINS = ['example.com', 'mail.dev', 'test.local']

function makeValue(rng, type) {
  if (type === 'id') return Math.floor(rng() * 1e9)
  if (type === 'name') return `${pick(rng, FIRST)} ${pick(rng, LAST)}`
  if (type === 'email') {
    const first = pick(rng, FIRST).toLowerCase()
    const last = pick(rng, LAST).toLowerCase()
    return `${first}.${last}@${pick(rng, DOMAINS)}`
  }
  if (type === 'bool') return rng() > 0.5
  if (type === 'number') return Math.round(rng() * 10000) / 100
  if (type === 'date') return new Date(Date.now() - Math.floor(rng() * 86400 * 365 * 1000)).toISOString()
  return String(makeValue(rng, 'name'))
}

function toTs(type) {
  if (type === 'id' || type === 'number') return 'number'
  if (type === 'bool') return 'boolean'
  return 'string'
}

export async function toolFakeData({ params }) {
  const count = Number(params?.count ?? 10)
  const seed = params?.seed != null ? Number(params.seed) : Date.now()
  const fields = Array.isArray(params?.fields) && params.fields.length
    ? params.fields
    : [
        { name: 'id', type: 'id' },
        { name: 'name', type: 'name' },
        { name: 'email', type: 'email' }
      ]

  const rng = createRng(seed)
  const items = []

  for (let i = 0; i < count; i++) {
    const row = {}
    for (const f of fields) {
      const name = String(f.name)
      const type = String(f.type)
      row[name] = makeValue(rng, type)
    }
    items.push(row)
  }

  const interfaceName = String(params?.interfaceName ?? 'GeneratedRow')
  const tsInterface = `export interface ${interfaceName} {\n` +
    fields.map((f) => `  ${String(f.name)}: ${toTs(String(f.type))}`).join('\n') +
    `\n}`

  return { ok: true, count, seed, fields, items, tsInterface }
}
