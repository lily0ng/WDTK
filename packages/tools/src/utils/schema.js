function typeOf(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function mergeSchemas(a, b) {
  if (!a) return b
  if (!b) return a

  if (a.type !== b.type) {
    return { type: 'union', anyOf: [a, b] }
  }

  if (a.type === 'object') {
    const props = { ...(a.properties || {}) }
    for (const [k, v] of Object.entries(b.properties || {})) {
      props[k] = mergeSchemas(props[k], v)
    }
    return { type: 'object', properties: props }
  }

  if (a.type === 'array') {
    return { type: 'array', items: mergeSchemas(a.items, b.items) }
  }

  return a
}

export function inferSchema(value) {
  const t = typeOf(value)

  if (t === 'object') {
    const props = {}
    for (const [k, v] of Object.entries(value)) props[k] = inferSchema(v)
    return { type: 'object', properties: props }
  }

  if (t === 'array') {
    let items = null
    for (const v of value) items = mergeSchemas(items, inferSchema(v))
    return { type: 'array', items: items || { type: 'unknown' } }
  }

  if (t === 'number') return { type: 'number' }
  if (t === 'string') return { type: 'string' }
  if (t === 'boolean') return { type: 'boolean' }
  if (t === 'null') return { type: 'null' }

  return { type: 'unknown' }
}
