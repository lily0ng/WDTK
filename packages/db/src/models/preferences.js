export function get(db, key) {
  const row = db.prepare('select value from preferences where key = ?').get(key)
  if (!row) return null
  return JSON.parse(row.value)
}

export function set(db, key, value) {
  const now = Date.now()
  db.prepare('insert into preferences (key, value, updated_at) values (?, ?, ?) on conflict(key) do update set value=excluded.value, updated_at=excluded.updated_at').run(key, JSON.stringify(value), now)
  return true
}

export function all(db) {
  const rows = db.prepare('select key, value from preferences order by key asc').all()
  const out = {}
  for (const r of rows) out[r.key] = JSON.parse(r.value)
  return out
}
