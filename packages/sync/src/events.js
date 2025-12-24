export function createEvents() {
  const subs = new Set()

  function publish(evt) {
    for (const fn of subs) fn(evt)
  }

  function subscribe(fn) {
    subs.add(fn)
    return () => subs.delete(fn)
  }

  return { publish, subscribe }
}
