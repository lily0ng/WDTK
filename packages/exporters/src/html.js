function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function toHtmlReport({ title, json }) {
  const safeTitle = escapeHtml(title || 'WebDevKit Report')
  const body = escapeHtml(JSON.stringify(json ?? null, null, 2))

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${safeTitle}</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background: #fff; color: #0f172a; }
  header { padding: 18px 22px; border-bottom: 1px solid #e2e8f0; }
  h1 { font-size: 16px; margin: 0; }
  main { padding: 18px 22px; }
  pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; overflow: auto; }
</style>
</head>
<body>
<header><h1>${safeTitle}</h1></header>
<main>
<pre>${body}</pre>
</main>
</body>
</html>`
}
