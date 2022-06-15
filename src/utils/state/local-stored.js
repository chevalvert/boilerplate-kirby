/* global localStorage */
const NS = `${window.ENV.name}@${window.ENV.version}/${window.location.pathname}__`

function localStored (key, signal, {
  decode = JSON.parse,
  encode = JSON.stringify,
  silent = false
} = {}) {
  if (!signal) return
  const ns = NS + key

  const value = localStorage.getItem(ns)
  if (value !== null) {
    if (silent) signal.current = decode(value)
    else signal.set(decode(value))
  } else {
    localStorage.setItem(ns, encode(signal.current))
  }

  signal.subscribe(value => localStorage.setItem(ns, encode(value)))
  return signal
}

export default localStored
