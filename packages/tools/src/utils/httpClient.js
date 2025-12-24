import http from 'node:http'
import https from 'node:https'

export function request({ method, url, headers, body, timeoutMs }) {
  return new Promise((resolve, reject) => {
    let u
    try {
      u = new URL(url)
    } catch (e) {
      reject(e)
      return
    }

    const lib = u.protocol === 'https:' ? https : http

    const req = lib.request(
      {
        method: method || 'GET',
        hostname: u.hostname,
        port: u.port || (u.protocol === 'https:' ? 443 : 80),
        path: u.pathname + (u.search || ''),
        headers: headers || {}
      },
      (res) => {
        const chunks = []
        res.on('data', (d) => chunks.push(d))
        res.on('end', () => {
          const buf = Buffer.concat(chunks)
          resolve({
            status: res.statusCode || 0,
            headers: res.headers,
            body: buf.toString('utf8')
          })
        })
      }
    )

    const t = typeof timeoutMs === 'number' ? timeoutMs : 15000
    req.setTimeout(t, () => {
      req.destroy(new Error('Request timed out'))
    })

    req.on('error', reject)

    if (body != null) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body))
    }

    req.end()
  })
}
