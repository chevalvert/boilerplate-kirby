import logger from '../logger'
import _render from './render'

export default class Component {
  constructor (props = {}) {
    this._parent = null
    this._collector = { refs: [], components: [], domEvents: [], storeEvents: [] }
    this._storeListeners = []

    this.refs = {}
    this.state = {}
    this.store = {}

    // Contains all component properties and children.
    // Do not modify it directly, recreate a new component using `cloneElement`
    this.props = props || {}

    // HTMLElement used as "base" for the component instance.
    // Can also be an array of elements if `template` return an array.
    this.base = null

    // Set to true when component is mounted
    this.mounted = false

    // Set to true when component is destroyed
    this.destroyed = false

    this.logger = logger(
      props.name || this.constructor.name || 'Component',
      '#fff',
      '#02024d',
      props['no-log']
    )

    this.log = this.logger.log
    this.warn = this.logger.warn
    this.error = this.logger.error
  }

  storeSubscribe (store, method, context, init = true) {
    store.subscribe(method, context)
    this._storeListeners.push([store, method, context])
    if (init) method.call(context, store.current)
  }

  // `component.template` will be called during the component
  // initial rendering to create the `component.base` node
  // You can return real dom or jsx
  template () {}

  // `component.beforeRender` will be called by `render`
  // just before the component template rendering
  beforeRender () {}

  // `component.afterRender` will be called by `render`
  // when all the rendered dom tree is rendered
  afterRender () {}

  // `component.afterMount` will be called by `render`
  // when all the rendered dom tree is mounted
  afterMount () {}

  // `component.beforeDestroy` will be called
  // when the component or one of its ancestors is destroyed
  beforeDestroy () {}

  // Quickly add ref to component
  ref (k) {
    const self = this
    return function updateRef (el) {
      if (!el && !self.refs) return // Handle destroying ref from another component
      self.refs[k] = el
    }
  }

  // Quickly add ref to an array of component refs
  refArray (k, poolable = false) {
    const arr = this.refs[k] || (this.refs[k] = [])
    let index = arr.length
    let pools, pool

    if (poolable) {
      pools = this.refs.__pools || (this.refs.__pools = {})
      pool = pools[k] || (pools[k] = [])
      if (pool.length) index = pool.pop()
    }

    arr[index] = null

    return function updateRefArray (el) {
      arr[index] = el
      if (poolable) pool.push(index)
    }
  }

  // Quickly add ref to a hashmap of component refs
  refMap (k, id = {}) {
    const map = this.refs[k] || (this.refs[k] = new Map())
    return function updateRefHashmap (el) {
      if (el) map.set(id, el)
      else map.delete(id)
    }
  }

  // Render a vnode or array of vnodes
  // and register the rendered content as "child" of this component.
  // Use this method when you want to add content to the component
  // after the initial rendering. This ensures new items will be
  // correctly unmount when the component is destroyed.
  render (vdom, parent) {
    return _render(vdom, parent, this)
  }

  // Destroy the component and its children components.
  // - This also removes component props and de-reference it from its parent.
  // - Callback refs inside the component tree will be re-called with `null`
  // - Set component.mounted to false
  destroy () {
    let i = 0
    this.beforeDestroy(this.props)

    // Unlisten to dom events
    for (i = this._collector.domEvents.length - 1; i >= 0; i--) {
      const event = this._collector.domEvents[i]
      event.el.removeEventListener(event.evt, event.fn)
    }

    // Unlisten to store events
    for (i = this._collector.storeEvents.length - 1; i >= 0; i--) {
      const event = this._collector.storeEvents[i]
      event.store.unsubscribe(event.fn)
    }

    // Unlisten to store events 2
    for (i = this._storeListeners.length - 1; i >= 0; i--) {
      const event = this._storeListeners[i]
      event[0].unsubscribe(event[1], event[2])
    }

    // destroy subcomponents
    for (i = this._collector.components.length - 1; i >= 0; i--) {
      this._collector.components[i].destroy()
    }

    this.mounted = false
    this.destroyed = true

    // unregister component from parent and dispose _parent
    if (this._parent) {
      const index = this._parent._collector.components.indexOf(this)
      if (~index) this._parent._collector.components.splice(index, 1)
      this._parent = null
    }

    // callback all ref with null and destroy them from the collector
    for (i = this._collector.refs.length - 1; i >= 0; i--) {
      this._collector.refs[i].fn(null)
      this._collector.refs.splice(i, 1)
    }

    // Unmount from dom
    let base = Array.isArray(this.base) ? this.base : [this.base]
    for (i = 0; i < base.length; i++) {
      if (base[i] && base[i].parentNode) base[i].parentNode.removeChild(base[i])
    }

    // Remove base
    this.base = base = null

    // Remove props / state / store / refs to avoid memory leaks
    this.props = null
    this.state = null
    this.store = null
    this.refs = null
    this._storeListeners = null
  }
}
