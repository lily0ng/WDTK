export async function toolRegexTest({ params }) {
  const pattern = String(params?.pattern ?? '')
  const flags = String(params?.flags ?? '')
  const input = String(params?.input ?? '')

  let re
  try {
    re = new RegExp(pattern, flags)
  } catch (e) {
    return { ok: false, error: e?.message || String(e) }
  }

  const matches = []
  if (re.global) {
    let m
    while ((m = re.exec(input)) !== null) {
      matches.push({ match: m[0], index: m.index, groups: m.groups || null })
      if (m[0] === '') re.lastIndex++
    }
  } else {
    const m = re.exec(input)
    if (m) matches.push({ match: m[0], index: m.index, groups: m.groups || null })
  }

  return { ok: true, matches }
}
