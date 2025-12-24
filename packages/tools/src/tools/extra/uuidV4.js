import crypto from 'node:crypto'

export async function toolUuidV4() {
  return { ok: true, uuid: crypto.randomUUID() }
}
