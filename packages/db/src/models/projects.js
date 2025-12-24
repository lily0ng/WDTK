import crypto from 'node:crypto'

export function getByPath(db, projectPath) {
  return db.prepare('select * from projects where path = ?').get(projectPath)
}

export function getOrCreateByPath(db, projectPath) {
  const existing = getByPath(db, projectPath)
  if (existing) return existing

  const now = Date.now()
  const id = crypto.randomUUID()
  db.prepare('insert into projects (id, path, created_at, updated_at) values (?, ?, ?, ?)').run(id, projectPath, now, now)
  return getByPath(db, projectPath)
}
