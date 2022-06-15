import { Readable } from './readable'

class Writable extends Readable {
  set (value, force) {
    if (!force && this.current === value) return
    const previous = this.current

    this.current = value
    let node = this._first
    while (node) {
      node.fn.call(node.ctx, this.current, previous)
      node.once && this.unsubscribe(node)
      node = node.next
    }
  }

  update (cb, force) {
    const value = cb(this.current)
    this.set(value !== undefined ? value : this.current, force)
  }
}

export { Writable }
export default function writable (v) {
  return new Writable(v)
}
