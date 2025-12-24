import path from 'node:path'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import { validatePluginManifest } from './manifest.js'
import { getPluginsDir, readJson } from './storage.js'

function manifestPath(pluginDir) {
  return path.join(pluginDir, 'manifest.json')
}

export function listInstalledPlugins() {
  const dir = getPluginsDir()
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  const plugins = []
  for (const e of entries) {
    if (!e.isDirectory()) continue

    const pdir = path.join(dir, e.name)
    const mpath = manifestPath(pdir)
    if (!fs.existsSync(mpath)) continue

    try {
      const manifest = readJson(mpath)
      const v = validatePluginManifest(manifest)
      if (!v.ok) continue
      plugins.push({ id: e.name, dir: pdir, manifest })
    } catch {
      continue
    }
  }

  return plugins
}

export function getInstalledPluginById(id) {
  const dir = getPluginsDir()
  const pdir = path.join(dir, id)
  const mpath = manifestPath(pdir)
  if (!fs.existsSync(mpath)) return null

  const manifest = readJson(mpath)
  const v = validatePluginManifest(manifest)
  if (!v.ok) throw new Error(v.error)

  return { id, dir: pdir, manifest }
}

export async function loadPluginModule(plugin) {
  const mainRel = plugin.manifest.main || './index.js'
  const entry = path.resolve(plugin.dir, mainRel)
  const url = pathToFileURL(entry).toString()
  return await import(url)
}
