import path from 'node:path'
import fs from 'node:fs'
import {
  copyDir,
  getInstalledPluginById,
  getPluginsDir,
  listInstalledPlugins,
  loadPluginModule,
  removeDir,
  safeId,
  validatePluginManifest
} from '@webdevkit/plugins'

function readManifestFromFolder(folder) {
  const file = path.join(folder, 'manifest.json')
  if (!fs.existsSync(file)) throw new Error('manifest.json not found in plugin folder')
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

export async function toolPlugins({ params, context, db, events }) {
  const action = String(params?.action ?? 'list')

  if (action === 'list') {
    const plugins = listInstalledPlugins().map((p) => ({ id: p.id, manifest: p.manifest }))
    return { ok: true, plugins }
  }

  if (action === 'install') {
    const cwd = context?.cwd ? path.resolve(context.cwd) : process.cwd()
    const source = String(params?.source ?? '')
    if (!source) return { ok: false, error: 'Missing source (folder path)' }

    const srcDir = path.isAbsolute(source) ? source : path.join(cwd, source)
    const manifest = readManifestFromFolder(srcDir)
    const v = validatePluginManifest(manifest)
    if (!v.ok) return { ok: false, error: v.error }
    const id = safeId(manifest.name, manifest.version)

    const dest = path.join(getPluginsDir(), id)
    if (fs.existsSync(dest)) return { ok: false, error: 'Plugin already installed', id }

    copyDir(srcDir, dest)

    const pkgJsonPath = path.join(dest, 'package.json')
    if (!fs.existsSync(pkgJsonPath)) {
      fs.writeFileSync(pkgJsonPath, JSON.stringify({ type: 'module' }, null, 2) + '\n')
    }

    events?.publish({ type: 'plugins.installed', id, ts: Date.now() })
    return { ok: true, id, manifest }
  }

  if (action === 'remove') {
    const id = String(params?.id ?? '')
    if (!id) return { ok: false, error: 'Missing id' }

    const dir = path.join(getPluginsDir(), id)
    if (!fs.existsSync(dir)) return { ok: false, error: 'Plugin not found' }
    removeDir(dir)

    events?.publish({ type: 'plugins.removed', id, ts: Date.now() })
    return { ok: true, id }
  }

  if (action === 'run') {
    const id = String(params?.id ?? '')
    const tool = String(params?.tool ?? '')
    const toolParams = params?.params ?? {}

    if (!id) return { ok: false, error: 'Missing id' }
    if (!tool) return { ok: false, error: 'Missing tool' }

    const plugin = getInstalledPluginById(id)
    if (!plugin) return { ok: false, error: 'Plugin not found' }

    const mod = await loadPluginModule(plugin)
    const tools = mod.tools

    if (!tools || typeof tools !== 'object') {
      return { ok: false, error: 'Plugin module must export a tools object' }
    }

    const fn = tools[tool]
    if (typeof fn !== 'function') {
      return { ok: false, error: 'Tool not found in plugin', available: Object.keys(tools) }
    }

    const result = await fn({ params: toolParams, context, db, events })
    return { ok: true, id, tool, result }
  }

  return { ok: false, error: 'Unsupported action' }
}
