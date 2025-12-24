import { inferSchema } from '../utils/schema.js'

export async function toolSchemaInfer({ params }) {
  const jsonText = String(params?.json ?? '')
  let value
  try {
    value = JSON.parse(jsonText)
  } catch (e) {
    return { ok: false, error: e?.message || String(e) }
  }

  return { ok: true, schema: inferSchema(value) }
}
