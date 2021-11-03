// All-purpose logger

function noop () {}
const noopObj = { log: noop, warn: noop, error: noop }
let logger = () => noopObj

/// #if DEVELOPMENT
logger = function logger (prefix, color, background, mute) {
  if (mute) return noopObj

  const pre = []
  prefix = prefix.toUpperCase()

  pre.push(`%c ${prefix} `)
  let style = 'font-weight:bold;'
  if (color) style += `color:${color};`
  if (background) style += `background-color:${background}`
  pre.push(style)

  return {
    log: console.log.bind(console, ...pre),
    warn: console.warn.bind(console, ...pre),
    error: console.error.bind(console, ...pre)
  }
}
/// #endif

export default logger
