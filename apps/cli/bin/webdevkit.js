#!/usr/bin/env node
import { Command } from 'commander'
import { findProjectRoot } from '@webdevkit/core'
import path from 'node:path'

const program = new Command()

program
  .name('webdevkit')
  .description('Web Developer Tools Kit')
  .option('-C, --cwd <path>', 'Run as if started in this directory')
  .option('--format <format>', 'Output format (json|text|html)', 'text')

program
  .command('connect')
  .description('Connect to the local desktop app service')
  .option('--url <url>', 'Service URL', 'http://127.0.0.1:3000')
  .action((opts) => {
    const payload = { connected: false, url: opts.url }
    output(program.opts(), payload)
  })

program
  .command('context')
  .description('Show detected project context')
  .action(() => {
    const baseCwd = program.opts().cwd ? path.resolve(program.opts().cwd) : process.cwd()
    const projectRoot = findProjectRoot(baseCwd)
    output(program.opts(), { cwd: baseCwd, projectRoot })
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
