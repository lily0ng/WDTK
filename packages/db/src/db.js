import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
import Database from 'better-sqlite3'
import { migrate } from './migrate.js'

let singleton = null

function defaultDbPath() {
  const dir = path.join(os.homedir(), '.webdevkit')
  fs.mkdirSync(dir, { recursive: true })
  return path.join(dir, 'webdevkit.sqlite')
}

export function getDb(dbPath) {
  if (singleton) return singleton

  const file = dbPath || process.env.WEBDEVKIT_DB_PATH || defaultDbPath()
  const db = new Database(file)
  db.pragma('journal_mode = WAL')

  migrate(db)

  singleton = db
  return db
}

export function closeDb() {
  if (!singleton) return
  singleton.close()
  singleton = null
}
