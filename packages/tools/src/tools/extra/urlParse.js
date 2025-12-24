export async function toolUrlParse({ params }) {
  const input = String(params?.url ?? '')
  if (!input) return { ok: false, error: 'Missing url' }
  const u = new URL(input)
  return {
    ok: true,
    href: u.href,
    origin: u.origin,
    protocol: u.protocol,
    username: u.username,
    password: u.password ? '***' : '',
    host: u.host,
    hostname: u.hostname,
    port: u.port,
    pathname: u.pathname,
    search: u.search,
    hash: u.hash,
    searchParams: Object.fromEntries(u.searchParams.entries())
  }
}
