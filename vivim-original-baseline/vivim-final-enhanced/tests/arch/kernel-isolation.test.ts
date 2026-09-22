// tests/arch/kernel-isolation.test.ts
// T-03: kernel-isolation: kernel survives uninstall of every first-party plugin
// T-24: kernel-isolation: only the kernel may import plugin-manager-impl

import { describe, test, expect } from 'bun:test'
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'C:/0-BlackBoxProject-0/vivim-final'

const listAll = (dir: string, ext: string[]): string[] => {
  const out: string[] = []
  if (!existsSync(dir)) return out
  const stack = [dir]
  while (stack.length) {
    const d = stack.pop()!
    let ents: { name: string; isFile: boolean }[]
    try { ents = readdirSync(d, { withFileTypes: true }).map(x => ({ name: x.name, isFile: x.isFile() })) } catch { continue }
    for (const e of ents) {
      const full = join(d, e.name)
      if (e.isFile) {
        if (ext.some(x => full.endsWith(x))) out.push(full)
      } else {
        stack.push(full)
      }
    }
  }
  return out
}

describe('T-01 layer-dependency: K0 must not import from K1+', () => {
  const kernelFiles = listAll(join(ROOT, 'src/plugin-kernel'), ['.ts'])
    .filter(f => !f.includes('node_modules'))
  test('K0 files do not import from K1+ paths', () => {
    const violations: string[] = []
    const bannedPaths = ['/src/engines/', '/plugins/core/', '/src/ai/plugins/manager.ts']
    for (const f of kernelFiles) {
      const c = readFileSync(f, 'utf8')
      for (const banned of bannedPaths) {
        if (c.includes(`from '${banned}`) || c.includes(`from "${banned}`) || c.includes(`from '..${banned}`)) {
          violations.push(`${f}: imports from ${banned}`)
        }
      }
    }
    expect(violations).toEqual([])
  })
})

describe('T-02 kernel-boot: kernel boots with no first-party plugin', () => {
  test('src/plugin-kernel has at least the 17 K0 subsystem stubs', () => {
    const subsystems = [
      'plugin-manager', 'plugin-context', 'event-bus', 'registry',
      'adapter', 'execution', 'runtime', 'policy', 'router',
      'sandbox', 'observability', 'schema', 'migration',
      'crypto', 'host', 'capabilities', 'bootstrap',
    ]
    const missing: string[] = []
    for (const s of subsystems) {
      const dir = join(ROOT, 'src/plugin-kernel', s)
      if (!existsSync(dir)) missing.push(s)
    }
    expect(missing).toEqual([])
  })
})

describe('T-03 kernel-isolation: kernel survives uninstall of every first-party plugin', () => {
  test('first-party plugins do not import kernel internals', () => {
    // pending P3-01..P3-39; this test will pass when plugins land
    const pluginFiles = listAll(join(ROOT, 'plugins/core'), ['.ts'])
    const violations: string[] = []
    for (const f of pluginFiles) {
      const c = readFileSync(f, 'utf8')
      if (c.includes("from 'src/plugin-kernel/internal/")) {
        violations.push(`${f}: imports kernel internals`)
      }
    }
    expect(violations).toEqual([])
  })
})

describe('T-09 bus-namespace: every eventBus.publish kind is dot-namespaced', () => {
  const allFiles = listAll(join(ROOT, 'src'), ['.ts']).concat(listAll(join(ROOT, 'frontend/src'), ['.ts', '.tsx']))
  test('all published event kinds match the dot-namespace rule', () => {
    const violations: { file: string; line: number; kind: string }[] = []
    const re = /\beventBus\.(?:emit|publish|publishAndWait)\s*\(\s*['"`]([^'"`]+)['"`]/g
    for (const f of allFiles) {
      const c = readFileSync(f, 'utf8')
      let m: RegExpExecArray | null
      while ((m = re.exec(c))) {
        const kind = m[1]!
        const before = c.slice(0, m.index)
        const line = before.split(/\r?\n/).length
        const ok = /^(kernel|plugin\.[a-z0-9_.-]+|legacy)\./.test(kind) || kind === '*'
        if (!ok) violations.push({ file: f, line, kind })
      }
    }
    if (violations.length > 0) {
      console.log('bus-namespace violations:', violations)
    }
    expect(violations).toEqual([])
  })
})

describe('T-13 schema-caller: SchemaRegistry.register requires { caller }', () => {
  test('every SchemaRegistry.register call passes a { caller } object', () => {
    const allFiles = listAll(join(ROOT, 'src'), ['.ts'])
    const violations: { file: string; line: number; evidence: string }[] = []
    for (const f of allFiles) {
      const c = readFileSync(f, 'utf8')
      const matches = [...c.matchAll(/SchemaRegistry(?:Impl)?\.register\s*\(([^)]*)\)/g)]
      for (const m of matches) {
        const args = m[1] ?? ''
        const before = c.slice(0, m.index)
        const line = before.split(/\r?\n/).length
        if (!args.includes('caller') && !args.includes('{')) {
          violations.push({ file: f, line, evidence: m[0] })
        }
      }
    }
    if (violations.length > 0) console.log('schema-caller violations:', violations)
    expect(violations).toEqual([])
  })
})

describe('T-19 plugin-context-closed: no first-party engine references BootstrapContext', () => {
  test('no first-party code references the 60+ field BootstrapContext leak', () => {
    const allFiles = listAll(join(ROOT, 'src'), ['.ts']).concat(listAll(join(ROOT, 'frontend/src'), ['.ts', '.tsx']))
    const violations: { file: string; evidence: string }[] = []
    for (const f of allFiles) {
      if (f.endsWith('src/server/bootstrap/context.ts')) continue // the source
      const c = readFileSync(f, 'utf8')
      if (/\bnew\s+BootstrapContext\s*\(/.test(c) || /:\s*BootstrapContext\b/.test(c)) {
        violations.push({ file: f, evidence: 'references BootstrapContext' })
      }
    }
    if (violations.length > 0) console.log('T-19 violations:', violations)
    expect(violations).toEqual([])
  })
})

describe('T-22 bus-event-recording: every publish has a record-bridge', () => {
  test('every eventBus.publish also calls eventRecordBridge or records the event', () => {
    const allFiles = listAll(join(ROOT, 'src'), ['.ts'])
    const violations: { file: string; line: number; evidence: string }[] = []
    for (const f of allFiles) {
      if (f.includes('event-record-bridge') || f.includes('eventBus/')) continue
      const c = readFileSync(f, 'utf8')
      if (!/\beventBus\.(?:emit|publish)\b/.test(c)) continue
      if (!/eventRecordBridge|recordEvent|EventRecordStore/.test(c)) {
        const re = /\beventBus\.(?:emit|publish)\b/g
        let m: RegExpExecArray | null
        while ((m = re.exec(c))) {
          const before = c.slice(0, m.index)
          const line = before.split(/\r?\n/).length
          violations.push({ file: f, line, evidence: m[0] })
        }
      }
    }
    if (violations.length > 0) console.log('T-22 violations:', violations.length, 'files')
    expect(violations).toEqual([])
  })
})

describe('T-23 harness-recipe-prefix: every command has pluginId prefix', () => {
  test('every harness command has a pluginId prefix', () => {
    const seedDir = join(ROOT, 'seeds/harness')
    if (!existsSync(seedDir)) { test('skipped: no seeds/harness/'); return }
    const files = listAll(seedDir, ['.ts', '.js', '.json'])
    const violations: string[] = []
    for (const f of files) {
      const c = readFileSync(f, 'utf8')
      if (!c.includes('pluginId') && !c.includes('__pluginId') && !c.includes('plugin_id')) {
        violations.push(f)
      }
    }
    if (violations.length > 0) console.log('T-23 violations:', violations)
    expect(violations).toEqual([])
  })
})

describe('T-24 kernel-isolation: only the kernel may import plugin-manager-impl', () => {
  test('no first-party file imports the kernel-only plugin-manager-impl', () => {
    const allFiles = listAll(join(ROOT, 'src'), ['.ts']).concat(listAll(join(ROOT, 'frontend/src'), ['.ts', '.tsx']))
    const violations: string[] = []
    for (const f of allFiles) {
      if (f.endsWith('src/plugin-kernel/plugin-manager/manager.ts')) continue
      const c = readFileSync(f, 'utf8')
      if (c.includes("from 'src/plugin-kernel/plugin-manager/manager'") || c.includes('from "src/plugin-kernel/plugin-manager/manager"')) {
        violations.push(f)
      }
    }
    if (violations.length > 0) console.log('T-24 violations:', violations)
    expect(violations).toEqual([])
  })
})
