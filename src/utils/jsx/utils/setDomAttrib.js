// Some portions of code are taken from preact
// https://github.com/developit/preact/blob/master/src/dom/index.js

import extend from './extend'

const namespaces = [
  'xlink',
  'xmlns',
  'xml'
]

// Some attribute doesn't work well when used online as node.attr = value
// We double it with node.setAttribute
const doubleAttr = new Set([
  'placeholder',
  'autoplay',
  'muted',
  'for',
  'webkit-playsinline',
  'playsinline',
  'selected'
])

let val

const startsWith = (str, w) => str.substr(0, w.length) === w
const updateClass = n => (v, el) => el.classList.toggle(n, v || false)
const updateAttrib = (name = 'textContent', isSvg) => (v, el) => {
  const ns = isSvg && (name !== (name = name.replace(/^xlink:?/, '')))
  if (ns) el.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), v)
  else {
    val = v == null ? '' : v
    if (!isSvg) el[name] = val
    if (isSvg || doubleAttr.has(name) || startsWith(name, 'data-')) {
      el.setAttribute(name, val)
    }
  }
}

function setDomAttrib (el, name, value, collector, isSvg) {
  // Don't treat undefined value
  if (value === undefined) return

  // Ignore JSX sourcemap props
  if (name === '__self' || name === '__source') return

  // Normalize class attribute
  if (name === 'className') name = 'class'

  // Correct attribute like xlmns:xlink
  for (let i = 0; i < namespaces.length; i++) {
    if (startsWith(name, namespaces[i])) {
      const len = namespaces[i].length
      if (name[len] && name[len] !== ':') {
        name = namespaces[i] + ':' + name[len].toLowerCase() + name.substr(len + 1, name.length)
      }
      break
    }
  }

  // Ignored props
  if (name === 'ref') {
    //
  } else if (startsWith(name, 'event-')) {
    // Synthetic DOM Events
    const eventName = name.toLowerCase().substring(6)
    collector.append({ domEvents: [{ el, evt: eventName, fn: value }] })
  } else if (name === 'store') {
    const evts = Array.isArray(value) ? value : [value]
    const events = []

    for (let i = 0, l = evts.length; i < l; i++) {
      const evt = Array.isArray(evts[i]) ? evts[i] : [evts[i]]
      const store = evt[0]
      const fn = evt[1]
      const init = evt[2] !== undefined ? evt[2] : true
      if (!store) continue
      events.push({ store, fn, init, el })
    }

    collector.append({ storeEvents: events })
  } else if (startsWith(name, 'store-class-')) {
    const className = name.substring(12)
    const fn = updateClass(className)
    collector.append({ storeEvents: [{ store: value, init: true, fn, el }] })
  } else if (startsWith(name, 'store-')) {
    let attrib = name.substring(6)
    if (attrib === 'text') attrib = 'textContent'
    const fn = updateAttrib(attrib, isSvg)
    collector.append({ storeEvents: [{ store: value, init: true, fn, el }] })
  } else if (typeof value === 'function' && startsWith(name, 'on')) {

    // Event attribute (usually do not use this, prefer the synthetic ones)
    // const eventType = name.toLowerCase();
    // el[ eventType ] = value;

  } else if (name === 'class' && !isSvg) {
    // Class - only for non-svg node
    el.className = value || ''
  } else if (name === 'style') {
    // Style attribute
    if (typeof value === 'object') extend(el.style, value)
    else if (typeof value === 'string') el.style.cssText = value
  } else if (name !== 'list' && name !== 'type' && !isSvg && name in el) {
    // Attrib
    // Attempt to set an attribute to the given value.
    // IE & FF throw for certain property-value combinations.
    try { updateAttrib(name, isSvg)(value, el) } catch (e) { /* */ }
  } else if (typeof value !== 'object' && typeof value !== 'function') {
    updateAttrib(name, isSvg)(value, el)
  }
}

export default setDomAttrib
