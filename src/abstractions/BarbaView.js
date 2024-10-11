export default class BarbaView {
  constructor (namespace, hooks) {
    this.namespace = namespace
    this.hooks = hooks
  }

  _callHook (hookName, data) {
    if (!this.hooks[hookName]) return
    this.hooks[hookName].call(this, data)
  }

  // SEE https://barba.js.org/docs/advanced/hooks/#Base-hooks
  beforeEnter (data) {
    this.refs = {}
    this.state = {}

    this._callHook('beforeEnter', data)
  }

  afterEnter (data) {
    this._callHook('afterEnter', data)
  }

  beforeLeave (data) {
    this._callHook('beforeLeave', data)
  }

  afterLeave (data) {
    this._callHook('afterLeave', data)

    for (const k in this.refs) {
      this.refs[k]?.destroy?.()
      delete this.refs[k]
    }

    for (const k in this.state) delete this.state[k]

    this.refs = {}
    this.state = {}
  }
}
