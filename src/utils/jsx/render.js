import rawRender from './utils/rawRender'
import { dispatchListeners, dispatchRefs, dispatch } from './utils/dispatch'

const SvgTagNames = new Set([
  'g',
  'svg',
  'defs'
])

export default function render (vnode, parent, context) {
  // render
  let i = 0
  const rendered = rawRender(vnode, SvgTagNames.has(parent.tagName))

  // dispatch callback refs
  let mockComponent = { _collector: rendered } // for dispatch convenience
  dispatchRefs(mockComponent)

  // dispatch afterRender
  dispatch(mockComponent, function (c) {
    c.afterRender && c.afterRender(c.props)
  })

  // mount
  if (typeof parent === 'function') {
    const nodes = rendered.nodes.length < 2 ? rendered.nodes[0] : rendered.nodes
    parent(nodes)
  } else if (parent) {
    for (i = 0; i < rendered.nodes.length; i++) {
      parent.appendChild(rendered.nodes[i])
    }
  }

  // This conditionnal avoids calling the dispatchers twice if
  // the renders is made during before / after render
  if (!context || context.mounted) {
    // Dispatch listeners
    dispatchListeners(mockComponent)

    // dispatch afterMounts
    dispatch(mockComponent, function (c) {
      c.mounted = true
      c.afterMount && c.afterMount(c.props)
    })
  }

  // Add items to context
  if (context && context._collector) {
    const c = context._collector

    for (i = 0; i < rendered.components.length; i++) {
      rendered.components[i]._parent = context
    }

    if (c.refs) c.refs = c.refs.concat(rendered.refs)
    if (c.components) c.components = c.components.concat(rendered.components)
    if (c.domEvents) c.domEvents = c.domEvents.concat(rendered.domEvents)
    if (c.storeEvents) c.storeEvents = c.storeEvents.concat(rendered.storeEvents)
  }

  mockComponent = undefined
  return rendered
}
