export function validatePluginManifest(manifest) {
  if (!manifest || typeof manifest !== 'object') return { ok: false, error: 'manifest must be an object' }
  if (!manifest.name || typeof manifest.name !== 'string') return { ok: false, error: 'manifest.name is required' }
  if (!manifest.version || typeof manifest.version !== 'string') return { ok: false, error: 'manifest.version is required' }
  return { ok: true }
}
