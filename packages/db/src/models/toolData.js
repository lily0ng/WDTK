export function list(db, kind) {
  const rows = db.prepare('select id, value, updated_at from tool_data where kind = ? order by updated_at desc').all(kind)
  return rows.map((r) => ({ id: r.id, value: JSON.parse(r.value), updatedAt: r.updated_at }))
}

export function get(db, kind, id) {
  const row = db.prepare('select value, updated_at from tool_data where kind = ? and id = ?').get(kind, id)
  if (!row) return null
  return { id, value: JSON.parse(row.value), updatedAt: row.updated_at }
}

export function upsert(db, kind, id, value) {
  const now = Date.now()
  db.prepare('insert into tool_data (kind, id, value, updated_at) values (?, ?, ?, ?) on conflict(kind, id) do update set value=excluded.value, updated_at=excluded.updated_at').run(kind, id, JSON.stringify(value), now)
  return true
}

export function remove(db, kind, id) {
  db.prepare('delete from tool_data where kind = ? and id = ?').run(kind, id)
  return true
}
