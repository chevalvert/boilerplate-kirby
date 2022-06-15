import { Signal } from './signal'

class Readable extends Signal {
  constructor (initialValue) {
    super()
    this.current = initialValue
  }

  set () {
    throw new Error('Cannot set a different value for a Readable Signal. Use Writable instead')
  }

  get () {
    return this.current
  }
}

export { Readable }
export default function readable (v) {
  return new Readable(v)
}
