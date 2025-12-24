export async function toolTimeNow() {
  const ts = Date.now()
  return { ok: true, epochMs: ts, iso: new Date(ts).toISOString() }
}
