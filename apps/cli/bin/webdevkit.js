#!/usr/bin/env node
import { Command } from 'commander'
import { findProjectRoot } from '@webdevkit/core'
import path from 'node:path'
import { getDb } from '@webdevkit/db'
import { listTools, runTool } from '@webdevkit/tools'
import fetchPkg from 'node-fetch'

const program = new Command()
const fetchFn = globalThis.fetch ? globalThis.fetch.bind(globalThis) : fetchPkg

program
  .name('webdevkit')
  .description('Web Developer Tools Kit')
  .option('-C, --cwd <path>', 'Run as if started in this directory')
  .option('--format <format>', 'Output format (json|text|html)', 'text')
  .option('--service-url <url>', 'Local service URL', 'http://127.0.0.1:3001')

program
  .command('connect')
  .description('Connect to the local desktop app service')
  .option('--url <url>', 'Service URL', 'http://127.0.0.1:3001')
  .action(async (opts) => {
    const url = String(opts.url || 'http://127.0.0.1:3001')
    let connected = false
    let error = null

    try {
      const res = await fetchFn(`${url}/health`)
      connected = res.ok
      if (!res.ok) error = `HTTP ${res.status}`
    } catch (e) {
      error = e?.message || String(e)
    }

    const payload = { ok: connected, connected, url }
    if (error) payload.error = error
    output(program.opts(), payload)

    if (!connected) process.exitCode = 1
  })

program
  .command('context')
  .description('Show detected project context')
  .action(() => {
    const baseCwd = program.opts().cwd ? path.resolve(program.opts().cwd) : process.cwd()
    const projectRoot = findProjectRoot(baseCwd)
    output(program.opts(), { cwd: baseCwd, projectRoot })
  })

program
  .command('list-tools')
  .description('List available tools')
  .action(async () => {
    const serviceUrl = String(program.opts().serviceUrl || 'http://127.0.0.1:3001')
    try {
      const res = await fetchFn(`${serviceUrl}/api/tools/list`)
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`)
      output(program.opts(), { tools: json.tools || [] })
      return
    } catch {
      output(program.opts(), { tools: listTools() })
    }
  })

program
  .command('run')
  .description('Run a tool (service-first, with local fallback)')
  .argument('<toolName>', 'Tool name (e.g. project.context)')
  .option('--params <json>', 'JSON params payload', '{}')
  .action(async (toolName, opts) => {
    const baseCwd = program.opts().cwd ? path.resolve(program.opts().cwd) : process.cwd()
    const serviceUrl = String(program.opts().serviceUrl || 'http://127.0.0.1:3001')

    let params
    try {
      params = JSON.parse(opts.params || '{}')
    } catch (e) {
      output(program.opts(), { ok: false, error: 'Invalid JSON for --params' })
      process.exitCode = 1
      return
    }

    const payload = {
      name: toolName,
      params,
      context: { cwd: baseCwd }
    }

    try {
      const res = await fetchFn(`${serviceUrl}/api/tools/run`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`)
      output(program.opts(), json.result)
      return
    } catch {
      const db = getDb()
      const result = await runTool({ name: toolName, params, context: { cwd: baseCwd }, db, events: null })
      output(program.opts(), result)
    }
  })

program.parse(process.argv)

function output(globalOpts, data) {
  if (globalOpts.format === 'json') {
    process.stdout.write(JSON.stringify(data, null, 2) + '\n')
    return
  }

  if (typeof data === 'string') {
    process.stdout.write(data + '\n')
    return
  }

  process.stdout.write(Object.entries(data)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n') + '\n')
}
