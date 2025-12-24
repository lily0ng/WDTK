import os from 'node:os'

export async function toolOsInfo() {
  const cpus = os.cpus() || []
  const nets = os.networkInterfaces() || {}

  const networkInterfaces = Object.entries(nets).map(([name, addrs]) => {
    const list = Array.isArray(addrs) ? addrs : []
    return {
      name,
      addresses: list.map((a) => ({
        address: a.address,
        family: a.family,
        internal: Boolean(a.internal),
        mac: a.mac
      }))
    }
  })

  return {
    ok: true,
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    uptimeSec: os.uptime(),
    loadavg: os.loadavg(),
    cpu: {
      count: cpus.length,
      model: cpus[0]?.model || null
    },
    memory: {
      total: os.totalmem(),
      free: os.freemem()
    },
    networkInterfaces
  }
}
