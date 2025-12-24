export function migrate(db) {
  db.exec(`
    create table if not exists projects (
      id text primary key,
      path text not null unique,
      created_at integer not null,
      updated_at integer not null
    );

    create table if not exists preferences (
      key text primary key,
      value text not null,
      updated_at integer not null
    );

    create table if not exists tool_data (
      kind text not null,
      id text not null,
      value text not null,
      updated_at integer not null,
      primary key (kind, id)
    );
  `)

  const now = Date.now()
  const upsertPref = db.prepare('insert into preferences (key, value, updated_at) values (@key, @value, @updated_at) on conflict(key) do update set value=excluded.value, updated_at=excluded.updated_at')
  const theme = db.prepare('select value from preferences where key = ?').get('theme')
  if (!theme) upsertPref.run({ key: 'theme', value: JSON.stringify('light'), updated_at: now })

  const fmt = db.prepare('select value from preferences where key = ?').get('defaultOutputFormat')
  if (!fmt) upsertPref.run({ key: 'defaultOutputFormat', value: JSON.stringify('text'), updated_at: now })
}
