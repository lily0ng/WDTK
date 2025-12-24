create table if not exists wdtk_preferences (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists wdtk_snippets (
  id uuid primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
