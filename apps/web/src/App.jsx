import React from 'react'

const tools = [
  { key: 'server', name: 'Local Servers', desc: 'Multi-port server, static server, SSL, mocks' },
  { key: 'code', name: 'Code Quality', desc: 'Linting, dead code, TypeScript strictness' },
  { key: 'css', name: 'CSS & Design', desc: 'Grid/flex builder, tokens, SVG tools' },
  { key: 'data', name: 'Data Tools', desc: 'SQLite browser, converters, fake data' },
  { key: 'perf', name: 'Performance', desc: 'Vitals, Lighthouse history, throttling' },
  { key: 'deploy', name: 'Build & Deploy', desc: 'Env manager, Docker, CI/CD generators' },
  { key: 'security', name: 'Security & Testing', desc: 'Vuln scan, JWT debugger, flow tests' },
  { key: 'workflow', name: 'Workflow', desc: 'Search/replace, snippets, regex tester' }
]

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="brand">WebDevKit</div>
        <div className="subtitle">Local-first developer toolkit</div>
      </header>

      <main className="content">
        <section className="panel">
          <div className="panelTitle">Project</div>
          <div className="panelBody">
            <div className="kv">
              <div className="k">Current directory</div>
              <div className="v">(not connected)</div>
            </div>
            <div className="kv">
              <div className="k">Theme</div>
              <div className="v">light</div>
            </div>
          </div>
        </section>

        <section className="grid">
          {tools.map((t) => (
            <button key={t.key} className="card" type="button">
              <div className="cardTitle">{t.name}</div>
              <div className="cardDesc">{t.desc}</div>
            </button>
          ))}
        </section>
      </main>
    </div>
  )
}
